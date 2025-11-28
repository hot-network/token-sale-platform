
import { useState, useEffect, useRef } from 'react';
import { getTokenMarketData } from '../lib/solana/birdeye';
import { getSolPrice as getLiveSolPrice } from '../lib/solana/pyth';
import { logger } from '../services/logger';
import { BirdeyeMarketData, SolanaNetwork } from '../types';
import { NETWORKS } from '../configs/network-config';

const PRESALE_PRICE = 0.0000127;

export function useMarketPrices(network: SolanaNetwork, isListedOnDex: boolean) {
    const [presaleHotPrice, setPresaleHotPrice] = useState<number>(PRESALE_PRICE);
    const [marketHotPrice, setMarketHotPrice] = useState<number>(0);
    const [marketStats, setMarketStats] = useState<BirdeyeMarketData | null>(null);
    const [solPrice, setSolPrice] = useState<number>(0);
    const ws = useRef<number | null>(null);

    // Effect for fetching core and market prices
    useEffect(() => {
        const networkConfig = NETWORKS[network];

        const fetchCorePrices = async () => {
           if (network !== 'mainnet-beta') {
               setSolPrice(150.00); // Mock price for dev/test
               return;
           }
           try {
               setSolPrice(await getLiveSolPrice());
           } catch (error) {
               logger.error('[useMarketPrices]', "Failed to fetch SOL price.", error);
           }
       };

       const fetchMarketStats = async () => {
           if (!isListedOnDex || network !== 'mainnet-beta') {
               if (marketStats !== null) {
                   setMarketStats(null);
                   setMarketHotPrice(0);
               }
               return;
           }
           try {
               const hotMarketData = await getTokenMarketData(networkConfig.hotTokenMint);
               setMarketStats(hotMarketData);
               setMarketHotPrice(hotMarketData?.price ?? 0);
           } catch (error) {
               logger.error('[useMarketPrices]', "Failed to fetch HOT market stats.", error);
               setMarketStats(null);
               setMarketHotPrice(0);
           }
       };
       
       fetchCorePrices();
       fetchMarketStats();

       const interval = setInterval(() => {
           fetchCorePrices();
           fetchMarketStats();
       }, 30000); // Refresh every 30 seconds

       return () => clearInterval(interval);
   }, [isListedOnDex, network]);


    // Simulate WebSocket for presale HOT/USD price fluctuation
    useEffect(() => {
        ws.current = window.setInterval(() => {
            setPresaleHotPrice(p => p * (1 + (Math.random() - 0.5) * 0.0001));
        }, 2000);
        return () => { if (ws.current) window.clearInterval(ws.current); };
    }, []);

    return {
        presaleHotPrice,
        marketHotPrice,
        marketStats,
        solPrice,
    };
}