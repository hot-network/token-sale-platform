
# HOT Token Sale Launchpad

This is a mainnet-ready presale launchpad for the HOT token, built as a modern, client-side web application using React and TypeScript. It features a real-time, interactive interface for token sales, complete with wallet integration simulation and AI-powered analysis.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Charting**: Recharts
- **AI Integration**: Google Gemini API for real-time sale analysis
- **Blockchain Interaction (Simulated)**: A client-side SDK that mimics interaction with a Solana Anchor smart contract using `@solana/web3.js` principles.

---

## Features

- **Real-Time Token Sale**: Participate in the presale with live updates on progress, pricing, and contributions.
- **Market Trading Simulation**: A dedicated trading panel is enabled post-presale for simulated buying and selling.
- **Dynamic Charting**: Live charts visualize token price and user balance history.
- **AI-Powered Audit**: An integrated Gemini-powered tool provides real-time, high-level analysis of the sale's health.
- **Wallet Integration**: A sleek, modal-based connection flow for popular Solana wallets and email-based login simulation.
- **Comprehensive Docs**: A full-featured, navigable documentation section explaining all aspects of the platform.
- **Responsive Design**: A seamless experience across desktop and mobile devices.

---

## Architecture: Direct On-Chain Transactions

This application simulates a true Web3 architecture where the client interacts directly with a Solana smart contract. This removes the need for a centralized backend for payment processing, enhancing security and decentralization.

### Core Components

1.  **Client-Side UI (React)**
    -   Connects to the user's Solana wallet (e.g., Phantom, Solflare) via a wallet adapter.
    -   Fetches real-time SOL and USDC balances.
    -   Constructs transactions based on user input.

2.  **Wallet Adapter**
    -   Prompts the user to sign and approve transactions securely within their wallet extension.
    -   Submits the signed transaction to the Solana network.

3.  **Solana Network (Simulated)**
    -   The application waits for the transaction to be processed and finalized by the network.
    -   It confirms the transaction's success by polling its signature.

4.  **Anchor SDK (Simulated via `lib/solana/anchor.ts`)**
    -   A client-side library that mimics the functions needed to interact with the presale smart contract.
    -   It includes logic for `buyTokensWithSol`, `buyTokensWithUsdc`, and handling the necessary data structures for the contract.

### Security & Trust

-   **Self-Custody**: Users never expose their private keys to the website. All transactions are signed within the security of their own wallet.
-   **Transparency**: Every transaction is a public record on the Solana blockchain, verifiable through explorers like Solscan using the provided transaction signature.
-   **Decentralization**: By interacting directly with the smart contract, the application removes central points of failure and control over user funds.

---

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- A code editor (e.g., VS Code)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd hot-token-launchpad
    ```

2.  **Dependencies:**
    This project uses dependencies managed via an `importmap` in `index.html`. No `npm install` is required for the frontend libraries.

3.  **Set up environment variables:**
    To use the AI Audit feature, you will need a Google Gemini API key. This is provided by the execution environment.

4.  **Run the application:**
    Serve the project's root directory using a local web server. A popular choice is the `serve` package:
    ```bash
    npx serve
    ```
    The application will be available at `http://localhost:3000` (or a similar address).