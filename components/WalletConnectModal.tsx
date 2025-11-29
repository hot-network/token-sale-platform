
import React from 'react';
import Modal from './modals/Modal';
import WalletProviderList from './WalletProviderList';
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
        <WalletProviderList onConnect={handleConnect} onEmailLogin={handleEmailLogin} />
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
