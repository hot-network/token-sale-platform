
import React, { useState } from 'react';
import useTokenSalesContext from '../hooks/useTokenSalesContext';
import Button from './Button';
import { RETWEET_BONUS_AMOUNT } from '../constants';

const AffiliatePanel: React.FC = () => {
    const { wallets, openWalletModal, affiliate, addToast } = useTokenSalesContext();
    const [copied, setCopied] = useState(false);
    const [twitterHandle, setTwitterHandle] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleCopy = () => {
        navigator.clipboard.writeText(affiliate.referralLink);
        setCopied(true);
        addToast('Referral link copied!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmitClaim = (e: React.FormEvent) => {
        e.preventDefault();
        if (affiliate.isClaiming || affiliate.hasClaimedBonus) return;

        if (!twitterHandle || !twitterHandle.startsWith('@') || twitterHandle.length < 2) {
            setValidationError("Please enter a valid handle (e.g., @YourHandle).");
            return;
        }
        setValidationError('');
        affiliate.claimBonus(twitterHandle);
    };

    const shareText = encodeURIComponent(`Join me in the HOT Token presale on Solana! Use my link to get started:`);
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${affiliate.referralLink}`;

    if (!wallets.isConnected) {
        return (
            <div className="text-center py-8 px-4 flex flex-col items-center justify-center min-h-[460px]">
                <i className="fa-solid fa-link text-4xl text-brand-accent mb-4"></i>
                <h3 className="text-2xl font-bold mb-4 font-serif">Join the Affiliate Program</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">Connect your wallet to get your unique referral link, earn rewards, and claim your free token bonus.</p>
                <Button onClick={openWalletModal} variant="primary" className="bg-brand-accent text-brand-dark">Connect Wallet</Button>
            </div>
        );
    }
    
    return (
        <div className="p-4 sm:p-6 min-h-[460px] grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left Side: Referral Link & Stats */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold mb-2 font-serif">Your Referral Link</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Share this link with your friends. You'll earn HOT tokens for everyone who participates through your link.</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            readOnly
                            value={affiliate.referralLink}
                            className="w-full bg-brand-light-dark dark:bg-brand-dark-lighter border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm"
                        />
                        <Button onClick={handleCopy} variant="secondary" className="flex-shrink-0">
                            {copied ? <><i className="fa-solid fa-check mr-2"></i> Copied</> : <><i className="fa-solid fa-copy mr-2"></i> Copy</>}
                        </Button>
                    </div>
                     <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-accent transition-colors">
                        <i className="fa-brands fa-x-twitter"></i>
                        Share on X
                    </a>
                </div>

                 <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-brand-light-dark dark:bg-brand-dark-lighter p-4 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Referred</p>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                     <div className="bg-brand-light-dark dark:bg-brand-dark-lighter p-4 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Rewards Earned</p>
                        <p className="text-2xl font-bold">{affiliate.rewards.toLocaleString()} HOT</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Retweet Bonus */}
            <div className="bg-brand-accent/10 dark:bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-6 text-center h-full flex flex-col justify-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent text-3xl">
                    <i className="fa-solid fa-gift"></i>
                </div>
                <h3 className="text-xl font-bold font-serif">Community Growth Bonus</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 my-2">Help spread the word about the presale and get a free, one-time reward.</p>
                <p className="text-3xl font-bold text-brand-accent my-3">{RETWEET_BONUS_AMOUNT.toLocaleString()} HOT</p>
                
                {affiliate.hasClaimedBonus ? (
                    <Button 
                        disabled={true}
                        className="w-full mt-4 bg-brand-accent text-brand-dark disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Bonus Claimed!
                    </Button>
                ) : (
                    <form onSubmit={handleSubmitClaim} className="mt-2">
                        <div>
                            <label htmlFor="twitter-handle" className="text-xs font-semibold text-gray-500">Enter your X Handle to validate</label>
                            <input
                                id="twitter-handle"
                                type="text"
                                value={twitterHandle}
                                onChange={(e) => {
                                    setTwitterHandle(e.target.value);
                                    if (validationError) setValidationError('');
                                }}
                                placeholder="@YourHandle"
                                className={`w-full text-center bg-brand-light dark:bg-brand-dark border rounded-lg p-2 mt-1 text-sm focus:ring-brand-accent focus:border-brand-accent transition-colors ${
                                    validationError 
                                    ? 'border-red-500' 
                                    : 'border-gray-300 dark:border-gray-600'
                                }`}
                                aria-invalid={!!validationError}
                                aria-describedby="twitter-error"
                            />
                            {validationError && <p id="twitter-error" className="text-xs text-red-500 mt-1">{validationError}</p>}
                        </div>
                        <Button 
                            type="submit"
                            disabled={affiliate.isClaiming || !twitterHandle}
                            className="w-full mt-4 bg-brand-accent text-brand-dark disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {affiliate.isClaiming ? 'Validating...' : 'Claim Your Free Tokens'}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AffiliatePanel;
