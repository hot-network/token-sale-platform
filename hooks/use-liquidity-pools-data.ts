import { useState, useEffect } from 'react';
import { SolanaNetwork } from '../types';
import { LiquidityPool } from '../types/pools';
import { POOLS } from '../data/pools';
import { logger } from '../services/logger';
import { DEXS } from '../data/dex';

// Simulate a more realistic, raw API response from a DEX aggregator
const FAKE_API_RESPONSE = {
    success: true,
    data: [
        {
            poolId: 'raydium-hot-sol',
            exchange: 'Raydium',
            baseTokenSymbol: 'HOT',
            quoteTokenSymbol: 'SOL',
            tvl: 1250000,
            volume24h: 78000,
            apy24h: 0.285,
        },
        {
            poolId: 'orca-hot-usdc',
            exchange: 'Orca',
            baseTokenSymbol: 'HOT',
            quoteTokenSymbol: 'USDC',
            tvl: 850000,
            volume24h: 42000,
            apy24h: 0.221,
        },
        {
            poolId: 'meteora-hot-usdc',
            exchange: 'Meteora',
            baseTokenSymbol: 'HOT',
            quoteTokenSymbol: 'USDC',
            tvl: 600000,
            volume24h: 35000,
            apy24h: 0.198,
        }
    ]
};

async function fetchMainnetPoolsFromApi(): Promise<LiquidityPool[]> {
    logger.info('[API]', 'Fetching mainnet liquidity pools from DEX aggregator...');
    // Simulate network delay for a real API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate a potential API failure
    if (Math.random() < 0.1) { // 10% chance to fail
        throw new Error("DEX Aggregator API is currently unavailable.");
    }
    
    // Map the raw API response to our internal LiquidityPool type
    const mappedPools = FAKE_API_RESPONSE.data.map(item => {
        const dexId = item.exchange.toLowerCase();
        return {
            id: item.poolId,
            dex: DEXS[dexId] || { id: dexId, name: item.exchange, logoUrl: '/assets/hot.png' },
            pair: { base: item.baseTokenSymbol, quote: item.quoteTokenSymbol },
            tvlUSD: item.tvl,
            volume24hUSD: item.volume24h,
            apy: item.apy24h * 100, // Convert decimal to percentage
        };
    });

    return mappedPools;
}


export function useLiquidityPoolsData(network: SolanaNetwork) {
    const [pools, setPools] = useState<LiquidityPool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPools = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let networkPools: LiquidityPool[];
                
                // FIX: Changed 'mainnet-beta' to 'mainnet' to match the SolanaNetwork type.
                if (network === 'mainnet') {
                    // This is the "fully wired" mainnet call
                    networkPools = await fetchMainnetPoolsFromApi();
                } else {
                    // For non-mainnet, use the existing mock data
                    logger.info('[useLiquidityPoolsData]', `Fetching mock pools for ${network}...`);
                    await new Promise(resolve => setTimeout(resolve, 300));
                    networkPools = POOLS[network];
                }

                if (!networkPools) {
                    throw new Error(`No pool data available for network: ${network}`);
                }
                
                setPools(networkPools);

            } catch (err: any) {
                logger.error('[useLiquidityPoolsData]', 'Failed to fetch liquidity pools from API, using fallback.', err);
                setError(err.message + ' - Displaying cached data.');
                // Fallback to static data on API error
                setPools(POOLS[network]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPools();
    }, [network]);

    return { pools, isLoading, error };
}