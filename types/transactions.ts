
export type TransactionStatus = 'idle' | 'processing' | 'success' | 'error';
export type OnChainTransactionStatus = 'confirmed' | 'pending' | 'failed';

export interface Transaction {
    id: string; // Transaction signature or temporary ID for pending
    timestamp: number;
    hotAmount: number;
    currency: 'SOL' | 'USDC';
    paidAmount: number;
    usdValue: number;
    type: 'presale_buy' | 'market_buy' | 'market_sell' | 'claim';
    status: OnChainTransactionStatus;
}

// Types related to the server-validated payment flow
export type VerificationStatus = 'pending' | 'verified' | 'failed' | 'expired';

export interface Payment {
    reference: string;
    signature?: string;
    status: VerificationStatus;
    solanaPayUrl?: string;
}

// New type for the order book
export interface Order {
    id: string;
    price: number;
    amount: number;
    side: 'buy' | 'sell';
    status: 'open' | 'partially_filled' | 'filled' | 'canceled';
    timestamp: number;
}
