import { lazy } from 'react';

// Lazy load all documentation components
const Instructions = lazy(() => import('./Instructions'));
const Claiming = lazy(() => import('./Claiming'));
const PaymentMethods = lazy(() => import('./PaymentMethods'));
const SupportedWallets = lazy(() => import('./SupportedWallets'));
const Security = lazy(() => import('./Security'));
const Roadmap = lazy(() => import('./Roadmap'));
const TokenSales = lazy(() => import('./TokenSales'));
const Distributions = lazy(() => import('./Distributions'));
const Affiliate = lazy(() => import('./Affiliate'));
const Faucet = lazy(() => import('./Faucet'));

export const docSections = {
  'instructions': { title: 'Getting Started', component: Instructions, icon: 'fa-solid fa-rocket' },
  'token-sales': { title: 'Token Sales', component: TokenSales, icon: 'fa-solid fa-coins' },
  'distributions': { title: 'Distributions', component: Distributions, icon: 'fa-solid fa-chart-pie' },
  'payment-methods': { title: 'Payment Methods', component: PaymentMethods, icon: 'fa-solid fa-credit-card' },
  'supported-wallets': { title: 'Supported Wallets', component: SupportedWallets, icon: 'fa-solid fa-wallet' },
  'claiming': { title: 'Claiming Tokens', component: Claiming, icon: 'fa-solid fa-hand-holding-dollar' },
  'affiliate': { title: 'Affiliate Program', component: Affiliate, icon: 'fa-solid fa-users' },
  'faucet': { title: 'Devnet Faucet', component: Faucet, icon: 'fa-solid fa-faucet-drip' },
  'security': { title: 'Security', component: Security, icon: 'fa-solid fa-shield-halved' },
  'roadmap': { title: 'Roadmap', component: Roadmap, icon: 'fa-solid fa-map-signs' },
};

export type DocKey = keyof typeof docSections;