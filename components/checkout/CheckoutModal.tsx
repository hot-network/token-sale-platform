
import React, { useState, lazy, Suspense, useMemo } from 'react';
import Modal from '../modals/Modal';
import Button from '../Button';
import AssetIcon from '../AssetIcons';
import useTokenSalesContext from '../../hooks/useTokenSalesContext';
import { PaymentMethod, CheckoutStep } from '../../types/checkout';

const SolanaPayWidget = lazy(() => import('./SolanaPayWidget'));

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotAmount: number;
  payAmount: number;
  currency: 'SOL' | 'USDC';
  bonusMultiplier: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = (props) => {
    const { transactions } = useTokenSalesContext();
    const [step, setStep] = useState<CheckoutStep>('select_method');
    const [method, setMethod] = useState<PaymentMethod>('wallet');
    const [errorMessage, setErrorMessage] = useState('');

    const totalToReceive = props.hotAmount * props.bonusMultiplier;

    const handlePayment = async () => {
        setStep('processing');
        let result = null;
        try {
            switch (method) {
                case 'wallet':
                    result = await transactions.buyPresaleTokens(totalToReceive, props.currency);
                    break;
                case 'solana_pay':
                    // Solana Pay simulation is handled inside the widget
                    // Here we just wait for its completion state
                    return; // Don't close modal yet
                case 'card':
                    result = await transactions.buyWithCard(totalToReceive);
                    break;
                default:
                    throw new Error("Invalid payment method");
            }

            if (result) {
                setStep('success');
            } else {
                throw new Error(transactions.error || "Transaction failed or was rejected.");
            }
        } catch (error: any) {
            setErrorMessage(error.message);
            setStep('error');
        }
    };
    
    const handleSolanaPaySuccess = () => {
        setStep('success');
    };

    const renderContent = () => {
        switch (step) {
            case 'select_method':
                return (
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">You are purchasing</p>
                        <p className="text-2xl font-bold my-2 text-brand-accent">{props.hotAmount.toLocaleString()} HOT</p>
                        <p className="text-lg font-bold">Total to Receive: {totalToReceive.toLocaleString()} HOT</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">For a total of</p>
                        <p className="font-bold text-lg flex items-center justify-center gap-2 mt-2">
                            <AssetIcon asset={props.currency} /> {props.payAmount.toFixed(6)}
                        </p>
                        <div className="my-6">
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 text-left mb-2">Select Payment Method</h3>
                            <div className="space-y-2">
                                 <button onClick={() => setMethod('wallet')} className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${method === 'wallet' ? 'border-brand-accent bg-brand-accent/10' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-brand-dark'}`}><i className="fa-solid fa-wallet mr-3 w-5 text-center"></i>Connected Wallet</button>
                                 <button onClick={() => setMethod('solana_pay')} className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${method === 'solana_pay' ? 'border-brand-accent bg-brand-accent/10' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-brand-dark'}`}><i className="fa-solid fa-qrcode mr-3 w-5 text-center"></i>Solana Pay</button>
                                 <button onClick={() => setMethod('card')} className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${method === 'card' ? 'border-brand-accent bg-brand-accent/10' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-brand-dark'}`}><i className="fa-solid fa-credit-card mr-3 w-5 text-center"></i>Pay with Card</button>
                            </div>
                        </div>
                        {method !== 'solana_pay' ? (
                            <Button onClick={handlePayment} className="w-full bg-brand-accent text-brand-dark">Confirm Purchase</Button>
                        ) : (
                             <Suspense fallback={<div className="text-center p-4"><i className="fas fa-spinner fa-spin text-2xl"></i></div>}>
                                <SolanaPayWidget 
                                    amount={props.payAmount}
                                    currency={props.currency}
                                    hotAmount={totalToReceive}
                                    onSuccess={handleSolanaPaySuccess}
                                />
                             </Suspense>
                        )}
                    </div>
                );
            case 'processing':
                return <div className="text-center p-8"><i className="fas fa-spinner fa-spin text-4xl text-brand-accent"></i><p className="mt-4">Processing Transaction...</p></div>;
            case 'success':
                 return (
                    <div className="text-center p-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-4xl"><i className="fa-solid fa-check"></i></div>
                        <h3 className="text-2xl font-bold">Success!</h3>
                        <p className="text-gray-500 mt-2">Your purchase of {totalToReceive.toLocaleString()} HOT is complete.</p>
                        <Button onClick={props.onClose} className="w-full mt-6 bg-brand-accent text-brand-dark">Done</Button>
                    </div>
                );
            case 'error':
                 return (
                    <div className="text-center p-8">
                         <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-4xl"><i className="fa-solid fa-times"></i></div>
                        <h3 className="text-2xl font-bold">Transaction Failed</h3>
                        <p className="text-gray-500 mt-2 bg-gray-100 dark:bg-brand-dark-lighter p-2 rounded-lg text-xs">{errorMessage}</p>
                        <Button onClick={() => setStep('select_method')} className="w-full mt-6 bg-brand-accent text-brand-dark">Try Again</Button>
                    </div>
                );
        }
    };
    
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} title="Confirm Purchase">
            <div className="text-center">
                {renderContent()}
            </div>
        </Modal>
    );
};

export default CheckoutModal;
