# VestaLink

Convergence | A Chainlink Hackathon

A blockchain-based vesting and upkeep system powered by Hardhat.  

This project demonstrates secure token vesting schedules, automated upkeep conditions, and integration with Chainlink-style price feeds.

---

## Highlights
- **Tests:** 8 passing  
- **Coverage:** ~78% statements, 75% branches  
- **Gas:** `createVesting` ~145k, `performUpkeep` ~53k avg  
- **Deployment:** Local Hardhat node (addresses below)

---

## Chainlink Integration
This project uses Chainlink services to simulate real‑world workflows:

- [contracts/VestaLink.sol](contracts/VestaLink.sol) — implements vesting logic with **Chainlink upkeep checks**  
- [contracts/MockV3Aggregator.sol](contracts/MockV3Aggregator.sol) — simulates **Chainlink price feeds** for testing  
- [scripts/deploy.ts](scripts/deploy.ts) — deploys contracts including Chainlink components

-> This project demonstrates a Chainlink CRE Workflow by integrating Ethereum smart contracts with external price feed data (via MockV3Aggregator) and upkeep automation, showcasing a reproducible workflow that can be simulated locally or deployed on the CRE network.

---

## Features
- ERC-20 token with initial supply.
- Vesting schedules that lock tokens for beneficiaries.
- Automated upkeep logic to release vested tokens when conditions are met.
- Integration with a mock price feed (`MockV3Aggregator`).
- Comprehensive test suite with coverage and gas efficiency analysis.

---

## Setup

Clone the repository and install dependencies:

git clone <https://github.com/Taniya027/VestaLink>
cd VestaLink
npm install
npx hardhat compile

---

## Running Tests

Run the full test suite:
npx hardhat test

-Test Results
[Test Results](docs/test.png)

## Coverage
Generate coverage reports:
npx hardhat coverage

-Coverage Summary
[Coverage Report](docs/coverage.png)

## Gas Report
Gas usage analysis is enabled via hardhat-gas-reporter.
Run tests to generate the gas report:
npx hardhat test

-Gas Report
[Gas Report](docs/gas-report.png)

## Deployment
Contracts were deployed locally using Hardhat.
- Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
- MockV3Aggregator: 0x5FbDB2315678afecb367f032d93F642f64180aa3
- VestaLink: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

- Deployment
[Deployment](docs/deployment.png)

---

## Project Structure
contracts/        # Solidity contracts
test/             # Test files (TypeScript/JavaScript)
scripts/          # Deployment and interaction scripts
docs/             # Screenshots (coverage, gas, tests, deployment)

---

## Proof of Work
This repository includes:
- Clean commit history.
- Passing tests with coverage.
- Gas efficiency analysis.
- Deployment proof with addresses.
- Screenshots for transparency.

---

## Challenges
During development, I ran into several challenges:
- Resolving strict Hardhat + TypeScript configuration errors  
- Handling dependency conflicts and plugin version mismatches  
- Balancing rapid iteration with polished documentation and screenshots for recruiter/judge visibility

## Demo
A 3–5 minute public demo video showcasing the workflow execution (via CLI and contract interaction) is available here:  
**[https://www.loom.com/share/0df587410e3d4d52a5e523ada3c9cb7e]**

The demo covers:
- Running tests (`npx hardhat test`)  
- Deploying contracts (`npx hardhat run scripts/deploy.ts --network localhost`)  
- Showing deployment addresses and Chainlink integration  
- Highlighting screenshots for coverage, gas report, and deployment proof

---

## License
MIT License

---
