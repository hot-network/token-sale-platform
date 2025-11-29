import React from 'react';
import { FAUCET_AMOUNTS } from '../../constants';

const Faucet: React.FC = () => {
    return (
        <div>
            <h1 className="font-serif text-3xl font-bold mb-4">Devnet Faucet</h1>
            <p className="lead">To facilitate testing and experimentation, our platform provides a faucet for devnet and localnet environments. This allows you to acquire free test tokens without any real-world cost.</p>
            
            <hr className="my-6" />

            <h2 className="text-2xl font-semibold mb-3">What is a Faucet?</h2>
            <p>In the context of blockchain development, a faucet is a tool that drips a small amount of testnet cryptocurrency to users for free. This is essential for developers and users to test applications without having to spend real money on a live network.</p>

            <h2 className="text-2xl font-semibold mt-6 mb-3">What You Get</h2>
            <p>Our faucet provides you with two types of tokens each time you use it:</p>
            <ul className="list-disc list-inside my-4 space-y-2">
                <li><strong>{FAUCET_AMOUNTS.HOT.toLocaleString()} HOT:</strong> Test tokens for our platform, allowing you to simulate buying, selling, and other interactions.</li>
                <li><strong>{FAUCET_AMOUNTS.SOL} SOL:</strong> A small amount of devnet SOL to cover transaction fees (gas) required to interact with the Solana network.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-3">How to Use the Faucet</h2>
            <p>You can access the faucet in two ways:</p>
             <ol className="list-decimal list-inside my-4 space-y-2">
                <li><strong>Dedicated Faucet Page:</strong> Navigate to the <a href="/faucet">/faucet</a> page for a simple, one-click experience.</li>
                <li><strong>Launchpad Terminal:</strong> While the presale is active on a devnet, a "Get Devnet HOT & SOL" button will be available directly within the sale terminal.</li>
            </ol>
            <p>To use the faucet, simply connect your wallet while on the Devnet or Localnet and click the button. The tokens will be "sent" to your wallet, and your balance will update shortly after.</p>
            
             <div className="mt-6 p-4 bg-yellow-500/10 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300">
                <p className="font-bold">Important Notes:</p>
                 <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>The faucet is only available on **Devnet** and **Localnet**. It is disabled on Mainnet.</li>
                    <li>There is a rate limit to prevent abuse. You can typically claim from the faucet once per hour.</li>
                    <li>These tokens have no real-world value and are for testing purposes only.</li>
                </ul>
            </div>
        </div>
    );
};

export default Faucet;