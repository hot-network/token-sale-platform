// This file acts as a client-side SDK for interacting with a simulated HOT Network Anchor program.
// It is structured to mimic the modern @coral-xyz/anchor library patterns as requested.

import { WalletAdapter } from '../../types/wallets';
import { logger } from '../../services/logger';
import { modifyMockBlockchainBalance } from './wallet';
import { SolanaNetwork } from '../../types';

// --- Start of Simulation Layer for @coral-xyz/anchor ---
// These classes and functions are mocks to replicate the structure of an Anchor program call.
class BN { constructor(public value: number | string) {} }
class PublicKey { 
    constructor(public key: string) {}
    static get default() { return new PublicKey('11111111111111111111111111111111'); }
    static findProgramAddress(seeds: (string | Uint8Array)[], programId: PublicKey) {
        return [new PublicKey(`pda_${programId.key}`), 0];
    }
}
const createMockProgram = (adapter: WalletAdapter, programId: string) => ({
    programId: new PublicKey(programId),
    methods: {
        buySol: (amount: BN) => ({ accounts: (_: any) => ({ rpc: async () => adapter.signAndSendTransaction({ instruction: 'buySol', amount, accounts: _.paymentVault ? { paymentVault: _.paymentVault.key } : {} }) }) }),
        buyUsdc: (amount: BN) => ({ accounts: (_: any) => ({ rpc: async () => adapter.signAndSendTransaction({ instruction: 'buyUsdc', amount, accounts: _.paymentVault ? { paymentVault: _.paymentVault.key } : {} }) }) }),
        claim: () => ({ accounts: (_: any) => ({ rpc: async () => adapter.signAndSendTransaction({ instruction: 'claim' }) }) }),
    },
});
// --- End of Simulation Layer ---

const SOL_TRANSACTION_FEE = 0.00001;

export async function buyHotTokens(
    adapter: WalletAdapter,
    network: SolanaNetwork,
    presaleProgramId: string,
    treasuryAddress: string,
    amountPay: number,
    currency: "SOL" | "USDC",
    userSolBalance: number,
    userUsdcBalance: number
): Promise<{ success: boolean; signature?: string; error?: string }> {
    if (!adapter) return { success: false, error: 'Wallet not connected' };

    // Balance checks
    if (currency === 'SOL') {
        const totalCost = amountPay + SOL_TRANSACTION_FEE;
        if (userSolBalance < totalCost) return { success: false, error: 'Insufficient SOL balance.' };
    } else {
        if (userUsdcBalance < amountPay) return { success: false, error: 'Insufficient USDC balance.' };
        if (userSolBalance < SOL_TRANSACTION_FEE) return { success: false, error: 'Insufficient SOL for transaction fees.' };
    }

    logger.info('[Payments]', `Simulating Anchor transaction for ${amountPay} ${currency} on ${network}. Funds to be sent to ${treasuryAddress}`);
    
    // This simulates the AnchorProvider and Program setup
    const program = createMockProgram(adapter, presaleProgramId);

    try {
        let tx: string;
        if (currency === "SOL") {
            tx = await program.methods
                .buySol(new BN(amountPay * 1e9))
                .accounts({
                    buyer: new PublicKey(adapter.address),
                    paymentVault: new PublicKey(treasuryAddress),
                    systemProgram: PublicKey.default,
                })
                .rpc();
        } else if (currency === "USDC") {
            tx = await program.methods
                .buyUsdc(new BN(amountPay * 1e6))
                .accounts({
                    buyer: new PublicKey(adapter.address),
                    paymentVault: new PublicKey(treasuryAddress),
                })
                .rpc();
        } else {
            throw new Error('Invalid currency for purchase.');
        }

        // Simulate confirmation and state change
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (network !== 'mainnet') {
            modifyMockBlockchainBalance(currency.toLowerCase() as 'sol' | 'usdc', -amountPay);
            if (currency === 'SOL') {
                 modifyMockBlockchainBalance('sol', -SOL_TRANSACTION_FEE);
            }
        }
        
        return { success: true, signature: tx };

    } catch (err: any) {
        logger.error('[Payments]', `Transaction failed: ${err.message}`);
        return { success: false, error: err.message || err };
    }
}


export async function claimHotTokens(
    adapter: WalletAdapter,
    network: SolanaNetwork,
    presaleProgramId: string,
    hotAmount: number
): Promise<{ success: boolean; signature?: string; error?: string }> {
    if (!adapter) return { success: false, error: 'Wallet not connected' };
    logger.info('[Payments]', `Simulating Anchor call to claim ${hotAmount} HOT on ${network}.`);
    const program = createMockProgram(adapter, presaleProgramId);

    try {
        const tx = await program.methods.claim().accounts({}).rpc();
        await new Promise(resolve => setTimeout(resolve, 1000));
         if (network !== 'mainnet') {
            modifyMockBlockchainBalance('hot', hotAmount);
        }
        return { success: true, signature: tx };
    } catch (err: any) {
        logger.error('[Payments]', `Claim failed: ${err.message}`);
        return { success: false, error: err.message || err };
    }
}