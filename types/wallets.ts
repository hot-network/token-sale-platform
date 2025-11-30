
export type WalletProvider = 'phantom' | 'solflare' | 'sollet' | 'embedded' | 'backpack' | 'ledger' | null;
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

// A mock adapter interface to represent different wallet connection objects
export interface WalletAdapter {
    provider: WalletProvider;
    address: string;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    // Simulates signing and sending a transaction, returning a mock signature.
    signAndSendTransaction: (transaction: any) => Promise<string>;
}