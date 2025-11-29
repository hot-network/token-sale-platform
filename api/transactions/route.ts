
import { db } from '../../lib/db';
import { logger } from '../../services/logger';

export async function POST(req: Request) {
    const headers = { 'Content-Type': 'application/json' };
    
    try {
        const {
            signature,
            walletAddress,
            hotAmount,
            paidAmount,
            paidCurrency,
            usdValue,
        } = await req.json();

        // --- Validation ---
        if (!signature || !walletAddress || !hotAmount || !paidAmount || !paidCurrency || !usdValue) {
            return new Response(JSON.stringify({ error: 'Missing required transaction fields.' }), { status: 400, headers });
        }

        logger.info('[API Transactions]', 'Recording new transaction.', { walletAddress, hotAmount, usdValue });

        // Use a SQL transaction to ensure all updates succeed or fail together.
        await db.transaction(async (tx) => {
            // 1. Check if the user exists
            const userResult = await tx.query('SELECT wallet_address FROM users WHERE wallet_address = $1', [walletAddress]);
            const isNewContributor = userResult.rows.length === 0;

            // 2. Insert or update the user record
            await tx.query(`
                INSERT INTO users (wallet_address, total_contribution_usd)
                VALUES ($1, $2)
                ON CONFLICT (wallet_address)
                DO UPDATE SET total_contribution_usd = users.total_contribution_usd + $2;
            `, [walletAddress, usdValue]);

            // 3. Insert the transaction record
            await tx.query(`
                INSERT INTO transactions (signature, wallet_address, hot_amount, paid_amount, paid_currency, usd_value)
                VALUES ($1, $2, $3, $4, $5, $6);
            `, [signature, walletAddress, hotAmount, paidAmount, paidCurrency, usdValue]);

            // 4. Update the global sale metrics
            await tx.query(`
                UPDATE sale_metrics
                SET 
                    total_sold_hot = total_sold_hot + $1,
                    total_raised_usd = total_raised_usd + $2,
                    total_contributors = total_contributors + $3,
                    updated_at = NOW()
                WHERE id = 'primary';
            `, [hotAmount, usdValue, isNewContributor ? 1 : 0]);
        });

        logger.info('[API Transactions]', `Successfully recorded transaction ${signature}.`);
        return new Response(JSON.stringify({ success: true, message: 'Transaction recorded.' }), { status: 200, headers });

    } catch (error: any) {
        // Handle unique constraint violation for signature separately
        if (error.message && error.message.includes('duplicate key value violates unique constraint "transactions_signature_key"')) {
            logger.warn('[API Transactions]', 'Attempted to record a duplicate transaction signature.');
            return new Response(JSON.stringify({ error: 'This transaction has already been recorded.' }), { status: 409, headers });
        }

        logger.error('[API Transactions]', 'Failed to record transaction.', error);
        return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), { status: 500, headers });
    }
}
