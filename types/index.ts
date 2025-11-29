
// This declaration informs TypeScript about the global `process` object provided by the execution environment.
// It prevents the compiler from pulling in the entire `@types/node` library, which was causing type conflicts.
declare var process: {
  env: {
    readonly API_KEY: string;
  }
};

export type SaleState = 'UPCOMING' | 'ACTIVE' | 'ENDED';

export interface Countdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export interface SaleStageConfig {
    id: string;
    name: string;
    startTimestamp: number; // Unix timestamp (seconds)
    endTimestamp: number;   // Unix timestamp (seconds)
    softcap: number;
    hardcap: number;
    minContributionUSD: number;
    maxContributionUSD: number;
}

// Types for Database Schema
export interface DBTransaction {
    id: string; // e.g., tx signature
    wallet_address: string;
    hot_amount: number;
    paid_amount: number;
    paid_currency: 'SOL' | 'USDC';
    usd_value: number;
    created_at: Date;
}

export interface SaleMetrics {
    id: string; // Should only be one row, e.g., 'primary'
    total_sold: number;
    total_contributors: number;
    total_raised_usd: number;
    updated_at: Date;
}

// NEW TYPES
export interface ContributionTier {
  id: "bronze" | "silver" | "gold" | "platinum";
  min: number;
  max: number;
  label: string;
  bonus: number; // Bonus percentage
}

export interface Eligibility {
    isEligible: boolean;
    reason: string | null;
    isLoading: boolean;
}

export type ToastType = 'success' | 'error' | 'info';
export interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

export type SolanaNetwork = 'mainnet' | 'devnet' | 'localnet';

export interface NetworkConfig {
    cluster: SolanaNetwork;
    label: string;
    rpcUrl: string;
    explorerUrl: string;
    programId: string;
    hotTokenMint: string;
    usdcTokenMint: string;
    treasuryAddress: string;
    faucetEnabled: boolean;
}

export interface BirdeyeMarketData {
    price: number;
    marketCap: number;
    volume24h: number;
    priceChange24h: number;
    holders: number;
}
