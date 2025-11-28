
import { useState, useCallback, useMemo } from 'react';
import { ConnectionStatus, WalletProvider, WalletAdapter } from '../types/wallets';
import { loginWithEmail } from '../lib/solana/embedded-wallets';
import { BrowserWalletAdapter } from '../lib/solana/BrowserWalletAdapter';

export default function useWallets() {
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
    const [adapter, setAdapter] = useState<WalletAdapter | null>(null);

    const connectWithEmail = useCallback(async (email: string) => {
        setConnectionStatus('connecting');
        try {
            const embeddedAdapter = await loginWithEmail(email);
            setAdapter(embeddedAdapter);
            setConnectionStatus('connected');
        } catch (error) {
            console.error("Failed to connect with email:", error);
            setConnectionStatus('disconnected');
        }
    }, []);

    const connectWithAdapter = useCallback(async (provider: WalletProvider) => {
        if (provider === 'embedded') return; // Should use connectWithEmail
        setConnectionStatus('connecting');
        try {
            // In a real app, this would involve wallet-adapter libraries.
            // Here, we simulate creating a new adapter instance.
            const browserAdapter = new BrowserWalletAdapter(provider);
            await browserAdapter.connect();
            setAdapter(browserAdapter);
            setConnectionStatus('connected');
        } catch (error) {
            console.error(`Failed to connect with ${provider}:`, error);
            setConnectionStatus('disconnected');
        }
    }, []);

    const disconnect = useCallback(async () => {
        if (adapter) {
            await adapter.disconnect();
            setAdapter(null);
            setConnectionStatus('disconnected');
        }
    }, [adapter]);

    return useMemo(() => ({
        connectionStatus,
        isConnected: connectionStatus === 'connected',
        isConnecting: connectionStatus === 'connecting',
        adapter,
        connectWithEmail,
        connectWithAdapter,
        disconnect,
    }), [connectionStatus, adapter, connectWithEmail, connectWithAdapter, disconnect]);
}
