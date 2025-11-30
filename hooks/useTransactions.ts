
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Transaction, TransactionStatus, Order } from '../types/transactions';
import { buyHotTokens, claimHotTokens } from '../lib/solana/payments';
import { executeJupiterSwap } from '../lib/solana/jupiter';
import { User } from '../types/users';
import { logger } from '../services/logger';
import { BirdeyeMarketData, SaleStageConfig, SolanaNetwork } from '../types';
import { localCacheGet, localCacheSet } from '../utils/cache';
import useNetwork from './useNetwork';
import { recordTransactionOnServer } from '../services/tokenSaleService';

interface UseTransactionsProps {
    saleState: 'UPCOMING' | 'ACTIVE' | 'ENDED';
    saleConfig: SaleStageConfig | null;
    totalSold: number;
    totalContributors: number;
    marketStats: BirdeyeMarketData | null;
    prices: {
        presaleHotPrice: number;
        marketHotPrice: number;
        solPrice: number;
    };
    user: User;
    wallets: {
        isConnected: boolean;
        adapter: any;
    };
    network: SolanaNetwork;
    onTransactionSuccess: (usdValue: number, isClaim?: boolean) => void;
    onTransactionError: (error: string) => void;
    refetchBalances: () => void;
}

const TRANSACTION_HISTORY_CACHE_KEY = 'transaction_history';

// Mock Orderbook Data
const generateMockOrders = (price: number, count: number, side: 'buy' | 'sell'): Order[] => {
    const orders: Order[] = [];
    let currentPrice = side === 'buy' ? price * 0.999 : price * 1.001;
    for (let i = 0; i < count; i++) {
        const amount = Math.random() * 500000 + 10000;
        orders.push({
            id: `ord_${side}_${i}_${Date.now()}`,
            price: currentPrice,
            amount,
            side,
            status: 'open',
            timestamp: Date.now() - Math.random() * 100000,
        });
        currentPrice = side === 'buy' ? currentPrice * (1 - Math.random() * 0.0005) : currentPrice * (1 + Math.random() * 0.0005);
    }
    return orders;
}


