// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VestaLink is ERC20, Ownable, AutomationCompatibleInterface {
    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 startTime;
        uint256 duration;
        bool active;
    }

    mapping(address => VestingSchedule) public vestings;
    AggregatorV3Interface internal priceFeed;

    constructor(address _priceFeed) ERC20("VestaLink Token", "VLT") Ownable(msg.sender) {
        priceFeed = AggregatorV3Interface(_priceFeed);
        _mint(msg.sender, 1_000_000 * 10**decimals()); // initial supply
    }

    function createVesting(
        address beneficiary,
        uint256 amount,
        uint256 duration
    ) external onlyOwner {
        require(balanceOf(msg.sender) >= amount, "Insufficient tokens");
        vestings[beneficiary] = VestingSchedule(
            amount,
            0,
            block.timestamp,
            duration,
            true
        );
        _transfer(msg.sender, address(this), amount);
    }

    // Chainlink Automation will call this periodically
    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory) {
        // Example condition: release if price > threshold
        (, int price,,,) = priceFeed.latestRoundData();
        upkeepNeeded = price > 2000e8; // e.g., ETH > $2000
        return (upkeepNeeded, "");
    }

    function performUpkeep(bytes calldata) external override {
        // Release vested tokens if condition met
        for (uint i = 0; i < 1; i++) { // simplify for demo
            address beneficiary = msg.sender; // placeholder
            VestingSchedule storage vest = vestings[beneficiary];
            if (vest.active) {
                uint256 releasable = (vest.totalAmount * (block.timestamp - vest.startTime)) / vest.duration;
                uint256 amountToRelease = releasable - vest.releasedAmount;
                if (amountToRelease > 0) {
                    vest.releasedAmount += amountToRelease;
                    _transfer(address(this), beneficiary, amountToRelease);
                }
            }
        }
    }
}