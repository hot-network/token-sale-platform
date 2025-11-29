import React, { lazy } from 'react';
import useTokenSalesContext from '../hooks/useTokenSalesContext';

const Header = lazy(() => import('../components/Header'));
const Footer = lazy(() => import('../components/Footer'));
const Button = lazy(() => import('../components/Button'));

interface FaucetProps {
    toggleTheme: () => void;
    currentTheme: string;
}

const Faucet: React.FC<FaucetProps> = ({ toggleTheme, currentTheme }) => {
    const { addToast, networkConfig, wallets, openWalletModal, isDripping, dripFaucetTokens } = useTokenSalesContext();

    const isFaucetAvailable = networkConfig.faucetEnabled;

    const handleFaucet = async () => {
        if (isDripping) return;
        dripFaucetTokens();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header toggleTheme={toggleTheme} currentTheme={currentTheme} />
            <main className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
                <div className="max-w-md w-full bg-brand-light dark:bg-brand-dark-light border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-xl">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent text-4xl">
                        <i className="fa-solid fa-faucet-drip"></i>
                    </div>
                    <h1 className="text-3xl font-bold font-serif">Devnet Faucet</h1>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        Get some devnet tokens to test the application. This faucet will provide you with 10,000 HOT tokens and some SOL for gas fees.
                    </p>

                    {isFaucetAvailable ? (
                        <div className="mt-8">
                            {wallets.isConnected ? (
                                <Button onClick={handleFaucet} disabled={isDripping} className="w-full bg-brand-accent text-brand-dark">
                                    {isDripping ? 'Processing...' : 'Get 10,000 HOT'}
                                </Button>
                            ) : (
                                <Button onClick={openWalletModal} className="w-full bg-brand-accent text-brand-dark">
                                    Connect Wallet to Use Faucet
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="mt-8 p-4 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-lg">
                            <p className="font-bold">Faucet is Unavailable</p>
                            <p className="text-sm">The faucet is only available on Devnet or Localnet. Please switch your network.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Faucet;