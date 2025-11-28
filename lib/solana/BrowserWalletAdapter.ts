
import { WalletAdapter, WalletProvider } from '../../types/wallets';
import { logger } from '../../services/logger';

const providerToAddress = (provider: WalletProvider): string => {
    // Simple deterministic address generation for simulation
    const base = provider?.slice(0, 4) ?? 'unkn';
    const hash = provider?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) ?? 0;
    return `${base}${hash.toString().slice(-4)}...${(hash * 2).toString().slice(-4)}`;
};

export class BrowserWalletAdapter implements WalletAdapter {
    address: string;
    provider: WalletProvider;

    constructor(provider: WalletProvider) {
        if (!provider || provider === 'embedded') {
            throw new Error('Invalid provider for BrowserWalletAdapter.');
        }
        this.provider = provider;
        this.address = providerToAddress(provider);
        logger.info(`[${provider}]`, `Adapter created with address ${this.address}`);
    }

    async connect(): Promise<void> {
        logger.info(`[${this.provider}]`, `Connecting with address ${this.address}`);
        // Simulate a slight delay for the connection process
        await new Promise(resolve => setTimeout(resolve, 300));
        return Promise.resolve();
    }

    async disconnect(): Promise<void> {
        logger.info(`[${this.provider}]`, `Disconnecting from ${this.address}`);
        return Promise.resolve();
    }
    
    async signAndSendTransaction(transaction: any): Promise<string> {
        logger.info(`[${this.provider}]`, `Opening wallet to sign transaction...`, transaction);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (Math.random() < 0.05) {
            logger.warn(`[${this.provider}]`, 'User rejected the transaction.');
            throw new Error("User rejected the request.");
        }
        
        const signature = `sim_sig_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        logger.info(`[${this.provider}]`, `Transaction signed and sent. Signature: ${signature}`);
        return signature;
    }
}
