
import React from 'react';

const Instructions: React.FC = () => {
    return (
        <div>
            <h1 className="font-serif text-3xl font-bold mb-4">Getting Started</h1>
            <p className="lead">Welcome to the HOT Token presale! This guide will walk you through the simple process of participating in our token sale. Follow these steps to acquire your HOT tokens.</p>
            
            <hr className="my-6" />

            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-3 flex items-center gap-3"><span className="text-brand-accent font-bold">1.</span> Connect Your Wallet</h2>
                    <p>First, you need a Solana-compatible wallet. We support several popular options like Phantom, Solflare, and Sollet. Click the "Connect Wallet" button in the top-right corner of the page and approve the connection in your wallet extension.</p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-3 flex items-center gap-3"><span className="text-brand-accent font-bold">2.</span> Select Your Payment Method</h2>
                    <p>In the "Presale" tab of the terminal, you can choose to pay with either SOL or USDC. Use the toggle buttons in the "You Pay" section to select your preferred currency.</p>
                </div>
                
                <div>
                    <h2 className="text-2xl font-semibold mb-3 flex items-center gap-3"><span className="text-brand-accent font-bold">3.</span> Enter Contribution Amount</h2>
                    <p>You can either enter the amount of SOL/USDC you wish to spend, or the amount of HOT tokens you want to receive. The form will automatically calculate the corresponding amount in the other field based on the current exchange rates.</p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-3 flex items-center gap-3"><span className="text-brand-accent font-bold">4.</span> Confirm Your Purchase</h2>
                    <p>Once you are happy with the amount, click the "Buy HOT Now" button. Your wallet will prompt you to approve the transaction. After you approve, the transaction will be sent to the Solana network for confirmation.</p>
                </div>
                
                <div>
                    <h2 className="text-2xl font-semibold mb-3 flex items-center gap-3"><span className="text-brand-accent font-bold">5.</span> Check Your Balance</h2>
                    <p>After a successful transaction, your HOT token balance will be updated in the presale panel and reflected in the real-time chart. Note that these tokens are locked until the presale concludes.</p>
                </div>
                
                <div>
                    <h2 className="text-2xl font-semibold mb-3 flex items-center gap-3"><span className="text-brand-accent font-bold">6.</span> Claim Your Tokens</h2>
                    <p>Once the presale period ends, the "Claim Tokens" button will become active. You will need to sign another transaction to claim your purchased HOT tokens and transfer them to your wallet.</p>
                </div>
            </div>
        </div>
    );
};

export default Instructions;
