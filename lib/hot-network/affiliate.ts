
import { logger } from '../../services/logger';

// A simple (and insecure) way to create a deterministic referral code from an address.
// In a real app, this would be a securely generated, unique random string stored in a database.
export const generateReferralCode = (address: string): string => {
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const code = `HOT${(hash * 1337).toString(16).toUpperCase().slice(0, 6)}`;
    logger.info('[Affiliate]', `Generated referral code ${code} for address ${address}`);
    return code;
};


/**
 * Simulates a backend API call to claim the retweet bonus.
 * In a real app, this would hit your server, which would perform checks (e.g., against a database)
 * to ensure the user hasn't already claimed the bonus, and use the Twitter API to validate the account.
 * 
 * @param address The user's wallet address.
 * @param twitterHandle The user's X (Twitter) handle for validation.
 * @returns A promise resolving to the success or failure of the claim.
 */
export async function claimRetweetBonus(address: string, twitterHandle: string): Promise<{ success: boolean; error?: string }> {
    logger.info('[Affiliate API]', `Received request to claim retweet bonus for ${address} with handle ${twitterHandle}`);
    
    // --- 1. Basic Input Validation ---
    if (!twitterHandle || !twitterHandle.startsWith('@') || twitterHandle.length < 2) {
        return { success: false, error: "Invalid X handle provided. It must start with '@'." };
    }
    
    // --- 2. Simulate Network Delay for API calls ---
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // --- 3. Simulate Backend Checks ---
    
    // Check if bonus was already claimed by this wallet address
    if (address.includes('alreadyclaimed')) {
        const errorMsg = "Bonus has already been claimed for this account.";
        logger.warn('[Affiliate API]', errorMsg);
        return { success: false, error: errorMsg };
    }
    
    // Check if the same Twitter handle was already used
    if (twitterHandle.toLowerCase() === '@existing_user') {
         const errorMsg = "This X handle has already been used to claim a bonus.";
         logger.warn('[Affiliate API]', errorMsg);
         return { success: false, error: errorMsg };
    }

    // --- 4. Simulate Twitter Account Validation Logic ---
    // In a real app, you would use the Twitter API to get user data.
    const handle = twitterHandle.toLowerCase();
    
    if (handle === '@bot_user') {
        return { success: false, error: "X account does not meet follower requirements (min. 50)." };
    }
    if (handle === '@new_user') {
        return { success: false, error: "X account is too new (must be > 3 months old)." };
    }
    if (handle === '@inactive_user') {
        return { success: false, error: "X account does not meet recent activity requirements." };
    }

    // --- 5. Success Case ---
    logger.info('[Affiliate API]', `Bonus claim approved for ${address} with handle ${twitterHandle}.`);
    return { success: true };
}
