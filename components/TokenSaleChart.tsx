
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Area } from 'recharts';
import { localCacheGet, localCacheSet } from '../utils/cache';
import { useIsMobile } from '../utils/mobile';

interface TokenSaleChartProps {
  userBalance: number;
  price: number;
}

const MAX_HISTORY = 100;
const CACHE_KEY = 'chart_history';

const TokenSaleChart: React.FC<TokenSaleChartProps> = ({ price, userBalance }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const isMobile = useIsMobile();
  
  const [chartData, setChartData] = useState<{ name: number, price: number, balance: number }[]>(() => {
    return localCacheGet<any[]>(CACHE_KEY) || [];
  });

  useEffect(() => {
    const now = Date.now();
    const newDataPoint = {
      name: now,
      price,
      balance: userBalance,
    };

    setChartData(currentData => {
      const updatedData = [...currentData, newDataPoint];
      const slicedData = updatedData.slice(Math.max(updatedData.length - MAX_HISTORY, 0));
      localCacheSet(CACHE_KEY, slicedData);
      return slicedData;
    });
  }, [price, userBalance]); 


  const gridColor = isDarkMode ? "rgba(224, 201, 166, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const textColor = isDarkMode ? "#9ca3af" : "#6b7280";
  const tooltipBg = isDarkMode ? "rgba(17, 17, 17, 0.7)" : "rgba(255, 255, 255, 0.7)";
  const tooltipBorder = isDarkMode ? "#2a2a2a" : "#e5e7eb";


  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: isMobile ? 0 : 10, left: -20, bottom: 5 }}>
        <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E0C9A6" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#E0C9A6" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8C7F79" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#8C7F79" stopOpacity={0.05}/>
            </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="name" tick={false} axisLine={false} />
        <YAxis 
            yAxisId="left" 
            stroke="#B3A184"
            tick={{ fill: textColor, fontSize: 12 }}
            domain={['dataMin * 0.9999', 'dataMax * 1.0001']}
            tickFormatter={(value) => `$${Number(value).toFixed(7)}`}
            />
        {!isMobile && (
            <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#8C7F79"
                tick={{ fill: textColor, fontSize: 12 }}
                domain={[dataMin => (dataMin > 1000 ? dataMin - 1000: 0), dataMax => (dataMax + 1000)]}
                tickFormatter={(value) => `${(Number(value)/1000).toFixed(1)}k`}
                />
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            borderRadius: '0.75rem',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 12px -4px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
          labelStyle={{ color: textColor }}
          formatter={(value, name) => {
             if(name === 'price') return [`$${Number(value).toFixed(8)}`, 'HOT/USD'];
             if(name === 'balance') return [`${Number(value).toLocaleString()} HOT`, 'Your Balance'];
             return [value, name];
          }}
        />
        <Legend wrapperStyle={{fontSize: '12px', color: textColor}} />
        <Area yAxisId="left" type="monotone" dataKey="price" stroke="none" fill="url(#colorPrice)" animationDuration={1500} />
        {!isMobile && <Area yAxisId="right" type="monotone" dataKey="balance" stroke="none" fill="url(#colorBalance)" animationDuration={1500} />}
        <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="price" 
            name="HOT/USD"
            stroke="#B3A184" 
            strokeWidth={2.5} 
            dot={false}
            animationDuration={1500}
            style={{ filter: 'drop-shadow(0 2px 4px rgba(179, 161, 132, 0.5))' }}
            />
        {!isMobile && (
            <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="balance" 
                name="Your Balance"
                stroke="#8C7F79" 
                strokeWidth={2.5} 
                dot={false}
                animationDuration={1500}
                style={{ filter: 'drop-shadow(0 2px 4px rgba(140, 127, 121, 0.4))' }}
                />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TokenSaleChart;
