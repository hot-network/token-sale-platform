
// Fetches real-time price data from the Pyth Network with a fallback.
import { appCache } from '../../utils/cache';
import { logger } from '../../services/logger';

// Pyth Config
const SOL_USD_PRICE_FEED_ID_PYTH = 'H6ARHf6YXhGYeQfUzQnetJpWgVtwgign51Lg5GyYkZub'; // Mainnet SOL/USD feed
const PYTH_API_URL = 'https://hermes.pyth.network';

// CoinGecko Config (Fallback)
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const SOL_ID_COINGECKO = 'solana';

const CACHE_KEY = 'sol_usd_price';
const CACHE_TTL_MS = 20000; // 20 seconds cache

// --- Internal Price Fetching Functions ---

async function fetchFromPyth(): Promise<number> {
    const response = await fetch(`${PYTH_API_URL}/v2/updates/price/latest?ids[]=${SOL_USD_PRICE_FEED_ID_PYTH}`);
    if (!response.ok) {
        throw new Error(`Pyth API request failed with status ${response.status}`);
    }
    const data = await response.json();
    
    // Note: The `data.parsed[0]` structure might be specific to the API response version.
    const priceData = data?.parsed?.[0]?.[SOL_USD_PRICE_FEED_ID_PYTH];
    if (!priceData || !priceData.price) {
        throw new Error('SOL/USD price not found in Pyth response format.');
    }

    const price = parseFloat(priceData.price.price);
    const exponent = parseInt(priceData.price.expo, 10);
    const finalPrice = price * Math.pow(10, exponent);

    if (isNaN(finalPrice) || finalPrice <= 0) {
        throw new Error('Invalid price data received from Pyth.');
    }
    return finalPrice;
}

async function fetchFromCoinGecko(): Promise<number> {
    const response = await fetch(`${COINGECKO_API_URL}/simple/price?ids=${SOL_ID_COINGECKO}&vs_currencies=usd`);
    if (!response.ok) {
        throw new Error(`CoinGecko API request failed with status ${response.status}`);
    }
    const data = await response.json();

    const price = data?.[SOL_ID_COINGECKO]?.usd;
    if (typeof price !== 'number' || price <= 0) {
        throw new Error('SOL/USD price not found in CoinGecko response format.');
    }
    
    return price;
}

// --- Main Exported Function ---

// An array of price providers, ordered by priority.
const priceProviders = [
    { name: 'Pyth', fetch: fetchFromPyth },
    { name: 'CoinGecko', fetch: fetchFromCoinGecko },
];

/**
 * Fetches the current SOL/USD price by trying a series of providers in order.
 * It uses a primary source (Pyth) and falls back to a secondary source (CoinGecko) on failure.
 * Results are cached to reduce network requests.
 * @returns A promise that resolves to the SOL price in USD.
 */
export async function getSolPrice(): Promise<number> {
    if (appCache.has(CACHE_KEY)) {
        return appCache.get<number>(CACHE_KEY)!;
    }

    for (const provider of priceProviders) {
        try {
            const price = await provider.fetch();
            logger.info(`[${provider.name}]`, `Successfully fetched SOL price: $${price}`);
            appCache.set(CACHE_KEY, price, CACHE_TTL_MS);
            return price;
        } catch (error) {
            logger.warn(`[${provider.name}]`, `Failed to fetch from ${provider.name}, trying next provider.`, error);
        }
    }

    logger.error('[getSolPrice]', 'Failed to fetch SOL price from all available sources.');
    throw new Error('All price sources are currently unavailable.');
}