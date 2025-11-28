
import React from 'react';

const roadmapData = [
    {
        quarter: 'Q3 2024',
        title: 'Launch & Foundation',
        items: ['Successful completion of the HOT Token Presale', 'Smart contract audit and mainnet deployment', 'Initial DEX listing and liquidity provisioning'],
        status: 'completed'
    },
    {
        quarter: 'Q4 2024',
        title: 'Platform Alpha',
        items: ['Launch of the closed alpha for select creators', 'Integration of core content monetization features', 'Community building and partnership outreach'],
        status: 'in_progress'
    },
    {
        quarter: 'Q1 2025',
        title: 'Public Beta',
        items: ['Open public beta of the HOT Network platform', 'Introduction of HOT token staking and rewards', 'Expansion of supported content types'],
        status: 'upcoming'
    },
    {
        quarter: 'Q2 2025',
        title: 'Full Launch & Governance',
        items: ['Official V1 launch of the HOT Network', 'Implementation of decentralized governance via HOT token holders', 'Mobile app development begins'],
        status: 'upcoming'
    },
];

const statusStyles = {
    completed: {
        icon: 'fa-solid fa-check-circle',
        color: 'text-green-500',
        bar: 'bg-green-500',
    },
    in_progress: {
        icon: 'fa-solid fa-spinner fa-spin',
        color: 'text-blue-500',
        bar: 'bg-blue-500',
    },
    upcoming: {
        icon: 'fa-regular fa-circle',
        color: 'text-gray-400',
        bar: 'bg-gray-400',
    }
}


const Roadmap: React.FC = () => {
    return (
        <div>
            <h1 className="font-serif text-3xl font-bold mb-4">Project Roadmap</h1>
            <p className="lead">Our roadmap outlines the key milestones for the HOT Network. We are committed to a transparent and phased development approach to build a robust and feature-rich platform for creators and their communities.</p>
            
            <hr className="my-6" />

            <div className="relative border-l-2 border-gray-300 dark:border-gray-600 pl-8 py-4">
                {roadmapData.map((phase, index) => {
                    const styles = statusStyles[phase.status as keyof typeof statusStyles];
                    return (
                        <div key={index} className="mb-12 relative">
                             <div className={`absolute -left-[3.25rem] top-1 h-8 w-8 rounded-full bg-brand-light dark:bg-brand-dark-light flex items-center justify-center`}>
                                <i className={`${styles.icon} ${styles.color} text-2xl`}></i>
                            </div>
                            <div className="p-4 rounded-lg">
                                <p className="text-sm font-semibold text-brand-accent">{phase.quarter}</p>
                                <h2 className="text-2xl font-semibold mt-1 mb-2">{phase.title}</h2>
                                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                                    {phase.items.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Roadmap;
