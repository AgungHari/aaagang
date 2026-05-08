import { Trash2 } from "lucide-react";
import { ModelSelector } from "./ModelSelector";
import { ModelOption } from "@/types/model-option";

interface ChatHeaderProps {
  selectedModel: string;
  showModelDropdown: boolean;
  onToggleModelDropdown: () => void;
  onModelChange: (modelValue: string) => void;
  onClearChat: () => void;
  modelOptions: ModelOption[];
}

export function ChatHeader({
  selectedModel,
  showModelDropdown,
  onToggleModelDropdown,
  onModelChange,
  onClearChat,
  modelOptions
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 bg-zinc-950/95">
      <div>
        <p className="text-[5px] uppercase tracking-[0.36em] text-zinc-600">We do not store your chat logs.</p>
        <ModelSelector
          selectedModel={selectedModel}
          showDropdown={showModelDropdown}
          onToggleDropdown={onToggleModelDropdown}
          onModelChange={onModelChange}
          options={modelOptions}
        />
      </div>
      <button
        onClick={onClearChat}
        className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold text-zinc-400 transition hover:text-white"
      >
        <Trash2 size={14} /> Clear
      </button>
    </div>
  );
}
