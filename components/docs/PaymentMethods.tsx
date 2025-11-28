
import React from 'react';
import AssetIcon from '../AssetIcons';

const PaymentMethods: React.FC = () => {
    return (
        <div>
            <h1 className="font-serif text-3xl font-bold mb-4">Payment Methods</h1>
            <p className="lead">To make participation as easy as possible, we accept the two most popular assets on the Solana network for purchasing HOT tokens: SOL and USDC.</p>
            
            <hr className="my-6" />

            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <AssetIcon asset="SOL" className="w-10 h-10 mt-1" />
                    <div>
                        <h2 className="text-2xl font-semibold">SOL (Solana)</h2>
                        <p>SOL is the native cryptocurrency of the Solana blockchain. It is used to pay for transaction fees (gas) and can be used directly to purchase HOT tokens during our presale. Ensure you have enough SOL in your wallet to cover both the purchase amount and the small network fee.</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                     <AssetIcon asset="USDC" className="w-10 h-10 mt-1" />
                    <div>
                        <h2 className="text-2xl font-semibold">USDC (USD Coin)</h2>
                        <p>USDC is a stablecoin pegged to the US Dollar, offering a stable value for your contribution. We accept the SPL (Solana Program Library) version of USDC. If you choose to pay with USDC, please remember that you will still need a small amount of SOL in your wallet to pay for the network transaction fees.</p>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mt-8 mb-3">How the Exchange Rate Works</h2>
            <p>The HOT token has a fixed price in USD during the presale. The amount of SOL you need to pay is calculated in real-time based on the current SOL/USD market price.</p>
            <p className="mt-2">Our purchase form is designed for your convenience:</p>
            <ul className="list-disc list-inside my-4 space-y-2">
                <li><strong>Enter HOT Amount:</strong> If you type the amount of HOT tokens you want, the form will instantly calculate the required SOL or USDC payment.</li>
                <li><strong>Enter Payment Amount:</strong> Alternatively, you can type the amount of SOL or USDC you wish to spend, and the form will show you how many HOT tokens you will receive.</li>
            </ul>
             <div className="mt-6 p-4 bg-brand-accent/10 border-l-4 border-brand-accent text-brand-dark dark:text-gray-200">
                <p className="font-bold">Real-Time Price Feeds:</p>
                <p>The SOL/USD price is updated dynamically to ensure you get a fair rate for your contribution at the moment of purchase.</p>
            </div>
        </div>
    );
};

export default PaymentMethods;
