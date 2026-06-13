'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge, TrendingUp } from 'lucide-react';

interface CWLWarCardProps {
  clan1: {
    tag: string;
    name: string;
    badgeUrl?: string;
    stars?: number;
    destructionPercent?: number;
  };
  clan2: {
    tag: string;
    name: string;
    badgeUrl?: string;
    stars?: number;
    destructionPercent?: number;
  };
  warState: 'preparation' | 'inWar' | 'warEnded';
  warTag: string;
  roundNum: number;
}

const DEFAULT_BADGE = 'https://api-assets.clashofclans.com/badges/70/lALfQlcyXt0AHyT-gKBbPe5i1fYaJfqYxj2eM1qXHs4.png';

export default function CWLWarCard({
  clan1,
  clan2,
  warState,
  warTag,
  roundNum,
}: CWLWarCardProps) {
  const getStateColor = (state: string) => {
    switch (state) {
      case 'preparation':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
      case 'inWar':
        return 'bg-amber-500/20 border-amber-500/30 text-amber-300';
      case 'warEnded':
        return 'bg-green-500/20 border-green-500/30 text-green-300';
      default:
        return 'bg-zinc-500/20 border-zinc-500/30 text-zinc-300';
    }
  };

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'preparation':
        return 'Preparation';
      case 'inWar':
        return 'In War';
      case 'warEnded':
        return 'Ended';
      default:
        return 'Unknown';
    }
  };

  const getBadgeUrl = (url?: string) => {
    return url && url.trim() ? url : DEFAULT_BADGE;
  };

  return (
    <Link href={`/livecwlstatus/${encodeURIComponent(clan1.tag)}/war/${encodeURIComponent(warTag)}`}>
      <div className="group relative p-4 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/60 rounded-xl hover:border-amber-500/40 hover:bg-zinc-900/60 transition-all duration-300 cursor-pointer h-full overflow-hidden">
        {/* Round Badge */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-zinc-800/80 border border-zinc-700/50 rounded-lg text-[10px] font-bold text-zinc-300 uppercase tracking-wide">
          Round {roundNum}
        </div>

        {/* War State Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 border rounded-lg text-[10px] font-bold uppercase tracking-wide ${getStateColor(warState)}`}>
          {getStateLabel(warState)}
        </div>

        {/* Main Content */}
        <div className="mt-8 space-y-3">
          {/* Clan 1 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-700/50 bg-zinc-800">
              <Image
                src={getBadgeUrl(clan1.badgeUrl)}
                alt={clan1.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                onError={(e: any) => {
                  e.currentTarget.src = DEFAULT_BADGE;
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-zinc-100 truncate">{clan1.name}</p>
              <p className="text-xs text-zinc-500 font-mono">{clan1.tag}</p>
            </div>
            {clan1.stars !== undefined && (
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-xs font-bold text-amber-400">
                ⭐ {clan1.stars}
              </div>
            )}
          </div>

          {/* VS Divider */}
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-transparent" />
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">vs</span>
            <div className="flex-1 h-px bg-gradient-to-l from-zinc-800 to-transparent" />
          </div>

          {/* Clan 2 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-700/50 bg-zinc-800">
              <Image
                src={getBadgeUrl(clan2.badgeUrl)}
                alt={clan2.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                onError={(e: any) => {
                  e.currentTarget.src = DEFAULT_BADGE;
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-zinc-100 truncate">{clan2.name}</p>
              <p className="text-xs text-zinc-500 font-mono">{clan2.tag}</p>
            </div>
            {clan2.stars !== undefined && (
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-xs font-bold text-amber-400">
                ⭐ {clan2.stars}
              </div>
            )}
          </div>
        </div>

        {/* Hover Indicator */}
      </div>
    </Link>
  );
}
