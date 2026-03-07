import "@nomiclabs/hardhat-ethers";
//import "@typechain/hardhat";
import "solidity-coverage";
import "hardhat-gas-reporter";

module.exports = {
  solidity: "0.8.28",
  gasReporter: {
    enabled: true,
    currency: "USD",
    showTimeSpent: true,
  },
};

const config = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v5",
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.SEPOLIA_PRIVATE_KEY ? [process.env.SEPOLIA_PRIVATE_KEY] : [],
    },
  },
};

export default config;