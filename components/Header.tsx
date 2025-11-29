
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import useTokenSalesContext from '../hooks/useTokenSalesContext';
import Button from './Button';
import useNetwork from '../hooks/useNetwork';
import { NETWORKS } from '../configs/network-config';
import { SolanaNetwork } from '../types';
import NetworkBadge from './NetworkBadge';


interface HeaderProps {
    toggleTheme: () => void;
    currentTheme: string;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, currentTheme }) => {
  const { wallets, user, openWalletModal } = useTokenSalesContext();
  const { network, setNetwork, config: networkConfig } = useNetwork();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleConnectClick = () => {
    if (wallets.isConnected && wallets.adapter) {
        wallets.disconnect();
    } else {
        openWalletModal();
    }
  }
  
  useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const truncateAddress = (address: string) => `${address.slice(0, 4)}...${address.slice(-4)}`;

  const navLinks = (
    <>
        <a href="/" onClick={() => setIsMenuOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-brand-accent-dark dark:hover:text-brand-accent transition-colors">Home</a>
        <a href="/#features" onClick={() => setIsMenuOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-brand-accent-dark dark:hover:text-brand-accent transition-colors">Features</a>
        <a href="/#tokenomics" onClick={() => setIsMenuOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-brand-accent-dark dark:hover:text-brand-accent transition-colors">Tokenomics</a>
        <a href="/#faq" onClick={() => setIsMenuOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-brand-accent-dark dark:hover:text-brand-accent transition-colors">FAQ</a>
        <a href="/docs" onClick={() => setIsMenuOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-brand-accent-dark dark:hover:text-brand-accent transition-colors">Docs</a>
        {networkConfig.faucetEnabled && (
            <a href="/faucet" onClick={() => setIsMenuOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-brand-accent-dark dark:hover:text-brand-accent transition-colors">Faucet</a>
        )}
    </>
  );

  return (
      <header className={`sticky top-0 z-50 py-4 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'bg-brand-light dark:bg-brand-dark shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="hidden sm:block">
                <NetworkBadge />
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold">
            {navLinks}
          </nav>
          <div className="flex items-center space-x-2 sm:space-x-4">
             <div className="hidden sm:flex items-center space-x-2">
                 <select 
                    value={network} 
                    onChange={(e) => setNetwork(e.target.value as SolanaNetwork)}
                    className="bg-brand-light-dark dark:bg-brand-dark-light border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm font-semibold focus:ring-2 focus:ring-brand-accent-dark focus:border-brand-accent-dark appearance-none"
                    aria-label="Select Network"
                >
                    {Object.entries(NETWORKS).map(([key, value]) => (
                    <option key={key} value={key} className="dark:bg-brand-dark-lighter">{value.label}</option>
                    ))}
                </select>
                <a href="/launchpad">
                    <Button 
                        variant="primary"
                        className="py-2.5 text-sm"
                    >
                        Launch App
                    </Button>
                </a>
                <Button 
                    onClick={handleConnectClick} 
                    variant={wallets.isConnected ? 'connected' : 'secondary'}
                    className="py-2.5 text-sm"
                >
                    {wallets.isConnecting ? 'Connecting...' : wallets.isConnected && user.address ? truncateAddress(user.address) : 'Connect'}
                </Button>
             </div>
             <button 
                onClick={toggleTheme} 
                className="h-10 w-10 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-brand-dark-light transition-colors"
                aria-label={currentTheme === 'dark' ? 'Activate light mode' : 'Activate dark mode'}
             >
                {currentTheme === 'dark' ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
            </button>
            <div className="md:hidden">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    className="h-10 w-10 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-brand-dark-light transition-colors"
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                >
                    <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
            <div className="md:hidden mt-4 bg-brand-light dark:bg-brand-dark-light rounded-lg shadow-xl p-4 animate-fadeIn">
                <nav className="flex flex-col space-y-4 text-center">
                    {navLinks}
                     <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                         <select 
                            value={network} 
                            onChange={(e) => setNetwork(e.target.value as SolanaNetwork)}
                            className="w-full bg-brand-light-dark dark:bg-brand-dark-lighter border border-gray-300 dark:border-gray-700 rounded-md p-2 text-sm font-semibold"
                        >
                            {Object.entries(NETWORKS).map(([key, value]) => (
                            <option key={key} value={key}>{value.label}</option>
                            ))}
                        </select>
                    </div>
                     <a href="/launchpad">
                        <Button 
                            variant="primary"
                            className="w-full text-sm"
                        >
                           Launch App
                        </Button>
                    </a>
                    <Button 
                        onClick={handleConnectClick} 
                        variant={wallets.isConnected ? 'connected' : 'secondary'}
                        className="w-full text-sm"
                    >
                        {wallets.isConnecting ? 'Connecting...' : wallets.isConnected && user.address ? truncateAddress(user.address) : 'Connect Wallet'}
                    </Button>
                     <div className="flex justify-center pt-2">
                        <NetworkBadge />
                    </div>
                </nav>
            </div>
        )}
      </header>
  );
};

export default Header;