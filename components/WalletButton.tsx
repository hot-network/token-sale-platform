
import React from 'react';

interface WalletButtonProps {
    name: string;
    icon: string;
    onClick: () => void;
}

const WalletButton: React.FC<WalletButtonProps> = ({ name, icon, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center w-full p-4 bg-gray-100 dark:bg-brand-dark-lighter rounded-lg text-left hover:bg-gray-200 dark:hover:bg-brand-dark-light transition-colors duration-200"
    >
        <img src={icon} alt={`${name} logo`} className="w-10 h-10 mr-4 rounded-md" />
        <span className="font-semibold text-lg text-gray-900 dark:text-white">{name}</span>
    </button>
);

export default WalletButton;
