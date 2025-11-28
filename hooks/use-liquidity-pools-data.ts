import { useState, useEffect } from 'react';
import { SolanaNetwork } from '../types';
import { LiquidityPool } from '../types/pools';
import { POOLS } from '../data/pools';
import { logger } from '../services/logger';

export function useLiquidityPoolsData(network: SolanaNetwork) {
    const [pools, setPools] = useState<LiquidityPool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPools = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // In a real app, this would be an API call to a DEX aggregator or on-chain data provider.
                // For this simulation, we'll use our static data file and add a delay.
                logger.info('[useLiquidityPoolsData]', `Fetching pools for ${network}...`);
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const networkPools = POOLS[network];
                if (!networkPools) {
                    throw new Error(`No pool data available for network: ${network}`);
                }
                
                // Simulate some dynamic changes for realism
                const dynamicPools = networkPools.map(pool => ({
                    ...pool,
                    tvlUSD: pool.tvlUSD * (1 + (Math.random() - 0.5) * 0.02),
                    volume24hUSD: pool.volume24hUSD * (1 + (Math.random() - 0.5) * 0.1),
                    apy: pool.apy * (1 + (Math.random() - 0.5) * 0.05),
                }));

                setPools(dynamicPools);

            } catch (err: any) {
                logger.error('[useLiquidityPoolsData]', 'Failed to fetch liquidity pools', err);
                setError(err.message || 'Could not load liquidity data.');
                setPools([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPools();
    }, [network]);

    return { pools, isLoading, error };
}