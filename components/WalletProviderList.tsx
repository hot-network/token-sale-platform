import React, { useState } from 'react';
import WalletButton from './WalletButton';
import { getWalletIcon, WalletName } from './WalletIcons';
import { WalletProvider } from '../types/wallets';

interface WalletProviderListProps {
  onConnect: (provider: WalletProvider) => void;
  onEmailLogin: () => void;
}

const WALLETS: { name: WalletName; provider: WalletProvider }[] = [
  { name: 'Phantom', provider: 'phantom' },
  { name: 'Solflare', provider: 'solflare' },
  { name: 'Backpack', provider: 'backpack' },
  { name: 'Ledger', provider: 'ledger' },
  { name: 'Sollet', provider: 'sollet' },
];


const WalletProviderList: React.FC<WalletProviderListProps> = ({ onConnect, onEmailLogin }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedWallets = showAll ? WALLETS : WALLETS.slice(0, 5);

  return (
    <div className="space-y-3">
      <button
        onClick={onEmailLogin}
        className="flex items-center w-full p-4 bg-gray-100 dark:bg-brand-dark-lighter rounded-lg text-left hover:bg-gray-200 dark:hover:bg-brand-dark-light transition-colors duration-200"
      >
        <div className="w-10 h-10 flex items-center justify-center text-brand-accent text-2xl"><i className="fa-solid fa-envelope"></i></div>
        <div className="ml-4">
          <span className="font-semibold text-lg text-gray-900 dark:text-white">Continue with Email</span>
        </div>
      </button>

      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-brand-dark-light px-2 text-sm text-gray-500">or</span>
        </div>
      </div>

      <div className="space-y-3">
        {displayedWallets.map(wallet => (
          <WalletButton
            key={wallet.provider}
            name={wallet.name}
            icon={getWalletIcon(wallet.name)}
            onClick={() => onConnect(wallet.provider)}
          />
        ))}
      </div>

      {WALLETS.length > 5 && (
        <div className="text-center pt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-semibold text-brand-accent-dark dark:text-brand-accent hover:underline focus:outline-none"
          >
            {showAll ? 'Show Less' : `Show ${WALLETS.length - 5} More`}
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletProviderList;