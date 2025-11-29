
import { useState, useCallback, useMemo } from 'react';
import { UserProfileHookReturn } from '../types/users';
import { ToastType } from '../types';
import { RETWEET_BONUS_AMOUNT } from '../constants';

// The 'addToast' function is now passed as an argument to decouple this hook from useToast.
export default function useAffiliate(
    user: UserProfileHookReturn,
    addToast: (message: string, type?: ToastType) => void
) {
    const [status, setStatus] = useState<'idle' | 'processing'>('idle');

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
            const response = await fetch('/api/affiliate/claim-retweet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletAddress: user.address, twitterHandle }),
            });

            const result = await response.json();

            if (response.ok) {
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
