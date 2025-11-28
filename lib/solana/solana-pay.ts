
// Simulates generating a Solana Pay transaction request URL.
// In a real app, this would use @solana/pay.
import { NETWORKS } from "../../configs/network-config";
import { logger } from "../../services/logger";


/**
 * Creates a Solana Pay transaction request URL.
 * @param recipient The public key of the recipient.
 * @param amount The amount of the specified token to transfer.
 * @param currency The currency to transfer, 'SOL' or 'USDC'.
 * @param reference A unique reference for this transaction.
 * @param label A label for the transaction.
 * @param message A message for the transaction.
 * @returns A Solana Pay spec URL.
 */
export function createSolanaPayUrl(
    recipient: string = NETWORKS['mainnet-beta'].treasuryAddress,
    amount: number,
    currency: 'SOL' | 'USDC',
    reference: string,
    label: string = "HOT Token Purchase",
    message: string = "Thank you for your support!"
): string {
    const url = new URL(`solana:${recipient}`);
    url.searchParams.append("amount", amount.toString());
    
    if (currency === 'USDC') {
        url.searchParams.append("spl-token", NETWORKS['mainnet-beta'].usdcTokenMint);
    }
    
    // The reference is crucial for the backend to find and verify the transaction.
    url.searchParams.append("reference", reference);

    url.searchParams.append("label", label);
    url.searchParams.append("message", message);

    logger.info(`[SolanaPay]`, `Generated URL: ${url.toString()}`);
    return url.toString();
}
