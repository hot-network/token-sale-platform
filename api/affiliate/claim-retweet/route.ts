
import { logger } from '../../../services/logger';
import { db } from '../../../lib/db';
import { RETWEET_BONUS_AMOUNT } from '../../../constants';

// In a real app, this would use the Twitter API.
// For simulation, we'll just check against a few hardcoded handles.
async function validateTwitterAccount(handle: string): Promise<{ valid: boolean; reason: string | null }> {
    const lowerHandle = handle.toLowerCase();
    
    if (lowerHandle === '@bot_user') return { valid: false, reason: "X account does not meet follower requirements (min. 50)." };
    if (lowerHandle === '@new_user') return { valid: false, reason: "X account is too new (must be > 3 months old)." };
    if (lowerHandle === '@inactive_user') return { valid: false, reason: "X account does not meet recent activity requirements." };

    return { valid: true, reason: null };
}

export async function POST(req: Request) {
    const headers = { 'Content-Type': 'application/json' };
    
    try {
        const { walletAddress, twitterHandle } = await req.json();
        logger.info('[API Affiliate]', `Bonus claim request for ${walletAddress} with handle ${twitterHandle}`);

        if (!walletAddress || !twitterHandle || !twitterHandle.startsWith('@') || twitterHandle.length < 2) {
             return new Response(JSON.stringify({ error: "Invalid input. Wallet address and a valid X handle are required." }), { status: 400, headers });
        }

        // --- Database Checks ---
        const { rows } = await db.query(
            'SELECT has_claimed_retweet_bonus FROM users WHERE wallet_address = $1 OR validated_twitter_handle = $2',
            [walletAddress, twitterHandle]
        );

        if (rows.length > 0) {
            if (rows.some(r => r.wallet_address === walletAddress && r.has_claimed_retweet_bonus)) {
                 return new Response(JSON.stringify({ error: "Bonus has already been claimed for this wallet." }), { status: 400, headers });
            }
            if (rows.some(r => r.validated_twitter_handle === twitterHandle)) {
                 return new Response(JSON.stringify({ error: "This X handle has already been used to claim a bonus." }), { status: 400, headers });
            }
        }
        
        // --- External Validation (Simulated) ---
        const validation = await validateTwitterAccount(twitterHandle);
        if (!validation.valid) {
             return new Response(JSON.stringify({ error: validation.reason }), { status: 400, headers });
        }

        // --- Success Case: Update Database ---
        await db.query(`
            INSERT INTO users (wallet_address, has_claimed_retweet_bonus, validated_twitter_handle, affiliate_rewards_hot)
            VALUES ($1, TRUE, $2, $3)
            ON CONFLICT (wallet_address)
            DO UPDATE SET 
                has_claimed_retweet_bonus = TRUE,
                validated_twitter_handle = $2,
                affiliate_rewards_hot = users.affiliate_rewards_hot + $3;
        `, [walletAddress, twitterHandle, RETWEET_BONUS_AMOUNT]);
        
        logger.info('[API Affiliate]', `Bonus claim approved for ${walletAddress}.`);
        return new Response(JSON.stringify({ success: true, message: 'Bonus claimed successfully!' }), { status: 200, headers });

    } catch (error: any) {
        logger.error('[API Affiliate]', 'An unexpected error occurred during bonus claim.', error);
        return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), { status: 500, headers });
    }
}
