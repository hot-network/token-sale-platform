
import React, { lazy, Suspense } from 'react';

const DistributionDonutChart = lazy(() => import('./charts/DistributionDonutChart'));
const VestingScheduleChart = lazy(() => import('./charts/VestingScheduleChart'));

const MetricCard: React.FC<{ title: string; value: string; description: string; icon: string }> = ({ title, value, description, icon }) => (
    <div className="bg-white dark:bg-brand-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 flex items-center justify-center text-brand-accent bg-brand-accent/10 rounded-lg">
                <i className={`fa-solid ${icon} text-xl`}></i>
            </div>
            <div>
                 <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</p>
                 <p className="text-2xl font-bold font-serif">{value}</p>
            </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode; footer: React.ReactNode }> = ({ title, children, footer }) => (
    <div className="bg-white dark:bg-brand-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div className="flex-grow h-48 sm:h-56">
             <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><i className="fas fa-spinner fa-spin text-2xl text-brand-accent"></i></div>}>
                {children}
            </Suspense>
        </div>
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
            {footer}
        </div>
    </div>
);

const TokenomicsHighlights: React.FC = () => {
    return (
        <section id="tokenomics" className="py-20 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-semibold font-serif">Key Metrics & Tokenomics</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                        A transparent overview of the HOT token's structure, designed for long-term growth and community value.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Sale Metrics */}
                    <div className="space-y-8 lg:col-span-1">
                        <MetricCard 
                            title="Presale Token Price" 
                            value="$0.0000018"
                            description="Fixed price for all presale participants, ensuring a fair entry point."
                            icon="fa-dollar-sign"
                        />
                         <MetricCard 
                            title="Total Token Supply" 
                            value="100 Billion HOT"
                            description="The maximum and total number of HOT tokens that will ever be created."
                            icon="fa-database"
                        />
                         <MetricCard 
                            title="Presale Hard Cap" 
                            value="~33.2M USD"
                            description="The maximum amount to be raised, concluding the sale once reached."
                            icon="fa-flag-checkered"
                        />
                    </div>
                    
                    {/* Charts */}
                    <ChartCard 
                        title="Token Distribution"
                        footer={
                             <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                <li><strong>40%</strong> Presale</li>
                                <li><strong>25%</strong> Liquidity</li>
                                <li><strong>30%</strong> Ecosystem & Team</li>
                                <li><strong>5%</strong> Marketing</li>
                            </ul>
                        }
                    >
                        <DistributionDonutChart />
                    </ChartCard>
                     <ChartCard 
                        title="Vesting Schedule"
                        footer={
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Team and advisor tokens are locked with linear vesting to ensure long-term project alignment.
                            </p>
                        }
                    >
                       <VestingScheduleChart />
                    </ChartCard>
                </div>
            </div>
        </section>
    );
};

export default TokenomicsHighlights;
