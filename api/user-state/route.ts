
import { logger } from '../../services/logger';
import { db } from '../../lib/db';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const address = url.searchParams.get('address');
    const network = url.searchParams.get('network');

    const headers = { 'Content-Type': 'application/json' };

    if (!address || !network) {
        return new Response(JSON.stringify({ error: 'Missing address or network parameter' }), { status: 400, headers });
    }

    if (network !== 'mainnet') {
        return new Response(JSON.stringify({ error: 'This endpoint is for mainnet data only' }), { status: 400, headers });
    }

    logger.info('[API User-State]', `Fetching mainnet state for ${address}`);
    
    try {
        const result = await db.query('SELECT total_contribution_usd, has_claimed FROM users WHERE wallet_address = $1', [address]);
        
        let userData;
        if (result.rows.length > 0) {
            const user = result.rows[0];
            userData = {
                totalContribution: parseFloat(user.total_contribution_usd),
                hasClaimed: user.has_claimed,
            };
        } else {
            // User not found in DB, return default state
            userData = {
                totalContribution: 0,
                hasClaimed: false,
            };
        }

        return new Response(JSON.stringify(userData), { status: 200, headers });

    } catch (error) {
        logger.error('[API User-State]', `Database error fetching state for ${address}`, error);
        return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), { status: 500, headers });
    }
}
