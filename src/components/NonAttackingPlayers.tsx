'use client';

import { AlertCircle, Users, Zap } from 'lucide-react';
import Image from 'next/image';
import ScrollReveal from './ScrollReveal';

interface NonAttackingPlayersProps {
  war: any;
  isWar?: boolean;
}

interface ClanMember {
  tag: string;
  name: string;
  townhallLevel: number;
  mapPosition: number;
  attacks?: any[];
}

interface UnoptimizedPlayer extends ClanMember {
  attackCount: number;
  status: 'not-attacked' | 'partial';
}

export default function NonAttackingPlayers({ war, isWar = true }: NonAttackingPlayersProps) {
  // Return null if not in war
  if (!isWar || !war || !war.clan || !war.clan.members) {
    return null;
  }

  // Filter members who haven't maximized their attacks (0 or 1 attack)
  const unoptimizedPlayers: UnoptimizedPlayer[] = war.clan.members
    .filter((member: ClanMember) => !member.attacks || member.attacks.length < 2)
    .map((member: ClanMember) => ({
      ...member,
      attackCount: member.attacks ? member.attacks.length : 0,
      status: member.attacks && member.attacks.length > 0 ? 'partial' : 'not-attacked',
    }))
    .sort((a: UnoptimizedPlayer, b: UnoptimizedPlayer) => a.mapPosition - b.mapPosition);

  // Return null if all players have maximized attacks
  if (unoptimizedPlayers.length === 0) {
    return null;
  }

  // Separate into two groups
  const notAttackedPlayers = unoptimizedPlayers.filter((p) => p.status === 'not-attacked');
  const partialAttackers = unoptimizedPlayers.filter((p) => p.status === 'partial');

  return (
    <div className="mt-12 animate-slide-up">


      {/* Not Attacked Players Section */}
      {notAttackedPlayers.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 ml-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <h3 className="text-sm font-semibold uppercase text-zinc-400">Not Attacking ({unoptimizedPlayers.length})</h3>
          </div>
          <PlayerTable players={notAttackedPlayers} />
        </div>
      )}

      {/* Partial Attackers Section */}
      {partialAttackers.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 ml-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <h3 className="text-sm font-semibold uppercase text-zinc-400">Partial Attacks</h3>
          </div>
          <PlayerTable players={partialAttackers} />
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-6 flex items-center gap-2 text-xs text-zinc-500">
        <Zap size={14} />
        <span>
          {unoptimizedPlayers.length} pemain belum memaksimalkan serangan mereka
        </span>
      </div>
    </div>
  );
}

/**
 * PlayerTable Component - Reusable table for displaying player lists
 */
interface PlayerTableProps {
  players: UnoptimizedPlayer[];
}

function PlayerTable({ players }: PlayerTableProps) {
  return (
    <div className="rounded-[1.5rem] border border-zinc-900/60 bg-zinc-900/20 overflow-hidden">
      {/* Header Row */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-zinc-900/40 border-b border-zinc-900/60">
        <div className="col-span-1 text-xs font-black uppercase tracking-wider text-zinc-500">
          #
        </div>
        <div className="col-span-6 text-xs font-black uppercase tracking-wider text-zinc-500">
          Nama
        </div>
        <div className="col-span-3 text-xs font-black uppercase tracking-wider text-zinc-500">
          TH Level
        </div>
        <div className="col-span-2 text-xs font-black uppercase tracking-wider text-zinc-500">
          Tag
        </div>
      </div>

      {/* Player Rows */}
      <div className="divide-y divide-zinc-900/40">
        {players.map((player: UnoptimizedPlayer, idx: number) => (
          <ScrollReveal
            key={player.tag}
            delay={idx * 0.05}
            mobileDelay={0.1}
          >
            <div className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-zinc-800/90 transition-colors">
              {/* Map Position */}
              <div className="col-span-1 flex items-center">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-500">
                  {player.mapPosition}
                </span>
              </div>

              {/* Player Name */}
              <div className="col-span-6 flex items-center">
                <span className="font-semibold text-zinc-100 truncate">
                  {player.name}
                </span>
              </div>

              {/* Town Hall Level */}
              <div className="col-span-3 flex items-center">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8">
                    <Image
                      src={`/townhall/Town_Hall${player.townhallLevel}${player.townhallLevel === 17 ? '-1' : ''}.webp`}
                      alt={`Town Hall ${player.townhallLevel}`}
                      fill
                      className="object-contain"
                      sizes="32px"
                    />
                  </div>
                  <span className="text-xs text-zinc-400">TH{player.townhallLevel}</span>
                </div>
              </div>

              {/* Player Tag */}
              <div className="col-span-2 flex items-center">
                <span className="px-2 py-1 text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 rounded border border-amber-500/30 truncate">
                  {player.tag}
                </span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
