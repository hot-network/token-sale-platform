import { SolanaNetwork } from '../types';
import { logger } from '../services/logger';

/**
 * NOTE: This is a placeholder for a dedicated API client module.
 * Currently, API calls are made directly from hooks (e.g., useTokenSales.ts).
 * This function demonstrates how status fetching could be centralized.
 */
export async function getSaleStatus(network: SolanaNetwork) {
    logger.info('[API Client]', `Fetching sale status for ${network}`);
    
    // In a full refactor, the fetch call from useTokenSales.ts would be moved here.
    const response = await fetch(`/api/status?network=${network}`);
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
}