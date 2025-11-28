
import React, { useState, useEffect } from 'react';
import Button from './Button';
import AssetIcon from './AssetIcons';
import useTokenSalesContext from '../hooks/useTokenSalesContext';

const TradePanel: React.FC = () => {
    const { isListedOnDex, prices, user, transactions, openWalletModal, wallets } = useTokenSalesContext();
    const [mode, setMode] = useState<'buy' | 'sell'>('buy');
    const [hotAmount, setHotAmount] = useState('10000');
    const [payAmount, setPayAmount] = useState('');
    const [lastEdited, setLastEdited] = useState<'hot' | 'pay'>('hot');
    const [paymentCurrency, setPaymentCurrency] = useState<'SOL' | 'USDC'>('SOL');
    
    const isTradingActive = isListedOnDex;
    const formatNumber = (num: number) => num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    
    const handleCurrencySwitch = (newCurrency: 'SOL' | 'USDC') => {
        if (newCurrency === paymentCurrency) return;
        setPaymentCurrency(newCurrency);
        setLastEdited('hot');
    };

    useEffect(() => {
        setHotAmount('10000');
        setPayAmount('');
        setLastEdited('hot');
    }, [mode, paymentCurrency]);

    useEffect(() => {
        if (!isTradingActive) return;
        
        const hot = parseFloat(hotAmount);
        const pay = parseFloat(payAmount);
        
        const updateAmounts = () => {
            if (lastEdited === 'hot') {
                if (isNaN(hot) || hot <= 0) { setPayAmount(''); return; }
                const costInUsd = hot * prices.marketHotPrice;
                if (paymentCurrency === 'SOL') {
                    setPayAmount(prices.solPrice > 0 ? (costInUsd / prices.solPrice).toFixed(6) : '');
                } else {
                    setPayAmount(costInUsd.toFixed(2));
                }
            } else { // lastEdited === 'pay'
                if (isNaN(pay) || pay <= 0) { setHotAmount(''); return; }
                let costInUsd = 0;
                if (paymentCurrency === 'SOL') {
                    costInUsd = pay * prices.solPrice;
                } else {
                    costInUsd = pay;
                }
                setHotAmount(prices.marketHotPrice > 0 ? (costInUsd / prices.marketHotPrice).toFixed(2) : '');
            }
        };

        updateAmounts();

    }, [hotAmount, payAmount, lastEdited, prices.marketHotPrice, prices.solPrice, isTradingActive, paymentCurrency]);

    const handleTrade = () => {
        if (mode === 'buy') {
            transactions.buyMarketTokens(parseFloat(hotAmount), paymentCurrency);
        } else {
            transactions.sellMarketTokens(parseFloat(hotAmount), paymentCurrency);
        }
    };

    if (!isTradingActive) {
        return (
            <div className="text-center py-8 px-4 flex flex-col items-center justify-center min-h-[460px]">
                <i className="fa-solid fa-hourglass-half text-4xl text-brand-accent mb-4"></i>
                <h3 className="text-2xl font-bold mb-4 font-serif">Trading Is Not Yet Active</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">Market trading will be enabled after the token is listed on a decentralized exchange (DEX).</p>
            </div>
        );
    }
    
    const userPaymentBalance = paymentCurrency === 'SOL' ? (user?.solBalance ?? 0) : (user?.usdcBalance ?? 0);
    const requiredPaymentAmount = parseFloat(payAmount) || 0;
    const hasSufficientPaymentBalance = userPaymentBalance >= requiredPaymentAmount;

    const isButtonDisabled = !hotAmount || 
        parseFloat(hotAmount) <= 0 || 
        transactions.status === 'processing' ||
        (mode === 'sell' && parseFloat(hotAmount) > user.hotBalance) || 
        (mode === 'buy' && !hasSufficientPaymentBalance);

    let buttonText;
    if (transactions.status === 'processing') {
        buttonText = 'Processing...';
    } else if (mode === 'buy' && !hasSufficientPaymentBalance && wallets.isConnected) {
        buttonText = `Insufficient ${paymentCurrency}`;
    } else if (mode === 'sell' && parseFloat(hotAmount) > user.hotBalance && wallets.isConnected) {
        buttonText = 'Insufficient HOT';
    } else {
        buttonText = mode === 'buy' ? 'Buy HOT' : 'Sell HOT';
    }

    return (
        <div className="p-4 sm:p-6 min-h-[460px] flex flex-col">
            <div className="flex justify-center mb-4">
                <div className="p-1 rounded-lg bg-brand-light-dark dark:bg-brand-dark-lighter flex gap-1">
                    <button onClick={() => setMode('buy')} className={`px-8 py-2 text-sm font-bold rounded-md transition-colors ${mode === 'buy' ? 'bg-brand-light dark:bg-brand-dark-light shadow' : 'text-gray-500'}`}>Buy</button>
                    <button onClick={() => setMode('sell')} className={`px-8 py-2 text-sm font-bold rounded-md transition-colors ${mode === 'sell' ? 'bg-brand-light dark:bg-brand-dark-light shadow' : 'text-gray-500'}`}>Sell</button>
                </div>
            </div>
            <div className="flex-grow flex flex-col justify-center">
                 <div className="bg-brand-light-dark dark:bg-brand-dark-lighter rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Your HOT Balance:</span>
                        <span className="font-bold text-gray-900 dark:text-white">{formatNumber(user.hotBalance)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Market Price:</span>
                        <span className="font-bold text-brand-accent">${prices.marketHotPrice.toFixed(8)}</span>
                    </div>
                    
                     <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-300 dark:border-gray-600">
                        <span className="font-semibold text-gray-600 dark:text-gray-300">{mode === 'buy' ? 'Pay with:' : 'Receive in:'}</span>
                        <div className="flex items-center gap-2">
                             <div className="p-1 rounded-lg bg-brand-light/50 dark:bg-brand-dark/50 flex gap-1">
                                <button onClick={() => handleCurrencySwitch('SOL')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${paymentCurrency === 'SOL' ? 'bg-brand-light dark:bg-brand-dark-light shadow text-brand-dark dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>SOL</button>
                                <button onClick={() => handleCurrencySwitch('USDC')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${paymentCurrency === 'USDC' ? 'bg-brand-light dark:bg-brand-dark-light shadow text-brand-dark dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>USDC</button>
                            </div>
                            {wallets.isConnected && (
                                <div className="text-xs text-right font-medium text-gray-500 dark:text-gray-400">
                                    Balance: {paymentCurrency === 'SOL' 
                                        ? `${(user?.solBalance ?? 0).toLocaleString(undefined, { maximumFractionDigits: 4 })} SOL`
                                        : `${(user?.usdcBalance ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} USDC`
                                    }
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SWAP UI */}
                    <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{mode === 'buy' ? 'You Pay' : 'You Sell'}</label>
                        <div className="mt-1 relative">
                            <input type="number" value={mode === 'buy' ? payAmount : hotAmount} onChange={e => mode === 'buy' ? setPayAmount(e.target.value) : setHotAmount(e.target.value)} onFocus={() => setLastEdited(mode === 'buy' ? 'pay' : 'hot')} className="w-full bg-brand-light dark:bg-brand-dark border border-gray-300 dark:border-gray-600 rounded-lg p-3 pr-24 text-gray-900 dark:text-white focus:ring-brand-accent focus:border-brand-accent" placeholder="0.00" />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <AssetIcon asset={mode === 'buy' ? paymentCurrency : 'HOT'} className="w-5 h-5 mr-2" />
                                <span className="font-bold text-gray-500 dark:text-gray-400">{mode === 'buy' ? paymentCurrency : 'HOT'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center my-1"><i className="fa-solid fa-arrow-down-long text-gray-400 dark:text-gray-500 text-lg"></i></div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{mode === 'buy' ? 'You Receive' : 'You Receive'}</label>
                        <div className="mt-1 relative">
                            <input type="number" value={mode === 'buy' ? hotAmount : payAmount} onChange={e => mode === 'buy' ? setHotAmount(e.target.value) : setPayAmount(e.target.value)} onFocus={() => setLastEdited(mode === 'buy' ? 'hot' : 'pay')} className="w-full bg-gray-100 dark:bg-brand-dark border border-gray-300 dark:border-gray-600 rounded-lg p-3 pr-24 text-gray-900 dark:text-white focus:ring-brand-accent focus:border-brand-accent" placeholder="0.00" />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <AssetIcon asset={mode === 'buy' ? 'HOT' : paymentCurrency} className="w-5 h-5 mr-2" />
                                <span className="font-bold text-gray-500 dark:text-gray-400">{mode === 'buy' ? 'HOT' : paymentCurrency}</span>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
             <div className="mt-4">
                {wallets.isConnected ? (
                     <Button onClick={handleTrade} disabled={isButtonDisabled} className={`w-full text-lg py-3 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${mode === 'sell' ? 'bg-red-500/80 hover:bg-red-500/100 text-white' : 'bg-brand-accent text-brand-dark'}`}>
                        {buttonText}
                    </Button>
                ) : (
                    <Button onClick={openWalletModal} className="w-full text-lg py-3 mt-2 bg-brand-accent text-brand-dark">
                        Connect Wallet
                    </Button>
                )}
             </div>
        </div>
    );
};

export default TradePanel;
