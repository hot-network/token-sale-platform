
export interface DexInfo {
    id: string;
    name: string;
    logoUrl: string;
}

export interface TokenPair {
    base: string; // symbol
    quote: string; // symbol
}

export interface LiquidityPool {
    id: string; // e.g., pool address
    dex: DexInfo;
    pair: TokenPair;
    tvlUSD: number;
    volume24hUSD: number;
    apy: number;
}
