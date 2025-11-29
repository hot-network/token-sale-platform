# On-Chain Programs (Smart Contracts)

This directory contains all the on-chain programs (smart contracts) for the HOT Network, built using the [Anchor framework](https://www.anchor-lang.com/) on Solana.

## Programs

-   `/hot-network-presale`: The core smart contract that governs the logic, funds, and execution of the HOT token presale.

### Note on Faucet Program

In a real-world project, a token faucet (especially for a devnet) would be its own on-chain program. This program would have the authority to mint new test tokens and would include logic to handle distribution rules, such as rate limiting per wallet address to prevent abuse. For this simulation, the faucet logic is handled by a centralized API endpoint for simplicity.

## Development Workflow

### Prerequisites

-   Rust toolchain
-   Solana CLI
-   Anchor CLI (`avm install latest`, `avm use latest`)

### Building the Program

To build a program and generate its IDL (Interface Definition Language), navigate to the program's directory and run:

```bash
# Example for the presale program
cd programs/hot-network-presale
anchor build
```

This command will compile the Rust code into a BPF-compatible binary and generate/update the program's IDL in the `target/idl/hot_network_presale.json` file. The IDL is crucial for client-side applications to interact with the contract in a type-safe way.

### Running Tests

Anchor provides a powerful testing environment using TypeScript, Mocha, and Chai. To run the integration tests for a program:

```bash
# From the project root
anchor test --program-name hot_network_presale
```

This will spin up a local Solana validator, deploy the contract, and run the test scripts located in the `tests/` directory (not included in this project scaffold).

### Deploying

Once built and tested, the program can be deployed to a Solana cluster (e.g., Devnet, Mainnet):

```bash
# Deploy to Devnet
anchor deploy --provider devnet

# Deploy to Mainnet
anchor deploy --provider mainnet
```