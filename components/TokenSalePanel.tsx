import React, { useState, useEffect, useMemo, lazy } from 'react';
import Button from './Button';
import CountdownDisplay from './CountdownDisplay';
import { SaleState, SaleStageConfig, Countdown } from '../types';
import { Transaction } from '../types/transactions';
import useTokenSalesContext from '../hooks/useTokenSalesContext';
import AssetIcon from './AssetIcons';
import Modal from './modals/Modal';
import { createSolanaPayUrl } from '../lib/solana/solana-pay';
import { localCacheGet, localCacheSet } from '../utils/cache';


const CheckoutModal = lazy(() => import('./checkout/CheckoutModal'));


const SOL_TRANSACTION_FEE = 0.00001; // A small fee for SOL transactions

// ---- HELPER & CHILD COMPONENTS ----

const SolanaPayDisplay: React.FC<{
    amount: number;
    currency: 'SOL' | 'USDC';
    hotAmount: number;
}> = ({ amount, currency, hotAmount }) => {
    const { transactions, networkConfig } = useTokenSalesContext();
    const [status, setStatus] = useState<'idle' | 'waiting' | 'verifying' | 'success'>('idle');
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

    const [reference] = useState(() => `hot_sale_${Date.now()}`); // Stable reference per component instance

    const solanaPayUrl = useMemo(() => {
        if (amount <= 0) return '';
        return createSolanaPayUrl(networkConfig, amount, currency, reference);
    }, [networkConfig, amount, currency, reference]);

    useEffect(() => {
        const cachedData = localCacheGet<{ amount: number; url: string }>('hot_last_qr');
        if (cachedData && cachedData.amount === amount) {
            setQrCodeUrl(cachedData.url);
        } else if (solanaPayUrl) {
            const newUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(solanaPayUrl)}`;
            setQrCodeUrl(newUrl);
            localCacheSet('hot_last_qr', { amount, url: newUrl });
        } else {
            setQrCodeUrl('');
        }
    }, [amount, solanaPayUrl]);

    useEffect(() => {
        setStatus('idle');
    }, [amount, currency, hotAmount]);

    useEffect(() => {
        let intervalId: number | undefined;
        if (status === 'waiting' && transactions.status !== 'processing') {
            intervalId = window.setInterval(async () => {
                setStatus('verifying');
                const result = await transactions.buyWithSolanaPay(hotAmount, currency);
                if (result) {
                    setStatus('success');
                } else {
                    setStatus('waiting');
                }
            }, 8000);
        }
        return () => {
            if (intervalId) window.clearInterval(intervalId);
        };
    }, [status, hotAmount, currency, transactions]);

    if (amount <= 0 || !qrCodeUrl) {
        return <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">Please enter a valid amount to generate a payment QR code.</p>;
    }
    
    if (status === 'success') {
        return (
            <div className="text-center p-4 mt-4 bg-green-500/10 rounded-lg animate-fadeIn">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-2xl"><i className="fa-solid fa-check"></i></div>
                <h3 className="font-bold">Payment Received!</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your balance has been updated.</p>
            </div>
        );
    }

    if (status !== 'idle') {
        return (
            <div className="flex flex-col items-center mt-4">
                 <a href={solanaPayUrl} target="_blank" rel="noopener noreferrer">
                    <img src={qrCodeUrl} alt="Solana Pay QR Code" className="rounded-lg border-4 border-white dark:border-brand-dark-lighter shadow-lg" />
                </a>
                <div className="mt-4 text-center">
                    {status === 'waiting' && (
                        <>
                            <p className="font-bold">Scan with your Solana wallet</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Waiting for payment...</p>
                        </>
                    )}
                    {status === 'verifying' && (
                        <>
                            <i className="fas fa-spinner fa-spin text-2xl text-brand-accent"></i>
                            <p className="font-bold animate-pulse mt-2">Verifying Transaction...</p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <Button onClick={() => setStatus('waiting')} className="w-full text-lg py-3 cursor-pointer bg-brand-accent text-brand-dark hover:brightness-105 active:brightness-95">
            <i className="fa-solid fa-qrcode mr-2"></i> Pay with QR Code
        </Button>
    );
};


const PriceInfo: React.FC = () => {
    const { prices } = useTokenSalesContext();
    if (prices.solPrice <= 0) {
        return (
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 my-2 animate-pulse">
                <span>Loading price data...</span>
            </div>
        );
    }
    return (
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 my-2">
            <span>1 SOL ≈ ${prices.solPrice.toFixed(2)}</span>
            <span className="mx-2 opacity-50">|</span>
            <span>1 HOT ≈ ${prices.presaleHotPrice.toFixed(8)}</span>
        </div>
    );
};

const TransactionHistory: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const { networkConfig } = useTokenSalesContext();
    const [isOpen, setIsOpen] = useState(transactions.length > 0);
    const listId = 'transaction-history-list';

    const getExplorerUrl = (txId: string) => {
        if (txId.startsWith('sim_') || txId.startsWith('card_') || txId.startsWith('solpay_') || txId.startsWith('pending_')) return '#';
        const clusterQuery = networkConfig.label === 'Mainnet' ? '' : `?cluster=${networkConfig.label.toLowerCase()}`;
        return `${networkConfig.explorerUrl}/tx/${txId}${clusterQuery}`;
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const getTransactionIcon = (tx: Transaction) => {
        if (tx.status === 'pending') {
            return 'fa-solid fa-clock text-yellow-500';
        }
        switch (tx.type) {
            case 'presale_buy': return 'fa-solid fa-cart-shopping text-blue-500';
            case 'claim': return 'fa-solid fa-hand-holding-dollar text-green-500';
            case 'market_buy': return 'fa-solid fa-arrow-trend-up text-green-500';
            case 'market_sell': return 'fa-solid fa-arrow-trend-down text-red-500';
            default: return 'fa-solid fa-exchange-alt text-gray-500';
        }
    };

    return (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                aria-expanded={isOpen}
                aria-controls={listId}
            >
                <span>Recent Activity {transactions.length > 0 && `(${transactions.length})`}</span>
                <i className={`fas fa-chevron-down transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div 
                id={listId}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-60 mt-2' : 'max-h-0'}`}
            >
                {transactions.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">Your transactions will appear here.</p>
                ) : (
                    <ul className="space-y-2 max-h-52 overflow-y-auto pr-2">
                        {transactions.map(tx => (
                            <li key={tx.id} className="flex items-center justify-between text-sm p-2.5 bg-brand-light-dark/50 dark:bg-brand-dark-lighter/50 rounded-lg border border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
                                <div className="flex items-center gap-3">
                                    <i className={`${getTransactionIcon(tx)} w-4 text-center`}></i>
                                    <div>
                                        <p className="font-bold capitalize">{tx.type.replace(/_/g, ' ')}</p>
                                        <p className="text-xs text-gray-500">{formatDate(tx.timestamp)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold flex items-center gap-1.5 justify-end ${tx.type === 'market_sell' ? 'text-red-500' : 'text-green-500'}`}>
                                        {tx.type === 'market_sell' ? '-' : '+'}
                                        <AssetIcon asset="HOT" className="w-4 h-4" />
                                        {tx.hotAmount.toLocaleString()}
                                    </p>
                                    {tx.usdValue > 0 && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            ~${tx.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    )}
                                    {tx.status === 'pending' ? (
                                        <span className="text-xs text-yellow-500 font-bold mt-0.5 inline-block">Pending</span>
                                    ) : (
                                        <a href={getExplorerUrl(tx.id)} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-accent hover:underline mt-0.5 inline-block">
                                            View <i className="fa-solid fa-arrow-up-right-from-square text-xs ml-1"></i>
                                        </a>
                                    )}
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
    };

    return (
        <div className="text-center py-8 px-4 flex flex-col items-center justify-center min-h-[460px]">
            <h3 className="text-2xl font-bold mb-4 font-serif">Presale Starting Soon</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The HOT Token presale is scheduled to begin on {new Date(stage.startTimestamp * 1000).toLocaleString()}.</p>
            <div className="max-w-sm w-full"><CountdownDisplay countdown={countdown} /></div>
            <div className="text-center pt-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Help build the community before we launch!</p>
                <Button
                    variant="secondary"
                    onClick={() => window.open(socialLinks.twitter, '_blank')}
                >
                    <i className="fa-brands fa-x-twitter mr-2"></i>
                    Share on X
                </Button>
            </div>
        </div>
    );
};

const EndedSalePanel: React.FC = () => {
    const { user, transactions } = useTokenSalesContext();
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [claimStep, setClaimStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [claimedAmount, setClaimedAmount] = useState<number>(0);
    const [isAcknowledgeChecked, setIsAcknowledgeChecked] = useState(false);
    
    const isOverallProcessing = transactions.status === 'processing';

    const handleOpenModal = () => {
        setClaimStep('confirm');
        setErrorMessage('');
        setIsAcknowledgeChecked(false);
        setIsClaimModalOpen(true);
    };

    const handleCloseModal = () => {
        if (claimStep === 'processing') return;
        setIsClaimModalOpen(false);
    };

    const handleConfirmClaim = async () => {
        const amountToClaim = user.hotBalance;
        setClaimedAmount(amountToClaim);
        setClaimStep('processing');
        const result = await transactions.claimTokens();
        if (result) {
            setClaimStep('success');
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
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 text-4xl">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <p className="text-lg font-semibold">You are about to claim your tokens.</p>
                        <p className="text-3xl font-bold text-brand-accent-dark dark:text-brand-accent my-4 flex items-center justify-center gap-2">
                            <AssetIcon asset="HOT" className="w-8 h-8" />
                            <span>{user.hotBalance.toLocaleString()} HOT</span>
                        </p>
                        <div className="mt-6 text-left p-3 bg-gray-100 dark:bg-brand-dark-lighter rounded-lg">
                            <label htmlFor="acknowledge-claim" className="flex items-start gap-3 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                                <input 
                                    id="acknowledge-claim"
                                    type="checkbox" 
                                    checked={isAcknowledgeChecked} 
                                    onChange={() => setIsAcknowledgeChecked(!isAcknowledgeChecked)}
                                    className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-brand-dark text-brand-accent focus:ring-brand-accent"
                                />
                                <span>I understand that this action is irreversible. The tokens will be sent to my connected wallet and this cannot be undone.</span>
                            </label>
                        </div>

                        <div className="mt-6 space-y-3">
                            <Button 
                                onClick={handleConfirmClaim} 
                                className="w-full bg-brand-accent text-brand-dark"
                                disabled={!isAcknowledgeChecked || isOverallProcessing}
                            >
                                Claim My Tokens
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
                        <p className="text-gray-500 mt-2">Your {claimedAmount.toLocaleString()} HOT tokens have been claimed.</p>
                        <Button onClick={handleCloseModal} className="w-full mt-6 bg-brand-accent text-brand-dark">
                            Done
                        </Button>
                    </div>
                );
            case 'error':
                 return (
                    <div className="text-center p-8 min-h-[240px] flex flex-col justify-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-4xl">
                            <i className="fa-solid fa-times"></i>
                        </div>
                        <h3 className="text-2xl font-bold">Claim Failed</h3>
                        <p className="text-gray-500 mt-2 bg-gray-100 dark:bg-brand-dark-light p-2 rounded-lg text-xs">{errorMessage}</p>
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

// ---- REFACTORED ACTIVE SALE COMPONENTS ----

const SaleProgress: React.FC<{ stage: SaleStageConfig; countdown: Countdown; totalSold: number; }> = ({ stage, countdown, totalSold }) => {
    const progressPercent = stage.hardcap > 0 ? Math.min(100, (totalSold / stage.hardcap) * 100) : 0;
    const formatNumber = (num: number) => num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    return (
        <>
            <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 text-center">Sale Ends In</p>
                <CountdownDisplay countdown={countdown} />
            </div>
            <div className="mb-4">
                <div className="flex justify-between items-center mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <span>Progress</span><span>{progressPercent.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-brand-light-dark dark:bg-brand-dark-light rounded-full h-4 relative overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-brand-accent-dark to-brand-accent h-4 rounded-full transition-all duration-1500 ease-out shadow-lg shadow-brand-accent/30" 
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                    <div className="absolute top-0 h-4 border-r-2 border-dashed border-white/60 dark:border-white/40" style={{ left: `${(stage.softcap / stage.hardcap) * 100}%` }} title={`Softcap: ${formatNumber(stage.softcap)}`}></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400"><span>{formatNumber(totalSold)} / {formatNumber(stage.hardcap)}</span></div>
            </div>
        </>
    );
};

const AmountInput: React.FC<{
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    currency: 'SOL' | 'USDC' | 'HOT';
    onCurrencySwitch?: (c: 'SOL' | 'USDC') => void;
    isPayInput?: boolean;
    hasError?: boolean;
    solBalance?: number;
    usdcBalance?: number;
    isBalancesLoading?: boolean;
    hasSufficientSolBalance?: boolean;
    hasSufficientUsdcBalance?: boolean;
}> = ({ id, label, value, onChange, onFocus, currency, onCurrencySwitch, isPayInput = false, hasError = false, solBalance, usdcBalance, isBalancesLoading = false, hasSufficientSolBalance, hasSufficientUsdcBalance }) => {
    
    const isValid = value && parseFloat(value) > 0 && !hasError;

    const inputClasses = `w-full text-2xl font-bold border-2 rounded-lg p-4 text-gray-900 dark:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:shadow-lg focus:shadow-brand-accent/20
        ${isPayInput 
            ? 'bg-brand-light dark:bg-brand-dark-light pr-48' // Use pr-48 for enough space for the buttons
            : 'bg-gray-100 dark:bg-black/20 pr-28 border-transparent'}
        ${hasError 
            ? 'border-red-500 focus:ring-red-500/50' 
            : isValid
                ? 'border-green-500/50 focus:ring-green-500/50'
                : 'border-gray-200 dark:border-gray-700 focus:ring-brand-accent/50 focus:border-brand-accent'}`

    const formatBalance = (bal: number, curr: 'SOL' | 'USDC') => bal.toLocaleString(undefined, { maximumFractionDigits: curr === 'SOL' ? 4 : 2 });

    const balanceDisplay = useMemo(() => {
        // Don't show if it's not the payment input, or if wallet isn't connected
        if (!isPayInput || solBalance === undefined || usdcBalance === undefined) return null;

        if (isBalancesLoading) {
            return (
                 <span className="font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Loading...</span>
                </span>
            );
        }

        const selectedBalance = currency === 'SOL' ? solBalance : usdcBalance;
        const hasSufficient = currency === 'SOL' ? hasSufficientSolBalance : hasSufficientUsdcBalance;

        return (
            <span className={`font-semibold ${!hasSufficient ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                Balance: {formatBalance(selectedBalance, currency as 'SOL' | 'USDC')}
            </span>
        );
    }, [isPayInput, currency, solBalance, usdcBalance, hasSufficientSolBalance, hasSufficientUsdcBalance, isBalancesLoading]);

    return (
        <div>
            <div className="flex justify-between items-center text-xs mb-1">
                <label htmlFor={id} className="font-medium text-gray-500 dark:text-gray-400">{label}</label>
                {balanceDisplay}
            </div>
            <div className="relative">
                <input id={id} type="number" value={value} onChange={onChange} onFocus={onFocus} className={inputClasses} placeholder="0.00" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    {isPayInput && onCurrencySwitch ? (
                        <div className="p-1 rounded-lg bg-gray-200 dark:bg-black/20 flex items-stretch gap-1">
                            <button onClick={() => onCurrencySwitch('SOL')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all duration-200 flex items-center gap-1.5 ${currency === 'SOL' ? 'bg-brand-accent text-brand-dark shadow-lg shadow-brand-accent/40 scale-105' : 'text-gray-500 hover:bg-white/80 dark:hover:bg-brand-dark-light/80'}`}>
                                <AssetIcon asset="SOL" className="w-5 h-5" /> SOL
                            </button>
                            <button onClick={() => onCurrencySwitch('USDC')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all duration-200 flex items-center gap-1.5 ${currency === 'USDC' ? 'bg-brand-accent text-brand-dark shadow-lg shadow-brand-accent/40 scale-105' : 'text-gray-500 hover:bg-white/80 dark:hover:bg-brand-dark-light/80'}`}>
                                <AssetIcon asset="USDC" className="w-5 h-5" /> USDC
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center pr-2 pointer-events-none">
                            <AssetIcon asset={'HOT'} className="w-6 h-6 mr-2" /><span className="font-bold text-lg text-gray-500 dark:text-gray-400">HOT</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const BuyForm: React.FC<{ stage: SaleStageConfig; }> = ({ stage }) => {
    const { transactions, prices, user, wallets, openWalletModal, eligibility, tier, addToast, isBalancesLoading } = useTokenSalesContext();

    const [hotAmount, setHotAmount] = useState('10000');
    const [payAmount, setPayAmount] = useState('');
    const [paymentCurrency, setPaymentCurrency] = useState<'SOL' | 'USDC'>('SOL');
    const [lastEdited, setLastEdited] = useState<'hot' | 'pay'>('hot');
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'solana_pay'>('wallet');

    const bonusMultiplier = 1 + (tier.bonus / 100);
    
    const hotValueUSD = useMemo(() => {
        const hot = parseFloat(hotAmount);
        return isNaN(hot) || hot < 0 ? 0 : hot * prices.presaleHotPrice;
    }, [hotAmount, prices.presaleHotPrice]);
    
    const validationError = useMemo(() => {
        if (hotValueUSD > 0 && hotValueUSD < stage.minContributionUSD) return `Minimum contribution is $${stage.minContributionUSD}.`;
        if (hotValueUSD > stage.maxContributionUSD) return `Maximum contribution is $${stage.maxContributionUSD}.`;
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
        let costInUsd = paymentCurrency === 'SOL' ? pay * prices.solPrice : pay;
        setHotAmount(prices.presaleHotPrice > 0 ? (costInUsd / prices.presaleHotPrice).toFixed(2) : '');
    }, [payAmount, paymentCurrency, prices.presaleHotPrice, prices.solPrice, lastEdited]);
    
    const requiredSol = useMemo(() => prices.solPrice > 0 ? hotValueUSD / prices.solPrice : 0, [hotValueUSD, prices.solPrice]);
    const hasSufficientSolBalance = (user.solBalance || 0) >= (requiredSol + SOL_TRANSACTION_FEE);
    const requiredUsdc = hotValueUSD;
    const hasSufficientUsdcBalance = (user.usdcBalance || 0) >= requiredUsdc;
    const hasSufficientBalanceForSelection = paymentCurrency === 'SOL' ? hasSufficientSolBalance : hasSufficientUsdcBalance;
    
    const isAmountInvalid = !hotAmount || parseFloat(hotAmount) <= 0 || !!validationError;
    const isPriceLoading = paymentCurrency === 'SOL' && prices.solPrice <= 0;
    const isBuyProcessing = transactions.status === 'processing';
    
    let buttonText: string;
    let isButtonDisabled: boolean;

    if (isPriceLoading) { buttonText = 'Loading Prices...'; isButtonDisabled = true; } 
    else if (isBuyProcessing) { buttonText = 'Processing...'; isButtonDisabled = true; } 
    else if (!wallets.isConnected) { buttonText = 'Connect Wallet'; isButtonDisabled = false; }
    else if (eligibility.isLoading) { buttonText = 'Checking Eligibility...'; isButtonDisabled = true; }
    else if (!hasSufficientBalanceForSelection) { buttonText = `Insufficient ${paymentCurrency}`; isButtonDisabled = true; } 
    else { 
        buttonText = `Buy with ${paymentCurrency}`;
        isButtonDisabled = isAmountInvalid; 
    }
    
    const handleBuyClick = () => {
        if (!eligibility.isEligible) {
            addToast(eligibility.reason || 'You are not eligible for this sale.', 'error');
            return;
        }
        setIsCheckoutModalOpen(true);
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-center mb-3">
                <div className="p-1 rounded-lg bg-gray-200 dark:bg-black/20 flex gap-1">
                    <button onClick={() => setPaymentMethod('wallet')} className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all duration-200 flex items-center gap-1.5 ${paymentMethod === 'wallet' ? 'bg-brand-accent text-brand-dark shadow-md' : 'text-gray-500 hover:bg-white/50 dark:hover:bg-brand-dark-light/50'}`}>
                        <i className="fa-solid fa-wallet"></i> Wallet
                    </button>
                    <button onClick={() => setPaymentMethod('solana_pay')} className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all duration-200 flex items-center gap-1.5 ${paymentMethod === 'solana_pay' ? 'bg-brand-accent text-brand-dark shadow-md' : 'text-gray-500 hover:bg-white/50 dark:hover:bg-brand-dark-light/50'}`}>
                       <i className="fa-solid fa-qrcode"></i> Solana Pay
                    </button>
                </div>
            </div>
             <div className="bg-brand-light-dark dark:bg-brand-dark-light border border-gray-200 dark:border-gray-700 p-4 rounded-lg space-y-3">
                <AmountInput
                    id="pay-amount-input"
                    label="You Pay"
                    value={payAmount}
                    onChange={(e) => { setLastEdited('pay'); setPayAmount(e.target.value); }}
                    onFocus={() => setLastEdited('pay')}
                    currency={paymentCurrency}
                    onCurrencySwitch={(c) => { setPaymentCurrency(c); setLastEdited('hot'); }}
                    isPayInput={true}
                    hasError={!!validationError}
                    solBalance={wallets.isConnected ? user.solBalance : undefined}
                    usdcBalance={wallets.isConnected ? user.usdcBalance : undefined}
                    isBalancesLoading={isBalancesLoading}
                    hasSufficientSolBalance={hasSufficientSolBalance}
                    hasSufficientUsdcBalance={hasSufficientUsdcBalance}
                />
                
                <div className="flex justify-center items-center"><i className="fa-solid fa-arrow-down-long text-gray-400 dark:text-gray-500 text-lg"></i></div>

                <AmountInput
                    id="hot-amount-input"
                    label="You Receive"
                    value={hotAmount}
                    onChange={(e) => { setLastEdited('hot'); setHotAmount(e.target.value); }}
                    onFocus={() => setLastEdited('hot')}
                    currency="HOT"
                    hasError={!!validationError}
                />
                 {tier.bonus > 0 && parseFloat(hotAmount) > 0 && (
                     <p className="text-right text-xs text-green-500 font-bold mt-1">
                        Total with +{tier.bonus}% bonus: <strong>{(parseFloat(hotAmount) * bonusMultiplier).toLocaleString()} HOT</strong>
                    </p>
                )}
             </div>

             <PriceInfo />

             <div className="flex justify-between items-center text-xs px-1 min-h-[16px]">
                <p className="text-gray-500 dark:text-gray-400">
                    Min: ${stage.minContributionUSD} | Max: ${stage.maxContributionUSD}
                </p>
                {validationError && <p className="font-bold text-red-500 flex items-center justify-end gap-1"><i className="fa-solid fa-exclamation-circle"></i><span>{validationError}</span></p>}
            </div>

            {paymentMethod === 'wallet' ? (
                <Button onClick={wallets.isConnected ? handleBuyClick : openWalletModal} disabled={isButtonDisabled} className="w-full text-lg py-3 cursor-pointer bg-brand-accent text-brand-dark hover:brightness-105 active:brightness-95">
                    {buttonText}
                </Button>
            ) : (
                <SolanaPayDisplay
                    amount={parseFloat(payAmount) || 0}
                    currency={paymentCurrency}
                    hotAmount={parseFloat(hotAmount) * bonusMultiplier}
                />
            )}
            
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


interface ActiveSalePanelProps {
    stage: SaleStageConfig;
    countdown: Countdown;
    totalSold: number;
}
const ActiveSalePanel: React.FC<ActiveSalePanelProps> = ({ stage, countdown, totalSold }) => {
    const { transactions, networkConfig, user, addToast, isDripping, dripFaucetTokens } = useTokenSalesContext();

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = encodeURIComponent(`I'm participating in the HOT Token presale on Solana! Join me and be part of the future of decentralized content. #HOTtoken #Solana #Presale`);
    const socialLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
    };
    
    return (
        <div className="p-4 sm:p-6 flex flex-col justify-between min-h-[550px]">
            <div>
                <SaleProgress stage={stage} countdown={countdown} totalSold={totalSold} />
            </div>
            <div className="mt-auto space-y-3">
                <BuyForm stage={stage} />
                
                {networkConfig.faucetEnabled && user.address && (
                    <Button onClick={dripFaucetTokens} disabled={isDripping} variant="outline" className="w-full">
                        {isDripping ? 'Processing...' : 'Get Devnet HOT & SOL'}
                    </Button>
                )}

                <TransactionHistory transactions={transactions.history} />
                
                <div className="text-center pt-4">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Help spread the word!</p>
                     <Button
                        variant="secondary"
                        onClick={() => window.open(socialLinks.twitter, '_blank')}
                    >
                        <i className="fa-brands fa-x-twitter mr-2"></i>
                        Share on X
                    </Button>
                </div>
            </div>
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