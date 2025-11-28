
import React, { useState, useEffect, useMemo, lazy } from 'react';
import Button from './Button';
import CountdownDisplay from './CountdownDisplay';
import { SaleState, SaleStageConfig, Countdown } from '../types';
import { Transaction } from '../types/transactions';
import useTokenSalesContext from '../hooks/useTokenSalesContext';
import AssetIcon from './AssetIcons';
import Modal from './modals/Modal';

const CheckoutModal = lazy(() => import('./checkout/CheckoutModal'));


const SOL_TRANSACTION_FEE = 0.00001; // A small fee for SOL transactions

// ---- HELPER & CHILD COMPONENTS ----

const TransactionHistory: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const { networkConfig } = useTokenSalesContext();
    const [isOpen, setIsOpen] = useState(false);

    const getExplorerUrl = (txId: string) => {
        if (txId.startsWith('sim_') || txId.startsWith('card_') || txId.startsWith('solpay_')) return '#';
        const clusterQuery = networkConfig.label === 'Mainnet' ? '' : `?cluster=${networkConfig.label.toLowerCase()}`;
        return `${networkConfig.explorerUrl}/tx/${txId}${clusterQuery}`;
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const getTransactionIcon = (type: Transaction['type']) => {
        switch (type) {
            case 'presale_buy': return 'fa-solid fa-cart-shopping text-blue-500';
            case 'claim': return 'fa-solid fa-hand-holding-dollar text-green-500';
            case 'market_buy': return 'fa-solid fa-arrow-trend-up text-green-500';
            case 'market_sell': return 'fa-solid fa-arrow-trend-down text-red-500';
            default: return 'fa-solid fa-exchange-alt text-gray-500';
        }
    };

    return (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                <span>Recent Activity</span>
                <i className={`fas fa-chevron-down transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-60 mt-2' : 'max-h-0'}`}>
                {transactions.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">Your transactions will appear here.</p>
                ) : (
                    <ul className="space-y-2 max-h-52 overflow-y-auto pr-2">
                        {transactions.map(tx => (
                            <li key={tx.id} className="flex items-center justify-between text-sm p-2 bg-brand-light-dark/50 dark:bg-brand-dark-lighter/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <i className={`${getTransactionIcon(tx.type)} w-4 text-center`}></i>
                                    <div>
                                        <p className="font-bold capitalize">{tx.type.replace(/_/g, ' ')}</p>
                                        <p className="text-xs text-gray-500">{formatDate(tx.timestamp)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold flex items-center gap-1.5 justify-end">
                                        <AssetIcon asset="HOT" className="w-4 h-4" />
                                        {tx.hotAmount.toLocaleString()}
                                    </p>
                                    <a href={getExplorerUrl(tx.id)} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-accent hover:underline">
                                        View <i className="fa-solid fa-arrow-up-right-from-square text-xs ml-1"></i>
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};


const UpcomingSalePanel: React.FC<{ stage: SaleStageConfig; countdown: Countdown }> = ({ stage, countdown }) => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = encodeURIComponent(`Join the HOT Token presale on Solana! Don't miss out on the future of decentralized content. #HOTtoken #Solana #Presale`);
    const socialLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        telegram: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`,
    };

    return (
        <div className="text-center py-8 px-4 flex flex-col items-center justify-center min-h-[460px]">
            <h3 className="text-2xl font-bold mb-4 font-serif">Presale Starting Soon</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The HOT Token presale is scheduled to begin on {new Date(stage.startTimestamp * 1000).toLocaleString()}.</p>
            <div className="max-w-sm w-full"><CountdownDisplay countdown={countdown} /></div>
            <div className="text-center pt-8">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Spread the word!</p>
                <div className="flex items-center justify-center gap-3">
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-brand-dark-lighter hover:opacity-80 transition-opacity" aria-label="Share on Twitter"><i className="fa-brands fa-x-twitter"></i></a>
                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-brand-dark-lighter hover:opacity-80 transition-opacity" aria-label="Share on Facebook"><i className="fab fa-facebook"></i></a>
                    <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-brand-dark-lighter hover:opacity-80 transition-opacity" aria-label="Share on Telegram"><i className="fab fa-telegram"></i></a>
                </div>
            </div>
        </div>
    );
};

const EndedSalePanel: React.FC = () => {
    const { user, transactions } = useTokenSalesContext();
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [claimStep, setClaimStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm');
    const [errorMessage, setErrorMessage] = useState<string>('');
    
    const isOverallProcessing = transactions.status === 'processing';

    const handleOpenModal = () => {
        setClaimStep('confirm');
        setErrorMessage('');
        setIsClaimModalOpen(true);
    };

    const handleCloseModal = () => {
        if (claimStep === 'processing') return;
        setIsClaimModalOpen(false);
    };

    const handleConfirmClaim = async () => {
        setClaimStep('processing');
        const result = await transactions.claimTokens();
        if (result) {
            setClaimStep('success');
            setTimeout(() => {
                setIsClaimModalOpen(false);
            }, 2500);
        } else {
            setErrorMessage(transactions.error || 'An unknown error occurred during the claim.');
            setClaimStep('error');
        }
    };
    
    const tokensAlreadyClaimed = user.hotBalance <= 0;

    const getModalTitle = () => {
        switch(claimStep) {
            case 'success': return 'Claim Successful';
            case 'error': return 'Claim Failed';
            default: return 'Confirm Token Claim';
        }
    };
    
    const renderModalContent = () => {
        switch (claimStep) {
            case 'confirm':
                return (
                    <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to claim your purchased tokens?</p>
                        <p className="text-3xl font-bold text-brand-accent my-4 flex items-center justify-center gap-2">
                            <AssetIcon asset="HOT" className="w-8 h-8" />
                            <span>{user.hotBalance.toLocaleString()} HOT</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">These tokens will be transferred to your connected wallet. This action is irreversible.</p>
                        <div className="space-y-3">
                            <Button onClick={handleConfirmClaim} className="w-full bg-brand-accent text-brand-dark">
                                Confirm Claim
                            </Button>
                            <Button onClick={handleCloseModal} variant="secondary" className="w-full">
                                Cancel
                            </Button>
                        </div>
                    </div>
                );
            case 'processing':
                return (
                    <div className="text-center p-8 min-h-[240px] flex flex-col justify-center">
                        <i className="fas fa-spinner fa-spin text-4xl text-brand-accent"></i>
                        <p className="mt-4 font-semibold">Processing Claim...</p>
                        <p className="text-sm text-gray-500 mt-2">Please approve the transaction in your wallet.</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="text-center p-8 min-h-[240px] flex flex-col justify-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-4xl">
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <h3 className="text-2xl font-bold">Success!</h3>
                        <p className="text-gray-500 mt-2">Your {user.hotBalance.toLocaleString()} HOT tokens have been claimed.</p>
                    </div>
                );
            case 'error':
                 return (
                    <div className="text-center p-8 min-h-[240px] flex flex-col justify-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-4xl">
                            <i className="fa-solid fa-times"></i>
                        </div>
                        <h3 className="text-2xl font-bold">Claim Failed</h3>
                        <p className="text-gray-500 mt-2 bg-gray-100 dark:bg-brand-dark-lighter p-2 rounded-lg text-xs">{errorMessage}</p>
                        <Button onClick={() => setClaimStep('confirm')} className="w-full mt-6 bg-brand-accent text-brand-dark">
                            Try Again
                        </Button>
                    </div>
                );
        }
    };

    return (
        <>
            <div className="py-8 px-4 flex flex-col items-center justify-center min-h-[460px]">
                 <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4 font-serif">The Presale Has Ended</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Thank you for your participation. You can now claim your purchased tokens.</p>
                    <Button 
                        onClick={handleOpenModal} 
                        variant="secondary" 
                        disabled={tokensAlreadyClaimed || isOverallProcessing}
                    >
                        {isOverallProcessing
                            ? 'Processing...' 
                            : tokensAlreadyClaimed
                                ? 'Tokens Claimed' 
                                : 'Claim Tokens'
                        }
                    </Button>
                </div>
                <div className="w-full max-w-sm mt-auto pt-4">
                     <TransactionHistory transactions={transactions.history} />
                </div>
            </div>
            <Modal 
                isOpen={isClaimModalOpen} 
                onClose={handleCloseModal} 
                title={getModalTitle()}
            >
                {renderModalContent()}
            </Modal>
        </>
    );
};

interface ActiveSalePanelProps {
    stage: SaleStageConfig;
    countdown: Countdown;
    totalSold: number;
}
const ActiveSalePanel: React.FC<ActiveSalePanelProps> = ({ stage, countdown, totalSold }) => {
    const { transactions, prices, user, wallets, openWalletModal, eligibility, tier, addToast, networkConfig } = useTokenSalesContext();
    
    const [hotAmount, setHotAmount] = useState('10000');
    const [payAmount, setPayAmount] = useState('');
    const [paymentCurrency, setPaymentCurrency] = useState<'SOL' | 'USDC'>('SOL');
    const [lastEdited, setLastEdited] = useState<'hot' | 'pay'>('hot');
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [isFaucetLoading, setIsFaucetLoading] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = encodeURIComponent(`I'm participating in the HOT Token presale on Solana! Join me and be part of the future of decentralized content. #HOTtoken #Solana #Presale`);
    const socialLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        telegram: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`,
    };

    const handleCurrencySwitch = (newCurrency: 'SOL' | 'USDC') => {
        if (newCurrency === paymentCurrency) return;
        setPaymentCurrency(newCurrency);
        setLastEdited('hot'); 
    };
    
    const bonusMultiplier = 1 + (tier.bonus / 100);

    const hotValueUSD = useMemo(() => {
        const hot = parseFloat(hotAmount);
        if (isNaN(hot) || hot < 0) return 0;
        return hot * prices.presaleHotPrice;
    }, [hotAmount, prices.presaleHotPrice]);

    const validationError = useMemo(() => {
        if (hotValueUSD > 0 && hotValueUSD < stage.minContributionUSD) {
            return `Minimum contribution is $${stage.minContributionUSD}.`;
        }
        if (hotValueUSD > stage.maxContributionUSD) {
            return `Maximum contribution is $${stage.maxContributionUSD}.`;
        }
        return null;
    }, [hotValueUSD, stage.minContributionUSD, stage.maxContributionUSD]);

    useEffect(() => {
        if (lastEdited !== 'hot') return;
        const hot = parseFloat(hotAmount);
        if (isNaN(hot) || hot < 0) { setPayAmount(''); return; }
        const costInUsd = hot * prices.presaleHotPrice;
        if (paymentCurrency === 'SOL') {
            setPayAmount(prices.solPrice > 0 ? (costInUsd / prices.solPrice).toFixed(6) : '');
        } else {
            setPayAmount(costInUsd.toFixed(2));
        }
    }, [hotAmount, paymentCurrency, prices.presaleHotPrice, prices.solPrice, lastEdited]);

    useEffect(() => {
        if (lastEdited !== 'pay') return;
        const pay = parseFloat(payAmount);
        if (isNaN(pay) || pay < 0) { setHotAmount(''); return; }
        let costInUsd = 0;
        if (paymentCurrency === 'SOL') {
            costInUsd = pay * prices.solPrice;
        } else {
            costInUsd = pay;
        }
        setHotAmount(prices.presaleHotPrice > 0 ? (costInUsd / prices.presaleHotPrice).toFixed(2) : '');
    }, [payAmount, paymentCurrency, prices.presaleHotPrice, prices.solPrice, lastEdited]);

    const progressPercent = stage.hardcap > 0 ? Math.min(100, (totalSold / stage.hardcap) * 100) : 0;
    const formatNumber = (num: number) => num.toLocaleString('en-US', { maximumFractionDigits: 0 });

    const userBalance = paymentCurrency === 'SOL' ? (user?.solBalance ?? 0) : (user?.usdcBalance ?? 0);
    const requiredAmount = (parseFloat(payAmount) || 0) + (paymentCurrency === 'SOL' ? SOL_TRANSACTION_FEE : 0);
    const hasSufficientBalance = userBalance >= requiredAmount;

    const handleHotAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => { setLastEdited('hot'); setHotAmount(e.target.value); };
    const handlePayAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => { setLastEdited('pay'); setPayAmount(e.target.value); };
    
    const handleBuyClick = () => {
        if (!eligibility.isEligible) {
            addToast(eligibility.reason || 'You are not eligible for this sale.', 'error');
            return;
        }
        setIsCheckoutModalOpen(true);
    }

    const handleFaucet = async () => {
        setIsFaucetLoading(true);
        const { requestFaucetTokens } = await import('../lib/solana/faucet');
        const result = await requestFaucetTokens(user);
        if (result.success) {
            addToast('Faucet funds received!', 'success');
        } else {
            addToast('Faucet request failed.', 'error');
        }
        setIsFaucetLoading(false);
    }

    const isAmountInvalid = !hotAmount || parseFloat(hotAmount) <= 0 || !!validationError;
    const isPriceLoading = paymentCurrency === 'SOL' && prices.solPrice <= 0;
    const isBuyProcessing = transactions.status === 'processing';
    
    let buttonText: string;
    let isButtonDisabled: boolean;

    if (isPriceLoading) { buttonText = 'Loading Prices...'; isButtonDisabled = true; } 
    else if (isBuyProcessing) { buttonText = 'Processing...'; isButtonDisabled = true; } 
    else if (!wallets.isConnected) { buttonText = 'Connect Wallet'; isButtonDisabled = false; }
    else if (eligibility.isLoading) { buttonText = 'Checking Eligibility...'; isButtonDisabled = true; }
    else if (!hasSufficientBalance) { buttonText = `Insufficient ${paymentCurrency}`; isButtonDisabled = true; } 
    else { buttonText = 'Buy Now'; isButtonDisabled = isAmountInvalid; }

    return (
        <div className="p-4 sm:p-6 flex flex-col justify-between min-h-[550px]">
            <div>
                <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 text-center">Sale Ends In</p>
                    <CountdownDisplay countdown={countdown} />
                </div>
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                        <span>Progress</span><span>{progressPercent.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-brand-light-dark dark:bg-brand-dark-lighter rounded-full h-4 relative overflow-hidden">
                        <div className="bg-brand-accent h-4 rounded-full transition-all duration-1000 ease-in-out" style={{ width: `${progressPercent}%` }}></div>
                        <div className="absolute top-0 h-4 border-r-2 border-dashed border-white/60 dark:border-white/40" style={{ left: `${(stage.softcap / stage.hardcap) * 100}%` }} title={`Softcap: ${formatNumber(stage.softcap)}`}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400"><span>{formatNumber(totalSold)} / {formatNumber(stage.hardcap)}</span></div>
                </div>
            </div>
            <div className="mt-auto space-y-3">
                <div className="bg-brand-light-dark dark:bg-brand-dark-lighter p-4 rounded-lg space-y-2">
                    <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                            <label htmlFor="pay-amount-input" className="font-medium text-gray-500 dark:text-gray-400">You Pay</label>
                             <div className="flex items-center gap-2">
                                <div className="p-1 rounded-lg bg-brand-light-dark/70 dark:bg-brand-dark-lighter/70 flex gap-1">
                                    <button onClick={() => handleCurrencySwitch('SOL')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${paymentCurrency === 'SOL' ? 'bg-brand-light dark:bg-brand-dark-light shadow text-brand-dark dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>SOL</button>
                                    <button onClick={() => handleCurrencySwitch('USDC')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${paymentCurrency === 'USDC' ? 'bg-brand-light dark:bg-brand-dark-light shadow text-brand-dark dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>USDC</button>
                                </div>
                                {wallets.isConnected && (
                                    <div className="text-xs text-right font-medium">
                                        <p className={`transition-colors ${paymentCurrency === 'SOL' && !hasSufficientBalance ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {(user?.solBalance ?? 0).toLocaleString(undefined, { maximumFractionDigits: 4 })} SOL
                                        </p>
                                        <p className={`transition-colors ${paymentCurrency === 'USDC' && !hasSufficientBalance ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {(user?.usdcBalance ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} USDC
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            <input id="pay-amount-input" aria-label="Amount to pay" type="number" value={payAmount} onChange={handlePayAmountChange} onFocus={() => setLastEdited('pay')} className="w-full bg-brand-light dark:bg-brand-dark border border-gray-300 dark:border-gray-600 rounded-lg p-3 pr-24 text-gray-900 dark:text-white focus:ring-brand-accent focus:border-brand-accent" placeholder="0.00" />
                             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <AssetIcon asset={paymentCurrency} className="w-5 h-5 mr-2" />
                                <span className="font-bold text-gray-500 dark:text-gray-400">{paymentCurrency}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center my-1"><i className="fa-solid fa-arrow-down-long text-gray-400 dark:text-gray-500 text-lg"></i></div>
                    <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                           <label htmlFor="hot-amount-input" className="font-medium text-gray-500 dark:text-gray-400">You Receive</label>
                           <div className="flex items-center gap-3">
                                {wallets.isConnected && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                        <AssetIcon asset="HOT" className="w-3 h-3" />
                                        Balance: {user.hotBalance.toLocaleString()}
                                    </span>
                                )}
                               {tier.bonus > 0 && <span className="font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full text-xs">+{tier.bonus}% Tier Bonus</span>}
                           </div>
                        </div>
                        <div className="mt-1 relative">
                            <input id="hot-amount-input" type="number" value={hotAmount} onChange={handleHotAmountChange} onFocus={() => setLastEdited('hot')} className="w-full bg-gray-100 dark:bg-brand-dark border border-gray-300 dark:border-gray-600 rounded-lg p-3 pr-24 text-gray-900 dark:text-white focus:ring-brand-accent focus:border-brand-accent" placeholder="0.00" />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"><AssetIcon asset={'HOT'} className="w-5 h-5 mr-2" /><span className="font-bold text-gray-500 dark:text-gray-400">HOT</span></div>
                        </div>
                        {tier.bonus > 0 && parseFloat(hotAmount) > 0 && (
                             <p className="text-right text-xs text-green-500 mt-1.5">
                                Total with bonus: <strong>{(parseFloat(hotAmount) * bonusMultiplier).toLocaleString()} HOT</strong>
                            </p>
                        )}
                        <div className="flex justify-between items-center mt-1.5 text-xs">
                            <p className="text-gray-500 dark:text-gray-400">
                                Min: ${stage.minContributionUSD} | Max: ${stage.maxContributionUSD}
                            </p>
                            {validationError && <p className="font-bold text-red-500">{validationError}</p>}
                        </div>
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                     <Button onClick={wallets.isConnected ? handleBuyClick : openWalletModal} disabled={isButtonDisabled} className="w-full text-lg py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-brand-accent text-brand-dark">
                        {buttonText}
                    </Button>
                    {networkConfig.faucetEnabled && wallets.isConnected && (
                        <Button onClick={handleFaucet} disabled={isFaucetLoading} variant="outline" className="w-full">
                            {isFaucetLoading ? 'Processing...' : 'Request Faucet Drip'}
                        </Button>
                    )}
                </div>
                <TransactionHistory transactions={transactions.history} />
                <div className="text-center pt-4">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Spread the word!</p>
                    <div className="flex items-center justify-center gap-3">
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-brand-dark-lighter hover:opacity-80 transition-opacity" aria-label="Share on Twitter"><i className="fa-brands fa-x-twitter"></i></a>
                        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-brand-dark-lighter hover:opacity-80 transition-opacity" aria-label="Share on Facebook"><i className="fab fa-facebook"></i></a>
                        <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-brand-dark-lighter hover:opacity-80 transition-opacity" aria-label="Share on Telegram"><i className="fab fa-telegram"></i></a>
                    </div>
                </div>
            </div>
            {isCheckoutModalOpen && (
                 <React.Suspense fallback={null}>
                    <CheckoutModal 
                        isOpen={isCheckoutModalOpen}
                        onClose={() => setIsCheckoutModalOpen(false)}
                        hotAmount={parseFloat(hotAmount || '0')}
                        payAmount={parseFloat(payAmount || '0')}
                        currency={paymentCurrency}
                        bonusMultiplier={bonusMultiplier}
                    />
                 </React.Suspense>
            )}
        </div>
    );
};


// ---- MAIN COMPONENT ----

interface TokenSalePanelProps {
    saleState: SaleState;
    stage: SaleStageConfig;
    countdown: Countdown;
    totalSold: number;
}

const TokenSalePanel: React.FC<TokenSalePanelProps> = (props) => {
    switch (props.saleState) {
        case 'UPCOMING':
            return <UpcomingSalePanel stage={props.stage} countdown={props.countdown} />;
        case 'ACTIVE':
            return <ActiveSalePanel stage={props.stage} countdown={props.countdown} totalSold={props.totalSold} />;
        case 'ENDED':
            return <EndedSalePanel />;
        default:
            return null;
    }
};

export default TokenSalePanel;
