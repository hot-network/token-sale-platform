
import React, { Suspense, lazy } from 'react';
import useTokenSalesContext from '../hooks/useTokenSalesContext';
import CountdownDisplay from '../components/CountdownDisplay';

const Header = lazy(() => import('../components/Header'));
const Footer = lazy(() => import('../components/Footer'));
const SaleTerminal = lazy(() => import('../components/SaleTerminal'));
const AccessDeniedPanel = lazy(() => import('../components/AccessDeniedPanel'));

interface LaunchpadProps {
    toggleTheme: () => void;
    currentTheme: string;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value?: string; children?: React.ReactNode }> = ({ icon, label, value, children }) => (
    <div className="bg-brand-light/50 dark:bg-brand-dark-light/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 sm:p-6 text-left">
        <div className="flex items-start sm:items-center gap-4">
            <div className="text-brand-accent-dark dark:text-brand-accent text-2xl w-8 text-center flex-shrink-0">{icon}</div>
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
                {value && <p className="text-2xl font-bold font-serif text-gray-900 dark:text-white">{value}</p>}
            </div>
        </div>
        {children && <div className="mt-4">{children}</div>}
    </div>
);

const LaunchpadStats: React.FC = () => {
    const { sale, prices } = useTokenSalesContext();

    if (!sale.stage || sale.state === 'UPCOMING') return null;

    const totalRaised = sale.totalSold * prices.presaleHotPrice;
    const hardcapValue = sale.stage.hardcap * prices.presaleHotPrice;
    const progressPercent = hardcapValue > 0 ? (totalRaised / hardcapValue) * 100 : 0;

    const formatLargeUsd = (value: number): string => {
        if (value >= 1_000_000) {
            return `$${(value / 1_000_000).toFixed(2)}M`;
        }
        if (value >= 1_000) {
            return `$${(value / 1_000).toFixed(1)}k`;
        }
        return `$${value.toFixed(0)}`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <StatCard 
                icon={<i className="fa-solid fa-dollar-sign"></i>} 
                label="Total Raised" 
                value={formatLargeUsd(totalRaised)}
            >
                 <div className="w-full bg-gray-200/50 dark:bg-brand-dark-lighter/50 rounded-full h-2.5 mt-2">
                    <div className="bg-gradient-to-r from-brand-accent-dark to-brand-accent h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{progressPercent.toFixed(1)}%</span>
                    <span>Target: {formatLargeUsd(hardcapValue)}</span>
                </div>
            </StatCard>
            <StatCard 
                icon={<i className="fa-solid fa-users"></i>} 
                label="Contributors" 
                value={sale.totalContributors.toLocaleString()} 
            />
            <StatCard 
                icon={<i className="fa-solid fa-clock"></i>} 
                label={sale.state === 'ACTIVE' ? "Time Remaining" : "Sale Ended"}
            >
                {sale.state === 'ACTIVE' && <CountdownDisplay countdown={sale.countdown} />}
            </StatCard>
        </div>
    );
};


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
                        <p className="text-sm sm:text-base font-semibold tracking-widest uppercase text-gray-600 dark:text-gray-400 mb-2 animate-fadeIn">The Future of Decentralized Content</p>
                        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white drop-shadow-lg animate-fadeIn">
                        HOT Network Launchpad
                        </h1>
                        <p className="mt-6 max-w-lg md:max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 drop-shadow-md animate-fadeIn" style={{ animationDelay: '100ms' }}>
                        The premier launchpad for the HOT token. Participate in token sales, track contributions, and monitor live prices on our fully dynamic, mainnet-ready dashboard.
                        </p>
                        
                        <div className="max-w-5xl mx-auto mt-12">
                             <Suspense fallback={null}>
                                <LaunchpadStats />
                            </Suspense>
                            <section id="sale">
                                <Suspense fallback={
                                    <div className="h-[600px] w-full flex items-center justify-center bg-brand-light/50 dark:bg-brand-dark-light/50 rounded-2xl">
                                        <i className="fas fa-spinner fa-spin text-4xl text-brand-accent"></i>
                                    </div>
                                }>
                                    {renderTerminal()}
                                </Suspense>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Launchpad;