import { useState, useEffect, useCallback, useMemo } from 'react';
// Fix: Import User from the correct file
import { SaleState, Countdown, ContributionTier, Eligibility, SaleStageConfig } from '../types';
import { User } from '../types/users';
import useWallets from './useWallets';
import useUser from './useUser';
import useTransactions from './useTransactions';
import { CONTRIBUTION_TIERS } from '../constants/tiers';
import { localCacheGet, localCacheSet } from '../utils/cache';
import useToast from './useToast';
import useNetwork from './useNetwork';
import { useMarketPrices } from './use-market-prices';
import { useWalletBalances } from './use-wallet-balances';
import useAffiliate from './useAffiliate';
import { logger } from '../services/logger';
import { modifyMockBlockchainBalance } from '../lib/solana/wallet';
import { FAUCET_AMOUNTS } from '../constants';

const calculateCountdown = (targetTimestamp: number): Countdown => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const remainingSeconds = Math.max(0, targetTimestamp - nowInSeconds);
    return {
        days: Math.floor(remainingSeconds / 86400),
        hours: Math.floor((remainingSeconds % 86400) / 3600),
        minutes: Math.floor((remainingSeconds % 3600) / 60),
        seconds: Math.floor(remainingSeconds % 60),
    };
};

export default function useTokenSales() {
    const { network, config: networkConfig } = useNetwork();
    const [saleConfig, setSaleConfig] = useState<SaleStageConfig | null>(null);
    const [isConfigLoading, setIsConfigLoading] = useState<boolean>(true);
    const [saleState, setSaleState] = useState<SaleState>('UPCOMING');
    const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [totalSold, setTotalSold] = useState<number>(0);
    const [totalContributors, setTotalContributors] = useState<number>(0);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [isListedOnDex, setIsListedOnDex] = useState(false);
    
    const { presaleHotPrice, marketHotPrice, solPrice, marketStats } = useMarketPrices(network, isListedOnDex);
    const [eligibility, setEligibility] = useState<Eligibility>({ isEligible: false, reason: null, isLoading: true });
    
    // User's presale-specific data (contribution and claim status)
    const [userSaleData, setUserSaleData] = useState({ totalContribution: 0, hasClaimed: false });
    
    const { toasts, addToast, removeToast } = useToast();
    
    const wallets = useWallets();
    const userProfile = useUser(wallets.adapter, wallets.connectionStatus);
    const affiliate = useAffiliate(userProfile, addToast);
    const balances = useWalletBalances({ address: userProfile.address, networkConfig });
    
    const [isDripping, setIsDripping] = useState(false);

    const onTransactionSuccess = useCallback((usdValue: number, isClaim: boolean = false) => {
        const address = userProfile.address;
        if (isClaim) {
            const newData = { ...userSaleData, hasClaimed: true };
            setUserSaleData(newData);
            if (network !== 'mainnet' && address) {
                localCacheSet(`hasClaimed_${address}_${network}`, true);
            }
            addToast('Tokens successfully claimed!', 'success');
        } else {
            const newTotal = userSaleData.totalContribution + usdValue;
            const newData = { ...userSaleData, totalContribution: newTotal };
            setUserSaleData(newData);
            if (network !== 'mainnet' && address) {
                localCacheSet(`userContribution_${address}_${network}`, newTotal);
            }
            addToast('Transaction successful!', 'success');
        }
        balances.refetch();
    }, [userSaleData, addToast, balances, network, userProfile.address]);

    const onTransactionError = useCallback((error: string) => addToast(error, 'error'), [addToast]);
    
    const claimableHotBalance = useMemo(() => {
        if (userSaleData.hasClaimed) return 0;
        const fromContribution = presaleHotPrice > 0 ? userSaleData.totalContribution / presaleHotPrice : 0;
        const fromAffiliate = userProfile.referralRewards;
        return fromContribution + fromAffiliate;
    }, [userSaleData.totalContribution, presaleHotPrice, userSaleData.hasClaimed, userProfile.referralRewards]);

    const user = useMemo((): User => ({
        ...userProfile,
        solBalance: balances.solBalance,
        usdcBalance: balances.usdcBalance,
        hotBalance: claimableHotBalance,
        walletHotBalance: balances.hotBalance,
    }), [userProfile, balances, claimableHotBalance]);

    const transactions = useTransactions({
        saleState,
        prices: { presaleHotPrice, marketHotPrice, solPrice },
        user,
        wallets,
        network,
        onTransactionSuccess,
        onTransactionError,
        refetchBalances: balances.refetch,
    });
    
    const tier = useMemo(() => {
        return CONTRIBUTION_TIERS.slice().reverse().find(t => userSaleData.totalContribution >= t.min) || CONTRIBUTION_TIERS[0];
    }, [userSaleData.totalContribution]);

    const openWalletModal = useCallback(() => setIsWalletModalOpen(true), []);
    const closeWalletModal = useCallback(() => setIsWalletModalOpen(false), []);
    
    const dripFaucetTokens = useCallback(async () => {
        if (!user.address || !networkConfig.faucetEnabled) {
            addToast("Faucet is not available for this network or wallet is not connected.", 'error');
            return;
        }
        setIsDripping(true);
        try {
            const response = await fetch('/api/faucet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletAddress: user.address, network }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Faucet request failed.');
            }
            
            // This is the key part: simulate the balance update on the client
            // after the server confirms the drip.
            modifyMockBlockchainBalance('sol', FAUCET_AMOUNTS.SOL);
            modifyMockBlockchainBalance('hot', FAUCET_AMOUNTS.HOT);

            addToast(result.message, 'success');
            balances.refetch(); // Trigger a re-render with new balances
        } catch (err: any) {
            addToast(err.message, 'error');
        } finally {
            setIsDripping(false);
        }
    }, [user.address, network, networkConfig.faucetEnabled, addToast, balances]);

    // Effect for fetching user-specific sale data (contribution, claimed status)
    useEffect(() => {
        const loadUserData = async () => {
            if (wallets.isConnected && user.address && network) {
                if (network === 'mainnet') {
                    try {
                        const response = await fetch(`/api/user-state?address=${user.address}&network=${network}`);
                        if (!response.ok) throw new Error('Failed to fetch user state from API.');
                        const data = await response.json();
                        setUserSaleData({ totalContribution: data.totalContribution || 0, hasClaimed: data.hasClaimed || false });
                    } catch (error) {
                        logger.error('[useTokenSales]', 'Failed to fetch mainnet user data', error);
                        setUserSaleData({ totalContribution: 0, hasClaimed: false });
                    }
                } else {
                    // For devnet/localnet, load from local storage
                    const savedContribution = localCacheGet<number>(`userContribution_${user.address}_${network}`) || 0;
                    const savedClaimed = localCacheGet<boolean>(`hasClaimed_${user.address}_${network}`) || false;
                    setUserSaleData({ totalContribution: savedContribution, hasClaimed: savedClaimed });
                }
            } else {
                setUserSaleData({ totalContribution: 0, hasClaimed: false });
            }
        };
        loadUserData();
    }, [wallets.isConnected, user.address, network]);
    
    useEffect(() => {
        if (wallets.isConnected && user.address) {
            setEligibility({ isEligible: false, reason: null, isLoading: true });
            setTimeout(() => {
                if (user.address.startsWith('user0')) {
                    setEligibility({ isEligible: false, reason: 'Your wallet address is not eligible for this presale due to regional restrictions.', isLoading: false });
                } else {
                    setEligibility({ isEligible: true, reason: null, isLoading: false });
                }
            }, 1000);
        } else {
            setEligibility({ isEligible: false, reason: 'Connect wallet to check eligibility.', isLoading: false });
        }
    }, [wallets.isConnected, user.address]);

    useEffect(() => {
        const fetchSaleStatus = async () => {
            setIsConfigLoading(true);
            try {
                const response = await fetch(`/api/status?network=${network}`);
                if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
                const data = await response.json();
                setSaleConfig(data.saleConfig);
                setSaleState(data.saleState);
                setTotalSold(data.totalSold);
                setTotalContributors(data.totalContributors);
                setIsListedOnDex(data.isListedOnDex);
            } catch (error) {
                logger.error('[useTokenSales]', 'Failed to fetch sale config from API', error);
            } finally {
                setIsConfigLoading(false);
            }
        };
        fetchSaleStatus();
        const interval = setInterval(fetchSaleStatus, 15000);
        return () => clearInterval(interval);
    }, [network]);

    useEffect(() => {
        const getTargetTimestamp = (): number => {
            if (!saleConfig) return 0;
            switch (saleState) {
                case 'UPCOMING': return saleConfig.startTimestamp;
                case 'ACTIVE': return saleConfig.endTimestamp;
                default: return 0;
            }
        };
        const targetTimestamp = getTargetTimestamp();
        if (targetTimestamp <= 0) {
            setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
        }
        const timer = setInterval(() => setCountdown(calculateCountdown(targetTimestamp)), 1000);
        setCountdown(calculateCountdown(targetTimestamp));
        return () => clearInterval(timer);
    }, [saleConfig, saleState]);

    const sale = useMemo(() => ({
        state: saleState,
        stage: saleConfig,
        countdown,
        totalSold,
        totalContributors
    }), [saleState, saleConfig, countdown, totalSold, totalContributors]);

    const prices = useMemo(() => ({
        presaleHotPrice,
        marketHotPrice,
        solPrice
    }), [presaleHotPrice, marketHotPrice, solPrice]);

    return useMemo(() => ({
        sale,
        prices,
        wallets,
        user,
        transactions,
        eligibility,
        tier,
        isListedOnDex,
        marketStats,
        totalContribution: userSaleData.totalContribution,
        isWalletModalOpen,
        openWalletModal,
        closeWalletModal,
        addToast,
        toasts,
        removeToast,
        networkConfig,
        affiliate,
        isConfigLoading,
        isBalancesLoading: balances.isLoading,
        isDripping,
        dripFaucetTokens,
    }), [sale, prices, wallets, user, transactions, eligibility, tier, isListedOnDex, marketStats, userSaleData.totalContribution, isWalletModalOpen, openWalletModal, closeWalletModal, addToast, toasts, removeToast, networkConfig, affiliate, isConfigLoading, balances.isLoading, isDripping, dripFaucetTokens]);
}