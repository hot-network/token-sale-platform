
import React from 'react';
import useNetwork from '../hooks/useNetwork';
import { useLiquidityPoolsData } from '../hooks/use-liquidity-pools-data';
import { LiquidityPool } from '../types/pools';

const PoolRow: React.FC<{ pool: LiquidityPool }> = ({ pool }) => {
    const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    return (
        <div className="grid grid-cols-5 items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-dark-lighter/50 transition-colors">
            <div className="col-span-2 flex items-center gap-3">
                <img src={pool.dex.logoUrl} alt={pool.dex.name} className="w-8 h-8 rounded-full" />
                <div>
                    <p className="font-bold">{pool.pair.base}/{pool.pair.quote}</p>
                    <p className="text-xs text-gray-500">{pool.dex.name}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold">{formatCurrency(pool.tvlUSD)}</p>
            </div>
            <div className="text-right">
                <p className="font-semibold">{formatCurrency(pool.volume24hUSD)}</p>
            </div>
            <div className="text-right">
                <p className="font-semibold text-green-500">{pool.apy.toFixed(2)}%</p>
            </div>
        </div>
    );
};


const LiquidityPanel: React.FC = () => {
    const { network } = useNetwork();
    const { pools, isLoading, error } = useLiquidityPoolsData(network);

    if (isLoading) {
        return (
            <div className="text-center py-8 px-4 flex flex-col items-center justify-center min-h-[460px]">
                <i className="fas fa-spinner fa-spin text-3xl text-brand-accent"></i>
                <p className="mt-4 text-gray-500">Loading Liquidity Pools...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="text-center py-8 px-4 flex flex-col items-center justify-center min-h-[460px]">
                <i className="fas fa-exclamation-triangle text-3xl text-red-500"></i>
                <p className="mt-4 text-red-500">{error}</p>
            </div>
        );
    }

    if (pools.length === 0) {
        return (
             <div className="text-center py-8 px-4 flex flex-col items-center justify-center min-h-[460px]">
                <i className="fa-solid fa-water text-4xl text-brand-accent mb-4"></i>
                <h3 className="text-2xl font-bold mb-4 font-serif">No Liquidity Pools Found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">There are currently no active HOT liquidity pools on {network}.</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 min-h-[460px]">
            <div className="space-y-2">
                <div className="grid grid-cols-5 gap-4 px-3 pb-2 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                    <div className="col-span-2">Pool</div>
                    <div className="text-right">TVL</div>
                    <div className="text-right">Volume (24h)</div>
                    <div className="text-right">APY</div>
                </div>
                <div className="max-h-[380px] overflow-y-auto pr-2">
                    {pools.map(pool => <PoolRow key={pool.id} pool={pool} />)}
                </div>
            </div>
        </div>
    );
};

export default LiquidityPanel;
