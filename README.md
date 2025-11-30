# HOT Token Sale Launchpad

This is a mainnet-ready presale launchpad for the HOT token, built as a modern, client-side web application using React and TypeScript. It features a real-time, interactive interface for token sales, complete with wallet integration simulation and AI-powered analysis, all backed by a serverless Neon database.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Vercel Edge Functions
- **Database**: Neon (Serverless Postgres)
- **Charting**: Recharts
- **AI Integration**: Google Gemini API for real-time sale analysis
- **Blockchain Interaction (Simulated)**: A client-side SDK that mimics interaction with a Solana Anchor smart contract.

---

## Features

- **Real-Time Token Sale**: Participate in the presale with live updates on progress, pricing, and contributions fetched from a live database.
- **PWA & Offline Support**: Install the app on your desktop or mobile device for a native-like experience. Offline capabilities ensure your transaction history is always available and allow you to queue transactions even without an internet connection.
- **Market Trading Simulation**: A dedicated trading panel is enabled post-presale for simulated buying and selling.
- **Devnet Faucet**: An API-driven faucet to drip devnet SOL and HOT tokens for testing purposes.
- **Dynamic Charting**: Live charts visualize token price and user balance history.
- **AI-Powered Audit**: An integrated Gemini-powered tool provides real-time, high-level analysis of the sale's health.
- **Wallet Integration**: A sleek, modal-based connection flow for popular Solana wallets and email-based login simulation.
- **Comprehensive Docs**: A full-featured, navigable documentation section explaining all aspects of the platform.
- **Responsive Design**: A seamless experience across desktop and mobile devices.

---

## Architecture: Hybrid On-Chain & Serverless DB

This application uses a hybrid architecture that combines the security of direct on-chain transactions with the reliability of a serverless database for state management.

1.  **Client-Side UI (React)**
    -   Connects to the user's Solana wallet (e.g., Phantom, Solflare).
    -   Constructs and simulates sending transactions for purchases or claims.

2.  **Wallet Adapter**
    -   Prompts the user to sign transactions securely within their wallet.

3.  **API Layer (Vercel Edge Functions)**
    -   After a client-side transaction simulation is successful, the client sends the transaction details to the API.
    -   The API connects to a **Neon DB** instance to securely record the transaction, update user contribution totals, and aggregate sale-wide metrics.
    -   It also provides endpoints for sale status (`/api/status`), AI analysis (`/api/audit`), and a devnet faucet (`/api/faucet`).
    -   Serves as the source of truth for all application state (sale progress, user history, etc.).

4.  **Neon Database (Serverless Postgres)**
    -   Persistently stores all critical data, such as user records, transaction history, and overall sale metrics.

### Security & Trust

-   **Self-Custody**: Users never expose their private keys to the website. All transactions are signed within the security of their own wallet.
-   **Verifiable State**: While the on-chain part is simulated, the backend database provides a persistent and reliable record of all sale activities.
-   **Scalability**: The serverless architecture ensures the application can handle high traffic loads during peak sale periods.

---

## Getting Started

### Prerequisites

-   Node.js (v22 or later)
-   A code editor (e.g., VS Code)
-   A Neon DB account and a project connection string.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd hot-token-launchpad
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the project root and add your Neon database connection string and Google Gemini API key.
    ```
    # .env
    DATABASE_URL="your_neon_db_connection_string"
    NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
    NEXT_PUBLIC_SOLANA_MAINNET_URL=https://api.mainnet-beta.solana.com
    NEXT_PUBLIC_SOLANA_DEVNET_URL=https://api.devnet.solana.com
    NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your-helius-api-key
    NEXT_PUBLIC_SOLANA_DEVNET_URL=https://api.devnet.solana.com
    NEXT_PUBLIC_HOT_TOKEN_MINT=EbDPyHifxX45CS6PA9msSM7utJa1DiHsDWp5zP6htf11
    NEXT_PUBLIC_REWARDS_POOL=
    NEXT_PUBLIC_PYTH_SOL_PRICE_FEED=H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG
    NEXT_PUBLIC_PYTH_HOT_PRICE_FEED=EbDPyHifxX45CS6PA9msSM7utJa1DiHsDWp5zP6htf11 (TBA)
    NEXT_PUBLIC_PYTH_USDC_PRICE_FEED=Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD
    NEXT_PUBLIC_JUPITER_API_URL=https://quote-api.jup.ag/v6
    API_KEY="your_google_gemini_api_key"
    ```
    
4.  **Set up the database schema:**
    Connect to your Neon database and run the SQL commands found in `scripts/schema.sql` to create the necessary tables.

5.  **Run the application:**
    Serve the project's root directory using a local web server that can handle SPA routing. A popular choice is `vite`.
    ```bash
    npx vite
    ```
    The application will be available at `http://localhost:5173` (or a similar address).
