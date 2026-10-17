'use client';

import { useMemo, useState } from 'react';
import { ListBullets, ShieldCheck, Skull, Sword, Trophy } from '@phosphor-icons/react';
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

const filters = [
  { value: null, label: "All wars", icon: ListBullets },
  { value: "win", label: "Victories", icon: Trophy },
  { value: "lose", label: "Defeats", icon: Skull },
  { value: "tie", label: "Draws", icon: Sword },
] as const;

export default function WarLogFilter({ wars }: WarLogFilterProps) {
  const [selectedResult, setSelectedResult] = useState<"win" | "lose" | "tie" | null>(null);

  const counts = useMemo(() => ({
    all: wars.length,
    win: wars.filter((war) => war.result === "win").length,
    lose: wars.filter((war) => war.result === "lose").length,
    tie: wars.filter((war) => war.result === "tie").length,
  }), [wars]);

  const filteredWars = useMemo(
    () => selectedResult ? wars.filter((war) => war.result === selectedResult) : wars,
    [wars, selectedResult],
  );
  const wins = filteredWars.filter((war) => war.result === "win").length;
  const winRate = filteredWars.length ? Math.round((wins / filteredWars.length) * 100) : 0;

  return (
    <div>
      <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-zinc-800/70 bg-transparent p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Browse the archive</p>
          <p className="text-sm font-bold text-zinc-200">
            Showing <span className="text-amber-300">{filteredWars.length}</span> of {wars.length} wars
          </p>
        </div>
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1 sm:pb-0" aria-label="Filter war results">
          {filters.map(({ value, label, icon: Icon }) => {
            const active = selectedResult === value;
            const count = value === null ? counts.all : counts[value];

            return (
              <button
                key={label}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedResult(value)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.12em] transition-colors ${
                  active
                    ? "border-amber-400/35 bg-amber-400/10 text-amber-200"
                    : "border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <Icon size={14} weight="duotone" />
                {label}
                <span className={`tabular-nums ${active ? "text-amber-300" : "text-zinc-700"}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {filteredWars.length > 0 ? (
        <>
          {!selectedResult && (
            <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-600">
              <ShieldCheck size={15} className="text-amber-500/70" />
              Overall win rate <span className="text-amber-300">{winRate}%</span>
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredWars.map((war, index) => (
              <WarLogCard key={`${war.endTime}-${war.opponent.name}-${index}`} war={war} index={index} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-zinc-800/60 px-5 py-16 text-center">
          <p className="text-sm font-bold text-zinc-400">
            {selectedResult
              ? `No ${selectedResult === "win" ? "victories" : selectedResult === "lose" ? "defeats" : "draws"} found`
              : "No war log data available"}
          </p>
        </div>
      )}
    </div>
  );
}
