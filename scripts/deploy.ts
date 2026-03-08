import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy MockV3Aggregator
  const MockFeed = await ethers.getContractFactory("MockV3Aggregator");
  const mockFeed = await MockFeed.deploy(8, 2100e8); // decimals=8, price=2100
  await mockFeed.deployed();
  console.log("MockV3Aggregator deployed to:", mockFeed.address);

  // Deploy VestaLink
  const VestaLink = await ethers.getContractFactory("VestaLink");
  const vestalink = await VestaLink.deploy(mockFeed.address);
  await vestalink.deployed();
  console.log("VestaLink deployed to:", vestalink.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});