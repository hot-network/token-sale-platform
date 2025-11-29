import { logger } from '../../services/logger';
import { FaucetRequestPayload, FaucetApiResponse } from '../../types/faucet';
import { FAUCET_AMOUNTS } from '../../constants';

// In-memory store for simple rate limiting.
// In a real-world scenario, this should be a persistent store like Redis or a database.
const claimTimestamps = new Map<string, number>();
const RATE_LIMIT_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: Request) {
    const headers = { 'Content-Type': 'application/json' };
    
    try {
        const { walletAddress, network } = (await req.json()) as FaucetRequestPayload;

        if (!walletAddress || !network) {
            return new Response(JSON.stringify({ success: false, message: 'Missing walletAddress or network.' }), { status: 400, headers });
        }

        if (network === 'mainnet') {
            return new Response(JSON.stringify({ success: false, message: 'Faucet is not available on mainnet.' }), { status: 400, headers });
        }
        
        // --- Rate Limiting Simulation ---
        const now = Date.now();
        const lastClaim = claimTimestamps.get(walletAddress);

        if (lastClaim && (now - lastClaim < RATE_LIMIT_MS)) {
            const timeLeft = Math.round((RATE_LIMIT_MS - (now - lastClaim)) / 60000);
            const message = `You have already claimed recently. Please try again in ${timeLeft} minutes.`;
            return new Response(JSON.stringify({ success: false, message }), { status: 429, headers });
        }

        logger.info('[API Faucet]', `Processing faucet request for ${walletAddress} on ${network}.`);
        
        // In a real backend, this is where you would build and send a transaction
        // to transfer the tokens from a faucet wallet.
        
        claimTimestamps.set(walletAddress, now);
        
        const response: FaucetApiResponse = {
            success: true,
            message: `${FAUCET_AMOUNTS.HOT.toLocaleString()} HOT and ${FAUCET_AMOUNTS.SOL} SOL have been sent to your wallet!`,
            txSignature: `sim_faucet_tx_${Date.now()}`
        };

        return new Response(JSON.stringify(response), { status: 200, headers });

    } catch (error: any) {
        logger.error('[API Faucet]', 'An unexpected error occurred.', error);
        return new Response(JSON.stringify({ success: false, message: 'An internal server error occurred.' }), { status: 500, headers });
    }
}