// Re-export OpenAI functions for backwards compatibility
export { buildOpenAIBody, MAX_HISTORY_MESSAGES } from "./openai";

export function getExplorerUrl(chainId: number, txHash: string): string {
  const explorers: Record<number, string> = {
    421614: "https://sepolia.arbiscan.io",
    16600: "https://chainscan.0g.ai",
    16601: "https://chainscan-newton.0g.ai",
  };
  const base = explorers[chainId] || "https://sepolia.arbiscan.io";
  return `${base}/tx/${txHash}`;
}
