// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Test.sol";
import "../src/ChatOracle.sol";

/// @notice Fork test against deployed contract on Arbitrum Sepolia
contract ChatOracleForkTest is Test {
    ChatOracle public oracle;
    address public user = 0xEd0c2E52f7e53c7b73866a8cDaEc458B877d4bA4;
    address public contractAddress = 0x2396402CBc65E469255407562123EE22fBa01eA7;

    function setUp() public {
        // Fork Arbitrum Sepolia
        vm.createSelectFork("https://sepolia-rollup.arbitrum.io/rpc");
        oracle = ChatOracle(contractAddress);
    }

    function _buildBody(string memory prompt) internal pure returns (bytes memory) {
        return abi.encodePacked(
            '{"model":"gpt-4o","messages":[{"role":"system","content":"You are a helpful assistant."},{"role":"user","content":"',
            prompt,
            '"}]}'
        );
    }

    function test_contractIsInitialized() public view {
        assertTrue(oracle.initialized(), "Contract should be initialized");
    }

    function test_userHasSubscription() public view {
        uint256 subscriptionId = oracle.getUserSubscription(user);
        assertTrue(subscriptionId > 0, "User should have a subscription");
        console.log("User subscription ID:", subscriptionId);
    }

    function test_sendMessage_simulateCall() public {
        // Check user's subscription
        uint256 subscriptionId = oracle.getUserSubscription(user);
        console.log("Subscription ID:", subscriptionId);

        // Build the same body as frontend
        bytes memory body = _buildBody("test from fork");

        // Simulate the call as the user
        vm.prank(user);

        // Try to send message (this should reveal the actual revert reason)
        uint256 messageId = oracle.sendMessage("test from fork", body);
        console.log("Message ID:", messageId);
    }

    function test_sendMessage_checkQuexCoreState() public view {
        address quexCore = oracle.quexCore();
        address oraclePool = oracle.oraclePool();
        address tdAddress = oracle.tdAddress();

        console.log("Quex Core:", quexCore);
        console.log("Oracle Pool:", oraclePool);
        console.log("TD Address:", tdAddress);

        // Check if these addresses have code
        assertTrue(quexCore.code.length > 0, "Quex Core should have code");
        assertTrue(oraclePool.code.length > 0, "Oracle Pool should have code");
    }
}
