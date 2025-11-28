
import React from 'react';
import { STATIC_CURRENCY_INFO } from '../constants/currencies';

interface AssetIconProps {
    asset: keyof typeof STATIC_CURRENCY_INFO;
    className?: string;
}

const AssetIcon: React.FC<AssetIconProps> = ({ asset, className = 'w-6 h-6' }) => {
    const tokenInfo = STATIC_CURRENCY_INFO[asset];
    if (!tokenInfo) return null;
    return <img src={tokenInfo.logo} alt={`${tokenInfo.name} logo`} className={className} />;
};

export default AssetIcon;
