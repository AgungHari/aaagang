'use client';

import { AlertCircle, Check, Copy, Swords, Zap } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { copyTextToClipboard } from '@/lib/copyToClipboard';
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
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

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

  const formatPlayerGroup = (label: string, players: UnoptimizedPlayer[]) => [
    `${label} (${players.length})`,
    ...(players.length > 0 ? players.map((player) => `- ${player.name}`) : ['- Tidak ada']),
  ].join('\n');

  const handleCopyPlayerList = async () => {
    const text = [
      formatPlayerGroup('Belum attack', notAttackedPlayers),
      formatPlayerGroup('Partial attack', partialAttackers),
    ].join('\n\n');

    try {
      await copyTextToClipboard(text);
      setCopyStatus('copied');
    } catch (error) {
      console.error('Failed to copy player list:', error);
      setCopyStatus('error');
    }
  };

  return (
    <section className="mt-12 animate-slide-up">
      <div className="relative overflow-hidden rounded-[2rem] border border-zinc-800/60 bg-gradient-to-br from-zinc-900/60 via-zinc-950/50 to-zinc-900/30 p-4 shadow-2xl sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-amber-500/[0.04] blur-3xl" />

        <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <Swords size={19} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-black uppercase italic tracking-tight text-zinc-100 sm:text-xl">
                  Pantau Serangan
                </h2>
                <span className="rounded-full border border-zinc-700/70 bg-zinc-900/80 px-2.5 py-1 text-[10px] font-bold text-zinc-400">
                  {unoptimizedPlayers.length} pemain
                </span>
              </div>
              <p className="mt-0.5 text-xs text-zinc-500">
                Pemain yang masih memiliki serangan tersisa
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <button
              type="button"
              onClick={handleCopyPlayerList}
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300 transition-all hover:border-amber-500/40 hover:bg-amber-500/20 active:scale-[0.98] sm:w-auto"
            >
              {copyStatus === 'copied' ? <Check size={15} /> : <Copy size={15} />}
              {copyStatus === 'copied' ? 'Daftar tersalin' : 'Salin daftar pemain'}
            </button>
            <span aria-live="polite" className="min-h-4 text-xs text-zinc-400">
              {copyStatus === 'error' && (
                <span className="inline-flex items-center gap-1 text-red-400">
                  <AlertCircle size={14} />
                  Gagal menyalin. Coba lagi.
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="relative grid gap-4 lg:grid-cols-2">
          {notAttackedPlayers.length > 0 && (
            <PlayerGroup
              title="Belum Menyerang"
              players={notAttackedPlayers}
              tone="red"
            />
          )}
          {partialAttackers.length > 0 && (
            <PlayerGroup
              title="Serangan Belum Lengkap"
              players={partialAttackers}
              tone="amber"
            />
          )}
        </div>

        <div className="relative mt-5 flex items-center gap-2 border-t border-zinc-800/60 pt-4 text-xs text-zinc-500">
          <Zap size={14} className="shrink-0 text-amber-500" />
          <span>
            {unoptimizedPlayers.length} pemain belum menggunakan semua serangan
            mereka.
          </span>
        </div>
      </div>
    </section>
  );
}

interface PlayerGroupProps {
  title: string;
  players: UnoptimizedPlayer[];
  tone: 'red' | 'amber';
}

function PlayerGroup({ title, players, tone }: PlayerGroupProps) {
  const toneClasses = tone === 'red'
    ? {
        border: 'border-red-500/15',
        badge: 'border-red-500/20 bg-red-500/10 text-red-400',
        dot: 'bg-red-400',
      }
    : {
        border: 'border-amber-500/15',
        badge: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
        dot: 'bg-amber-400',
      };

  return (
    <div className={`overflow-hidden rounded-2xl border bg-zinc-950/40 ${toneClasses.border}`}>
      <div className="flex items-center justify-between border-b border-zinc-800/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${toneClasses.dot}`} />
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-300">
            {title}
          </h3>
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${toneClasses.badge}`}>
          {players.length}
        </span>
      </div>

      <div className="divide-y divide-zinc-800/50">
        {players.map((player: UnoptimizedPlayer, idx: number) => (
          <ScrollReveal key={player.tag} delay={idx * 0.03} mobileDelay={0.03}>
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 transition-colors hover:bg-zinc-900/70 sm:grid-cols-12 sm:gap-4 sm:px-4">
              <div className="flex items-center sm:col-span-1">
                <span className={`inline-flex size-7 items-center justify-center rounded-lg border text-xs font-black ${toneClasses.badge}`}>
                  {player.mapPosition}
                </span>
              </div>

              <div className="min-w-0 sm:col-span-6">
                <span className="block truncate text-sm font-bold text-zinc-100">
                  {player.name}
                </span>
                <span className="mt-0.5 block truncate font-mono text-[9px] text-zinc-500 sm:hidden">
                  {player.tag}
                </span>
              </div>

              <div className="flex items-center justify-end gap-1.5 sm:col-span-3 sm:justify-start sm:gap-2">
                <div className="relative size-7 shrink-0 sm:size-8">
                  <Image
                    src={`/townhall/Town_Hall${player.townhallLevel}${player.townhallLevel === 17 ? '-1' : ''}.webp`}
                    alt={`Town Hall ${player.townhallLevel}`}
                    fill
                    className="object-contain"
                    sizes="32px"
                  />
                </div>
                <span className="text-[10px] font-semibold text-zinc-400 sm:text-xs">
                  TH{player.townhallLevel}
                </span>
              </div>

              <div className="hidden sm:col-span-2 sm:flex sm:items-center">
                <span className="max-w-full truncate rounded-lg border border-zinc-700/60 bg-zinc-900/70 px-2 py-1 font-mono text-[10px] font-bold text-zinc-400">
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
