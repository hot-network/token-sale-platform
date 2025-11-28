
import React from 'react';
import Modal from './modals/Modal';
import WalletButton from './WalletButton';
import { getWalletIcon } from './WalletIcons';
import useTokenSalesContext from '../hooks/useTokenSalesContext';
import { WalletProvider } from '../types/wallets';

const WalletConnectModal: React.FC = () => {
  const { wallets, isWalletModalOpen, closeWalletModal } = useTokenSalesContext();

  const handleConnect = (walletProvider: WalletProvider) => {
    if (!walletProvider) return;
    wallets.connectWithAdapter(walletProvider);
    closeWalletModal();
  };

  const handleEmailLogin = () => {
    const email = prompt("Please enter your email to log in:");
    if (email) {
        wallets.connectWithEmail(email);
        closeWalletModal();
    }
  };
  
  return (
    <Modal isOpen={isWalletModalOpen} onClose={closeWalletModal} title="Connect a Wallet">
        <div className="space-y-4">
            <button
                onClick={handleEmailLogin}
                className="flex items-center w-full p-4 bg-gray-100 dark:bg-brand-dark-lighter rounded-lg text-left hover:bg-gray-200 dark:hover:bg-brand-dark-light transition-colors duration-200"
            >
                <div className="w-10 h-10 flex items-center justify-center text-brand-accent text-2xl"><i className="fa-solid fa-envelope"></i></div>
                <div className="ml-4">
                    <span className="font-semibold text-lg text-gray-900 dark:text-white">Continue with Email</span>
                </div>
            </button>
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white dark:bg-brand-dark-light px-2 text-sm text-gray-500">or</span>
                </div>
            </div>
            <WalletButton name="Phantom" icon={getWalletIcon('Phantom')} onClick={() => handleConnect('phantom')} />
            <WalletButton name="Solflare" icon={getWalletIcon('Solflare')} onClick={() => handleConnect('solflare')} />
            <WalletButton name="Backpack" icon={getWalletIcon('Backpack')} onClick={() => handleConnect('backpack')} />
            <WalletButton name="Ledger" icon={getWalletIcon('Ledger')} onClick={() => handleConnect('ledger')} />
            <WalletButton name="Base" icon={getWalletIcon('Base')} onClick={() => handleConnect('base')} />
            <WalletButton name="Sollet" icon={getWalletIcon('Sollet')} onClick={() => handleConnect('sollet')} />
        </div>
         <div className="mt-6 p-3 bg-red-500/10 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-xs">
            <p className="font-bold flex items-center gap-2">
                <i className="fa-solid fa-shield-halved"></i>
                Security Reminder
            </p>
            <p className="mt-1">HOT Network will <strong className="font-bold">NEVER</strong> ask for your seed phrase or private key.</p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
            By connecting a wallet, you agree to our Terms of Service and consent to its Privacy Policy.
        </p>
    </Modal>
  );
};

export default WalletConnectModal;