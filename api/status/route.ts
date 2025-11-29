
import tokenSaleConfig from '../../configs/token-sale-config';
import { SaleState } from '../../types';
import { logger } from '../../services/logger';
import { db } from '../../lib/db';

// For devnet, we generate mock data that changes over time to simulate activity.
// This is stateless and safe for serverless environments.
const getDevnetMockData = () => {
    const startTime = 1704067200000; // A fixed point in the past (Jan 1 2024)
    const now = Date.now();
    const elapsedSeconds = (now - startTime) / 1000;

    const baseSold = 1234567890;
    const baseContributors = 123;

    // Simulate a steady increase
    const dynamicSold = baseSold + (elapsedSeconds * 333);
    const dynamicContributors = baseContributors + Math.floor(elapsedSeconds / 100);

    return { totalSold: dynamicSold, totalContributors: dynamicContributors };
};

export async function GET(req: Request) {
    const url = new URL(req.url);
    const network = url.searchParams.get('network');
    
    let saleData;
    if (network === 'mainnet') {
        try {
            logger.info('[API Status]', 'Fetching mainnet sale data from Neon DB.');
            const result = await db.query('SELECT total_sold_hot, total_contributors FROM sale_metrics WHERE id = \'primary\'');
            const metrics = result.rows[0];
            saleData = {
                totalSold: metrics ? Number(metrics.total_sold_hot) : 0,
                totalContributors: metrics ? Number(metrics.total_contributors) : 0,
            };
        } catch (error) {
            logger.error('[API Status]', 'Failed to fetch mainnet data from DB.', error);
            // Fallback to static data on DB error
            saleData = { totalSold: 0, totalContributors: 0 };
        }
    } else {
        // For devnet/localnet, serve dynamic mock data.
        saleData = getDevnetMockData();
    }

    const saleConfig = tokenSaleConfig.STAGES[0];
    const nowInSeconds = Math.floor(Date.now() / 1000);
    let saleState: SaleState;

    if (nowInSeconds < saleConfig.startTimestamp) {
        saleState = 'UPCOMING';
    } else if (nowInSeconds <= saleConfig.endTimestamp) {
        saleState = 'ACTIVE';
    } else {
        saleState = 'ENDED';
    }
    
    // Ensure totalSold does not exceed the hardcap
    const currentTotalSold = Math.min(saleData.totalSold, saleConfig.hardcap);

    const status = {
        saleConfig,
        saleState,
        totalSold: currentTotalSold,
        totalContributors: saleData.totalContributors,
        isListedOnDex: saleState === 'ENDED',
    };
    
    const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
    };
    
    return new Response(JSON.stringify(status), { headers });
}
