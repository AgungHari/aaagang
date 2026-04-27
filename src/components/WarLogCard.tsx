import { Trophy, Target, Flame, Zap, Users } from "lucide-react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

interface WarLogItem {
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
    badgeUrls?: {
      small: string;
      large: string;
      medium: string;
    };
  };
}

interface WarLogCardProps {
  war: WarLogItem;
  index: number;
}

export default function WarLogCard({ war, index }: WarLogCardProps) {
  const getResultBadge = () => {
    switch (war.result) {
      case "win":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase">
            Victory
          </span>
        );
      case "lose":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase text-zinc-500">
            Defeat
          </span>
        );
      case "tie":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase">
            Draw
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase text-zinc-500">
            Cancelled 
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    // Convert format from 20260420T022323.000Z to 2026-04-20T02:23:23.000Z
    const formatted = `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}T${dateString.substring(9, 11)}:${dateString.substring(11, 13)}:${dateString.substring(13, 15)}.${dateString.substring(16)}`;
    const date = new Date(formatted);
    
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const isLose = war.result === "lose";
  const textColorClass = isLose ? "text-zinc-500" : "text-zinc-100";
  const labelColorClass = isLose ? "text-zinc-600" : "text-zinc-500";
  const numberColorClass = isLose ? "text-zinc-500" : "text-zinc-300";
  const valueColorClass = isLose ? "text-zinc-500" : "text-amber-500";

  return (
    <ScrollReveal delay={index * 0.02} mobileDelay={0.01}>
      <div
        className="border border-zinc-800/50 rounded-[2rem] p-6 transition-all group relative overflow-hidden h-full"
      >
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 blur-3xl rounded-full group-hover:bg-amber-500/10 transition-colors"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            {war.opponent.badgeUrls?.small && (
              <Image
                src={war.opponent.badgeUrls.small}
                alt={`${war.opponent.name} clan badge`}
                width={40}
                height={40}
                loading="eager"
                unoptimized
                className={`w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.3)] transition-transform ${isLose ? "" : "group-hover:scale-110"}`}
              />
            )}
            <div>
              <h3 className={`font-black text-lg tracking-tight uppercase transition-colors italic ${isLose ? "text-zinc-500" : "group-hover:text-amber-500"}`}>
                {war.opponent.name}
              </h3>
              <p className={`text-[10px] font-bold uppercase mt-1 ${labelColorClass}`}>
                {formatDate(war.endTime)}
              </p>
            </div>
          </div>
          {getResultBadge()}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-zinc-800/30 relative z-10">
          {/* Clan Stats */}
          <div>
            <div className={`text-[9px] font-black uppercase tracking-wider mb-2 ${labelColorClass}`}>
              AAA GANG
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Trophy size={14} className={isLose ? "text-zinc-600" : "text-amber-500"} />
                <span className={`text-sm font-black ${numberColorClass}`}>{war.clan.stars}</span>
                <span className={`text-[9px] ${isLose ? "text-zinc-600" : "text-zinc-600"}`}>Stars</span>
              </div>
              <div className="flex items-center gap-2">
                <Target size={14} className={isLose ? "text-zinc-600" : "text-blue-500"} />
                <span className={`text-sm font-black ${numberColorClass}`}>
                  {war.clan.destructionPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Opponent Stats */}
          <div>
            <div className={`text-[9px] font-black uppercase tracking-wider mb-2 ${labelColorClass}`}>
              Opponent
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Trophy size={14} className={isLose ? "text-zinc-600" : "text-amber-500"} />
                <span className={`text-sm font-black ${numberColorClass}`}>{war.opponent.stars}</span>
                <span className={`text-[9px] ${isLose ? "text-zinc-600" : "text-zinc-600"}`}>Stars</span>
              </div>
              <div className="flex items-center gap-2">
                <Target size={14} className={isLose ? "text-zinc-600" : "text-blue-500"} />
                <span className={`text-sm font-black ${numberColorClass}`}>
                  {war.opponent.destructionPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Users size={14} className={isLose ? "text-zinc-600" : "text-amber-500"} />
              <span className={`text-xs font-bold ${isLose ? "text-zinc-500" : "text-zinc-400"}`}>
                {war.teamSize} vs {war.teamSize}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Flame size={14} className={isLose ? "text-zinc-600" : "text-orange-500"} />
              <span className={`text-xs font-bold ${isLose ? "text-zinc-500" : "text-zinc-400"}`}>
                {war.attacksPerMember}x Att. Per Member
              </span>
            </div>
          </div>
          {war.result && war.result !== "tie" && (
            <div className="text-right">
              <span className={`text-[9px] font-bold uppercase block ${isLose ? "text-zinc-600" : "text-zinc-600"}`}>
                Exp Earned
              </span>
              <span className={`text-sm font-black ${valueColorClass}`}>
                +{war.clan.expEarned}
              </span>
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}
