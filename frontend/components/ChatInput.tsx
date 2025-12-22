export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isPending?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  isPending = false,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isPending) {
      onSend();
    }
  };

  return (
    <div className="flex gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-1 px-4 py-3 bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
        disabled={isPending}
      />
      <button
        onClick={onSend}
        disabled={isPending}
        className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-500 disabled:opacity-50 font-medium transition-colors"
      >
        {isPending ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
