import ScrollReveal from "./ScrollReveal";
import { getBadgeByLeagueName } from "@/constants/league"; // Pastikan path-nya bener Ri

interface ClanCapitalCardProps {
  capitalLeagueName?: string;
  clanCapitalPoints?: number;
}

export default function ClanCapitalCard({
  capitalLeagueName,
  clanCapitalPoints,
}: ClanCapitalCardProps) {
  const badgeUrl = getBadgeByLeagueName(capitalLeagueName);

  return (
    <ScrollReveal delay={0.4} mobileDelay={0.1} className="w-full h-full flex">
      <div className="w-full p-10 bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] flex items-center justify-between group hover:border-amber-500/30 transition-all overflow-hidden relative">
        
        {/* Badge Liga sebagai background dekoratif */}
        <img 
          src={badgeUrl} 
          alt="League Badge"
          className="absolute -right-6 -bottom-6 size-48 opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700 -rotate-12 pointer-events-none"
        />

        <div className="relative z-10">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-2">
            Clan Capital District
          </div>
          <div className="text-3xl font-black italic uppercase text-amber-500 tracking-tighter">
            {capitalLeagueName || "Unranked"}
          </div>
          <div className="mt-4 text-lg font-black italic text-zinc-100">
            {clanCapitalPoints?.toLocaleString() || "0"}
            <span className="text-[8px] text-zinc-600 uppercase tracking-widest block mt-1">
              Capital Points
            </span>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}