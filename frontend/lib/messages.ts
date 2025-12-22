import { formatEther } from "viem";

export type ConversationItem = {
  prompt: string;
  response: string;
};

export type PendingMessage = {
  id: number;
  content: string;
  txHash?: `0x${string}`;
  status: "pending" | "confirming" | "confirmed" | "failed";
};

export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  txHash?: `0x${string}`;
  status?: "pending" | "confirming" | "confirmed" | "failed";
  messageId?: bigint;
};

export type TxHashMap = Map<string, `0x${string}`>;

// Map from prompt content to messageId (for matching conversation to events)
export type PromptToMessageIdMap = Map<string, string>;

// Event log types for building messages from events
export type MessageSentLog = {
  messageId: bigint;
  prompt: string;
  txHash: `0x${string}`;
};

export type ResponseReceivedLog = {
  messageId: bigint;
  response: string;
  txHash: `0x${string}`;
};

// Message type with guaranteed txHash (for confirmed messages)
export type OnChainMessage = {
  messageId: bigint;
  role: "user" | "assistant";
  content: string;
  txHash: `0x${string}`;
};

export function formatTxHashShort(txHash: string): string {
  return txHash.slice(2, 8);
}

export function formatBalance(balance: bigint): string {
  return Number(formatEther(balance)).toFixed(6);
}

export function hasActiveSubscription(subscriptionId: bigint | undefined): boolean {
  return subscriptionId !== undefined && subscriptionId > 0n;
}

export function needsDeposit(
  subscriptionId: bigint | undefined,
  balance: bigint | undefined
): boolean {
  // No subscription - needs deposit to create one
  if (!hasActiveSubscription(subscriptionId)) {
    return true;
  }
  // Subscription exists but no balance or zero balance - needs top-up
  if (balance === undefined || balance === 0n) {
    return true;
  }
  return false;
}

export function buildMessagesFromConversation(
  conversation: readonly ConversationItem[],
  pendingMessage: PendingMessage | null,
  messageTxHashes: TxHashMap,
  responseTxHashes: TxHashMap,
  promptToMessageId: PromptToMessageIdMap,
  debug?: (label: string, ...args: unknown[]) => void
): Message[] {
  const messages: Message[] = [];

  // Debug: log available tx hashes
  if (debug) {
    debug("Building messages", {
      conversationLength: conversation.length,
      promptToMessageId: Array.from(promptToMessageId.entries()),
      messageTxHashes: Array.from(messageTxHashes.entries()),
      responseTxHashes: Array.from(responseTxHashes.entries()),
    });
  }

  conversation.forEach((msg, i) => {
    // Look up messageId by prompt content (since messageId is global, not per-user)
    const messageIdStr = promptToMessageId.get(msg.prompt);
    const userTxHash = messageIdStr ? messageTxHashes.get(messageIdStr) : undefined;
    const responseTxHash = messageIdStr ? responseTxHashes.get(messageIdStr) : undefined;

    if (debug && !messageIdStr) {
      debug("Missing messageId for prompt", { index: i, prompt: msg.prompt.slice(0, 30) });
    }

    const messageId = messageIdStr ? BigInt(messageIdStr) : undefined;

    messages.push({
      id: i * 2,
      role: "user",
      content: msg.prompt,
      status: "confirmed",
      messageId,
      txHash: userTxHash,
    });

    if (msg.response) {
      messages.push({
        id: i * 2 + 1,
        role: "assistant",
        content: msg.response,
        status: "confirmed",
        messageId,
        txHash: responseTxHash,
      });
    }
  });

  // Add pending message if it's not already in conversation
  if (pendingMessage && !messages.some((m) => m.role === "user" && m.content === pendingMessage.content)) {
    messages.push({
      id: pendingMessage.id,
      role: "user",
      content: pendingMessage.content,
      txHash: pendingMessage.txHash,
      status: pendingMessage.status,
    });
  }

  return messages;
}

/**
 * Build messages from event logs. Every message has a guaranteed txHash.
 */
export function buildMessagesFromEvents(
  messageLogs: MessageSentLog[],
  responseLogs: ResponseReceivedLog[]
): OnChainMessage[] {
  // Create response lookup by messageId
  const responseByMessageId = new Map<string, ResponseReceivedLog>();
  responseLogs.forEach((log) => {
    responseByMessageId.set(log.messageId.toString(), log);
  });

  // Sort messages by messageId
  const sortedMessages = [...messageLogs].sort((a, b) =>
    a.messageId < b.messageId ? -1 : a.messageId > b.messageId ? 1 : 0
  );

  const result: OnChainMessage[] = [];

  sortedMessages.forEach((msg) => {
    // Add user message
    result.push({
      messageId: msg.messageId,
      role: "user",
      content: msg.prompt,
      txHash: msg.txHash,
    });

    // Add assistant message if response exists
    const response = responseByMessageId.get(msg.messageId.toString());
    if (response) {
      result.push({
        messageId: msg.messageId,
        role: "assistant",
        content: response.response,
        txHash: response.txHash,
      });
    }
  });

  return result;
}
