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
        className="flex-1 px-4 py-3 bg-[#1a1a2e] border border-[#2a2a3e] rounded-full focus:outline-none focus:border-[#7a00df] transition-colors"
        disabled={isPending}
      />
      <button
        onClick={onSend}
        disabled={isPending}
        className="px-6 py-3 bg-[#7a00df] text-white rounded-full hover:bg-[#8a10ef] disabled:opacity-50 font-medium transition-colors"
      >
        {isPending ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
