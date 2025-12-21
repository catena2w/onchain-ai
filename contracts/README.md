# ChatOracle Contracts

Solidity smart contracts for on-chain AI chat via Quex oracles.

## Setup

```bash
forge install
```

## Test

```bash
forge test
```

## Deploy

### 1. Encrypt your OpenAI API key

```bash
# Clone Quex tools
git clone https://github.com/quex-tech/quex-v1-interfaces
cd quex-v1-interfaces/tools/encrypt_data
pip install -r requirements.txt

# Encrypt for Arbitrum Sepolia
python encrypt_data.py \
  --data "Bearer sk-YOUR_OPENAI_KEY" \
  --td-public-key 0x4af5d1d8db254edb79ead159a57d4c0102209a123f3eb27a74f9b5221edf4ae38dfddf5005c5f35cd35e4726d7044de1152ecd4393ab507f1fa4ad60132b0d67
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local with your PRIVATE_KEY and ENCRYPTED_API_KEY
```

### 3. Deploy

```bash
source .env.local

# Arbitrum Sepolia
forge script script/Deploy.s.sol \
  --rpc-url https://sepolia-rollup.arbitrum.io/rpc \
  --broadcast \
  --private-key $PRIVATE_KEY

# 0G Mainnet
forge script script/Deploy.s.sol \
  --rpc-url https://evmrpc.0g.ai \
  --broadcast \
  --private-key $PRIVATE_KEY
```

### 4. Update frontend

Copy the deployed contract address to `frontend/lib/config.ts`.

## Contract Interface

```solidity
// Send a message (first call requires ETH deposit for Quex subscription)
function sendMessage(string calldata prompt, bytes calldata body) external payable returns (uint256 messageId);

// Get conversation history
function getConversation(address user) external view returns (Message[] memory);

// Check subscription status
function getUserSubscription(address user) external view returns (uint256);
```

## Quex Addresses

| Network | QuexCore | Oracle Pool | Trust Domain |
|---------|----------|-------------|--------------|
| Arbitrum Sepolia | `0x97076a3c...` | `0xE83bB203...` | `0x128B61f6...` |
| 0G Mainnet | `0x48f15775...` | `0xe0655573...` | `0xB86EeAe9...` |
