
import React, { useState } from 'react';
import useTokenSalesContext from '../hooks/useTokenSalesContext';
import { Order } from '../types/transactions';
import Button from './Button';

const OrderBook: React.FC<{ bids: Order[], asks: Order[] }> = ({ bids, asks }) => {
    const formatPrice = (price: number) => price.toFixed(8);
    const formatAmount = (amount: number) => (amount / 1000).toFixed(1) + 'k';

    const renderRows = (orders: Order[], isBid: boolean) => {
        const cumulativeOrders = orders.map((order, index) => {
            const cumulativeAmount = orders.slice(0, index + 1).reduce((sum, o) => sum + o.amount, 0);
            return { ...order, cumulativeAmount };
        });

        const maxCumulative = Math.max(...cumulativeOrders.map(o => o.cumulativeAmount), 0);
        
        return cumulativeOrders.map((order) => {
            const depth = maxCumulative > 0 ? (order.cumulativeAmount / maxCumulative) * 100 : 0;
            const bgClass = isBid ? 'bg-green-500/10' : 'bg-red-500/10';
            const gradientDirection = isBid ? 'to left' : 'to right';
            
            return (
                <tr key={order.id} className="relative hover:bg-gray-200/50 dark:hover:bg-brand-dark-lighter/50">
                    <td className={`absolute top-0 bottom-0 ${isBid ? 'right-0' : 'left-0'} ${bgClass} z-0`} style={{ width: `${depth}%` }}></td>
                    <td className={`px-2 py-1 text-xs z-10 ${isBid ? 'text-green-500' : 'text-red-500'}`}>{formatPrice(order.price)}</td>
                    <td className="px-2 py-1 text-xs text-right z-10">{formatAmount(order.amount)}</td>
                    <td className="px-2 py-1 text-xs text-right z-10">{formatAmount(order.cumulativeAmount)}</td>
                </tr>
            );
        });
    };

    return (
        <div className="h-64 overflow-y-auto">
            <table className="w-full table-fixed">
                <thead className="text-xs text-gray-500 dark:text-gray-400">
                    <tr>
                        <th className="font-medium px-2 py-1">Price (USD)</th>
                        <th className="font-medium px-2 py-1 text-right">Amount (HOT)</th>
                        <th className="font-medium px-2 py-1 text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {renderRows(asks.slice().reverse(), false)}
                </tbody>
                <tbody>
                     <tr>
                        <td colSpan={3} className="py-1 text-center font-bold text-lg border-y border-gray-300 dark:border-gray-600">
                           $0.00000195
                        </td>
                    </tr>
                </tbody>
                 <tbody>
                    {renderRows(bids, true)}
                </tbody>
            </table>
        </div>
    );
};


const OrderbookPanel: React.FC = () => {
    const { transactions, wallets, openWalletModal, addToast } = useTokenSalesContext();
    const { orderbook, isOrderbookLoading, userOrders, placeLimitOrder } = transactions;

    const [side, setSide] = useState<'buy' | 'sell'>('buy');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');

    const handlePlaceOrder = async () => {
        const priceNum = parseFloat(price);
        const amountNum = parseFloat(amount);
        if (isNaN(priceNum) || priceNum <= 0 || isNaN(amountNum) || amountNum <= 0) {
            addToast("Please enter a valid price and amount.", "error");
            return;
        }
        await placeLimitOrder(side, amountNum, priceNum);
        // Reset form on success
        if (transactions.status === 'success') {
            setPrice('');
            setAmount('');
        }
    };

    const renderSkeleton = () => (
        <div className="animate-pulse">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex justify-between my-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="p-4 sm:p-6 min-h-[460px] grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Orderbook */}
            <div className="bg-brand-light-dark/50 dark:bg-brand-dark-light/50 rounded-lg p-3">
                 <h3 className="text-sm font-bold mb-2">Order Book</h3>
                 {isOrderbookLoading ? renderSkeleton() : <OrderBook bids={orderbook.bids} asks={orderbook.asks} />}
            </div>
            {/* Right: Trading Form & User Orders */}
            <div className="space-y-4">
                <div className="bg-brand-light-dark/50 dark:bg-brand-dark-light/50 rounded-lg p-4">
                     <div className="grid grid-cols-2 gap-2 mb-4">
                         <Button onClick={() => setSide('buy')} className={`w-full ${side === 'buy' ? 'bg-green-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Buy</Button>
                         <Button onClick={() => setSide('sell')} className={`w-full ${side === 'sell' ? 'bg-red-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Sell</Button>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-gray-500">Price (USD)</label>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00000180" className="w-full mt-1 p-2 rounded-md bg-white dark:bg-brand-dark border border-gray-300 dark:border-gray-600"/>
                        </div>
                         <div>
                            <label className="text-xs font-medium text-gray-500">Amount (HOT)</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100,000" className="w-full mt-1 p-2 rounded-md bg-white dark:bg-brand-dark border border-gray-300 dark:border-gray-600"/>
                        </div>
                    </div>
                     {wallets.isConnected ? (
                        <Button onClick={handlePlaceOrder} disabled={transactions.status === 'processing'} className="w-full mt-4 bg-brand-accent text-brand-dark">
                            {transactions.status === 'processing' ? 'Placing Order...' : `Place ${side === 'buy' ? 'Buy' : 'Sell'} Order`}
                        </Button>
                     ) : (
                        <Button onClick={openWalletModal} className="w-full mt-4 bg-brand-accent text-brand-dark">Connect Wallet</Button>
                     )}
                </div>
                <div className="bg-brand-light-dark/50 dark:bg-brand-dark-light/50 rounded-lg p-3">
                     <h3 className="text-sm font-bold mb-2">My Open Orders</h3>
                     <div className="h-24 overflow-y-auto">
                        {userOrders.length === 0 ? (
                             <p className="text-xs text-gray-500 text-center pt-4">You have no open orders.</p>
                        ) : (
                            <table className="w-full table-fixed">
                                <tbody>
                                    {userOrders.map(order => (
                                         <tr key={order.id}>
                                            <td className={`px-1 py-0.5 text-xs font-bold ${order.side === 'buy' ? 'text-green-500' : 'text-red-500'}`}>{order.side.toUpperCase()}</td>
                                            <td className="px-1 py-0.5 text-xs text-right">{order.amount.toLocaleString()}</td>
                                            <td className="px-1 py-0.5 text-xs text-right">@{order.price.toFixed(8)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default OrderbookPanel;
