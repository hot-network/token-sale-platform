
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Team', 'Vesting Period (Months)': 24, 'Cliff (Months)': 12 },
  { name: 'Advisors', 'Vesting Period (Months)': 18, 'Cliff (Months)': 6 },
  { name: 'Ecosystem', 'Vesting Period (Months)': 36, 'Cliff (Months)': 0 },
];

const VestingScheduleChart: React.FC = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const textColor = isDarkMode ? "#9ca3af" : "#6b7280";
  const tooltipBg = isDarkMode ? "rgba(17, 17, 17, 0.7)" : "rgba(255, 255, 255, 0.7)";
  const tooltipBorder = isDarkMode ? "#2a2a2a" : "#e5e7eb";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" stroke={textColor} width={70} tickLine={false} axisLine={false} />
        <Tooltip
           contentStyle={{
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            borderRadius: '0.75rem',
            backdropFilter: 'blur(8px)',
          }}
          labelStyle={{ color: textColor, fontWeight: 'bold' }}
        />
        <Legend wrapperStyle={{fontSize: '12px', color: textColor, paddingTop: '10px'}} />
        <Bar dataKey="Cliff (Months)" stackId="a" fill="#8C7F79" radius={[5, 0, 0, 5]} />
        <Bar dataKey="Vesting Period (Months)" stackId="a" fill="#D0BFB4" radius={[0, 5, 5, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VestingScheduleChart;
