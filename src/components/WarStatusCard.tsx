import ScrollReveal from "./ScrollReveal";

interface WarStatusCardProps {
  isWar: boolean;
  state?: string;
  opponentName?: string;
  opponentBadgeUrl?: string;
  clanStars?: number;
  opponentStars?: number;
  clanAttacks?: number;
  totalAttacks?: number;
}

export default function WarStatusCard({
  isWar,
  state,
  opponentName,
  opponentBadgeUrl,
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
            ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40"
            : "bg-zinc-900/20 border-zinc-800/50"
        }`}
      >
        {isWar && opponentBadgeUrl ? (
          <img 
            src={opponentBadgeUrl} 
            alt="Opponent Badge"
            className="absolute -right-6 -bottom-6 size-48 opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-25 group-hover:scale-110 transition-all duration-700 -rotate-12 pointer-events-none"
          />
        ) : (
          <div className="absolute -right-4 -bottom-4 size-32 bg-zinc-800/10 rounded-full blur-3xl" />
        )}

        <div className="relative z-10">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-1">
            Live War Status
          </div>
          <div className="text-[7px] text-zinc-600 uppercase tracking-[0.4em] mb-4">
            (Refreshes every 60 seconds for the latest overview)
          </div>
          
          <div
            className={`text-3xl font-black italic uppercase tracking-tighter ${
              isWar ? "text-red-500 animate-pulse" : "text-zinc-500"
            }`}
          >
            {isWar ? (
              <span className="flex flex-col">
                <span className="text-[10px] text-zinc-600 not-italic mb-1 tracking-widest">
                  Targeting :
                  {state === "preparation" && (
                    <span className="text-amber-500 font-black animate-bounce"> (Preparation)</span>
                  )}
                  </span>
                {opponentName}
              </span>
            ) : "Resting / Neutral"}
          </div>

          {isWar && (
            <div className="mt-6 flex gap-8 text-xl font-black italic text-zinc-100">
              <div className="border-l-2 border-red-500 pl-3">
                <div className="flex items-center gap-2">
                   {clanStars} <span className="text-zinc-700 not-italic text-sm">VS</span> <span className="text-red-500">{opponentStars}</span>
                </div>
                <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest block">
                  Stars Comparison
                </span>
              </div>
              <div className="border-l-2 border-zinc-800 pl-3">
                {clanAttacks} / {totalAttacks}
                <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest block">
                  Attacks Executed
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}