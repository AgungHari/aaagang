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
    <div className="px-4 pb-4 pt-3 sm:px-6 ">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
            placeholder=""
            className="w-full rounded-lg border-1 border-zinc-800/70 bg-zinc-900/90 px-4 py-3 text-sm text-white outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-600 transition"
          />
          <div
            className={`pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-zinc-500 transition-opacity duration-300 ease-out ${
              showPlaceholder ? "opacity-100" : "opacity-0"
            }`}
          >
            {placeholderOptions[placeholderIndex]}
          </div>
        </div>
        <button
          onClick={onSendMessage}
          disabled={isLoading}
          className="h-12 w-12 flex items-center justify-center rounded-full bg-amber-600 text-zinc-950 shadow-sm hover:bg-amber-500 disabled:opacity-40"
        >
          <Send size={19} />
        </button>
      </div>
    </div>
  );
}
