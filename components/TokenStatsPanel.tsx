import React from 'react';
import TokenSaleChart from './TokenSaleChart';
import { BirdeyeMarketData } from '../types';

interface TokenStatsPanelProps {
  hotPriceUSD: number;
  userHOTBalance: number;
  totalSold: number;
  marketStats: BirdeyeMarketData | null;
  hardcap: number;
}

const StatItem: React.FC<{ icon: string; label: string; value: string; children?: React.ReactNode }> = ({ icon, label, value, children }) => (
    <div className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-brand-dark-lighter/50 transition-colors">
        <div className="flex items-start gap-4">
            <div className="w-8 h-8 flex items-center justify-center text-brand-accent bg-brand-accent/10 rounded-lg">
                <i className={`fa-solid ${icon}`}></i>
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
        {children}
    </div>
);

const TokenStatsPanel: React.FC<TokenStatsPanelProps> = ({
  hotPriceUSD,
  userHOTBalance,
  totalSold,
  marketStats,
  hardcap,
}) => {
  const totalRaised = totalSold * hotPriceUSD;
  const raisedPercent = hardcap > 0 ? Math.min(100, (totalSold / hardcap) * 100) : 0;

  const formatCurrency = (value: number, decimals = 0) => `$${value.toLocaleString('en-US', { maximumFractionDigits: decimals })}`;
  const formatNumber = (value: number) => value.toLocaleString('en-US');

  return (
    <div className="p-4 sm:p-6">
      <div className="w-full h-56 md:h-64 mb-6 min-h-[224px]">
        <TokenSaleChart price={hotPriceUSD} userBalance={userHOTBalance} />
      </div>
      <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="px-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Market Data {marketStats ? <span className="text-green-500">(Live)</span> : <span className="text-yellow-500">(Unavailable)</span>}</p>
        </div>
        <StatItem icon="fa-dollar-sign" label="Market Cap" value={marketStats ? formatCurrency(marketStats.marketCap) : '---'} />
        <StatItem icon="fa-chart-line" label="24h Volume" value={marketStats ? formatCurrency(marketStats.volume24h) : '---'} />
        <StatItem icon="fa-users" label="Holders" value={marketStats ? formatNumber(marketStats.holders) + '+' : '---'} />
        <div className="px-3 pt-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Presale Stats</p>
        </div>
        <StatItem icon="fa-coins" label="Total Raised" value={formatCurrency(totalRaised)}>
            <div className="w-24 mt-1">
                <div className="w-full bg-gray-200 dark:bg-brand-dark-lighter rounded-full h-2">
                    <div className="bg-brand-accent h-2 rounded-full" style={{ width: `${raisedPercent}%` }}></div>
                </div>
                <p className="text-xs text-right text-gray-500 mt-1">{raisedPercent.toFixed(1)}%</p>
            </div>
        </StatItem>
      </div>
    </div>
  );
};

export default TokenStatsPanel;