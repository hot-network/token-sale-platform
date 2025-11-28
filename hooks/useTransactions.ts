
import { useState, useCallback, useMemo } from 'react';
import { Transaction, TransactionStatus } from '../types/transactions';
import { claimHotTokens, purchaseHotTokens } from '../lib/solana/anchor';
import { executeJupiterSwap } from '../lib/solana/jupiter';
import { UserHookReturn } from '../types/users';
import { logger } from '../services/logger';
import { GoogleGenAI } from '@google/genai';

const getApiKey = () => {
    try {
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            return process.env.API_KEY;
        }
    } catch (e) {
        console.warn("Could not access process.env.API_KEY. AI features may be disabled.");
    }
    return '';
};

interface UseTransactionsProps {
    saleState: 'UPCOMING' | 'ACTIVE' | 'ENDED';
    prices: {
        presaleHotPrice: number;
        marketHotPrice: number;
        solPrice: number;
    };
    user: UserHookReturn;
    wallets: {
        isConnected: boolean;
        adapter: any;
    };
    onTransactionSuccess: (usdValue: number) => void;
    onTransactionError: (error: string) => void;
}

export default function useTransactions(props: UseTransactionsProps) {
    const { saleState, prices, user, wallets, onTransactionSuccess, onTransactionError } = props;
    
    const [status, setStatus] = useState<TransactionStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<Transaction[]>([]);

    const [isAuditing, setIsAuditing] = useState(false);
    const [aiAuditResult, setAiAuditResult] = useState<string | null>(null);
    const [auditError, setAuditError] = useState<string | null>(null);

    const clearError = useCallback(() => setError(null), []);
    const addTransactionToHistory = useCallback((transaction: Transaction) => setHistory(prev => [transaction, ...prev]), []);

    const executeGenericTransaction = useCallback(async <T extends any[], R>(
        txFunction: (...args: T) => Promise<{ success: boolean; error?: string; [key: string]: any }>,
        onSuccess: (result: any) => R,
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
                const successData = onSuccess(result);
                setStatus('success');
                return successData;
            } else {
                throw new Error(result.error || "Transaction failed in contract.");
            }
        } catch (err: any) {
            const errMsg = err.message || 'An unknown error occurred.';
            // User rejection is a common case, handle it gracefully
            if (errMsg.includes('User rejected the request')) {
                onTransactionError('Transaction was rejected.');
            } else {
                setError(errMsg);
                onTransactionError(errMsg);
            }
            setStatus('error');
            return null;
        }
    }, [wallets.isConnected, onTransactionError]);

    const buyPresaleTokens = useCallback(async (hotAmount: number, currency: 'SOL' | 'USDC'): Promise<Transaction | null> => {
        const usdValue = hotAmount * prices.presaleHotPrice;
        const result = await executeGenericTransaction(
            purchaseHotTokens,
            (res: { signature: string, paidAmount: number }): Transaction => {
                const newTx: Transaction = {
                    id: res.signature,
                    timestamp: Date.now(),
                    hotAmount,
                    currency,
                    usdValue,
                    type: 'presale_buy',
                };
                addTransactionToHistory(newTx);
                user.deductFunds(res.paidAmount, currency);
                user.updateUserBalance(user.hotBalance + hotAmount);
                onTransactionSuccess(usdValue);
                return newTx;
            },
            wallets.adapter,
            currency,
            hotAmount,
            prices,
            user.solBalance,
            user.usdcBalance
        );
        return result;
    }, [executeGenericTransaction, addTransactionToHistory, user, prices, wallets.adapter, onTransactionSuccess]);

    const claimTokens = useCallback(async (): Promise<Transaction | null> => {
        if (saleState !== 'ENDED' || user.hotBalance <= 0) {
            onTransactionError(user.hotBalance <= 0 ? "You have no tokens to claim." : "Claiming is not available yet.");
            return null;
        }
        return await executeGenericTransaction(
            claimHotTokens,
            (res: { signature: string }): Transaction => {
                const newTx: Transaction = {
                    id: res.signature,
                    timestamp: Date.now(),
                    hotAmount: user.hotBalance,
                    currency: 'SOL', // Claim doesn't involve payment currency
                    usdValue: 0,
                    type: 'claim',
                };
                addTransactionToHistory(newTx);
                user.updateUserBalance(0);
                onTransactionSuccess(0);
                return newTx;
            },
            wallets.adapter, user.hotBalance
        );
    }, [saleState, user, executeGenericTransaction, addTransactionToHistory, wallets.adapter, onTransactionSuccess, onTransactionError]);
    
    const buyMarketTokens = useCallback(async (amount: number, currency: 'SOL' | 'USDC') => {
        await executeGenericTransaction(
            executeJupiterSwap,
            () => {
                user.updateUserBalance(user.hotBalance + amount);
                onTransactionSuccess(0); // Market trades don't count towards presale contribution
            },
            amount, currency, 'buy'
        );
    }, [executeGenericTransaction, user, onTransactionSuccess]);

    const sellMarketTokens = useCallback(async (amount: number, currency: 'SOL' | 'USDC') => {
        if (amount > user.hotBalance) {
            const errorMessage = "Insufficient HOT balance to sell.";
            setError(errorMessage);
            onTransactionError(errorMessage);
            setStatus('error');
            return;
        }
        await executeGenericTransaction(
            executeJupiterSwap,
            () => {
                user.updateUserBalance(user.hotBalance - amount);
                onTransactionSuccess(0); // Market trades don't count towards presale contribution
            },
            amount, currency, 'sell'
        );
    }, [executeGenericTransaction, user, onTransactionError, onTransactionSuccess]);

    const buyWithCard = useCallback(async (hotAmount: number): Promise<Transaction | null> => {
        const usdValue = hotAmount * prices.presaleHotPrice;
        setStatus('processing');
        setError(null);

        // Simulate API call to a payment provider and waiting for webhook confirmation
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Simulate a successful transaction
        try {
            const newTx: Transaction = {
                id: `card_tx_${Date.now()}`,
                timestamp: Date.now(),
                hotAmount,
                currency: 'USDC', // On-ramps typically deal with stablecoins
                usdValue,
                type: 'presale_buy',
            };
            addTransactionToHistory(newTx);
            user.updateUserBalance(user.hotBalance + hotAmount);
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
    }, [addTransactionToHistory, user, prices.presaleHotPrice, onTransactionSuccess, onTransactionError]);

    const buyWithSolanaPay = useCallback(async (hotAmount: number, currency: 'SOL' | 'USDC'): Promise<Transaction | null> => {
        const usdValue = hotAmount * prices.presaleHotPrice;
        setStatus('processing');
        setError(null);
        
        // In a real app, we'd make an API call to our backend to create a transaction request reference.
        // The backend would then monitor the blockchain for the payment.
        // Here, we'll just simulate a delay for the user "making" the payment.
        
        console.log("Waiting for Solana Pay transaction...");
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Simulate a successful transaction
        try {
            const signature = `solpay_sig_${Date.now()}`;
            const newTx: Transaction = {
                id: signature,
                timestamp: Date.now(),
                hotAmount,
                currency,
                usdValue,
                type: 'presale_buy',
            };
            addTransactionToHistory(newTx);
            user.updateUserBalance(user.hotBalance + hotAmount);
            onTransactionSuccess(usdValue);
            setStatus('success');
            return newTx;
        } catch (err: any)
        {
            const errMsg = err.message || 'An unknown error occurred during Solana Pay processing.';
            setError(errMsg);
            onTransactionError(errMsg);
            setStatus('error');
            return null;
        }
    }, [addTransactionToHistory, user, prices.presaleHotPrice, onTransactionSuccess, onTransactionError]);


    const runAiAudit = useCallback(async () => {
        setIsAuditing(true);
        setAiAuditResult(null);
        setAuditError(null);
        try {
            const apiKey = getApiKey();
            if (!apiKey) throw new Error("API Key not configured.");
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `As a blockchain security analyst, provide a brief, high-level summary of a token presale with the following real-time metrics:\n- Current HOT/USD Price: $${prices.presaleHotPrice.toFixed(8)}\n\nYour summary should mention one key strength, one potential risk to monitor, and a concluding remark. Keep it concise and professional. Format the response using Markdown with bolding for titles.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            if (response.text) {
                setAiAuditResult(response.text);
            } else {
                throw new Error("Received an empty response from the AI.");
            }
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
