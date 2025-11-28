
import React from 'react';

// Assuming wallet logos are now stored as assets
const walletIcons = {
  Phantom: '/assets/wallets/phantom.png',
  Solflare: '/assets/wallets/solflare.png',
  Sollet: '/assets/wallets/sollet.png',
  Backpack: '/assets/wallets/backpack.png',
  Ledger: '/assets/wallets/ledger.png',
  Base: '/assets/wallets/base.png',
};

type WalletName = keyof typeof walletIcons;

export const getWalletIcon = (name: WalletName): string => {
    return walletIcons[name] || walletIcons.Sollet;
};