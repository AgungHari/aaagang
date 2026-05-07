import { Medal, Star, StarHalf, StarOff, Timer, ChessQueen, CrownIcon, Zap } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { mockWarHighlights, mockIsWar } from "@/lib/mockData";  // untuk testing

interface WarHighlight {
  name: string;
  type: string;
  desc: string;
  priority: number;
}

interface HallOfFameProps {
  isWar: boolean;
  war?: any;
}

export default function HallOfFame({ isWar, war }: HallOfFameProps) {
  const getWarHighlights = (): WarHighlight[] => {
    if (!isWar || !war?.clan?.members) return [];
    const highlights: WarHighlight[] = [];

    war.clan.members.forEach((m: any) => {
      if (!m.attacks) return;
      m.attacks.forEach((atk: any) => {
        const opponent = war.opponent.members.find((opp: any) => opp.tag === atk.defenderTag);
        const opponentName = opponent?.name || "Enemy";

        if (atk.stars === 3 && opponent?.mapPosition === 1) {
          highlights.push({
            name: m.name,
            type: "King Slayer",
            priority: 1,
            desc: `ELIMINATED THE ENEMY KING 1. ${opponentName}! `,
          });
        } else if (atk.stars === 3 && opponent && opponent.townhallLevel > m.townhallLevel) {
          highlights.push({
            name: m.name,
            type: "Giant Slayer",
            priority: 2,
            desc: `Destroy ${opponent.mapPosition}. ${opponentName} (TH ${opponent.townhallLevel}) as TH ${m.townhallLevel}!`,
          });
        } else if (atk.stars === 3 && atk.duration < 100) {
          highlights.push({
            name: m.name,
            type: "Blitzkrieg",
            priority: 3,
            desc: `3-Starred ${opponent.mapPosition}. ${opponentName} in just ${atk.duration}s!`,
          });
        } else if (atk.stars === 3) {
          highlights.push({
            name: m.name,
            type: "Perfect 3 Star Attack",
            priority: 4,
            desc: `Flawless 100% vs ${opponent.mapPosition}. ${opponentName}!`,
          });
        } else if (atk.stars === 2) {
          highlights.push({
            name: m.name,
            type: "Nice Attack 2 Star",
            priority: 5,
            desc: `${atk.destructionPercentage}% vs ${opponent.mapPosition}. ${opponentName} - Nice try!`,
          });
        } else if (atk.stars === 1) {
          highlights.push({
            name: m.name,
            type: "Unlucky 1 Star",
            priority: 6,
            desc: `${atk.destructionPercentage}% vs ${opponent.mapPosition}. ${opponentName} - So close!`,
          });
        }
      });
    });

    return highlights.sort((a, b) => a.priority - b.priority);
  };

  const highlights = getWarHighlights();
  if (!isWar || highlights.length === 0) return null;

  return (
    <ScrollReveal delay={0.1} mobileDelay={0.1}>
      <div className="max-w-7xl mx-auto px-6 mt-12 mb-24">
        <div className="p-8 bg-zinc-900/10 border border-zinc-800/50 rounded-[2.5rem]">
          <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-8 animate-pulse">
            <Medal size={14} className="text-amber-500" /> Live War Hall of Fame
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map((h, i) => (
              <ScrollReveal key={i} delay={i * 0.02}>
                <div
                  className={`p-5 bg-zinc-950/40 border rounded-2xl group transition-all ${
                    h.type === "Unlucky 1 Star"
                      ? "border-zinc-800/50 grayscale opacity-60"
                      : h.type === "Nice Attack 2 Star"
                        ? "border-amber-500/10 hover:border-amber-800/30 opacity-80"
                        : "border-amber-500/10 hover:border-amber-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        h.type.includes("Unlucky")
                          ? "bg-zinc-800 text-zinc-500"
                          : h.type === "Nice Attack 2 Star"
                            ? "bg-amber-800/10 text-amber-800"
                            : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {h.type.includes("Unlucky") ? (
                        <StarOff size={14} />
                      ) : h.type === "King Slayer" ? (
                        <ChessQueen size={14} />
                      ) : h.type === "Giant Slayer" ? (
                        <CrownIcon size={14} />
                      ) : h.type === "Blitzkrieg" ? (
                        <Timer size={14} />
                      ) : h.type === "Perfect 3 Star Attack" ? (
                        <Star size={14} />
                      ) : h.type === "Nice Attack 2 Star" ? (
                        <StarHalf size={14} />
                      ) : (
                        <Zap size={14} />
                      )}
                    </div>
                    <div className="text-xs font-black uppercase italic tracking-tight">{h.name}</div>
                  </div>
                  <div
                    className={`text-[9px] font-bold uppercase tracking-tighter leading-tight ${
                      h.type.includes("Unlucky") ? "text-zinc-500" : "text-amber-500/70"
                    }`}
                  >
                    {h.type}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-medium italic mt-1 line-clamp-1">
                    {h.desc}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
