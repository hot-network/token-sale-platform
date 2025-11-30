# **HOT Network — Project To‑Do List**

## **1. Architecture & Framework Migration**

### Check and Fix tokenomics and use https://hotnetwork.fun/tokenimics and updates

* [ ] Update Key Metrics & Tokenomics, configs


### **Framework Upgrade**

* [ ] Convert full project from **Vite + React** → **Next.js 16 (App Router)**
* [ ] Set up project structure (`/app`, `/components`, `/lib`, `/utils`, `/providers`)
* [ ] Enable SSR, RSC, and Edge-ready architecture
* [ ] Implement Layouts, Route Handlers, Metadata API

### **Solana Integration Migration**

* [ ] Move wallet adapters to Next.js Client Components
* [ ] Create `wallet-provider.tsx`
* [ ] Set up Solana RPC connection using Helius

---

## **2. UI / UX Improvements & Redesign**

### **Branding & Visual Work**

* [ ] Redesign full UI to match HOT Network branding
* [ ] Implement light/dark theme system
* [ ] Replace Tailwind CDN → Tailwind via PostCSS

### **Core Component Redesign**

* [ ] Navbar redesign
* [ ] Hero redesign
* [ ] Launchpad dashboard redesign
* [ ] Token sale progress UI
* [ ] Wallet modal customization
* [ ] Transaction success/error UI
* [ ] Footer redesign

### **UX Enhancements**

* [ ] Add skeleton/loading states
* [ ] Add real‑time metrics (price, liquidity, participants)
* [ ] Improve mobile responsiveness

---

## **3. Solana Program Development (Anchor)**

### **Core Program Features**

* [ ] Implement token sale program using Anchor
* [ ] Instructions:

  * [ ] Initialize Sale
  * [ ] Purchase Token
  * [ ] Claim Tokens
  * [ ] Close Sale
* [ ] PDA configuration
* [ ] Treasury management logic
* [ ] Vesting schedule (optional)

### **Testing**

* [ ] Localnet program testing
* [ ] Unit tests (Anchor)
* [ ] Integration tests with Helius
* [ ] Full token sale simulation

---

## **4. Blockchain APIs & Data Providers**

### **Hermes Price API**

* [ ] Replace Pyth with Hermes
* [ ] Fetch token price
* [ ] Implement polling/caching
* [ ] Display price in UI

### **Raydium Data Provider**

* [ ] Retrieve liquidity pool data
* [ ] Fetch live token pairs
* [ ] Track volume/liquidity statistics

### **Helius**

* [ ] Use Helius RPC instead of default RPC
* [ ] Transaction parsing integration
* [ ] Webhooks for purchases, wallet events

### **Supported Wallets**

* [ ] Phantom
* [ ] Solflare
* [ ] Coinbase
* [ ] Ledger
* [ ] Packback
* [ ] Torus

---

## **5. Database & Backend (Supabase)**

### **Schema & RLS Setup**

* [ ] Create schema
* [ ] Add RLS policies
* [ ] Add timestamp triggers

### **API & Services**

* [ ] Users API
* [ ] Newsletter API
* [ ] Transactions API
* [ ] Metrics API

### **Admin Dashboard**

* [ ] Sale metrics overview
* [ ] Wallet stats
* [ ] Funding totals
* [ ] CSV export

---

## **6. Deployment & Optimization**

* [ ] Deploy Next.js on Vercel (or Supabase Edge)
* [ ] Deploy Neon DB / Serverless, Schemas
* [ ] Deploy Anchor program to mainnet-beta
* [ ] Optimize with caching + RSC
* [ ] Add environment variable management

---

## **7. QA & Launch Readiness**

* [ ] End‑to‑end app testing
* [ ] Program + UI integration validation
* [ ] Security review
* [ ] Mainnet launch preparations
