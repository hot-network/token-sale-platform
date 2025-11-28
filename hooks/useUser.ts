
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, UserHookReturn } from '../types/users';
import { WalletAdapter } from '../types/wallets';
import { ConnectionStatus } from '../types/wallets';
import { generateReferralCode } from '../lib/hot-network/affiliate';

export default function useUser(adapter: WalletAdapter | null, status: ConnectionStatus): UserHookReturn {
    const [user, setUser] = useState<User>({
        address: null,
        hotBalance: 0,
        solBalance: 0,
        usdcBalance: 0,
        referralCode: null,
        referralRewards: 0,
        hasClaimedRetweetBonus: false,
    });

    useEffect(() => {
        if (status === 'connected' && adapter) {
            setUser({ 
                address: adapter.address,
                hotBalance: 0,
                solBalance: 10, // Mock starting balance for simulation
                usdcBalance: 1000, // Mock starting balance for simulation
                referralCode: generateReferralCode(adapter.address),
                referralRewards: 0,
                hasClaimedRetweetBonus: false,
            });
        } else if (status === 'disconnected') {
            setUser({ 
                address: null, 
                hotBalance: 0, 
                solBalance: 0, 
                usdcBalance: 0,
                referralCode: null,
                referralRewards: 0,
                hasClaimedRetweetBonus: false,
            });
        }
    }, [status, adapter]);

    const updateUserBalance = useCallback((newBalance: number) => {
        setUser(prev => ({ ...prev, hotBalance: newBalance }));
    }, []);

    const updateUserSolBalance = useCallback((newBalance: number) => {
        setUser(prev => ({ ...prev, solBalance: newBalance }));
    }, []);

    const updateUserUsdcBalance = useCallback((newBalance: number) => {
        setUser(prev => ({...prev, usdcBalance: newBalance }));
    }, []);
    
    const deductFunds = useCallback((amount: number, currency: 'SOL' | 'USDC') => {
        if (currency === 'SOL') {
            setUser(prev => ({ ...prev, solBalance: Math.max(0, prev.solBalance - amount) }));
        } else {
            setUser(prev => ({ ...prev, usdcBalance: Math.max(0, prev.usdcBalance - amount) }));
        }
    }, []);

    const creditFunds = useCallback((amount: number, currency: 'SOL' | 'USDC' | 'HOT') => {
        if (currency === 'SOL') {
            setUser(prev => ({ ...prev, solBalance: prev.solBalance + amount }));
        } else if (currency === 'USDC') {
            setUser(prev => ({ ...prev, usdcBalance: prev.usdcBalance + amount }));
        } else {
            setUser(prev => ({ ...prev, hotBalance: prev.hotBalance + amount }));
        }
    }, []);

    const claimRetweetBonus = useCallback((twitterHandle: string) => {
        setUser(prev => {
            if (prev.hasClaimedRetweetBonus) return prev; // Prevent double-claiming
            return {
                ...prev,
                hotBalance: prev.hotBalance + 1000,
                hasClaimedRetweetBonus: true,
                validatedTwitterHandle: twitterHandle,
            };
        });
    }, []);

    return useMemo(() => ({
        ...user,
        updateUserBalance,
        updateUserSolBalance,
        updateUserUsdcBalance,
        deductFunds,
        creditFunds,
        claimRetweetBonus,
    }), [user, updateUserBalance, updateUserSolBalance, updateUserUsdcBalance, deductFunds, creditFunds, claimRetweetBonus]);
}
