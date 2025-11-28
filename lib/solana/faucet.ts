
import { UserHookReturn } from '../../types/users';
import { logger } from '../../services/logger';

export async function requestFaucetTokens(user: UserHookReturn): Promise<{success: boolean}> {
    logger.info('[Faucet]', 'Requesting simulated token drip...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    user.creditFunds(1, 'SOL');
    user.creditFunds(100, 'USDC');
    
    logger.info('[Faucet]', 'Successfully dripped 1 SOL and 100 USDC.');
    return { success: true };
}
