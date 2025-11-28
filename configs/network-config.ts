
import { SolanaNetwork, NetworkConfig } from '../types';

// --- CONFIGURATION ---
// Set the default network for the application.
// 'mainnet-beta' for production, 'devnet' or 'testnet' for development.
export const DEFAULT_NETWORK: SolanaNetwork = 'mainnet-beta';
// --------------------


export const NETWORKS: Record<SolanaNetwork, NetworkConfig> = {
  'mainnet-beta': {
    label: 'Mainnet',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://solscan.io',
    hotTokenMint: 'EbDPyHifxX45CS6PA9msSM7utJa1DiHsDWp5zP6htf11',
    usdcTokenMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyB7uH0',
    treasuryAddress: 'HotNet11111111111111111111111111111111111111',
    faucetEnabled: false,
  },
  devnet: {
    label: 'Devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    explorerUrl: 'https://solscan.io',
    hotTokenMint: 'HotTokEN1111111111111111111111111111111111',
    usdcTokenMint: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
    treasuryAddress: 'DevTreasury11111111111111111111111111111111',
    faucetEnabled: true,
  },
  testnet: {
    label: 'Testnet',
    rpcUrl: 'https://api.testnet.solana.com',
    explorerUrl: 'https://solscan.io',
    hotTokenMint: 'TestHoT1111111111111111111111111111111111',
    usdcTokenMint: 'TestUSDC11111111111111111111111111111111',
    treasuryAddress: 'TestTreasury111111111111111111111111111111',
    faucetEnabled: true,
  },
};
