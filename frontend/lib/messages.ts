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

export function formatTxHashShort(txHash: string): string {
  return txHash.slice(2, 8);
}

export function formatBalance(balance: bigint): string {
  return Number(formatEther(balance)).toFixed(6);
}

export function hasActiveSubscription(subscriptionId: bigint | undefined): boolean {
  return subscriptionId !== undefined && subscriptionId > 0n;
}

export function buildMessagesFromConversation(
  conversation: readonly ConversationItem[],
  pendingMessage: PendingMessage | null,
  messageTxHashes: TxHashMap,
  responseTxHashes: TxHashMap
): Message[] {
  const messages: Message[] = [];

  conversation.forEach((msg, i) => {
    const messageId = BigInt(i + 1);
    const userTxHash = messageTxHashes.get(messageId.toString());
    const responseTxHash = responseTxHashes.get(messageId.toString());

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
