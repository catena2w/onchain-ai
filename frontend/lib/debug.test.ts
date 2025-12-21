import { describe, it, expect, vi, beforeEach } from "vitest";
import { createDebugLogger, formatTimestamp, formatLogMessage } from "./debug";

describe("formatTimestamp", () => {
  it("extracts time portion from ISO string", () => {
    const date = new Date("2024-01-15T10:30:45.123Z");
    expect(formatTimestamp(date)).toBe("10:30:45.123");
  });

  it("pads single digit values", () => {
    const date = new Date("2024-01-01T01:02:03.004Z");
    expect(formatTimestamp(date)).toBe("01:02:03.004");
  });
});

describe("formatLogMessage", () => {
  it("formats string arguments", () => {
    const result = formatLogMessage("Label", ["hello", "world"]);
    expect(result).toContain("Label:");
    expect(result).toContain("hello world");
  });

  it("formats object arguments as JSON", () => {
    const result = formatLogMessage("Data", [{ key: "value" }]);
    expect(result).toContain('{"key":"value"}');
  });

  it("handles mixed argument types", () => {
    const result = formatLogMessage("Mixed", ["text", 42, { a: 1 }]);
    expect(result).toContain("text");
    expect(result).toContain("42");
    expect(result).toContain('{"a":1}');
  });
});

describe("createDebugLogger", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("stores logs up to max limit", () => {
    const logger = createDebugLogger({ maxLogs: 3 });

    logger.log("First", []);
    logger.log("Second", []);
    logger.log("Third", []);
    logger.log("Fourth", []);

    const logs = logger.getLogs();
    expect(logs).toHaveLength(3);
    expect(logs[0]).toContain("Fourth");
    expect(logs[2]).toContain("Second");
  });

  it("clears logs", () => {
    const logger = createDebugLogger({ maxLogs: 10 });
    logger.log("Test", []);
    expect(logger.getLogs()).toHaveLength(1);

    logger.clear();
    expect(logger.getLogs()).toHaveLength(0);
  });

  it("calls update callback when logging", () => {
    const callback = vi.fn();
    const logger = createDebugLogger({ maxLogs: 10 });
    logger.setUpdateCallback(callback);

    logger.log("Test", []);

    vi.runAllTimers();
    expect(callback).toHaveBeenCalled();
  });

  it("does not call callback if not set", () => {
    const logger = createDebugLogger({ maxLogs: 10 });
    // Should not throw
    expect(() => logger.log("Test", [])).not.toThrow();
  });
});
