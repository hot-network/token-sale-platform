export interface FaucetRequestPayload {
  walletAddress: string;
  // Fix: The network can be 'mainnet' from the client, so the type should allow it to be properly handled.
  network: 'mainnet' | 'devnet' | 'localnet';
}

export interface FaucetApiResponse {
  success: boolean;
  message: string;
  txSignature?: string; // Mock signature
}
