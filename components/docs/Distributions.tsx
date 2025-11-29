
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, Label } from 'recharts';

const data = [
  { name: 'Presale', value: 40 },
  { name: 'Liquidity', value: 25 },
  { name: 'Team & Advisors', value: 15 },
  { name: 'Ecosystem Fund', value: 15 },
  { name: 'Marketing', value: 5 },
];

const COLORS = ['#B3A184', '#E0C9A6', '#8C7F79', '#D9C5A8', '#6B5B4B'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="font-bold text-sm drop-shadow-md">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


const Distributions: React.FC = () => {
    return (
        <div>
            <h1 className="font-serif text-3xl font-bold mb-4">Token Distribution (Tokenomics)</h1>
            <p className="lead">A well-planned token distribution strategy is crucial for the long-term health and decentralization of the HOT Network. Our tokenomics are designed to foster growth, reward the community, and ensure the project's sustainability.</p>
            
            <hr className="my-6" />

            <h2 className="text-2xl font-semibold mb-3">Allocation Overview</h2>
            <p>The total supply of HOT tokens is allocated across several key areas to balance the needs of all stakeholders.</p>

            <div className="my-8 h-80 sm:h-96 w-full">
                 <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            innerRadius={80}
                            outerRadius={140}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                            nameKey="name"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={'none'} />
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
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <ul className="space-y-4">
                <li><strong>Presale (40%):</strong> Allocated for early supporters to raise initial funding and build a strong community base.</li>
                <li><strong>Liquidity (25%):</strong> Reserved for providing liquidity on decentralized exchanges (DEXs) like Raydium or Orca. This is crucial for a healthy and stable trading market post-launch. These funds are typically locked.</li>
                <li><strong>Team & Advisors (15%):</strong> For the core team and strategic advisors. These tokens are subject to a vesting schedule (e.g., a 1-year cliff followed by monthly releases over 24 months) to align their long-term interests with the project's success.</li>
                <li><strong>Ecosystem Fund (15%):</strong> Dedicated to fostering growth on the HOT Network. These funds will be used for creator grants, developer bounties, community incentives, and platform rewards.</li>
                <li><strong>Marketing (5%):</strong> To fund marketing campaigns, partnerships, and promotional activities to increase awareness and drive user adoption.</li>
            </ul>
        </div>
    );
};

export default Distributions;
