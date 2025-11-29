// This file interacts with the Birdeye API to get market data for a token.
import { appCache } from '../../utils/cache';
import { logger } from '../../services/logger';
import { BirdeyeMarketData, SolanaNetwork } from '../../types';

const BIRDEYE_API_URL = 'https://public-api.birdeye.so';
const CACHE_KEY_PREFIX = 'birdeye_market_';
const CACHE_TTL_MS = 30000; // 30 seconds

/**
 * Fetches market data for a given token mint from Birdeye.
 * @param mintAddress The mint address of the token.
 * @param network The current Solana network.
 * @returns A promise resolving to the token's market data or null if not found/error.
 */
export async function getTokenMarketData(mintAddress: string, network: SolanaNetwork): Promise<BirdeyeMarketData | null> {
    const cacheKey = `${CACHE_KEY_PREFIX}${mintAddress}`;
    if (appCache.has(cacheKey)) {
        return appCache.get<BirdeyeMarketData>(cacheKey);
    }
    
    // Use mock data for non-mainnet environments to allow UI testing
    if (network !== 'mainnet') {
        logger.info('[Birdeye]', `Returning MOCK market data for ${network}.`);
        const basePrice = 0.0000020;
        const priceFluctuation = 1 + (Math.random() - 0.5) * 0.05;
        const simulatedPrice = basePrice * priceFluctuation;
        const mockData: BirdeyeMarketData = {
            price: simulatedPrice,
            marketCap: 2100000 * priceFluctuation,
            volume24h: 150000 * (1 + (Math.random() - 0.5) * 0.2),
            priceChange24h: (priceFluctuation - 1) * 100 * 5,
            holders: 17480 + Math.floor(Math.random() * 100),
        };
        appCache.set(cacheKey, mockData, CACHE_TTL_MS);
        return mockData;
    }

    // --- Mainnet: Fetch real data ---
    try {
        logger.info('[Birdeye]', `Fetching REAL market data for ${mintAddress} from Birdeye.`);
        const response = await fetch(`${BIRDEYE_API_URL}/public/overview/token/${mintAddress}`);

        if (!response.ok) {
            if (response.status === 404) {
                logger.warn('[Birdeye]', `Token ${mintAddress} not found on Birdeye.`);
                return null;
            }
            throw new Error(`Birdeye API responded with status ${response.status}`);
        }

        const result = await response.json();
        if (!result.success || !result.data) {
            throw new Error('Invalid data format from Birdeye API.');
        }

        const data = result.data;
        const marketData: BirdeyeMarketData = {
            price: data.price || 0,
            marketCap: data.mc || 0,
            volume24h: data.v24hUSD || 0,
            priceChange24h: data.priceChange24hPercent || 0,
            // Holders count is not available in the overview endpoint, so we omit it.
            // UI will need to handle this gracefully.
            holders: 0, 
        };
        
        appCache.set(cacheKey, marketData, CACHE_TTL_MS);
        return marketData;

    } catch (error) {
        logger.error('[Birdeye]', `Failed to fetch token market data for ${mintAddress}`, error);
        return null;
    }
}