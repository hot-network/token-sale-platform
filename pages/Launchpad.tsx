
import React, { Suspense, lazy } from 'react';
import useTokenSalesContext from '../hooks/useTokenSalesContext';

const Header = lazy(() => import('../components/Header'));
const Footer = lazy(() => import('../components/Footer'));
const SaleTerminal = lazy(() => import('../components/SaleTerminal'));
const AccessDeniedPanel = lazy(() => import('../components/AccessDeniedPanel'));

interface LaunchpadProps {
    toggleTheme: () => void;
    currentTheme: string;
}

const Launchpad: React.FC<LaunchpadProps> = ({ toggleTheme, currentTheme }) => {
    const { eligibility, wallets } = useTokenSalesContext();

    const renderTerminal = () => {
        // Show terminal if not connected, it has its own "Connect Wallet" logic
        if (!wallets.isConnected) {
            return <SaleTerminal />;
        }

        if (eligibility.isLoading) {
            return (
                <div className="h-[600px] w-full max-w-5xl mx-auto flex items-center justify-center bg-brand-light/50 dark:bg-brand-dark-light/50 rounded-2xl">
                    <i className="fas fa-spinner fa-spin text-4xl text-brand-accent"></i>
                    <p className="ml-4 text-lg">Checking eligibility...</p>
                </div>
            );
        }

        if (!eligibility.isEligible) {
            return <AccessDeniedPanel reason={eligibility.reason || 'An unknown error occurred.'} />;
        }

        return <SaleTerminal />;
    };

    return (
        <div className="relative overflow-x-hidden">
            <Header toggleTheme={toggleTheme} currentTheme={currentTheme} />
            <main>
                <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 md:pt-48 md:pb-32 overflow-hidden">
                    <div className="absolute inset-0 bg-brand-background-light dark:bg-brand-background-dark z-0">
                      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent dark:from-brand-dark dark:via-transparent to-transparent opacity-50"></div>
                      <div 
                        className="absolute top-0 left-0 w-1/3 h-1/3 bg-brand-accent/20 rounded-full filter blur-3xl opacity-30 animate-pulse"
                        style={{ animationDuration: '10s' }}
                      ></div>
                      <div 
                        className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-brand-accent/10 rounded-full filter blur-3xl opacity-20 animate-pulse"
                        style={{ animationDuration: '15s', animationDelay: '3s' }}
                      ></div>
                    </div>
                    
                    <div className="relative z-10 container mx-auto text-center px-4">
                        <p className="text-sm sm:text-base font-semibold tracking-widest uppercase text-gray-600 dark:text-gray-400 mb-2">The Future of Decentralized Content</p>
                        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white drop-shadow-lg">
                        HOT Network Launchpad
                        </h1>
                        <p className="mt-6 max-w-lg md:max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 drop-shadow-md">
                        The premier launchpad for the HOT token. Participate in token sales, track contributions, and monitor live prices on our fully dynamic, mainnet-ready dashboard.
                        </p>
                        
                        <section id="sale" className="mt-12">
                            <Suspense fallback={
                                <div className="h-[600px] w-full max-w-5xl mx-auto flex items-center justify-center bg-brand-light/50 dark:bg-brand-dark-light/50 rounded-2xl">
                                    <i className="fas fa-spinner fa-spin text-4xl text-brand-accent"></i>
                                </div>
                            }>
                                {renderTerminal()}
                            </Suspense>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Launchpad;