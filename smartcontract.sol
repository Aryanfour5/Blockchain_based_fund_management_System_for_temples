// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TempleDonationContract {
    address public owner;
    uint256 public totalDonations;
    uint256 public constant donationLimit = 5 ether; // Set donation limit to 5 ETH

    // Events for donation received and distribution
    event DonationReceived(address indexed donor, uint256 amount);
    event Distribution(address indexed recipient, uint256 amount);

    // Accounts for different purposes
    address payable[] public accounts = [
        payable(0xc5518430c1449569ECDC97701418a75813653e82),
        payable(0x732ca75CD5D3c9FEB294581D8D59C0340183ae42),
        payable(0x31126263e4b408F925CC7B41f65de2B96148dDaf),
        payable(0x5F07D0f7e5a3D46Ef9437d173463CC88D4a00477),
        payable(0x7172F601308368BabB92852Ad1Cf195b84418eDC)
    ];

    constructor() {
        owner = msg.sender;
    }

    // Fallback function to receive ETH
    receive() external payable {
        require(totalDonations < donationLimit, "Donation limit exceeded");
        totalDonations += msg.value;
        emit DonationReceived(msg.sender, msg.value);

        // Check if donation limit is reached
        if (totalDonations >= donationLimit) {
            distributeFunds();
        }
    }

    // Function to distribute funds to different accounts
    function distributeFunds() private {
        uint256 eachShare = 1 ether;

        // Transfer 1 ETH to each account
        for (uint256 i = 0; i < accounts.length; i++) {
            accounts[i].transfer(eachShare);
            emit Distribution(accounts[i], eachShare);
        }

        // Reset total donations for the next round
        totalDonations = 0;
    }

    // Function to get the contract balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
