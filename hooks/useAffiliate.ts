
import { useState, useCallback, useMemo } from 'react';
import { UserHookReturn } from '../types/users';
import useToast from './useToast';
import { claimRetweetBonus as apiClaimRetweetBonus } from '../lib/hot-network/affiliate';
import { RETWEET_BONUS_AMOUNT } from '../constants';

export default function useAffiliate(user: UserHookReturn) {
    const [status, setStatus] = useState<'idle' | 'processing'>('idle');
    const { addToast } = useToast();

    const referralLink = useMemo(() => {
        if (!user.referralCode) return '';
        return `https://hotnetwork.fun/launchpad?ref=${user.referralCode}`;
    }, [user.referralCode]);

    const claimBonus = useCallback(async (twitterHandle: string) => {
        if (user.hasClaimedRetweetBonus) {
            addToast("Bonus has already been claimed.", 'info');
            return;
        }
        if (!twitterHandle || !twitterHandle.startsWith('@')) {
            addToast("Please enter a valid X handle starting with '@'.", 'error');
            return;
        }
        
        setStatus('processing');
        try {
            // Simulate an API call to a backend to verify and claim the bonus.
            const result = await apiClaimRetweetBonus(user.address!, twitterHandle);

            if (result.success) {
                user.claimRetweetBonus(twitterHandle); // Update the local user state
                addToast(`Successfully claimed ${RETWEET_BONUS_AMOUNT} HOT!`, 'success');
            } else {
                throw new Error(result.error || "Failed to claim bonus.");
            }
        } catch (error: any) {
            addToast(error.message, 'error');
        } finally {
            setStatus('idle');
        }
    }, [user, addToast]);
    
    return useMemo(() => ({
        referralLink,
        rewards: user.referralRewards,
        hasClaimedBonus: user.hasClaimedRetweetBonus,
        claimBonus,
        isClaiming: status === 'processing',
    }), [referralLink, user.referralRewards, user.hasClaimedRetweetBonus, claimBonus, status]);
}
