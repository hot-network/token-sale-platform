
import { useState, useEffect, useCallback, useMemo } from 'react';
import { WalletAdapter } from '../types/wallets';
import { ConnectionStatus } from '../types/wallets';
import { generateReferralCode } from '../lib/hot-network/affiliate';
import { UserProfileHookReturn } from '../types/users';
import { RETWEET_BONUS_AMOUNT } from '../constants';

export default function useUser(adapter: WalletAdapter | null, status: ConnectionStatus): UserProfileHookReturn {
    const [profile, setProfile] = useState<{
        address: string | null;
        referralCode: string | null;
        referralRewards: number;
        hasClaimedRetweetBonus: boolean;
        validatedTwitterHandle: string | undefined;
    }>({
        address: null,
        referralCode: null,
        referralRewards: 0,
        hasClaimedRetweetBonus: false,
        validatedTwitterHandle: undefined,
    });

    useEffect(() => {
        if (status === 'connected' && adapter) {
            setProfile(prev => ({
                ...prev,
                address: adapter.address,
                referralCode: generateReferralCode(adapter.address),
            }));
        } else if (status === 'disconnected') {
            setProfile({
                address: null,
                referralCode: null,
                referralRewards: 0,
                hasClaimedRetweetBonus: false,
                validatedTwitterHandle: undefined,
            });
        }
    }, [status, adapter]);

    const claimRetweetBonus = useCallback((twitterHandle: string) => {
        setProfile(prev => {
            if (prev.hasClaimedRetweetBonus) return prev;
            return {
                ...prev,
                referralRewards: prev.referralRewards + RETWEET_BONUS_AMOUNT,
                hasClaimedRetweetBonus: true,
                validatedTwitterHandle: twitterHandle,
            };
        });
    }, []);
    
    const addReferralReward = useCallback((amount: number) => {
        setProfile(prev => ({...prev, referralRewards: prev.referralRewards + amount }));
    }, []);

    return useMemo(() => ({
        ...profile,
        claimRetweetBonus,
        addReferralReward,
    }), [profile, claimRetweetBonus, addReferralReward]);
}
