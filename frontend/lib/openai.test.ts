import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { buildOpenAIBody, MAX_HISTORY_MESSAGES } from "./openai";
import { fromHex } from "viem";
import type { Message } from "./messages";

describe("buildOpenAIBody", () => {
  it("creates valid hex-encoded JSON with user prompt", () => {
    const hex = buildOpenAIBody("Hello");
    const decoded = new TextDecoder().decode(fromHex(hex, "bytes"));
    const parsed = JSON.parse(decoded);

    expect(parsed.model).toBe("gpt-4o-search-preview");
    expect(parsed.messages).toHaveLength(2);
    expect(parsed.messages[0].role).toBe("system");
    expect(parsed.messages[1].role).toBe("user");
    expect(parsed.messages[1].content).toBe("Hello");
  });

  it("returns hex string starting with 0x", () => {
    const hex = buildOpenAIBody("Test");
    expect(hex.startsWith("0x")).toBe(true);
  });

  it("includes conversation history when provided", () => {
    const history: Message[] = [
      { id: 0, role: "user", content: "What is 2+2?", status: "confirmed" },
      { id: 1, role: "assistant", content: "4", status: "confirmed" },
    ];
    const hex = buildOpenAIBody("What is 3+3?", { history });
    const decoded = new TextDecoder().decode(fromHex(hex, "bytes"));
    const parsed = JSON.parse(decoded);

    // system + 2 history + 1 new = 4 messages
    expect(parsed.messages).toHaveLength(4);
    expect(parsed.messages[1].role).toBe("user");
    expect(parsed.messages[1].content).toBe("What is 2+2?");
    expect(parsed.messages[2].role).toBe("assistant");
    expect(parsed.messages[2].content).toBe("4");
    expect(parsed.messages[3].content).toBe("What is 3+3?");
  });

  it("limits history to MAX_HISTORY_MESSAGES", () => {
    const history: Message[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      role: i % 2 === 0 ? "user" : "assistant",
      content: `Message ${i}`,
      status: "confirmed" as const,
    }));
    const hex = buildOpenAIBody("New message", { history });
    const decoded = new TextDecoder().decode(fromHex(hex, "bytes"));
    const parsed = JSON.parse(decoded);

    // system + MAX_HISTORY_MESSAGES + 1 new
    expect(parsed.messages).toHaveLength(1 + MAX_HISTORY_MESSAGES + 1);
  });

  // Property tests
  describe("property tests", () => {
    it("always produces valid hex starting with 0x", () => {
      fc.assert(
        fc.property(fc.string(), (prompt) => {
          const hex = buildOpenAIBody(prompt);
          return hex.startsWith("0x") && /^0x[0-9a-f]*$/i.test(hex);
        })
      );
    });

    it("always produces valid JSON when decoded", () => {
      fc.assert(
        fc.property(fc.string(), (prompt) => {
          const hex = buildOpenAIBody(prompt);
          const decoded = new TextDecoder().decode(fromHex(hex, "bytes"));
          try {
            JSON.parse(decoded);
            return true;
          } catch {
            return false;
          }
        })
      );
    });

    it("handles special characters in prompt", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }).filter((s) => s.length > 0),
          (prompt) => {
            const hex = buildOpenAIBody(prompt);
            const decoded = new TextDecoder().decode(fromHex(hex, "bytes"));
            const parsed = JSON.parse(decoded);
            const lastMsg = parsed.messages[parsed.messages.length - 1];
            return lastMsg.role === "user" && lastMsg.content === prompt;
          }
        )
      );
    });

    it("handles unicode and emoji in messages", () => {
      // Use grapheme-composite unit for full unicode including emojis
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, unit: "grapheme-composite" }),
          (prompt) => {
            const hex = buildOpenAIBody(prompt);
            const decoded = new TextDecoder().decode(fromHex(hex, "bytes"));
            const parsed = JSON.parse(decoded);
            return parsed.messages.some(
              (m: { content: string }) => m.content === prompt
            );
          }
        )
      );
    });

    it("preserves history content exactly", () => {
      const historyArb = fc.array(
        fc.record({
          id: fc.integer({ min: 0 }),
          role: fc.constantFrom("user", "assistant") as fc.Arbitrary<
            "user" | "assistant"
          >,
          content: fc.string(),
          status: fc.constant("confirmed" as const),
        }),
        { minLength: 0, maxLength: 10 }
      );

      fc.assert(
        fc.property(fc.string(), historyArb, (prompt, history) => {
          const hex = buildOpenAIBody(prompt, { history });
          const decoded = new TextDecoder().decode(fromHex(hex, "bytes"));
          const parsed = JSON.parse(decoded);

          // Check that history messages are preserved (after system message)
          const historyToCheck = history.slice(-MAX_HISTORY_MESSAGES);
          for (let i = 0; i < historyToCheck.length; i++) {
            const msg = parsed.messages[i + 1]; // +1 to skip system message
            if (msg.content !== historyToCheck[i].content) return false;
            if (msg.role !== historyToCheck[i].role) return false;
          }
          return true;
        })
      );
    });

    it("output is always valid bytes for contract", () => {
      fc.assert(
        fc.property(fc.string(), (prompt) => {
          const hex = buildOpenAIBody(prompt);
          // Should be able to convert to bytes without error
          try {
            fromHex(hex, "bytes");
            return true;
          } catch {
            return false;
          }
        })
      );
    });
  });
});
