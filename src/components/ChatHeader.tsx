import { Trash2 } from "lucide-react";
import { ModelSelector } from "./ModelSelector";
import { ModelOption } from "@/types/model-option";

interface ChatHeaderProps {
  selectedModel: string;
  sigmaMood: "happy" | "thinking" | "explaining";
  isLoading: boolean;
  showModelDropdown: boolean;
  onToggleModelDropdown: () => void;
  onModelChange: (modelValue: string) => void;
  onClearChat: () => void;
  modelOptions: ModelOption[];
}

export function ChatHeader({
  selectedModel,
  sigmaMood,
  isLoading,
  showModelDropdown,
  onToggleModelDropdown,
  onModelChange,
  onClearChat,
  modelOptions
}: ChatHeaderProps) {
  return (
    <div className="relative z-20 flex items-center justify-between gap-3 rounded-t-2xl border-b border-white/[0.06] bg-zinc-950/80 px-4 py-3 sm:px-5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <ModelSelector
            selectedModel={selectedModel}
            showDropdown={showModelDropdown}
            onToggleDropdown={onToggleModelDropdown}
            onModelChange={onModelChange}
            options={modelOptions}
          />
          {isLoading && (
            <>
              <span className="text-[10px] text-zinc-600">·</span>
              <span className="text-[10px] font-medium text-zinc-500">
                {sigmaMood === "thinking" ? "Thinking..." : "Writing a reply..."}
              </span>
            </>
          )}
        </div>
        <p className="mt-0.5 text-[10px] text-zinc-600">
          Your chat stays on this device
        </p>
      </div>
      <button
        type="button"
        onClick={onClearChat}
        className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-medium text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
      >
        <Trash2 size={14} /> Clear
      </button>
    </div>
  );
}
