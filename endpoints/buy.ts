import { logger } from '../services/logger';

interface BuyTransactionPayload {
    signature: string;
    walletAddress: string;
    hotAmount: number;
    paidAmount: number;
    currency: 'SOL' | 'USDC';
    usdValue: number;
}

/**
 * NOTE: This is a placeholder for a dedicated API client module.
 * Currently, API calls are made directly from hooks (e.g., useTransactions.ts).
 * This function demonstrates how transaction recording could be centralized.
 */
export async function recordBuyTransaction(payload: BuyTransactionPayload) {
    logger.info('[API Client]', 'Recording buy transaction.', payload);
    
    // In a full refactor, the fetch call from useTransactions.ts would be moved here.
    const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, paidCurrency: payload.currency }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server failed to record transaction with status ${response.status}`);
    }
    return await response.json();
}