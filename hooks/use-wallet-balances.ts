import { useState, useEffect, useCallback } from 'react';
import { getSolBalance, getSplTokenBalance } from '../lib/solana/wallet';
import { NetworkConfig } from '../types';
import { logger } from '../services/logger';

interface UseWalletBalancesProps {
    address: string | null;
    networkConfig: NetworkConfig;
    pollInterval?: number;
}

export function useWalletBalances({ address, networkConfig, pollInterval = 12000 }: UseWalletBalancesProps) {
    const [solBalance, setSolBalance] = useState(0);
    const [usdcBalance, setUsdcBalance] = useState(0);
    const [hotBalance, setHotBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBalances = useCallback(async () => {
        if (!address) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            // This structure mimics a more standard balance fetching pattern.
            const { cluster, rpcUrl, usdcTokenMint, hotTokenMint } = networkConfig;
            
            // 1. Fetch native SOL balance and SPL token balances concurrently.
            const [sol, usdc, hot] = await Promise.all([
                getSolBalance(address, cluster, rpcUrl),
                getSplTokenBalance(address, usdcTokenMint, cluster, rpcUrl),
                getSplTokenBalance(address, hotTokenMint, cluster, rpcUrl),
            ]);

            setSolBalance(sol);
            setUsdcBalance(usdc);
            setHotBalance(hot);

        } catch (error) {
            logger.error('[useWalletBalances]', 'Failed to fetch balances', error);
        } finally {
            setIsLoading(false);
        }
    }, [address, networkConfig]);

    useEffect(() => {
        if (address) {
            fetchBalances();
            const intervalId = setInterval(fetchBalances, pollInterval);
            return () => clearInterval(intervalId);
        } else {
            setSolBalance(0);
            setUsdcBalance(0);
            setHotBalance(0);
            setIsLoading(false);
        }
    }, [address, pollInterval, fetchBalances]);

    return { solBalance, usdcBalance, hotBalance, isLoading, refetch: fetchBalances };
}