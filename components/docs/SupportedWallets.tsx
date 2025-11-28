
import React from 'react';
import WalletButton from '../WalletButton';
import { getWalletIcon } from '../WalletIcons';

const SupportedWallets: React.FC = () => {
    return (
        <div>
            <h1 className="font-serif text-3xl font-bold mb-4">Supported Wallets</h1>
            <p className="lead">To interact with the HOT token presale on the Solana blockchain, you need a self-custodial wallet that supports the SPL token standard. We recommend the following wallets for the best experience.</p>
            
            <hr className="my-6" />

            <div className="space-y-4">
                <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer" className="block">
                    <WalletButton name="Phantom" icon={getWalletIcon('Phantom')} onClick={() => {}} />
                </a>
                <a href="https://solflare.com/" target="_blank" rel="noopener noreferrer" className="block">
                    <WalletButton name="Solflare" icon={getWalletIcon('Solflare')} onClick={() => {}} />
                </a>
                <a href="https://www.sollet.io/" target="_blank" rel="noopener noreferrer" className="block">
                    <WalletButton name="Sollet" icon={getWalletIcon('Sollet')} onClick={() => {}} />
                </a>
            </div>

            <h2 className="text-2xl font-semibold mt-8 mb-3">Why Do I Need a Special Wallet?</h2>
            <p>Unlike centralized exchanges (like Coinbase or Binance), a self-custodial wallet gives you full control over your private keys and your assets. This is essential for interacting with decentralized applications (dApps) like our token sale platform.</p>
            <p className="mt-2">These wallets typically come as browser extensions or mobile apps and allow you to securely sign transactions without exposing your sensitive information.</p>
            
             <div className="mt-6 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-700 dark:text-red-400">
                <p className="font-bold">Security Reminder:</p>
                <p>Never share your wallet's private key or seed phrase with anyone. Our team will never ask you for this information. Keep it safe and offline.</p>
            </div>
        </div>
    );
};

export default SupportedWallets;
