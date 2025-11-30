
import { db } from '../../lib/db';
import { logger } from '../../services/logger';

export async function GET(req: Request) {
    const headers = { 'Content-Type': 'application/json' };
    const url = new URL(req.url);
    const walletAddress = url.searchParams.get('walletAddress');

    if (!walletAddress) {
        return new Response(JSON.stringify({ error: 'walletAddress is required' }), { status: 400, headers });
    }

    try {
        const { rows } = await db.query(
            `SELECT 
                signature as id, 
                created_at as "timestamp", 
                hot_amount as "hotAmount",
                paid_currency as currency,
                paid_amount as "paidAmount",
                usd_value as "usdValue",
                'presale_buy' as type, -- Note: This assumes all recorded are buys for now. The 'type' could be stored in the DB in a future iteration.
                'confirmed' as status
             FROM transactions 
             WHERE wallet_address = $1 
             ORDER BY created_at DESC 
             LIMIT 5`,
            [walletAddress]
        );
        
        // Convert the Date object from the DB to a Unix timestamp (milliseconds) for the client.
        const transactions = rows.map(row => ({
            ...row,
            timestamp: new Date(row.timestamp).getTime()
        }));

        return new Response(JSON.stringify(transactions), { status: 200, headers });
    } catch (error) {
        logger.error('[API History]', `Failed to fetch transaction history for ${walletAddress}`, error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers });
    }
}
