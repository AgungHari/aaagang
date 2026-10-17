import { Send } from "lucide-react";
import { useEffect, useState } from "react";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  placeholderOptions: string[];
}

export function ChatInput({
  input,
  onInputChange,
  onSendMessage,
  isLoading,
  placeholderOptions
}: ChatInputProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    if (input.trim() || isLoading) {
      setShowPlaceholder(false);
      return;
    }

    setShowPlaceholder(true);
    let timeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setShowPlaceholder(false);
      timeout = setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholderOptions.length);
        setShowPlaceholder(true);
      }, 220);
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [input, isLoading, placeholderOptions]);

  return (
    <div className="rounded-b-2xl border-t border-white/[0.06] bg-zinc-950/70 px-3 pb-3 pt-3 sm:px-5 sm:pb-4">
      <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-1.5 pl-4 transition focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/20 sm:gap-3">
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSendMessage()}
            placeholder=""
            aria-label="Message Sigma"
            className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-zinc-600"
          />
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 flex items-center text-sm text-zinc-500 transition-opacity duration-300 ease-out ${
              showPlaceholder ? "opacity-100" : "opacity-0"
            }`}
          >
            {placeholderOptions[placeholderIndex]}
          </div>
        </div>
        <button
          onClick={onSendMessage}
          disabled={isLoading}
          aria-label="Send message"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 shadow-sm transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40 sm:size-11"
        >
          <Send size={19} />
        </button>
      </div>
    </div>
  );
}
