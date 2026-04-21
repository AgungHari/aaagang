import { Castle } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface ClanCapitalCardProps {
  capitalLeagueName?: string;
  clanCapitalPoints?: number;
}

export default function ClanCapitalCard({
  capitalLeagueName,
  clanCapitalPoints,
}: ClanCapitalCardProps) {
  return (
    <ScrollReveal delay={0.4} mobileDelay={0.1} className="w-full h-full flex">
      <div className="w-full p-10 bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] flex items-center justify-between group hover:border-amber-500/30 transition-all overflow-hidden relative">
        <Castle className="absolute -right-4 -bottom-4 size-32 text-zinc-800/20 -rotate-12 group-hover:text-amber-500/10 transition-colors" />
        <div className="relative z-10">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-2">
            Clan Capital District
          </div>
          <div className="text-3xl font-black italic uppercase text-amber-500 tracking-tighter">
            {capitalLeagueName || "Unranked"}
          </div>
          <div className="mt-4 text-lg font-black italic">
            {clanCapitalPoints?.toLocaleString() || "0"}
            <span className="text-[8px] text-zinc-600 uppercase tracking-widest block">
              Capital Points
            </span>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
