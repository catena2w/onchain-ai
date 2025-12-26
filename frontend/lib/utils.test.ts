import { describe, it, expect } from "vitest";
import { getExplorerUrl } from "./utils";

describe("getExplorerUrl", () => {
  it("returns Arbitrum One URL for chain 42161", () => {
    const url = getExplorerUrl(42161, "0xabc123");
    expect(url).toBe("https://arbiscan.io/tx/0xabc123");
  });

  it("returns Arbitrum Sepolia URL for chain 421614", () => {
    const url = getExplorerUrl(421614, "0xabc123");
    expect(url).toBe("https://sepolia.arbiscan.io/tx/0xabc123");
  });

  it("returns 0G mainnet URL for chain 16661", () => {
    const url = getExplorerUrl(16661, "0xdef456");
    expect(url).toBe("https://chainscan.0g.ai/tx/0xdef456");
  });

  it("defaults to Arbitrum One for unknown chains", () => {
    const url = getExplorerUrl(99999, "0xunknown");
    expect(url).toBe("https://arbiscan.io/tx/0xunknown");
  });
});
