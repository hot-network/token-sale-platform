import React from 'react';
import Button from '../Button';
import AssetIcon from '../AssetIcons';
import useNetwork from '../../hooks/useNetwork';

interface PaymentSuccessProps {
  hotAmount: number;
  onDone: () => void;
  transactionId?: string;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ hotAmount, onDone, transactionId }) => {
    const { config: networkConfig } = useNetwork();
    
    const getExplorerUrl = (txId: string) => {
        if (txId.startsWith('sim_') || txId.startsWith('card_') || txId.startsWith('solpay_') || txId.startsWith('pending_')) return '#';
        const clusterQuery = networkConfig.label === 'Mainnet' ? '' : `?cluster=${networkConfig.label.toLowerCase()}`;
        return `${networkConfig.explorerUrl}/tx/${txId}${clusterQuery}`;
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `I just bought ${hotAmount.toLocaleString()} $HOT tokens! Join the presale on Solana. #HOTtoken #Solana`;

    const links = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    };
    
    return (
        <div className="text-center p-4 sm:p-8 min-h-[300px] flex flex-col justify-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-50"></div>
                <div className="relative w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-4xl">
                    <i className="fa-solid fa-check"></i>
                </div>
            </div>
            
            <h3 className="text-2xl font-bold font-serif">Purchase Successful!</h3>
            
            <p className="text-gray-500 dark:text-gray-400 mt-2">You successfully purchased</p>
            <p className="text-3xl font-bold my-2 text-brand-accent-dark dark:text-brand-accent flex items-center justify-center gap-2">
                <AssetIcon asset="HOT" className="w-7 h-7" /> 
                {hotAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} HOT
            </p>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Your tokens are now secured and will be available to claim after the presale concludes.
            </p>

            {transactionId && getExplorerUrl(transactionId) !== '#' && (
                 <a href={getExplorerUrl(transactionId)} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-accent hover:underline mt-2 inline-block">
                    View Transaction <i className="fa-solid fa-arrow-up-right-from-square text-xs ml-1"></i>
                </a>
            )}

            <div className="mt-8 space-y-3">
                 <Button onClick={onDone} className="w-full bg-brand-accent text-brand-dark">
                    Done
                </Button>
                <div className="text-center">
                     <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Share your purchase!</p>
                     <div className="flex justify-center gap-3">
                        <a href={links.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-brand-dark-lighter flex items-center justify-center hover:opacity-80 transition-opacity">
                            <i className="fa-brands fa-x-twitter text-xl"></i>
                        </a>
                         <a href={links.telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-brand-dark-lighter flex items-center justify-center hover:opacity-80 transition-opacity">
                            <i className="fa-brands fa-telegram text-xl"></i>
                        </a>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;