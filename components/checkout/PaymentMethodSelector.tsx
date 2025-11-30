import React from 'react';
import { PaymentMethod } from '../../types/checkout';

interface PaymentMethodSelectorProps {
    selectedMethod: PaymentMethod;
    onSelectMethod: (method: PaymentMethod) => void;
    disabledMethods?: PaymentMethod[];
}

const METHODS: { id: PaymentMethod; name: string; icon: string }[] = [
    { id: 'wallet', name: 'Connected Wallet', icon: 'fa-solid fa-wallet' },
    { id: 'solana_pay', name: 'Solana Pay QR', icon: 'fa-solid fa-qrcode' },
    { id: 'card', name: 'Credit/Debit Card', icon: 'fa-solid fa-credit-card' },
];

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ selectedMethod, onSelectMethod, disabledMethods = [] }) => {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 text-left">Select Payment Method</h3>
            {METHODS.map(method => (
                <button
                    key={method.id}
                    onClick={() => onSelectMethod(method.id)}
                    disabled={disabledMethods.includes(method.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-4
                        ${selectedMethod === method.id 
                            ? 'border-brand-accent bg-brand-accent/10 shadow-lg' 
                            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-brand-dark'}
                        ${disabledMethods.includes(method.id) 
                            ? 'opacity-50 cursor-not-allowed' 
                            : ''}
                    `}
                >
                    <i className={`${method.icon} w-6 text-center text-lg text-brand-accent-dark dark:text-brand-accent`}></i>
                    <span className="font-semibold">{method.name}</span>
                </button>
            ))}
        </div>
    );
};

export default PaymentMethodSelector;