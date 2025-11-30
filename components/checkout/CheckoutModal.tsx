
import React, { useState, lazy, Suspense } from 'react';
import Modal from '../modals/Modal';
import Button from '../Button';
import AssetIcon from '../AssetIcons';
import useTokenSalesContext from '../../hooks/useTokenSalesContext';
import { PaymentMethod, CheckoutStep } from '../../types/checkout';

const PaymentMethodSelector = lazy(() => import('./PaymentMethodSelector'));
const SolanaPayWidget = lazy(() => import('./SolanaPayWidget'));
const OnRampWidget = lazy(() => import('./OnRampWidget'));
const PaymentSuccess = lazy(() => import('./PaymentSuccess'));

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotAmount: number;
  payAmount: number;
  usdValue: number;
  currency: 'SOL' | 'USDC';
  bonusMultiplier: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = (props) => {
    const { transactions } = useTokenSalesContext();
    const [step, setStep] = useState<CheckoutStep>('select_method');
    const [method, setMethod] = useState<PaymentMethod>('wallet');
    const [errorMessage, setErrorMessage] = useState('');
    const [transactionId, setTransactionId] = useState<string | undefined>();

    const totalToReceive = props.hotAmount * props.bonusMultiplier;

    const handleWalletPayment = async () => {
        setStep('processing');
        const result = await transactions.buyPresaleTokens(totalToReceive, props.currency);
        if (result) {
            setTransactionId(result.id);
            setStep('success');
        } else {
            setErrorMessage(transactions.error || "Transaction failed or was rejected.");
            setStep('error');
        }
    };
    
    const handleSuccess = (txId?: string) => {
        setTransactionId(txId);
        setStep('success');
    };
    
    const handleFailure = (error: string) => {
        setErrorMessage(error);
        setStep('error');
    };

    const renderContent = () => {
        switch (step) {
            case 'select_method':
                return (
                    <div>
                        <div className="text-center mb-6 p-4 bg-gray-100 dark:bg-brand-dark-lighter rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">You will receive ~</p>
                            <p className="text-3xl font-bold my-1 text-brand-accent-dark dark:text-brand-accent flex items-center justify-center gap-2">
                                <AssetIcon asset="HOT" className="w-7 h-7" /> {totalToReceive.toLocaleString(undefined, {maximumFractionDigits: 0})} HOT
                            </p>
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                for {props.payAmount.toFixed(4)} {props.currency} (~${props.usdValue.toFixed(2)})
                            </p>
                        </div>
                        
                        <Suspense fallback={<div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />}>
                           <PaymentMethodSelector selectedMethod={method} onSelectMethod={setMethod} />
                        </Suspense>
                        
                        <div className="mt-6">
                            {method === 'wallet' && (
                                <Button onClick={handleWalletPayment} className="w-full bg-brand-accent text-brand-dark">Confirm with Wallet</Button>
                            )}
                            {method === 'solana_pay' && (
                                <Suspense fallback={<div className="text-center p-4"><i className="fas fa-spinner fa-spin text-2xl"></i></div>}>
                                    <SolanaPayWidget 
                                        amount={props.payAmount}
                                        currency={props.currency}
                                        hotAmount={totalToReceive}
                                        onSuccess={handleSuccess}
                                    />
                                </Suspense>
                            )}
                            {method === 'card' && (
                                 <Suspense fallback={<div className="text-center p-4"><i className="fas fa-spinner fa-spin text-2xl"></i></div>}>
                                    <OnRampWidget 
                                        hotAmount={totalToReceive}
                                        usdAmount={props.usdValue}
                                        onSuccess={handleSuccess}
                                        onFailure={handleFailure}
                                    />
                                 </Suspense>
                            )}
                        </div>
                    </div>
                );
            case 'processing':
                return <div className="text-center p-8 min-h-[300px] flex flex-col justify-center"><i className="fas fa-spinner fa-spin text-4xl text-brand-accent"></i><p className="mt-4">Processing Transaction...</p><p className="text-sm text-gray-500 mt-2">Please approve in your wallet if prompted.</p></div>;
            case 'success':
                 return (
                    <Suspense fallback={<div className="min-h-[300px]" />}>
                        <PaymentSuccess 
                            hotAmount={totalToReceive}
                            onDone={props.onClose}
                            transactionId={transactionId}
                        />
                    </Suspense>
                );
            case 'error':
                 return (
                    <div className="text-center p-8 min-h-[300px] flex flex-col justify-center">
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
            {renderContent()}
        </Modal>
    );
};

export default CheckoutModal;