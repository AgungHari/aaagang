import { ChevronDown } from "lucide-react";
import { useRef, useEffect } from "react";
import { ModelOption } from "@/types/model-option";

interface ModelSelectorProps {
  selectedModel: string;
  showDropdown: boolean;
  onToggleDropdown: () => void;
  onModelChange: (modelValue: string) => void;
  options: ModelOption[];
}

export function ModelSelector({
  selectedModel,
  showDropdown,
  onToggleDropdown,
  onModelChange,
  options
}: ModelSelectorProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (showDropdown) onToggleDropdown();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, onToggleDropdown]);

  return (
    <div className="relative z-10" ref={dropdownRef}>
      <button
        type="button"
        onClick={onToggleDropdown}
        className="flex items-center gap-1 text-lg font-semibold text-zinc-200"
      >
        Sigma
        <span className="text-[9px] text-amber-500 flex items-center gap-1 self-end translate-y-[-3px]">
          {options.find(m => m.value === selectedModel)?.label}
          <ChevronDown size={10} className="animate-pulse" />
        </span>
      </button>

      {showDropdown && (
        <div className="absolute left-0 mt-2 w-full min-w-[12rem] sm:w-48 bg-zinc-900/20 backdrop-blur-md border border-zinc-800/50 rounded-md shadow-2xl z-[9999] pointer-events-auto">
          <div className="p-2 text-xs text-zinc-400 uppercase tracking-wider">Select AI Model</div>
          {options.map((model, index) => {
            if (model.isSeparator) {
              return (
                <div key={`separator-${index}`} className="px-3 py-2">
                  <div className="border-t border-zinc-700/50 my-2"></div>
                  <div className="text-[10px] text-center text-amber-400/80 uppercase tracking-wider py-1 font-medium">
                    {model.label}
                    <br/><span className="text-[7px] text-zinc-400">3agang.pro/admin/dashboard</span>
                  </div>
                  <div className="border-t border-zinc-700/50 mt-2"></div>
                </div>
              );
            }

            return (
              <button
                key={model.value}
                onClick={() => {
                  if (!model.disabled) {
                    onModelChange(model.value);
                  }
                }}
                disabled={model.disabled}
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors ${
                  model.disabled
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:bg-zinc-800 cursor-pointer'
                } ${
                  selectedModel === model.value ? 'bg-zinc-800 text-amber-400' : 'text-zinc-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${model.disabled ? 'bg-zinc-600' : 'bg-amber-500'} opacity-50`}></span>
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {model.label}
                  </div>
                  <div className="text-xs text-zinc-400">{model.description}</div>
                </div>
                {selectedModel === model.value && !model.disabled && (
                  <span className="text-amber-400 text-xs">✓</span>
                )}
              </button>
            );
          })}
                  </div>
                )}
              </div>
            );
          }
