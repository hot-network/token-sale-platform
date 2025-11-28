
// This file interacts with the Birdeye API to get market data for a token.
import { appCache } from '../../utils/cache';
import { logger } from '../../services/logger';
import { NETWORKS } from '../../configs/network-config';
import { BirdeyeMarketData } from '../../types';


const BIRDEYE_API_URL = 'https://public-api.birdeye.so';
const CACHE_KEY_PREFIX = 'birdeye_market_';
const CACHE_TTL_MS = 30000; // 30 seconds

/**
 * Fetches market data for a given token mint from Birdeye.
 * NOTE: For this simulation, it returns hardcoded mock data for the fictional HOT token
 * once it is considered "listed", and will fail for other tokens.
 * @param mintAddress The mint address of the token.
 * @returns A promise resolving to the token's market data.
 */
export async function getTokenMarketData(mintAddress: string): Promise<BirdeyeMarketData | null> {
    const cacheKey = `${CACHE_KEY_PREFIX}${mintAddress}`;
    if (appCache.has(cacheKey)) {
        return appCache.get<BirdeyeMarketData>(cacheKey);
    }

    if (mintAddress !== NETWORKS['mainnet-beta'].hotTokenMint) {
        logger.warn('[Birdeye]', `Market data requested for an unsupported token: ${mintAddress}. This simulation only supports the HOT token.`);
        return null;
    }

    try {
        logger.info('[Birdeye]', 'Simulating fetch for HOT token market data...');
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 250));

        // In a real app, you would make an API call to Birdeye's more detailed endpoints.
        // Here, we return a plausible, dynamic-ish simulated market data object.
        const basePrice = 0.0000020;
        const priceFluctuation = 1 + (Math.random() - 0.5) * 0.05; // +/- 5% fluctuation
        const simulatedPrice = basePrice * priceFluctuation;
        
        const marketData: BirdeyeMarketData = {
            price: simulatedPrice,
            marketCap: 2100000 * priceFluctuation,
            volume24h: 150000 * (1 + (Math.random() - 0.5) * 0.2),
            priceChange24h: (priceFluctuation - 1) * 100 * 5, // Exaggerate change for visual effect
            holders: 17480 + Math.floor(Math.random() * 100),
        };
        
        appCache.set(cacheKey, marketData, CACHE_TTL_MS);
        return marketData;

    } catch (error) {
        logger.error('[Birdeye]', `Failed to fetch token market data for ${mintAddress}`, error);
        return null;
    }
}
