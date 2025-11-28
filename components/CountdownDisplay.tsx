
import React from 'react';

interface CountdownDisplayProps {
    countdown: { days: number; hours: number; minutes: number; seconds: number };
}

const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ countdown }) => (
    <div className="grid grid-cols-4 gap-2 text-center">
        {Object.entries(countdown).map(([unit, value]) => (
            <div key={unit} className="bg-brand-light-dark dark:bg-brand-dark-lighter rounded-lg p-3">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{String(value).padStart(2, '0')}</p>
                <p className="text-xs uppercase text-gray-500 dark:text-gray-400">{unit}</p>
            </div>
        ))}
    </div>
);

export default CountdownDisplay;
