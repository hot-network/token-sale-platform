
import React from 'react';
import useNetwork from '../hooks/useNetwork';

const NetworkBadge: React.FC = () => {
  const { config } = useNetwork();

  const getBadgeClasses = () => {
    switch (config.cluster) {
      case "mainnet":
        return "bg-green-600 text-white";
      case "devnet":
        return "bg-yellow-500 text-black";
      case "localnet":
        return "bg-purple-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${getBadgeClasses()}`}>
      {config.label}
    </div>
  );
};

export default NetworkBadge;
