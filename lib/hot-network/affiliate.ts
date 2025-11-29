
import { logger } from '../../services/logger';

// A simple (and insecure) way to create a deterministic referral code from an address.
// In a real app, this would be a securely generated, unique random string stored in a database.
export const generateReferralCode = (address: string): string => {
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const code = `HOT${(hash * 1337).toString(16).toUpperCase().slice(0, 6)}`;
    logger.info('[Affiliate]', `Generated referral code ${code} for address ${address}`);
    return code;
};
