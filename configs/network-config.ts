
import { SolanaNetwork, NetworkConfig } from '../types';

// --- CONFIGURATION ---
// Set the default network for the application.
// 'mainnet' for production, 'devnet' or 'localnet' for development.
export const DEFAULT_NETWORK: SolanaNetwork = 'devnet';
// --------------------


export const NETWORKS: Record<SolanaNetwork, NetworkConfig> = {
  mainnet: {
    cluster: 'mainnet',
    label: 'Mainnet',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://solscan.io',
    programId: 'Hot111111111111111111111111111111111111111',
    hotTokenMint: 'EbDPyHifxX45CS6PA9msSM7utJa1DiHsDWp5zP6htf11',
    usdcTokenMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyB7uH0',
    treasuryAddress: 'HotNet11111111111111111111111111111111111111',
    faucetEnabled: false,
  },
  devnet: {
    cluster: 'devnet',
    label: 'Devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    explorerUrl: 'https://solscan.io',
    programId: 'HoTDeVneTPReSaLE11111111111111111111111111',
    hotTokenMint: 'HotTokEN1111111111111111111111111111111111',
    usdcTokenMint: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
    treasuryAddress: 'DevTreasury11111111111111111111111111111111',
    faucetEnabled: true,
  },
  localnet: {
    cluster: 'localnet',
    label: 'Localnet',
    rpcUrl: 'http://127.0.0.1:8899',
    explorerUrl: 'https://explorer.solana.com',
    programId: 'Hot111111111111111111111111111111111111111',
    hotTokenMint: 'HOTLocaLMINT111111111111111111111111111111',
    usdcTokenMint: 'TestUSDC11111111111111111111111111111111',
    treasuryAddress: 'TestTreasury111111111111111111111111111111',
    faucetEnabled: true,
  },
};
