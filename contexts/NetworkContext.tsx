
import React, { createContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { SolanaNetwork, NetworkConfig } from '../types';
import { NETWORKS, DEFAULT_NETWORK } from '../configs/network-config';

interface INetworkContext {
    network: SolanaNetwork;
    setNetwork: (network: SolanaNetwork) => void;
    config: NetworkConfig;
}

export const NetworkContext = createContext<INetworkContext | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [network, setNetwork] = useState<SolanaNetwork>(() => {
        const savedNetwork = localStorage.getItem('solanaNetwork') as SolanaNetwork;
        return NETWORKS[savedNetwork] ? savedNetwork : DEFAULT_NETWORK;
    });

    useEffect(() => {
        localStorage.setItem('solanaNetwork', network);
    }, [network]);

    const config = useMemo(() => NETWORKS[network], [network]);

    const value = useMemo(() => ({
        network,
        setNetwork,
        config,
    }), [network, config]);

    return (
        <NetworkContext.Provider value={value}>
            {children}
        </NetworkContext.Provider>
    );
};
