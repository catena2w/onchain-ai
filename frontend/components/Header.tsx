import { ReactNode } from "react";

export interface HeaderProps {
  hasSubscription: boolean;
  subscriptionBalance?: string;
  currencySymbol?: string;
  onDebugToggle: () => void;
  showDebug: boolean;
  walletButton?: ReactNode;
  onWithdraw?: () => void;
  isWithdrawing?: boolean;
}

export function Header({
  hasSubscription,
  subscriptionBalance,
  currencySymbol = "ETH",
  onDebugToggle,
  showDebug,
  walletButton,
  onWithdraw,
  isWithdrawing,
}: HeaderProps) {
  const hasBalance = subscriptionBalance && parseFloat(subscriptionBalance) > 0;

  return (
    <header className="px-6 py-4 border-b border-[#1a1a2e] bg-[#0a0a0f]/95 backdrop-blur-sm flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">
          <span className="text-white">On-Chain</span>{" "}
          <span className="text-purple-400">AI</span>
        </h1>
        <button
          onClick={onDebugToggle}
          className="text-xs px-3 py-1.5 bg-[#1a1a2e] border border-[#2a2a3e] rounded-full hover:border-purple-500/50 transition-colors"
        >
          {showDebug ? "Hide Debug" : "Debug"}
        </button>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">
          {hasSubscription
            ? `Balance: ${subscriptionBalance ?? "..."} ${currencySymbol}`
            : "No subscription"}
        </span>
        {hasSubscription && hasBalance && onWithdraw && (
          <button
            onClick={onWithdraw}
            disabled={isWithdrawing}
            className="text-xs px-3 py-1.5 bg-purple-600 rounded-full hover:bg-purple-500 disabled:opacity-50 transition-colors"
          >
            {isWithdrawing ? "Withdrawing..." : "Withdraw"}
          </button>
        )}
        {walletButton}
      </div>
    </header>
  );
}
