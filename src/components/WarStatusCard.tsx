import { Crosshair } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface WarStatusCardProps {
  isWar: boolean;
  opponentName?: string;
  clanStars?: number;
  opponentStars?: number;
  clanAttacks?: number;
  totalAttacks?: number;
}

export default function WarStatusCard({
  isWar,
  opponentName,
  clanStars,
  opponentStars,
  clanAttacks,
  totalAttacks,
}: WarStatusCardProps) {
  return (
    <ScrollReveal delay={0.5} mobileDelay={0.1} className="w-full h-full flex">
      <div
        className={`w-full p-10 border rounded-[2.5rem] flex items-center justify-between transition-all overflow-hidden relative group ${
          isWar
            ? "bg-red-500/5 border-red-500/20"
            : "bg-zinc-900/20 border-zinc-800/50"
        }`}
      >
        <Crosshair
          className={`absolute -right-4 -bottom-4 size-32 -rotate-12 opacity-10`}
        />
        <div className="relative z-10">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-1">
            Live War Status
          </div>
          <div className="text-[7px] text-zinc-600 uppercase tracking-[0.4em] mb-4">
            (Refreshes every 60 seconds for the latest overview)
          </div>
          <div
            className={`text-3xl font-black italic uppercase tracking-tighter ${
              isWar ? "text-red-500 animate-pulse" : "text-zinc-400"
            }`}
          >
            {isWar ? `VS ${opponentName}` : "Resting / Neutral"}
          </div>
          {isWar && (
            <div className="mt-4 flex gap-6 text-lg font-black italic">
              <div>
                {clanStars} - {opponentStars}
                <span className="text-[8px] text-zinc-600 uppercase block">
                  Stars
                </span>
              </div>
              <div>
                {clanAttacks} / {totalAttacks}
                <span className="text-[8px] text-zinc-600 uppercase block">
                  Attacks
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}