export default function useTransactions(props: UseTransactionsProps) {
    const { saleState, saleConfig, totalSold, totalContributors, marketStats, prices, user, wallets, network, onTransactionSuccess, onTransactionError, refetchBalances } = props;
    const { config: networkConfig } = useNetwork();
    
    const [status, setStatus] = useState<TransactionStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [localHistory, setLocalHistory] = useState<Transaction[]>(() => localCacheGet(TRANSACTION_HISTORY_CACHE_KEY) || []);
    const [serverHistory, setServerHistory] = useState<Transaction[]>([]);

    const [isAuditing, setIsAuditing] = useState(false);
    const [aiAuditResult, setAiAuditResult] = useState<string | null>(null);
    const [auditError, setAuditError] = useState<string | null>(null);

    // --- New State for Orderbook ---
    const [orderbook, setOrderbook] = useState<{ bids: Order[], asks: Order[] }>({ bids: [], asks: [] });
    const [userOrders, setUserOrders] = useState<Order[]>([]);
    const [isOrderbookLoading, setIsOrderbookLoading] = useState(true);

    useEffect(() => {
        localCacheSet(TRANSACTION_HISTORY_CACHE_KEY, localHistory);
    }, [localHistory]);
    
    useEffect(() => {
        if (prices.marketHotPrice > 0) {
             setIsOrderbookLoading(true);
             setTimeout(() => {
                setOrderbook({
                    bids: generateMockOrders(prices.marketHotPrice, 15, 'buy'),
                    asks: generateMockOrders(prices.marketHotPrice, 15, 'sell'),
                });
                setIsOrderbookLoading(false);
             }, 1000);
        }
    }, [prices.marketHotPrice]);
    
    const placeLimitOrder = useCallback(async (side: 'buy' | 'sell', amount: number, price: number): Promise<Order | null> => {
        setStatus('processing');
        try {
            const newOrder: Order = {
                id: `pending_ord_${Date.now()}`,
                price,
                amount,
                side,
                status: 'open',
                timestamp: Date.now(),
            };
            setUserOrders(prev => [newOrder, ...prev]);
            
            // Simulate network confirmation
            await new Promise(resolve => setTimeout(resolve, 2000));
            onTransactionSuccess(amount * price);
            setStatus('success');
            return newOrder;

        } catch (e: any) {
            setError(e.message);
            onTransactionError(e.message);
            setStatus('error');
            return null;
        }
    }, [onTransactionSuccess, onTransactionError]);


    useEffect(() => {
        const fetchHistory = async () => {
            if (!user.address) {
                setServerHistory([]);
                return;
            }
            try {
                const response = await fetch(`/api/transactions/history?walletAddress=${user.address}`);
                if (response.ok) {
                    const data = await response.json();
                    setServerHistory(data);
                }
            } catch (err) {
                logger.error('[useTransactions]', 'Failed to fetch transaction history', err);
            }
        };

        fetchHistory();
        const interval = setInterval(fetchHistory, 15000);

        return () => clearInterval(interval);
    }, [user.address]);

    const clearError = useCallback(() => setError(null), []);
    const addTransactionToHistory = useCallback((transaction: Transaction) => setLocalHistory(prev => [transaction, ...prev]), []);

    const history = useMemo(() => {
        const combined = [...localHistory, ...serverHistory];
        const unique = Array.from(new Map(combined.map(tx => [tx.id, tx])).values());
        unique.sort((a, b) => b.timestamp - a.timestamp);
        return unique.slice(0, 5);
    }, [localHistory, serverHistory]);

    const executeGenericTransaction = useCallback(async <T extends any[], R>(
        txFunction: (...args: T) => Promise<{ success: boolean; error?: string; [key: string]: any }>,
        onSuccess: (result: any) => Promise<R> | R,
        ...args: T
    ): Promise<R | null> => {
        if (!wallets.isConnected) {
            const err = "Please connect your wallet first.";
            setError(err);
            onTransactionError(err);
            return null;
        }
        setStatus('processing');
        setError(null);
        try {
            const result = await txFunction(...args);
            if (result.success) {
                const successData = await onSuccess(result);
                setStatus('success');
                refetchBalances();
                return successData;
            } else {
                throw new Error(result.error || "Transaction failed in contract.");
            }
        } catch (err: any) {
            const errMsg = err.message || 'An unknown error occurred.';
            if (errMsg.includes('User rejected the request')) {
                onTransactionError('Transaction was rejected.');
            } else {
                setError(errMsg);
                onTransactionError(errMsg);
            }
            setStatus('error');
            return null;
        }
    }, [wallets.isConnected, onTransactionError, refetchBalances]);

    const buyPresaleTokens = useCallback(async (hotAmount: number, currency: 'SOL' | 'USDC'): Promise<Transaction | null> => {
        const usdValue = hotAmount * prices.presaleHotPrice;
        const paidAmount = currency === 'SOL' ? (prices.solPrice > 0 ? usdValue / prices.solPrice : 0) : usdValue;
        
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            onTransactionError("You are offline. Transaction has been queued.");
            const newTx: Transaction = {
                id: `pending_${Date.now()}`,
                timestamp: Date.now(),
                hotAmount,
                currency,
                paidAmount,
                usdValue,
                type: 'presale_buy',
                status: 'pending',
            };
            addTransactionToHistory(newTx);
            return newTx;
        }
        
        return await executeGenericTransaction(
            buyHotTokens,
            async (res: { signature: string; }): Promise<Transaction> => {
                const newTx: Transaction = {
                    id: res.signature,
                    timestamp: Date.now(),
                    hotAmount,
                    currency,
                    paidAmount: paidAmount,
                    usdValue,
                    type: 'presale_buy',
                    status: 'confirmed',
                };
                addTransactionToHistory(newTx);
                onTransactionSuccess(usdValue);

                if (network === 'mainnet' && user.address) {
                    await recordTransactionOnServer({
                        signature: res.signature,
                        walletAddress: user.address,
                        hotAmount,
                        paidAmount: paidAmount,
                        currency,
                        usdValue
                    });
                }
                return newTx;
            },
            wallets.adapter,
            network,
            networkConfig.programId,
            networkConfig.treasuryAddress,
            paidAmount,
            currency,
            user.solBalance,
            user.usdcBalance
        );
    }, [executeGenericTransaction, addTransactionToHistory, user, prices, wallets.adapter, onTransactionSuccess, network, networkConfig.programId, networkConfig.treasuryAddress, onTransactionError]);

    const claimTokens = useCallback(async (): Promise<Transaction | null> => {
        if (saleState !== 'ENDED' || user.hotBalance <= 0) {
            onTransactionError(user.hotBalance <= 0 ? "You have no tokens to claim." : "Claiming is not available yet.");
            return null;
        }
        
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            onTransactionError("You are offline. Claim has been queued.");
            const newTx: Transaction = {
                id: `pending_claim_${Date.now()}`,
                timestamp: Date.now(),
                hotAmount: user.hotBalance,
                currency: 'SOL',
                paidAmount: 0,
                usdValue: 0,
                type: 'claim',
                status: 'pending',
            };
            addTransactionToHistory(newTx);
            return newTx;
        }

        return await executeGenericTransaction(
            claimHotTokens,
            (res: { signature: string }): Transaction => {
                const newTx: Transaction = {
                    id: res.signature,
                    timestamp: Date.now(),
                    hotAmount: user.hotBalance,
                    currency: 'SOL',
                    paidAmount: 0,
                    usdValue: 0,
                    type: 'claim',
                    status: 'confirmed',
                };
                addTransactionToHistory(newTx);
                onTransactionSuccess(user.hotBalance * prices.presaleHotPrice, true);
                return newTx;
            },
            wallets.adapter, network, networkConfig.programId, user.hotBalance
        );
    }, [saleState, user.hotBalance, prices.presaleHotPrice, executeGenericTransaction, addTransactionToHistory, wallets.adapter, onTransactionSuccess, onTransactionError, network, networkConfig.programId]);
    
    const buyMarketTokens = useCallback(async (amount: number, currency: 'SOL' | 'USDC') => {
        const usdValue = amount * prices.marketHotPrice;
        const paidAmount = currency === 'SOL' ? (prices.solPrice > 0 ? usdValue / prices.solPrice : 0) : usdValue;

        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            onTransactionError("You are offline. Market buy has been queued.");
            addTransactionToHistory({
                id: `pending_buy_${Date.now()}`,
                timestamp: Date.now(),
                hotAmount: amount,
                currency,
                paidAmount,
                usdValue,
                type: 'market_buy',
                status: 'pending',
            });
            return;
        }

        await executeGenericTransaction(
            executeJupiterSwap,
            (res: { signature: string }): Transaction => {
                const newTx: Transaction = {
                    id: res.signature,
                    timestamp: Date.now(),
                    hotAmount: amount,
                    currency,
                    paidAmount,
                    usdValue,
                    type: 'market_buy',
                    status: 'confirmed',
                };
                addTransactionToHistory(newTx);
                return newTx;
            },
            amount, currency, 'buy'
        );
    }, [executeGenericTransaction, prices, addTransactionToHistory, onTransactionError]);

    const sellMarketTokens = useCallback(async (amount: number, currency: 'SOL' | 'USDC') => {
        if (amount > user.walletHotBalance) {
            const errorMessage = "Insufficient HOT balance to sell.";
            setError(errorMessage);
            onTransactionError(errorMessage);
            setStatus('error');
            return;
        }
        const usdValue = amount * prices.marketHotPrice;
        const paidAmount = currency === 'SOL' ? (prices.solPrice > 0 ? usdValue / prices.solPrice : 0) : usdValue;

        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            onTransactionError("You are offline. Market sell has been queued.");
            addTransactionToHistory({
                id: `pending_sell_${Date.now()}`,
                timestamp: Date.now(),
                hotAmount: amount,
                currency,
                paidAmount,
                usdValue,
                type: 'market_sell',
                status: 'pending',
            });
            return;
        }

        await executeGenericTransaction(
            executeJupiterSwap,
            (res: { signature: string }): Transaction => {
                const newTx: Transaction = {
                    id: res.signature,
                    timestamp: Date.now(),
                    hotAmount: amount,
                    currency,
                    paidAmount,
                    usdValue,
                    type: 'market_sell',
                    status: 'confirmed',
                };
                addTransactionToHistory(newTx);
                return newTx;
            },
            amount, currency, 'sell'
        );
    }, [executeGenericTransaction, user.walletHotBalance, onTransactionError, prices, addTransactionToHistory]);

    const buyWithCard = useCallback(async (hotAmount: number): Promise<Transaction | null> => {
        const usdValue = hotAmount * prices.presaleHotPrice;
        setStatus('processing');
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 3000));
        try {
            const newTx: Transaction = { id: `card_tx_${Date.now()}`, timestamp: Date.now(), hotAmount, currency: 'USDC', paidAmount: usdValue, usdValue, type: 'presale_buy', status: 'confirmed' };
            addTransactionToHistory(newTx);
            onTransactionSuccess(usdValue);
            setStatus('success');
             if (user.address) {
                await recordTransactionOnServer({
                    signature: newTx.id,
                    walletAddress: user.address,
                    hotAmount,
                    paidAmount: usdValue,
                    currency: 'USDC',
                    usdValue
                });
            }
            return newTx;
        } catch (err: any) {
            const errMsg = err.message || 'An unknown error occurred during card payment processing.';
            setError(errMsg);
            onTransactionError(errMsg);
            setStatus('error');
            return null;
        }
    }, [addTransactionToHistory, prices.presaleHotPrice, onTransactionSuccess, onTransactionError, user.address]);

    const buyWithSolanaPay = useCallback(async (hotAmount: number, currency: 'SOL' | 'USDC'): Promise<Transaction | null> => {
        const usdValue = hotAmount * prices.presaleHotPrice;
        const paidAmount = currency === 'SOL' ? (prices.solPrice > 0 ? usdValue / prices.solPrice : 0) : usdValue;
        setStatus('processing');
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 4000));
        try {
            const signature = `solpay_sig_${Date.now()}`;
            const newTx: Transaction = { id: signature, timestamp: Date.now(), hotAmount, currency, paidAmount, usdValue, type: 'presale_buy', status: 'confirmed' };
            addTransactionToHistory(newTx);
            onTransactionSuccess(usdValue);
            setStatus('success');
            if (user.address) {
                 await recordTransactionOnServer({
                    signature: newTx.id,
                    walletAddress: user.address,
                    hotAmount,
                    paidAmount,
                    currency,
                    usdValue
                });
            }
            return newTx;
        } catch (err: any) {
            const errMsg = err.message || 'An unknown error occurred during Solana Pay processing.';
            setError(errMsg);
            onTransactionError(errMsg);
            setStatus('error');
            return null;
        }
    }, [addTransactionToHistory, prices.presaleHotPrice, prices.solPrice, onTransactionSuccess, onTransactionError, user.address]);

    const runAiAudit = useCallback(async () => {
        setIsAuditing(true);
        setAiAuditResult(null);
        setAuditError(null);
        try {
            const response = await fetch('/api/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sale: {
                        state: saleState,
                        stage: saleConfig,
                        totalSold,
                        totalContributors,
                    },
                    prices,
                    marketStats,
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "API request failed.");
            if (data.text) setAiAuditResult(data.text);
            else throw new Error("Received an empty response from the AI.");
        } catch (error: any) {
            logger.error('[AI Audit]', error.message, error);
            setAuditError(error.message || "Failed to generate AI audit.");
        } finally {
            setIsAuditing(false);
        }
    }, [prices, saleState, saleConfig, totalSold, totalContributors, marketStats]);

    return useMemo(() => ({
        status, error, history, isAuditing, aiAuditResult, auditError,
        orderbook, userOrders, isOrderbookLoading, placeLimitOrder,
        buyPresaleTokens, claimTokens, runAiAudit,
        buyMarketTokens, sellMarketTokens,
        clearError,
        buyWithCard,
        buyWithSolanaPay,
    }), [
        status, error, history, isAuditing, aiAuditResult, auditError,
        orderbook, userOrders, isOrderbookLoading, placeLimitOrder,
        buyPresaleTokens, claimTokens, runAiAudit, buyMarketTokens, sellMarketTokens, clearError,
        buyWithCard, buyWithSolanaPay,
    ]);
}