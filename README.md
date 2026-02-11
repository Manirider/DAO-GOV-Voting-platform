# Decentralized On-Chain Governance and Voting Platform

## One-Line Description
A full-stack, production-grade DAO governance system enabling secure, transparent, and democratic decision-making on the Ethereum blockchain.

## Overview
This project is a complete implementation of a decentralized autonomous organization (DAO) governance model. It allows token holders to manage proposals, delegate voting power, and participate in on-chain decision-making processes.

Blockchain governance is critical for ensuring that protocol changes and treasury management are handled transparently and without centralized control. This platform demonstrates a real-world use case for community-driven organizations, providing the infrastructure needed for fair and verifiable voting.

## Key Features
- **ERC20 Governance Token**: Standard ERC20 token with built-in checkpointing and delegation capabilities (ERC20Votes).
- **OpenZeppelin Governor Framework**: Leverages industry-standard, audited contracts for core governance logic.
- **Proposal Lifecycle Management**: Full support for creating, cancelling, queuing, and executing proposals.
- **Standard Voting**: Traditional one-token-one-vote mechanism.
- **Quadratic Voting**: Advanced voting mechanism where the cost of votes increases quadratically, giving minority voices more weight.
- **Snapshot-Based Voting Power**: Ensures voting power is calculated based on past block checkpoints to prevent flash loan attacks.
- **Quorum Enforcement**: Proposals require a minimum percentage of total supply participation to be valid.
- **Dark-Themed Dashboard**: A modern, responsive Next.js frontend with a polished dark theme using Tailwind CSS.
- **Wallet Connection**: Seamless integration with MetaMask and WalletConnect via Wagmi and Viem.
- **Real-Time Interface**: Live updates for proposal status and voting results.
- **Dockerized Setup**: Complete containerization for consistent development and deployment environments.

## Architecture Overview
The system is composed of three main layers:

1.  **Smart Contracts (Hardhat)**: Written in Solidity, these contracts manage the governance logic, token distribution, and time-locked execution of proposals. Hardhat is used for compilation, deployment, and testing.
2.  **Frontend (Next.js)**: A React-based web application that interacts with the deployed smart contracts. It provides a user-friendly interface for proposing and voting.
3.  **Blockchain Interaction**: The frontend communicates with the Ethereum network (or local Hardhat node) using JSON-RPC providers and the ethers/viem libraries.
4.  **Docker Environment**: Docker Compose orchestrates the local blockchain node, deployment scripts, and the frontend server, ensuring a reproducible environment.

## Tech Stack

### Backend
-   **Solidity**: Smart contract language.
-   **Hardhat**: Ethereum development environment.
-   **OpenZeppelin**: Secure smart contract library.

### Frontend
-   **Next.js**: React framework for production.
-   **Tailwind CSS**: Utility-first CSS framework.
-   **ethers.js / wagmi**: Blockchain interaction libraries.
-   **Recharts**: Data visualization library.

### DevOps
-   **Docker**: Containerization platform.
-   **docker-compose**: Multi-container orchestration.

## Folder Structure

```
.
├── contracts/               # Solidity smart contracts
│   ├── GovernanceToken.sol
│   ├── MyGovernor.sol
│   └── TimelockController.sol
├── frontend/                # Next.js frontend application
│   ├── app/                 # App router pages and layouts
│   ├── components/          # Reusable React components
│   ├── config/              # Wagmi and chain configuration
│   └── hooks/               # Custom hooks for contract interaction
├── scripts/                 # Deployment and seeding scripts
│   ├── deploy.js
│   └── seed.js
├── test/                    # Hardhat test suite
├── docker/                  # Dockerfiles for services
├── docker-compose.yml       # Docker services configuration
├── hardhat.config.js        # Hardhat configuration
└── README.md                # Project documentation
```

## Getting Started

### Local Development

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start the local blockchain node**:
    ```bash
    npx hardhat node
    ```

3.  **Deploy contracts (in a new terminal)**:
    ```bash
    npx hardhat run scripts/deploy.js --network localhost
    ```

4.  **Setup and run the frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

### Docker Setup

For a quick and consistent startup, use Docker Compose:

```bash
docker-compose up --build
```

This command will start the local node, deploy the contracts, and launch the frontend automatically.

## Environment Variables

Copy the `.env.example` file to `.env` in the root directory.

```bash
cp .env.example .env
```

The `.env` file should contain:
-   `SEPOLIA_RPC_URL`: RPC URL for the Sepolia testnet (optional for local dev).
-   `PRIVATE_KEY`: Private key for deployment (optional for local dev).
-   `ETHERSCAN_API_KEY`: API key for contract verification.

## Smart Contract Details

-   **GovernanceToken**: An ERC20 extension that supports voting and delegation. It snapshots balances to determine voting power at specific blocks.
-   **MyGovernor**: The core governance contract. It manages proposal states (Pending, Active, Defeated, Succeeded, Queued, Executed) and counting logic. It includes a custom override for Quadratic Voting.
-   **Timelock**: A controller that enforces a time delay between when a proposal passes and when it can be executed. This allows users to exit the protocol if they disagree with a decision.
-   **Voting Types**: The system supports standard voting (1 token = 1 vote) and Quadratic Voting (cost = votes squared).

## Quadratic Voting Explanation

Quadratic Voting (QV) is designed to address the issue where large token holders (whales) dominate decision-making. In a standard system, if you have 100 tokens, you have 100 votes. In a quadratic system, voting becomes "expensive."

If you want 10 votes, it costs you 100 tokens (10 squared). This means that while you can use more tokens to cast more votes, the marginal cost of each additional vote increases. This system encourages broader participation and allows smaller holders to have a meaningful impact by expressing the intensity of their preferences, rather than just their raw wealth.

## Testing

The project includes a comprehensive test suite written in JavaScript using Hardhat and Chai.

To run the tests:

```bash
npx hardhat test
```

The tests cover:
-   Token deployment and minting.
-   Delegation logic.
-   Proposal creation and state transitions.
-   Vote casting (both Standard and Quadratic).
-   Timelock execution.
-   Security checks (e.g., preventing unauthorized execution).

## Security Considerations

-   **Snapshot Voting**: Voting power is determined by a snapshot of token balances at the proposal's start block. This prevents users from flash-loaning tokens to manipulate votes.
-   **Proposal Threshold**: A minimum number of tokens is required to create a proposal, preventing spam.
-   **Quorum**: A proposal must reach a minimum participation threshold to be valid, ensuring decisions reflect community consensus.
-   **OpenZeppelin Usage**: The project relies heavily on audited OpenZeppelin contracts to minimize the risk of vulnerabilities in core logic.

## Screenshots

### Dashboard Overview
![Dashboard Overview](docs/assets/dashboard_polish.png)

### Proposal Details & Quadratic Voting
![Proposal Interface](docs/assets/dashboard_functional.png)

## Future Improvements

-   **Gas Optimization**: Implement further gas-saving techniques for contract interactions.
-   **AI-Based Governance Analytics**: Integrate AI tools to analyze proposal sentiment and impact.
-   **Testnet Deployment**: Deploy the system to public testnets like Sepolia or Goerli.
-   **Notification System**: Add email or push notifications for proposal updates.

## Author

**Manikanta Suryasai**

---

*This project is part of a portfolio demonstrating advanced blockchain development skills.*
