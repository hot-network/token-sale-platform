import React from 'react';

const walletIcons = {
  Phantom: '/assets/wallets/phantom.svg',
  Solflare: '/assets/wallets/solflare.svg',
  Sollet: '/assets/wallets/sollet.png',
  Backpack: '/assets/wallets/backpack.png',
  Ledger: '/assets/wallets/ledger.png',
  Base: '/assets/wallets/base.png',
};

export type WalletName = keyof typeof walletIcons;

export const getWalletIcon = (name: WalletName): string => {
    return walletIcons[name] || walletIcons.Sollet;
};