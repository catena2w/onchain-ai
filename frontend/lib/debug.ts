export function formatTimestamp(date: Date): string {
  return date.toISOString().split("T")[1].slice(0, 12);
}

export function formatLogMessage(label: string, args: unknown[]): string {
  const formatted = args
    .map((a) => (typeof a === "object" ? JSON.stringify(a, null, 0) : String(a)))
    .join(" ");
  return `${label}: ${formatted}`;
}

export type DebugLogger = {
  log: (label: string, args: unknown[]) => void;
  getLogs: () => string[];
  clear: () => void;
  setUpdateCallback: (callback: (() => void) | null) => void;
};

export function createDebugLogger(options: { maxLogs: number }): DebugLogger {
  const logs: string[] = [];
  let updateCallback: (() => void) | null = null;

  return {
    log(label: string, args: unknown[]) {
      const timestamp = formatTimestamp(new Date());
      const message = `[${timestamp}] ${formatLogMessage(label, args)}`;
      console.log(`[ChatOracle] ${label}:`, ...args);
      logs.unshift(message);
      if (logs.length > options.maxLogs) {
        logs.pop();
      }
      if (updateCallback) {
        setTimeout(updateCallback, 0);
      }
    },

    getLogs() {
      return [...logs];
    },

    clear() {
      logs.length = 0;
    },

    setUpdateCallback(callback: (() => void) | null) {
      updateCallback = callback;
    },
  };
}
