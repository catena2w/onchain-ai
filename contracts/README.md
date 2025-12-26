# ChatOracle Contracts

Solidity smart contracts for on-chain AI chat via Quex oracles.

## Test

```bash
forge test
```

## Deploy

Deployment reads config from `../chains.json`.

```bash
# Set private key
export PRIVATE_KEY=your_private_key

# Deploy to Arbitrum One
forge script script/Deploy.s.sol --rpc-url https://arb1.arbitrum.io/rpc --broadcast --private-key $PRIVATE_KEY

# Deploy to Aristotle (0G)
forge script script/Deploy.s.sol --rpc-url https://evmrpc.0g.ai --broadcast --private-key $PRIVATE_KEY --priority-gas-price 2000000000

# Deploy to Arbitrum Sepolia
forge script script/Deploy.s.sol --rpc-url https://sepolia-rollup.arbitrum.io/rpc --broadcast --private-key $PRIVATE_KEY
```

After deployment, update `chatOracle` address in `../chains.json`.

## Contract Interface

```solidity
function sendMessage(string calldata prompt, bytes calldata body) external payable returns (uint256 messageId);
function getConversation(address user) external view returns (Message[] memory);
function getUserSubscription(address user) external view returns (uint256);
```
