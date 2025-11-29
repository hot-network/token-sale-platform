import { useState, useCallback, useMemo, useEffect } from 'react';
import { Transaction, TransactionStatus } from '../types/transactions';
import { claimHotTokens, purchaseHotTokens } from '../lib/solana/presale';
import { executeJupiterSwap } from '../lib/solana/jupiter';
import { User } from '../types/users';
import { logger } from '../services/logger';
import { SolanaNetwork } from '../types';
import { localCacheGet, localCacheSet } from '../utils/cache';

interface UseTransactionsProps {
    saleState: 'UPCOMING' | 'ACTIVE' | 'ENDED';
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

const recordTransactionOnServer = async (txData: {
    signature: string;
    walletAddress: string;
    hotAmount: number;
    paidAmount: number;
    currency: 'SOL' | 'USDC';
    usdValue: number;
}) => {
    try {
        const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                signature: txData.signature,
                walletAddress: txData.walletAddress,
                hotAmount: txData.hotAmount,
                paidAmount: txData.paidAmount,
                paidCurrency: txData.currency,
                usdValue: txData.usdValue,
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server failed to record transaction with status ${response.status}`);
        }
        logger.info('[useTransactions]', 'Successfully recorded transaction on server.');
    } catch (error) {
        logger.error('[useTransactions]', 'Failed to record transaction on server.', error);
    }
};

const TRANSACTION_HISTORY_CACHE_KEY = 'transaction_history';

export default function useTransactions(props: UseTransactionsProps) {
    const { saleState, prices, user, wallets, network, onTransactionSuccess, onTransactionError, refetchBalances } = props;
    
    const [status, setStatus] = useState<TransactionStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<Transaction[]>(() => localCacheGet(TRANSACTION_HISTORY_CACHE_KEY) || []);

    const [isAuditing, setIsAuditing] = useState(false);
    const [aiAuditResult, setAiAuditResult] = useState<string | null>(null);
    const [auditError, setAuditError] = useState<string | null>(null);

    useEffect(() => {
        localCacheSet(TRANSACTION_HISTORY_CACHE_KEY, history);
    }, [history]);

    const clearError = useCallback(() => setError(null), []);
    const addTransactionToHistory = useCallback((transaction: Transaction) => setHistory(prev => [transaction, ...prev]), []);

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
        const cost = currency === 'SOL' ? (prices.solPrice > 0 ? usdValue / prices.solPrice : 0) : usdValue;
        
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            onTransactionError("You are offline. Transaction has been queued.");
            const newTx: Transaction = {
                id: `pending_${Date.now()}`,
                timestamp: Date.now(),
                hotAmount,
                currency,
                paidAmount: cost,
                usdValue,
                type: 'presale_buy',
                status: 'pending',
            };
            addTransactionToHistory(newTx);
            return newTx;
        }
        
        return await executeGenericTransaction(
            purchaseHotTokens,
            async (res: { signature: string; paidAmount: number }): Promise<Transaction> => {
                const newTx: Transaction = {
                    id: res.signature,
                    timestamp: Date.now(),
                    hotAmount,
                    currency,
                    paidAmount: res.paidAmount,
                    usdValue,
                    type: 'presale_buy',
                    status: 'confirmed',
                };
                addTransactionToHistory(newTx);
                onTransactionSuccess(usdValue);

                if (network === 'mainnet') {
                    await recordTransactionOnServer({
                        signature: res.signature,
                        walletAddress: user.address!,
                        hotAmount,
                        paidAmount: res.paidAmount,
                        currency,
                        usdValue
                    });
                }
                return newTx;
            },
            wallets.adapter,
            currency,
            hotAmount,
            prices,
            user.solBalance,
            user.usdcBalance,
            network
        );
    }, [executeGenericTransaction, addTransactionToHistory, user.address, user.solBalance, user.usdcBalance, prices, wallets.adapter, onTransactionSuccess, network, onTransactionError]);

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
            wallets.adapter, user.hotBalance, network
        );
    }, [saleState, user.hotBalance, prices.presaleHotPrice, executeGenericTransaction, addTransactionToHistory, wallets.adapter, onTransactionSuccess, onTransactionError, network]);
    
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
            return newTx;
        } catch (err: any) {
            const errMsg = err.message || 'An unknown error occurred during card payment processing.';
            setError(errMsg);
            onTransactionError(errMsg);
            setStatus('error');
            return null;
        }
    }, [addTransactionToHistory, prices.presaleHotPrice, onTransactionSuccess, onTransactionError]);

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
            return newTx;
        } catch (err: any) {
            const errMsg = err.message || 'An unknown error occurred during Solana Pay processing.';
            setError(errMsg);
            onTransactionError(errMsg);
            setStatus('error');
            return null;
        }
    }, [addTransactionToHistory, prices.presaleHotPrice, prices.solPrice, onTransactionSuccess, onTransactionError]);

    const runAiAudit = useCallback(async () => {
        setIsAuditing(true);
        setAiAuditResult(null);
        setAuditError(null);
        try {
            const response = await fetch('/api/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ presaleHotPrice: prices.presaleHotPrice }),
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
    }, [prices.presaleHotPrice]);

    return useMemo(() => ({
        status, error, history, isAuditing, aiAuditResult, auditError,
        buyPresaleTokens, claimTokens, runAiAudit,
        buyMarketTokens, sellMarketTokens,
        clearError,
        buyWithCard,
        buyWithSolanaPay,
    }), [
        status, error, history, isAuditing, aiAuditResult, auditError,
        buyPresaleTokens, claimTokens, runAiAudit, buyMarketTokens, sellMarketTokens, clearError,
        buyWithCard, buyWithSolanaPay,
    ]);
}