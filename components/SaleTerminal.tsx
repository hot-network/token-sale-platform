
import React, { useState, lazy, Suspense } from 'react';
import useTokenSalesContext from '../hooks/useTokenSalesContext';
import Button from './Button';
import TokenSalePanel from './TokenSalePanel';
import TradePanel from './TradePanel';
import FormattedAiResponse from './FormattedAiResponse';

const TokenStatsPanel = lazy(() => import('./TokenStatsPanel'));
const LiquidityPanel = lazy(() => import('./LiquidityPanel'));
const AffiliatePanel = lazy(() => import('./AffiliatePanel'));


const SaleTerminal: React.FC = () => {
    const { sale, user, transactions, prices, networkConfig, isListedOnDex, marketStats } = useTokenSalesContext();
    const [infoTab, setInfoTab] = useState<'chart' | 'ai'>('chart');
    const [mainTab, setMainTab] = useState<'presale' | 'trade' | 'liquidity' | 'affiliate'>('presale');

    const renderSuspenseFallback = () => (
        <div className="p-4 sm:p-6 min-h-[460px] flex flex-col items-center justify-center">
            <i className="fas fa-spinner fa-spin text-3xl text-brand-accent"></i>
        </div>
    );
    
    const terminalHeader = (
         <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/assets/hot.png" alt="HOT Token" className="w-10 h-10"/>
                    <div>
                        <p className="font-bold text-lg text-gray-900 dark:text-white">HOT Token</p>
                        <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold bg-brand-light-dark dark:bg-brand-dark-lighter text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">{networkConfig.label}</p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-serif text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                        {mainTab === 'presale' 
                            ? `$${prices.presaleHotPrice.toFixed(8)}`
                            : isListedOnDex && marketStats 
                                ? `$${marketStats.price.toFixed(8)}`
                                : '---' 
                        }
                    </p>
                    {isListedOnDex && marketStats && mainTab !== 'presale' && (
                        <div className={`text-sm font-bold ${marketStats.priceChange24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            <i className={`fas ${marketStats.priceChange24h > 0 ? 'fa-caret-up' : 'fa-caret-down'} mr-1`}></i>
                            {marketStats.priceChange24h.toFixed(2)}% (24h)
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
    
    const TabButton = ({ label, active, onClick, statusBadge }: { label: string; active: boolean; onClick: () => void, statusBadge?: React.ReactNode }) => (
        <button onClick={onClick} className={`relative w-full py-3 font-bold text-center transition-colors duration-300 ${active ? 'text-brand-accent' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-brand-dark/50'}`}>
            <div className="flex items-center justify-center gap-2">
                <span>{label}</span>
                {statusBadge}
            </div>
            {active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-accent"></span>}
        </button>
    );
    
    const presaleContent = <TokenSalePanel saleState={sale.state} stage={sale.stage} countdown={sale.countdown} totalSold={sale.totalSold} />;
    const tradeContent = <TradePanel />;
    const liquidityContent = <Suspense fallback={renderSuspenseFallback()}><LiquidityPanel /></Suspense>;
    const affiliateContent = <Suspense fallback={renderSuspenseFallback()}><AffiliatePanel /></Suspense>;


    const renderMainContent = () => {
        switch (mainTab) {
            case 'presale': return presaleContent;
            case 'trade': return tradeContent;
            case 'liquidity': return liquidityContent;
            case 'affiliate': return affiliateContent;
            default: return null;
        }
    };
    
    const chartContent = (
       <Suspense fallback={renderSuspenseFallback()}>
          <TokenStatsPanel
              hotPriceUSD={prices.presaleHotPrice}
              userHOTBalance={user?.hotBalance ?? 0}
              totalSold={sale.totalSold}
              marketStats={marketStats}
           />
       </Suspense>
    );
    
    const aiAuditContent = (
        <div className="p-4 sm:p-6 min-h-[460px] flex flex-col items-center justify-center">
            {transactions.isAuditing && <div className="text-center"><i className="fas fa-spinner fa-spin text-3xl text-brand-accent"></i><p className="mt-4 text-gray-500">Generating AI Analysis...</p></div>}
            {transactions.auditError && <p className="text-red-500">{transactions.auditError}</p>}
            {transactions.aiAuditResult && (
                <div className="w-full bg-brand-light-dark dark:bg-brand-dark-lighter rounded-lg p-4 max-h-[400px] overflow-y-auto">
                    <FormattedAiResponse text={transactions.aiAuditResult} />
                </div>
            )}
            <div className="mt-4">
                {!transactions.isAuditing && (
                     <Button onClick={transactions.runAiAudit} disabled={transactions.isAuditing}>
                        {transactions.aiAuditResult ? 'Re-Run AI Audit' : 'Run AI Audit'}
                     </Button>
                )}
            </div>
        </div>
    );

    const presaleStatusBadge = sale.state === 'ACTIVE' ? <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div><span className="text-green-500 text-xs font-bold">LIVE</span></div> : null;
    const tradeStatusBadge = isListedOnDex 
        ? <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div><span className="text-green-500 text-xs font-bold">LIVE</span></div>
        : <span className="text-xs font-bold bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">TBA</span>;

    return (
        <div className="max-w-5xl mx-auto bg-brand-light dark:bg-brand-dark-light border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl font-sans overflow-hidden">
            {terminalHeader}
            
            {/* Main Content Area */}
            <div>
                <div className="grid grid-cols-4 bg-brand-light-dark dark:bg-brand-dark-lighter">
                    <TabButton label="Presale" active={mainTab === 'presale'} onClick={() => setMainTab('presale')} statusBadge={presaleStatusBadge} />
                    <TabButton label="Trade" active={mainTab === 'trade'} onClick={() => setMainTab('trade')} statusBadge={tradeStatusBadge} />
                    <TabButton label="Liquidity" active={mainTab === 'liquidity'} onClick={() => setMainTab('liquidity')} />
                    <TabButton label="Affiliate" active={mainTab === 'affiliate'} onClick={() => setMainTab('affiliate')} />
                </div>
                <div>
                    {renderMainContent()}
                </div>
            </div>
            
            {/* Secondary Info Area */}
            <div className="border-t border-gray-200 dark:border-gray-700">
                 <div className="grid grid-cols-2 bg-brand-light-dark dark:bg-brand-dark-lighter">
                    <TabButton label="Chart & Stats" active={infoTab === 'chart'} onClick={() => setInfoTab('chart')} />
                    <TabButton label="AI Audit" active={infoTab === 'ai'} onClick={() => setInfoTab('ai')} />
                </div>
                <div>
                    {infoTab === 'chart' ? chartContent : aiAuditContent}
                </div>
            </div>
        </div>
    );
};

export default SaleTerminal;