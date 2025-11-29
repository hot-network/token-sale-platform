
// Simulates generating a Solana Pay transaction request URL.
// In a real app, this would use @solana/pay.
import { NetworkConfig } from "../../types";
import { logger } from "../../services/logger";


/**
 * Creates a Solana Pay transaction request URL.
 * @param config The current network configuration.
 * @param amount The amount of the specified token to transfer.
 * @param currency The currency to transfer, 'SOL' or 'USDC'.
 * @param reference A unique reference for this transaction.
 * @param label A label for the transaction.
 * @param message A message for the transaction.
 * @param recipient The public key of the recipient (optional, defaults to treasury).
 * @returns A Solana Pay spec URL.
 */
export function createSolanaPayUrl(
    config: NetworkConfig,
    amount: number,
    currency: 'SOL' | 'USDC',
    reference: string,
    label: string = "HOT Token Purchase",
    message: string = "Thank you for your support!",
    recipient: string = config.treasuryAddress,
): string {
    const url = new URL(`solana:${recipient}`);
    url.searchParams.append("amount", amount.toString());
    
    if (currency === 'USDC') {
        url.searchParams.append("spl-token", config.usdcTokenMint);
    }
    
    // The reference is crucial for the backend to find and verify the transaction.
    url.searchParams.append("reference", reference);

    url.searchParams.append("label", label);
    url.searchParams.append("message", message);

    logger.info(`[SolanaPay]`, `Generated URL for ${config.cluster}: ${url.toString()}`);
    return url.toString();
}
