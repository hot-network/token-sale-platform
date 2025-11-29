import { User } from '../../types/users';
import { logger } from '../../services/logger';
import { modifyMockBlockchainBalance } from './wallet';

export async function requestFaucetTokens(user: User): Promise<{success: boolean}> {
    logger.info('[Faucet]', `Requesting simulated token drip for ${user.address}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    modifyMockBlockchainBalance('sol', 0.1);
    modifyMockBlockchainBalance('hot', 10000);
    
    logger.info('[Faucet]', 'Successfully dripped 0.1 SOL and 10,000 HOT.');
    return { success: true };
}