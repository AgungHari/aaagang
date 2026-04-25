'use client';

import { useState, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import WarLogCard from '@/components/WarLogCard';

interface War {
  result: "win" | "lose" | "tie" | null;
  endTime: string;
  teamSize: number;
  attacksPerMember: number;
  clan: {
    name: string;
    stars: number;
    destructionPercentage: number;
    expEarned: number;
  };
  opponent: {
    name: string;
    stars: number;
    destructionPercentage: number;
  };
}

interface WarLogFilterProps {
  wars: War[];
}

export default function WarLogFilter({ wars }: WarLogFilterProps) {
  const [selectedResult, setSelectedResult] = useState<"win" | "lose" | "tie" | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Filter wars berdasarkan selected result
  const filteredWars = useMemo(() => {
    if (!selectedResult) return wars;
    return wars.filter(war => war.result === selectedResult);
  }, [wars, selectedResult]);

  // Calculate stats untuk filtered wars
  const wins = filteredWars.filter(w => w.result === "win").length;
  const losses = filteredWars.filter(w => w.result === "lose").length;
  const ties = filteredWars.filter(w => w.result === "tie").length;
  const winRate = filteredWars.length > 0 ? ((wins / filteredWars.length) * 100).toFixed(1) : "0";

  return (
    <>
      {/* Filter Button & Dropdown */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 rounded-lg transition text-amber-500 font-semibold text-sm"
          >
            <Filter size={16} />
            <span>
              {selectedResult === "win" 
                ? "Victories" 
                : selectedResult === "lose" 
                ? "Defeats" 
                : selectedResult === "tie" 
                ? "Draws" 
                : "All Wars"}
            </span>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-2 bg-zinc-900 border border-white/10 rounded-lg shadow-lg z-50 min-w-48">
              {/* Show All */}
              <button
                onClick={() => {
                  setSelectedResult(null);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-white/5 transition text-sm text-gray-300 border-b border-white/5 flex items-center gap-2"
              >
                <X size={14} />
                All Wars
              </button>

              {/* Victories */}
              <button
                onClick={() => {
                  setSelectedResult("win");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-white/5 transition text-sm flex items-center gap-2 ${
                  selectedResult === "win"
                    ? 'bg-green-500/20 text-green-400 font-semibold'
                    : 'text-gray-300'
                }`}
              >
                Victories
              </button>

              {/* Defeats */}
              <button
                onClick={() => {
                  setSelectedResult("lose");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-white/5 transition text-sm flex items-center gap-2 ${
                  selectedResult === "lose"
                    ? 'bg-red-500/20 text-red-400 font-semibold'
                    : 'text-gray-300'
                }`}
              >
                Defeats
              </button>

              {/* Draws */}
              <button
                onClick={() => {
                  setSelectedResult("tie");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-white/5 transition text-sm flex items-center gap-2 ${
                  selectedResult === "tie"
                    ? 'bg-blue-500/20 text-blue-400 font-semibold'
                    : 'text-gray-300'
                }`}
              >
                Draws
              </button>
            </div>
          )}
        </div>

        {/* Stats Badge */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">
            {filteredWars.length} war{filteredWars.length !== 1 ? 's' : ''}
          </span>
          {!selectedResult && filteredWars.length > 0 && (
            <span className="text-amber-400 font-semibold">
              Win Rate: {winRate}%
            </span>
          )}
        </div>
      </div>

      {/* War Log Grid */}
      {filteredWars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWars.map((war, index) => (
            <WarLogCard key={index} war={war} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-zinc-500 font-bold">
            {selectedResult 
              ? `No ${selectedResult === "win" ? "victories" : selectedResult === "lose" ? "defeats" : "draws"} found`
              : "No war log data available"
            }
          </p>
        </div>
      )}
    </>
  );
}
