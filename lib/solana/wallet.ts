import { logger } from '../../services/logger';
import { SolanaNetwork } from '../../types';

// Mock values to simulate a user's wallet state on the "blockchain"
let mockBlockchainBalances = {
    sol: 10.0,
    usdc: 1000.0,
    hot: 0.0, // Starts at 0, increases upon claiming
};

/**
 * Modifies the mock blockchain state. Called by transaction simulations on devnet/localnet.
 * @param currency The currency to modify.
 * @param amount The amount to add (can be negative).
 */
export const modifyMockBlockchainBalance = (currency: 'sol' | 'usdc' | 'hot', amount: number) => {
    // Prevent negative balances
    mockBlockchainBalances[currency] = Math.max(0, mockBlockchainBalances[currency] + amount);
    logger.info('[MockBlockchain]', `Updated ${currency} balance. New balance: ${mockBlockchainBalances[currency]}`);
};

/**
 * Fetches the native SOL balance for a given address.
 * Uses real RPC for mainnet and mock data for other networks.
 * @param address The wallet address.
 * @param network The current Solana network.
 * @param rpcUrl The RPC endpoint to use.
 * @returns A promise that resolves to the SOL balance.
 */
export async function getSolBalance(address: string, network: SolanaNetwork, rpcUrl: string): Promise<number> {
    if (network !== 'mainnet') {
        logger.info('[WalletLib]', `Fetching MOCK SOL balance for ${address}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        return mockBlockchainBalances.sol;
    }

    logger.info('[WalletLib]', `Fetching REAL SOL balance for ${address} via ${rpcUrl}`);
    try {
        const response = await fetch(rpcUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getBalance',
                params: [address],
            }),
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        const lamports = data.result?.value || 0;
        return lamports / 1_000_000_000;
    } catch (error) {
        logger.error('[WalletLib]', 'Failed to fetch real SOL balance:', error);
        return 0;
    }
}

/**
 * Fetches the balance of an SPL token.
 * Uses real RPC for mainnet and mock data for other networks.
 * @param address The wallet address.
 * @param mintAddress The mint address of the SPL token.
 * @param network The current Solana network.
 * @param rpcUrl The RPC endpoint to use.
 * @returns A promise that resolves to the token balance.
 */
export async function getSplTokenBalance(address: string, mintAddress: string, network: SolanaNetwork, rpcUrl: string): Promise<number> {
    if (network !== 'mainnet') {
        logger.info('[WalletLib]', `Fetching MOCK SPL token balance for mint ${mintAddress}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        const lowerMint = mintAddress.toLowerCase();
        if (lowerMint.includes('usdc')) return mockBlockchainBalances.usdc;
        if (lowerMint.includes('hot')) return mockBlockchainBalances.hot;
        return 0;
    }

    logger.info('[WalletLib]', `Fetching REAL SPL token balance for mint ${mintAddress}`);
    try {
        const response = await fetch(rpcUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getTokenAccountsByOwner',
                params: [
                    address,
                    { mint: mintAddress },
                    { encoding: 'jsonParsed' },
                ],
            }),
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        const accounts = data.result?.value || [];
        if (accounts.length === 0) {
            return 0; // User does not have a token account for this mint
        }
        
        // Sum balances from all accounts, though typically there's only one.
        const totalBalance = accounts.reduce((acc: number, account: any) => {
            const amount = account?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0;
            return acc + amount;
        }, 0);

        return totalBalance;
    } catch (error) {
        logger.error('[WalletLib]', `Failed to fetch real SPL balance for mint ${mintAddress}:`, error);
        return 0;
    }
}