'use client'
import { motion } from "motion/react";
import { Trophy, Zap } from "lucide-react";

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

interface WarTestimonialCardProps {
  war: WarLogItem;
  index: number;
}

export default function WarTestimonialCard({ war, index }: WarTestimonialCardProps) {
  const getResultBadgeColor = () => {
    switch (war.result) {
      case "win":
        return "bg-green-500/20 text-green-400";
      case "lose":
        return "bg-red-500/20 text-red-400";
      case "tie":
        return "bg-amber-500/20 text-amber-400 ";
      default:
        return "bg-zinc-800/20 text-zinc-500 ";
    }
  };

  const getResultBadgeText = () => {
    switch (war.result) {
      case "win":
        return "Victory";
      case "lose":
        return "Defeat";
      case "tie":
        return "Draw";
      default:
        return "Cancelled";
    }
  };

    const getWarDescription = () => {
    switch (war.result) {
        case "win":
        return (
            <>
            Membantai dengan skor {war.clan.stars}:{war.opponent.stars}
            </>
        );
        case "lose":
        return (
            <>
            Dibantai dengan skor ({war.clan.stars}:{war.opponent.stars})
            </>
        );
        case "tie":
        return (
            <>
            Seri dengan skor ({war.clan.stars}:{war.opponent.stars})
            </>
        );
        default:
        return (
            <>
            Clannya bubar no data
            </>);
    }
    };

return (
    <motion.div 
      className="relative p-4 rounded-lg mx-2 w-72 min-w-72 max-w-72 shrink-0 bg-zinc-900/20 border border-zinc-800/50"
        initial={{ y: 150, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 blur-3xl rounded-full group-hover:bg-amber-500/10 transition-colors"></div>

      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {war.opponent.badgeUrls?.small ? (
              <img 
                src={war.opponent.badgeUrls.small} 
                alt={war.opponent.name}
                className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.3)] transition-transform"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center text-xs font-bold text-zinc-500">—</div>
            )}
            <div>
              <p className="font-black uppercase italic text-sm tracking-tight transition-colors">
                {war.opponent.name}
              </p>
              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full inline-block mt-1 border ${getResultBadgeColor().replace('bg-', 'border-').split(' ')[0]} ${getResultBadgeColor()}`}>
                {getResultBadgeText()}
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-zinc-400 font-medium italic leading-relaxed border-l-2 border-amber-500/20 pl-3">
          "{getWarDescription()}"
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-zinc-800/50 pt-4 relative z-10 mt-4">
        <div>
          <div className="flex items-center gap-1 text-[10px] font-black italic text-amber-500">
            <Trophy size={10}/> {war.clan.stars} vs {war.opponent.stars}
          </div>
          <div className="text-[7px] text-zinc-600 font-bold uppercase tracking-tighter">Final Stars</div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-[10px] font-black italic text-blue-500">
             {war.clan.destructionPercentage.toFixed(1)}% <Zap size={10}/>
          </div>
          <div className="text-[7px] text-zinc-600 font-bold uppercase tracking-tighter">Destruction</div>
        </div>
      </div>
    </motion.div>
  );
}