import { logger } from './logger';
import { SaleState, SaleStageConfig, SolanaNetwork } from '../types';

// --- Types for API responses ---

export interface SaleStatusResponse {
    saleConfig: SaleStageConfig;
    saleState: SaleState;
    totalSold: number;
    totalContributors: number;
    isListedOnDex: boolean;
}

export interface RecordTransactionPayload {
    signature: string;
    walletAddress: string;
    hotAmount: number;
    paidAmount: number;
    currency: 'SOL' | 'USDC';
    usdValue: number;
}


// --- API Functions ---

/**
 * Fetches the current sale status from the API.
 * @param network The network to query the status for.
 */
export async function fetchSaleStatus(network: SolanaNetwork): Promise<SaleStatusResponse> {
    logger.info('[TokenSaleService]', `Fetching sale status for ${network}`);
    const response = await fetch(`/api/status?network=${network}`);
    if (!response.ok) {
        throw new Error(`API request for sale status failed with status ${response.status}`);
    }
    return await response.json();
}

/**
 * Records a successful presale purchase transaction on the server.
 * @param txData The transaction data payload.
 */
export async function recordTransactionOnServer(txData: RecordTransactionPayload): Promise<void> {
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
        logger.info('[TokenSaleService]', 'Successfully recorded transaction on server.');
    } catch (error) {
        logger.error('[TokenSaleService]', 'Failed to record transaction on server.', error);
        // We re-throw the error so the calling hook can handle it if needed,
        // though in the current implementation it's fire-and-forget.
        throw error;
    }
}