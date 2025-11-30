import React, { useState, lazy } from 'react';
import Button from '../Button';
import useTokenSalesContext from '../../hooks/useTokenSalesContext';

const AnimatedCreditCard = lazy(() => import('./AnimatedCreditCard'));

interface OnRampWidgetProps {
    hotAmount: number;
    usdAmount: number;
    onSuccess: (transactionId: string) => void;
    onFailure: (error: string) => void;
}

const OnRampWidget: React.FC<OnRampWidgetProps> = ({ hotAmount, usdAmount, onSuccess, onFailure }) => {
    const { transactions } = useTokenSalesContext();
    const [isFlipped, setIsFlipped] = useState(false);
    const [cardState, setCardState] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Basic input formatting
        if (name === 'number') {
            setCardState(s => ({ ...s, [name]: value.replace(/\D/g, '').slice(0, 16) }));
        } else if (name === 'expiry') {
            setCardState(s => ({ ...s, [name]: value.replace(/\D/g, '').slice(0, 4) }));
        } else if (name === 'cvv') {
             setCardState(s => ({ ...s, [name]: value.replace(/\D/g, '').slice(0, 3) }));
        } else {
             setCardState(s => ({ ...s, [name]: value.slice(0, 50) }));
        }
    };
    
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.name === 'cvv') {
            setIsFlipped(true);
        } else {
            setIsFlipped(false);
        }
    };

    const handlePayment = async () => {
        const result = await transactions.buyWithCard(hotAmount);
        if (result) {
            onSuccess(result.id);
        } else {
            onFailure(transactions.error || 'Card payment failed.');
        }
    };
    
    const isFormValid = cardState.number.length === 16 && cardState.name.length > 2 && cardState.expiry.length === 4 && cardState.cvv.length === 3;

    return (
        <div className="w-full max-w-lg mx-auto">
            <React.Suspense fallback={<div className="h-56 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />}>
                <AnimatedCreditCard
                    isFlipped={isFlipped}
                    cardNumber={cardState.number}
                    cardName={cardState.name}
                    cardExpiry={cardState.expiry}
                    cardCvv={cardState.cvv}
                />
            </React.Suspense>
            
            <div className="mt-6 space-y-4">
                <div>
                    <label htmlFor="card-number" className="text-xs font-semibold text-gray-500">Card Number</label>
                    <input id="card-number" name="number" type="text" value={cardState.number} onChange={handleChange} onFocus={handleFocus} className="w-full p-3 mt-1 bg-gray-100 dark:bg-brand-dark rounded-lg border border-gray-300 dark:border-gray-600" placeholder="0000 0000 0000 0000" />
                </div>
                 <div>
                    <label htmlFor="card-name" className="text-xs font-semibold text-gray-500">Card Holder Name</label>
                    <input id="card-name" name="name" type="text" value={cardState.name} onChange={handleChange} onFocus={handleFocus} className="w-full p-3 mt-1 bg-gray-100 dark:bg-brand-dark rounded-lg border border-gray-300 dark:border-gray-600" placeholder="John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="card-expiry" className="text-xs font-semibold text-gray-500">Expiry (MMYY)</label>
                        <input id="card-expiry" name="expiry" type="text" value={cardState.expiry} onChange={handleChange} onFocus={handleFocus} className="w-full p-3 mt-1 bg-gray-100 dark:bg-brand-dark rounded-lg border border-gray-300 dark:border-gray-600" placeholder="1228" />
                    </div>
                     <div>
                        <label htmlFor="card-cvv" className="text-xs font-semibold text-gray-500">CVV</label>
                        <input id="card-cvv" name="cvv" type="text" value={cardState.cvv} onChange={handleChange} onFocus={handleFocus} className="w-full p-3 mt-1 bg-gray-100 dark:bg-brand-dark rounded-lg border border-gray-300 dark:border-gray-600" placeholder="123" />
                    </div>
                </div>
                <Button onClick={handlePayment} disabled={!isFormValid || transactions.status === 'processing'} className="w-full text-lg py-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30">
                    {transactions.status === 'processing' ? 'Processing...' : `Pay $${usdAmount.toFixed(2)}`}
                </Button>
            </div>
        </div>
    );
};

export default OnRampWidget;