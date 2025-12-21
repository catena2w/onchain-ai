import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatInput } from "./ChatInput";

describe("ChatInput", () => {
  it("renders input and send button", () => {
    render(<ChatInput value="" onChange={() => {}} onSend={() => {}} />);

    expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const onChange = vi.fn();
    render(<ChatInput value="" onChange={onChange} onSend={() => {}} />);

    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.change(input, { target: { value: "Hello" } });

    expect(onChange).toHaveBeenCalledWith("Hello");
  });

  it("calls onSend when clicking send button", () => {
    const onSend = vi.fn();
    render(<ChatInput value="Hello" onChange={() => {}} onSend={onSend} />);

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(onSend).toHaveBeenCalled();
  });

  it("calls onSend when pressing Enter", () => {
    const onSend = vi.fn();
    render(<ChatInput value="Hello" onChange={() => {}} onSend={onSend} />);

    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSend).toHaveBeenCalled();
  });

  it("disables input and button when isPending", () => {
    render(<ChatInput value="" onChange={() => {}} onSend={() => {}} isPending />);

    expect(screen.getByPlaceholderText("Type your message...")).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows Sending... text when isPending", () => {
    render(<ChatInput value="" onChange={() => {}} onSend={() => {}} isPending />);

    expect(screen.getByRole("button")).toHaveTextContent("Sending...");
  });

  it("does not call onSend on Enter when isPending", () => {
    const onSend = vi.fn();
    render(<ChatInput value="Hello" onChange={() => {}} onSend={onSend} isPending />);

    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSend).not.toHaveBeenCalled();
  });
});
