
import { useState, useEffect, useCallback, useMemo } from 'react';
import tokenSaleConfig from '../configs/token-sale-config';
import { SaleState, Countdown, ContributionTier, Eligibility, Toast } from '../types';
import useWallets from './useWallets';
import useUser from './useUser';
import useTransactions from './useTransactions';
import { CONTRIBUTION_TIERS } from '../constants/tiers';
import { localCacheGet, localCacheSet } from '../utils/cache';
import useToast from './useToast';
import useNetwork from './useNetwork';
import { useMarketPrices } from './use-market-prices';
import useAffiliate from './useAffiliate';

const ACTIVE_STAGE_CONFIG = tokenSaleConfig.STAGES[0];

export default function useTokenSales() {
    const { network, config: networkConfig } = useNetwork();
    // === STATE HOOKS ===
    const [saleState, setSaleState] = useState<SaleState>('UPCOMING');
    const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [totalSold, setTotalSold] = useState<number>(0);
    const [totalContributors, setTotalContributors] = useState<number>(0);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [isListedOnDex, setIsListedOnDex] = useState(false);
    
    // === PRICE HOOK ===
    const { presaleHotPrice, marketHotPrice, solPrice, marketStats } = useMarketPrices(network, isListedOnDex);

    // === NEW FEATURE STATE ===
    const [eligibility, setEligibility] = useState<Eligibility>({ isEligible: false, reason: null, isLoading: true });
    const [totalContribution, setTotalContribution] = useState<number>(() => localCacheGet<number>('userContribution') || 0);
    const { toasts, addToast, removeToast } = useToast();

    // === MODULAR HOOKS ===
    const wallets = useWallets();
    const user = useUser(wallets.adapter, wallets.connectionStatus);
    const affiliate = useAffiliate(user);

    const onTransactionSuccess = useCallback((usdValue: number) => {
        const newTotal = totalContribution + usdValue;
        setTotalContribution(newTotal);
        localCacheSet('userContribution', newTotal);
        addToast('Transaction successful!', 'success');
    }, [totalContribution, addToast]);

    const onTransactionError = useCallback((error: string) => {
        addToast(error, 'error');
    }, [addToast]);
    
    const transactions = useTransactions({
        saleState,
        prices: { presaleHotPrice, marketHotPrice, solPrice },
        user,
        wallets,
        onTransactionSuccess,
        onTransactionError,
    });
    
    const tier = useMemo(() => {
        return CONTRIBUTION_TIERS.slice().reverse().find(t => totalContribution >= t.min) || CONTRIBUTION_TIERS[0];
    }, [totalContribution]);

    const openWalletModal = useCallback(() => setIsWalletModalOpen(true), []);
    const closeWalletModal = useCallback(() => setIsWalletModalOpen(false), []);

    // === EFFECTS ===
    
    // Simulate eligibility check
    useEffect(() => {
        if (wallets.isConnected && user.address) {
            setEligibility({ isEligible: false, reason: null, isLoading: true });
            setTimeout(() => {
                // Mock logic: For simulation, block addresses that hash to start with 'user0'
                // This gives us a deterministic way to test the ineligible state.
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


    const updateSaleStateAndCountdown = useCallback(() => {
        const nowInSeconds = Math.floor(Date.now() / 1000);
        const { startTimestamp, endTimestamp } = ACTIVE_STAGE_CONFIG;
        let targetTime: number, currentState: SaleState;
        if (nowInSeconds < startTimestamp) { currentState = 'UPCOMING'; targetTime = startTimestamp; } 
        else if (nowInSeconds <= endTimestamp) { currentState = 'ACTIVE'; targetTime = endTimestamp; } 
        else { currentState = 'ENDED'; targetTime = 0; }
        
        if (currentState === 'ENDED' && !isListedOnDex) {
            setIsListedOnDex(true);
        }

        setSaleState(prevState => prevState !== currentState ? currentState : prevState);
        const diff = targetTime > 0 ? targetTime - nowInSeconds : 0;
        setCountdown({
            days: Math.floor(diff / 86400),
            hours: Math.floor((diff % 86400) / 3600),
            minutes: Math.floor((diff % 3600) / 60),
            seconds: Math.floor(diff % 60),
        });
    }, [isListedOnDex]);

    useEffect(() => {
        updateSaleStateAndCountdown();
        const timer = setInterval(updateSaleStateAndCountdown, 1000);
        return () => clearInterval(timer);
    }, [updateSaleStateAndCountdown]);
    
    useEffect(() => {
        let salesInterval: ReturnType<typeof setInterval>;
        if (saleState === 'ACTIVE') {
            salesInterval = setInterval(() => {
                setTotalSold(sold => Math.min(sold + Math.random() * 100000, ACTIVE_STAGE_CONFIG.hardcap));
                setTotalContributors(c => c + (Math.random() > 0.6 ? 1 : 0));
            }, 3000);
        }
        return () => { if (salesInterval) clearInterval(salesInterval); };
    }, [saleState]);

    const sale = useMemo(() => ({
        state: saleState,
        stage: ACTIVE_STAGE_CONFIG,
        countdown,
        totalSold,
        totalContributors
    }), [saleState, countdown, totalSold, totalContributors]);

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
        totalContribution,
        isWalletModalOpen,
        openWalletModal,
        closeWalletModal,
        addToast,
        toasts,
        removeToast,
        networkConfig,
        affiliate,
    }), [sale, prices, wallets, user, transactions, eligibility, tier, isListedOnDex, marketStats, totalContribution, isWalletModalOpen, openWalletModal, closeWalletModal, addToast, toasts, removeToast, networkConfig, affiliate]);
}