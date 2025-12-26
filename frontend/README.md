# On-Chain AI Chat Frontend

Next.js web interface for the ChatOracle smart contract.

## Development

```bash
npm install
npm run dev
```

## Test

```bash
npm run test:run
```

## Build

```bash
npm run build
```

Static output in `out/` directory.

## Configuration

Chain config is in `../chains.json` (copied at build time).

## Tech Stack

- Next.js 16 (App Router, static export)
- wagmi v2 + viem
- RainbowKit
- Tailwind CSS
- Vitest + fast-check
