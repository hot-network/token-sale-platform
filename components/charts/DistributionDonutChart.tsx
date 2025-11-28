
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
  { name: 'Presale', value: 40 },
  { name: 'Liquidity', value: 25 },
  { name: 'Team & Advisors', value: 15 },
  { name: 'Ecosystem Fund', value: 15 },
  { name: 'Marketing', value: 5 },
];

const COLORS = ['#D0BFB4', '#A6988D', '#8C7F79', '#726762', '#584F4C'];

const DistributionDonutChart: React.FC = () => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    innerRadius={50}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(30, 30, 30, 0.8)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '0.5rem', 
                        border: '1px solid #2a2a2a'
                    }}
                    itemStyle={{ color: '#E5E5E5' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default DistributionDonutChart;
