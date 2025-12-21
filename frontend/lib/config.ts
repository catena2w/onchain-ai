import { http, createConfig } from "wagmi";
import { defineChain } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { injected } from "wagmi/connectors";

export const zgMainnet = defineChain({
  id: 16600,
  name: "0G Mainnet",
  nativeCurrency: { name: "A0GI", symbol: "A0GI", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://evmrpc.0g.ai"] },
  },
  blockExplorers: {
    default: { name: "0G Explorer", url: "https://chainscan.0g.ai" },
  },
});

export const zgTestnet = defineChain({
  id: 16601,
  name: "0G Newton Testnet",
  nativeCurrency: { name: "A0GI", symbol: "A0GI", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://evmrpc-testnet.0g.ai"] },
  },
  blockExplorers: {
    default: { name: "0G Explorer", url: "https://chainscan-newton.0g.ai" },
  },
});

export { arbitrumSepolia };

export const config = createConfig({
  chains: [arbitrumSepolia, zgMainnet, zgTestnet],
  connectors: [injected()],
  transports: {
    [arbitrumSepolia.id]: http(),
    [zgMainnet.id]: http(),
    [zgTestnet.id]: http(),
  },
});

// Contract addresses per chain - update after deployment
export const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  [arbitrumSepolia.id]: "0x0000000000000000000000000000000000000000",
  [zgMainnet.id]: "0x0000000000000000000000000000000000000000",
  [zgTestnet.id]: "0x0000000000000000000000000000000000000000",
};
