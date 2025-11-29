import { logger } from '../services/logger';

interface SellTransactionPayload {
    signature: string;
    walletAddress: string;
    hotAmount: number;
    receivedAmount: number;
    receivedCurrency: 'SOL' | 'USDC';
    usdValue: number;
}

/**
 * NOTE: This is a placeholder for a dedicated API client module.
 * The current /api/transactions endpoint only supports recording buys.
 * This function demonstrates how a sell transaction could be recorded if the API was extended.
 */
export async function recordSellTransaction(payload: SellTransactionPayload) {
    logger.info('[API Client]', 'Recording sell transaction.', payload);
    
    // This endpoint does not exist yet. This is a conceptual implementation.
    const response = await fetch('/api/transactions/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server failed to record transaction with status ${response.status}`);
    }
    return await response.json();
}