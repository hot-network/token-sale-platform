
import React from 'react';
import WalletButton from './WalletButton';
import { getWalletIcon } from './WalletIcons';
import { WalletProvider } from '../types/wallets';

interface WalletProviderListProps {
  onConnect: (provider: WalletProvider) => void;
  onEmailLogin: () => void;
}

const WalletProviderList: React.FC<WalletProviderListProps> = ({ onConnect, onEmailLogin }) => {
  return (
    <div className="space-y-4">
      <button
        onClick={onEmailLogin}
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
      <WalletButton name="Phantom" icon={getWalletIcon('Phantom')} onClick={() => onConnect('phantom')} />
      <WalletButton name="Solflare" icon={getWalletIcon('Solflare')} onClick={() => onConnect('solflare')} />
      <WalletButton name="Backpack" icon={getWalletIcon('Backpack')} onClick={() => onConnect('backpack')} />
      <WalletButton name="Ledger" icon={getWalletIcon('Ledger')} onClick={() => onConnect('ledger')} />
      <WalletButton name="Base" icon={getWalletIcon('Base')} onClick={() => onConnect('base')} />
      <WalletButton name="Sollet" icon={getWalletIcon('Sollet')} onClick={() => onConnect('sollet')} />
    </div>
  );
};

export default WalletProviderList;
