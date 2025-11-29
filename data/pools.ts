import { LiquidityPool } from '../types/pools';
import { SolanaNetwork } from '../types';
import { DEXS } from './dex';

// --- MAINNET POOLS ---
const MAINNET_POOLS: LiquidityPool[] = [
    {
        id: 'raydium-hot-sol',
        dex: DEXS.raydium,
        pair: { base: 'HOT', quote: 'SOL' },
        tvlUSD: 1_250_000,
        volume24hUSD: 78_000,
        apy: 28.5,
    },
    {
        id: 'orca-hot-usdc',
        dex: DEXS.orca,
        pair: { base: 'HOT', quote: 'USDC' },
        tvlUSD: 850_000,
        volume24hUSD: 42_000,
        apy: 22.1,
    },
    {
        id: 'meteora-hot-usdc',
        dex: DEXS.meteora,
        pair: { base: 'HOT', quote: 'USDC' },
        tvlUSD: 600_000,
        volume24hUSD: 35_000,
        apy: 19.8,
    }
];

// --- DEVNET / TESTNET POOLS (MOCK DATA) ---
const DEVNET_POOLS: LiquidityPool[] = [
     {
        id: 'raydium-hot-sol-dev',
        dex: DEXS.raydium,
        pair: { base: 'HOT', quote: 'SOL' },
        tvlUSD: 15_000,
        volume24hUSD: 1_200,
        apy: 15.0,
    },
];

export const POOLS: Record<SolanaNetwork, LiquidityPool[]> = {
    // FIX: Changed 'mainnet-beta' to 'mainnet' to match the SolanaNetwork type.
    'mainnet': MAINNET_POOLS,
    'devnet': DEVNET_POOLS,
    // FIX: Changed 'testnet' to 'localnet' to match the SolanaNetwork type.
    'localnet': DEVNET_POOLS,
};