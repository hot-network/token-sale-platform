export type TransactionStatus = 'idle' | 'processing' | 'success' | 'error';

export interface Transaction {
    id: string; // Transaction signature
    timestamp: number;
    hotAmount: number;
    currency: 'SOL' | 'USDC';
    usdValue: number;
    type: 'presale_buy' | 'market_buy' | 'market_sell' | 'claim';
}

// Types related to the server-validated payment flow
export type VerificationStatus = 'pending' | 'verified' | 'failed' | 'expired';

export interface Payment {
    reference: string;
    signature?: string;
    status: VerificationStatus;
    solanaPayUrl?: string;
}
