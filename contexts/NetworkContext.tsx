
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
        let savedNetwork = localStorage.getItem('solanaNetwork') as any;
        // Simple migration for users who have the old value stored
        if (savedNetwork === 'mainnet-beta') {
            savedNetwork = 'mainnet';
        }
        return NETWORKS[savedNetwork as SolanaNetwork] ? savedNetwork : DEFAULT_NETWORK;
    });

    useEffect(() => {
        localStorage.setItem('solanaNetwork', network);
    }, [network]);

    const baseConfig = useMemo(() => NETWORKS[network], [network]);

    const value = useMemo(() => {
        // For client-side consumers of this context, we override the rpcUrl to point to our proxy.
        // Server-side code (like the proxy itself) that imports NETWORKS directly will get the original URL.
        const clientConfig = {
            ...baseConfig,
            rpcUrl: `/api/rpc?network=${network}`
        };

        return {
            network,
            setNetwork,
            config: clientConfig,
        };
    }, [network, baseConfig]);

    return (
        <NetworkContext.Provider value={value}>
            {children}
        </NetworkContext.Provider>
    );
};
