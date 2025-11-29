
// This file acts as a client-side SDK for interacting with a simulated HOT Network Anchor program.
import { WalletAdapter } from '../../types/wallets';
import { logger } from '../../services/logger';
import { modifyMockBlockchainBalance } from './wallet';
import { SolanaNetwork } from '../../types';

const SOL_TRANSACTION_FEE = 0.00001; // A small fee for SOL transactions

/**
 * Simulates purchasing HOT tokens by calling the 'purchase' instruction on the Anchor program.
 *
 * @param adapter The user's connected wallet adapter.
 * @param currency The currency to pay with ('SOL' or 'USDC').
 * @param hotAmount The amount of HOT tokens to purchase.
 * @param prices The current prices for tokens.
 * @param userSolBalance The user's current SOL balance.
 * @param userUsdcBalance The user's current USDC balance.
 * @param network The current Solana network.
 * @returns A promise resolving to the result of the transaction.
 */
export async function purchaseHotTokens(
    adapter: WalletAdapter,
    currency: 'SOL' | 'USDC',
    hotAmount: number,
    prices: { presaleHotPrice: number; solPrice: number },
    userSolBalance: number,
    userUsdcBalance: number,
    network: SolanaNetwork
): Promise<{ success: boolean; signature?: string; paidAmount?: number; error?: string }> {
    if (!adapter) {
        return { success: false, error: 'Wallet not connected' };
    }

    // 1. Calculate the cost
    const usdValue = hotAmount * prices.presaleHotPrice;
    const cost = currency === 'SOL' ? (usdValue / prices.solPrice) : usdValue;

    // 2. Validate user's balance
    if (currency === 'SOL') {
        const totalCost = cost + SOL_TRANSACTION_FEE;
        if (userSolBalance < totalCost) {
            return { success: false, error: 'Insufficient SOL balance for transaction.' };
        }
    } else { // Paying with USDC
        if (userUsdcBalance < cost) {
            return { success: false, error: 'Insufficient USDC balance.' };
        }
        if (userSolBalance < SOL_TRANSACTION_FEE) {
            return { success: false, error: 'Insufficient SOL balance for transaction fees.' };
        }
    }

    logger.info('[PresaleProgram]', `Attempting to purchase ${hotAmount} HOT with ${cost.toFixed(6)} ${currency} on ${network}.`);

    try {
        // 3. Simulate creating and sending the transaction
        const mockTransaction = {
            instruction: 'purchase',
            hotAmount,
            paymentCurrency: currency,
            paymentAmount: cost,
        };
        
        const signature = await adapter.signAndSendTransaction(mockTransaction);
        
        // 4. Simulate waiting for confirmation and updating mock blockchain state
        await new Promise(resolve => setTimeout(resolve, 1000));
        logger.info('[PresaleProgram]', `Transaction confirmed with signature: ${signature}`);
        
        // For devnet/localnet, we manually adjust the mock balance for immediate feedback.
        // For mainnet, we assume this happens on-chain and the balance poller will pick up the change.
        if (network !== 'mainnet') {
            modifyMockBlockchainBalance(currency.toLowerCase() as 'sol' | 'usdc', -cost);
            if (currency === 'SOL') {
                modifyMockBlockchainBalance('sol', -SOL_TRANSACTION_FEE);
            }
        }

        return { success: true, signature, paidAmount: cost };

    } catch (error: any) {
        logger.error('[PresaleProgram]', `Transaction failed: ${error.message}`);
        return { success: false, error: error.message };
    }
}

/**
 * Simulates claiming HOT tokens after the sale ends.
 *
 * @param adapter The user's connected wallet adapter.
 * @param hotAmount The amount of HOT to claim.
 * @param network The current Solana network.
 * @returns A promise resolving to the transaction result.
 */
export async function claimHotTokens(
    adapter: WalletAdapter,
    hotAmount: number,
    network: SolanaNetwork
): Promise<{ success: boolean; signature?: string; error?: string }> {
    if (!adapter) {
        return { success: false, error: 'Wallet not connected' };
    }
    
    logger.info('[PresaleProgram]', `Attempting to claim ${hotAmount} HOT on ${network}.`);
    
    try {
        const mockTransaction = { instruction: 'claim', hotAmount };
        const signature = await adapter.signAndSendTransaction(mockTransaction);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        logger.info('[PresaleProgram]', `Claim transaction confirmed with signature: ${signature}`);
        
        // For devnet/localnet, we manually adjust the mock balance for immediate feedback.
        if (network !== 'mainnet') {
            modifyMockBlockchainBalance('hot', hotAmount);
        }

        return { success: true, signature };
        
    } catch (error: any) {
        logger.error('[PresaleProgram]', `Claim failed: ${error.message}`);
        return { success: false, error: error.message };
    }
}
