
// This file simulates an embedded wallet service like Privy or Dynamic.
// It creates a deterministic "wallet" based on the user's email.
import { WalletAdapter } from '../../types/wallets';
import { logger } from '../../services/logger';

// A simple (and insecure) way to create a deterministic, fake address from an email.
// In a real app, this would be a secure, cryptographically generated key pair.
const emailToAddress = (email: string): string => {
    const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `user${hash.toString().padStart(4, '0')}...${(hash * 3).toString().slice(-4)}`;
};

class EmbeddedWalletAdapter implements WalletAdapter {
    provider: 'embedded' = 'embedded';
    address: string;

    constructor(email: string) {
        this.address = emailToAddress(email);
        logger.info('[EmbeddedWallet]', `Created adapter for ${email} with address ${this.address}`);
    }

    async connect(): Promise<void> {
        logger.info('[EmbeddedWallet]', `Connecting with address ${this.address}`);
        // No-op for simulation, already "connected" on instantiation
        return Promise.resolve();
    }

    async disconnect(): Promise<void> {
        logger.info('[EmbeddedWallet]', `Disconnecting from ${this.address}`);
        localStorage.removeItem('embedded_wallet_email');
        return Promise.resolve();
    }
    
    async signAndSendTransaction(transaction: any): Promise<string> {
        logger.info('[EmbeddedWallet]', `Prompting user to sign transaction...`, transaction);
        
        // Simulate user taking time to review the transaction
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate a 5% chance of user rejection
        if (Math.random() < 0.05) {
            logger.warn('[EmbeddedWallet]', 'User rejected the transaction.');
            throw new Error("User rejected the request.");
        }
        
        const signature = `sim_sig_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        logger.info('[EmbeddedWallet]', `Transaction signed and sent. Signature: ${signature}`);
        return signature;
    }
}

export const loginWithEmail = async (email: string): Promise<WalletAdapter> => {
    logger.info('[EmbeddedWallet]', `Logging in with ${email}`);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, you might store a session token.
    localStorage.setItem('embedded_wallet_email', email);
    
    return new EmbeddedWalletAdapter(email);
};

export const logout = async (): Promise<void> => {
    logger.info('[EmbeddedWallet]', `Logging out.`);
    localStorage.removeItem('embedded_wallet_email');
    return Promise.resolve();
};

// This could be used on page load to see if a user is already logged in.
export const getWallet = (): WalletAdapter | null => {
    const email = localStorage.getItem('embedded_wallet_email');
    if (email) {
        return new EmbeddedWalletAdapter(email);
    }
    return null;
};