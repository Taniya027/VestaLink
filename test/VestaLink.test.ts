import { expect } from "chai";
import { ethers } from "hardhat";

describe("VestaLink", function () {
  let owner: any, beneficiary: any, mockFeed: any, vestalink: any;

  beforeEach(async function () {
    [owner, beneficiary] = await ethers.getSigners();

    // Deploy a mock price feed contract
    const MockFeed = await ethers.getContractFactory("MockV3Aggregator");
    mockFeed = await MockFeed.deploy(8, 2100e8); // decimals=8, price=2100
    await mockFeed.deployed();

    // Deploy VestaLink with mock feed
    const VestaLink = await ethers.getContractFactory("VestaLink");
    vestalink = await VestaLink.deploy(mockFeed.address);
    await vestalink.deployed();
  });

  it("Should deploy with initial supply", async function () {
    const balance = await vestalink.balanceOf(owner.address);
    const expectedSupply = ethers.utils.parseUnits("1000000", 18);
    expect(balance.eq(expectedSupply)).to.be.true;
  });

  it("Should create a vesting schedule and lock tokens", async function () {
    const amount = ethers.utils.parseUnits("1000", 18);
    await vestalink.createVesting(beneficiary.address, amount, 60 * 60 * 24 * 30);

    const vesting = await vestalink.vestings(beneficiary.address);
    expect(vesting.totalAmount.eq(amount)).to.be.true;
    expect(vesting.active).to.be.true;

    const contractBalance = await vestalink.balanceOf(vestalink.address);
    expect(contractBalance.eq(amount)).to.be.true;
  });

  it("Should release vested tokens when upkeep condition met", async function () {
    const amount = ethers.utils.parseUnits("1000", 18);
    await vestalink.createVesting(beneficiary.address, amount, 60); // 1 minute duration

    // Fast-forward time by 30 seconds
    await ethers.provider.send("evm_increaseTime", [30]);
    await ethers.provider.send("evm_mine", []);

    // Perform upkeep (price > 2000e8 in mock feed)
    await vestalink.connect(beneficiary).performUpkeep("0x");

    const vesting = await vestalink.vestings(beneficiary.address);
    expect(vesting.releasedAmount.gt(0)).to.be.true;

    const beneficiaryBalance = await vestalink.balanceOf(beneficiary.address);
    expect(beneficiaryBalance.gt(0)).to.be.true;
  });

  it("Should revert if owner tries to vest more than balance", async function () {
    const tooMuch = ethers.utils.parseUnits("2000000", 18); // more than supply
   
    try {
  await vestalink.createVesting(beneficiary.address, tooMuch, 60);
  expect.fail("Expected revert not received");
} catch (error: any) {
  expect(error.message).to.include("Insufficient tokens");
}
  });

  it("Should do nothing if upkeep called with no active vesting", async function () {
    await vestalink.connect(beneficiary).performUpkeep("0x");
    const balance = await vestalink.balanceOf(beneficiary.address);
    expect(balance.eq(0)).to.be.true;
  });

  it("Should release vested tokens when upkeep condition met", async function () {
  const amount = ethers.utils.parseUnits("1000", 18);
  await vestalink.createVesting(beneficiary.address, amount, 60); // 1 minute duration

  // Fast-forward time by 30 seconds
  await ethers.provider.send("evm_increaseTime", [30]);
  await ethers.provider.send("evm_mine", []);

  // Call upkeep
  await vestalink.connect(beneficiary).performUpkeep("0x");

  const vesting = await vestalink.vestings(beneficiary.address);
  expect(vesting.releasedAmount.gt(0)).to.be.true;

  const beneficiaryBalance = await vestalink.balanceOf(beneficiary.address);
  expect(beneficiaryBalance.gt(0)).to.be.true;
});

it("Should do nothing if upkeep called with no active vesting", async function () {
  await vestalink.connect(beneficiary).performUpkeep("0x");
  const balance = await vestalink.balanceOf(beneficiary.address);
  expect(balance.eq(0)).to.be.true;
});

it("Should revert if vesting amount exceeds balance", async function () {
  const tooMuch = ethers.utils.parseUnits("2000000", 18); // more than supply
  try {
    await vestalink.createVesting(beneficiary.address, tooMuch, 60);
    expect.fail("Expected revert not received");
  } catch (error: any) {
    expect(error.message).to.include("Insufficient tokens");
  }
});
});