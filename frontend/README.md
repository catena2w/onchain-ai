# On-Chain AI Chat Frontend

Next.js web interface for the ChatOracle smart contract.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
```

## Configuration

Update contract addresses in `lib/config.ts` after deployment:

```typescript
export const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  [arbitrumSepolia.id]: "0xYOUR_DEPLOYED_ADDRESS",
  // ...
};
```

## Tech Stack

- Next.js 16 (App Router)
- wagmi v3 + viem (wallet connection)
- Tailwind CSS
