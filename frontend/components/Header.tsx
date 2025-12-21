import { ReactNode } from "react";

export interface HeaderProps {
  hasSubscription: boolean;
  subscriptionBalance?: string;
  currencySymbol?: string;
  onDebugToggle: () => void;
  showDebug: boolean;
  walletButton?: ReactNode;
}

export function Header({
  hasSubscription,
  subscriptionBalance,
  currencySymbol = "ETH",
  onDebugToggle,
  showDebug,
  walletButton,
}: HeaderProps) {
  return (
    <header className="p-4 border-b border-gray-700 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">On-Chain AI Chat</h1>
        <button
          onClick={onDebugToggle}
          className="text-xs px-2 py-1 bg-gray-800 rounded hover:bg-gray-700"
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
        {walletButton}
      </div>
    </header>
  );
}
