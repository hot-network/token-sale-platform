
import React from 'react';

const Claiming: React.FC = () => {
    return (
        <div>
            <h1 className="font-serif text-3xl font-bold mb-4">Claiming Your Tokens</h1>
            <p className="lead">After the HOT token presale concludes, you will be able to claim your purchased tokens and have them transferred to your personal wallet. This process is straightforward and secured by our smart contract.</p>
            
            <hr className="my-6" />

            <h2 className="text-2xl font-semibold mb-3">When Can I Claim?</h2>
            <p>The claiming period begins as soon as the presale officially ends. The sale ends under one of two conditions:</p>
            <ul className="list-disc list-inside my-4 space-y-2">
                <li>The presale timer runs out.</li>
                <li>The hardcap for the sale is reached.</li>
            </ul>
            <p>Once the sale is over, the status on the main terminal will change to "Ended", and the claiming function will be enabled.</p>

            <h2 className="text-2xl font-semibold mt-6 mb-3">How to Claim</h2>
            <p>Follow these simple steps to claim your tokens:</p>
            <ol className="list-decimal list-inside my-4 space-y-2">
                <li><strong>Navigate to the Sale Panel:</strong> Return to the token sale page where you made your purchase.</li>
                <li><strong>Connect Your Wallet:</strong> Ensure you are connected with the same wallet you used to buy the tokens.</li>
                <li><strong>Click the Claim Button:</strong> The "Buy" form will be replaced with a "Claim Tokens" button. Click this button to initiate the process.</li>
                <li><strong>Approve the Transaction:</strong> Your wallet will prompt you to approve a transaction. This is a standard blockchain interaction that executes the token transfer. A small network fee (gas) in SOL will be required.</li>
                <li><strong>Receive Your Tokens:</strong> Once the transaction is confirmed on the Solana network, your purchased HOT tokens will be sent directly to your wallet address. You may need to add the HOT token address to your wallet to see them listed.</li>
            </ol>
            
             <div className="mt-6 p-4 bg-brand-accent/10 border-l-4 border-brand-accent text-brand-dark dark:text-gray-200">
                <p className="font-bold">Important Note:</p>
                <p>The claiming process is a one-time event per user. Once you have successfully claimed your tokens, the button will be disabled for your account.</p>
            </div>
        </div>
    );
};

export default Claiming;
