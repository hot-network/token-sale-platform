
import React, { useState, useEffect, useMemo } from 'react';
import { createSolanaPayUrl } from '../../lib/solana/solana-pay';
import useTokenSalesContext from '../../hooks/useTokenSalesContext';
import useNetwork from '../../hooks/useNetwork';

interface SolanaPayWidgetProps {
    amount: number;
    currency: 'SOL' | 'USDC';
    hotAmount: number;
    onSuccess: () => void;
}

const SolanaPayWidget: React.FC<SolanaPayWidgetProps> = (props) => {
    const { transactions } = useTokenSalesContext();
    const { config: networkConfig } = useNetwork();
    const [status, setStatus] = useState<'idle' | 'waiting' | 'verifying'>('idle');

    // Generate a unique reference for this payment request
    const reference = useMemo(() => `hot_sale_${Date.now()}`, []);

    const solanaPayUrl = useMemo(() => {
        return createSolanaPayUrl(networkConfig, props.amount, props.currency, reference);
    }, [networkConfig, props.amount, props.currency, reference]);

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(solanaPayUrl)}`;

    useEffect(() => {
        let intervalId: number | undefined;

        if (status === 'waiting') {
            // Simulate polling a backend to see if the transaction with the given reference has been paid
            intervalId = window.setInterval(async () => {
                setStatus('verifying');
                 try {
                    // Simulate API call to our backend, which would check the blockchain
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // Simulate a successful finding
                    console.log(`[SolanaPay] Found payment for reference: ${reference}. Simulating success.`);
                    await transactions.buyWithSolanaPay(props.hotAmount, props.currency);
                    props.onSuccess();
                    // The component will unmount upon success, triggering the cleanup function.

                } catch (error) {
                    console.error("Verification failed:", error);
                    setStatus('waiting'); // Go back to waiting for the next poll
                }
            }, 5000);
        }

        // Cleanup function to clear the interval when the component unmounts or status changes
        return () => {
            if (intervalId) {
                window.clearInterval(intervalId);
            }
        };
    }, [status, reference, props.onSuccess, props.hotAmount, props.currency, transactions]);

    const handleStartPayment = () => {
        setStatus('waiting');
    };

    if (status === 'idle') {
        return (
            <button onClick={handleStartPayment} className="w-full bg-brand-accent text-brand-dark p-3 rounded-lg font-bold">
                Generate Solana Pay QR Code
            </button>
        );
    }
    
    return (
        <div className="flex flex-col items-center">
             <a href={solanaPayUrl} target="_blank" rel="noopener noreferrer">
                <img src={qrCodeUrl} alt="Solana Pay QR Code" className="rounded-lg border-4 border-white dark:border-brand-dark-lighter shadow-lg" />
            </a>
            <div className="mt-4 text-center">
                 {status === 'waiting' && (
                    <>
                        <p className="font-bold">Scan with your Solana wallet</p>
                        <p className="text-sm text-gray-500 animate-pulse">Waiting for payment...</p>
                    </>
                 )}
                 {status === 'verifying' && (
                     <>
                        <p className="font-bold animate-pulse">Verifying Transaction...</p>
                        <p className="text-sm text-gray-500">This may take a moment.</p>
                     </>
                 )}
            </div>
        </div>
    );
};

export default SolanaPayWidget;
