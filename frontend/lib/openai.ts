import { toHex } from "viem";
import type { Message } from "./messages";

const SYSTEM_PROMPT =
  "You are an on-chain AI living on the blockchain. Keep responses under 50 words. Be extremely brief. One short paragraph max. No lists, no URLs.";

export const MAX_HISTORY_MESSAGES = 20;

type OpenAIMessage = { role: "system" | "user" | "assistant"; content: string };

type BuildOptions = {
  history?: Message[];
};

export function buildOpenAIBody(
  prompt: string,
  options: BuildOptions = {}
): `0x${string}` {
  const { history = [] } = options;

  const messages: OpenAIMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  // Add conversation history (limited to last MAX_HISTORY_MESSAGES)
  const recentHistory = history.slice(-MAX_HISTORY_MESSAGES);
  for (const msg of recentHistory) {
    messages.push({ role: msg.role, content: msg.content });
  }

  // Add current prompt
  messages.push({ role: "user", content: prompt });

  const body: Record<string, unknown> = {
    model: "gpt-4o-search-preview",
    messages,
    max_tokens: 100, // Keep responses short for gas efficiency
  };

  return toHex(new TextEncoder().encode(JSON.stringify(body)));
}
