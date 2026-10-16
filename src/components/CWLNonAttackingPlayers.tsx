'use client';

import { AlertCircle, Check, Copy, Swords, Zap } from 'lucide-react';
import { useState } from 'react';
import { copyTextToClipboard } from '@/lib/copyToClipboard';

interface CWLNonAttackingPlayersProps {
  war: any;
  isWar: boolean;
}

interface CWLPlayer {
  tag: string;
  name: string;
  mapPosition?: number;
}

export default function CWLNonAttackingPlayers({ war, isWar }: CWLNonAttackingPlayersProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  if (!isWar || !war || war.state === 'preparation' || (!war.clan?.members && !war.opponent?.members)) {
    return null;
  }

  const clanNonAttacking: CWLPlayer[] = (war.clan?.members || []).filter(
    (member: CWLPlayer & { attacks?: unknown[] }) => !member.attacks || member.attacks.length === 0
  );
  const opponentNonAttacking: CWLPlayer[] = (war.opponent?.members || []).filter(
    (member: CWLPlayer & { attacks?: unknown[] }) => !member.attacks || member.attacks.length === 0
  );
  const totalNonAttacking = clanNonAttacking.length + opponentNonAttacking.length;

  const handleCopyPlayerList = async () => {
    const formatPlayerGroup = (label: string, players: CWLPlayer[]) => [
      `${label} (${players.length})`,
      ...(players.length > 0 ? players.map((player) => `- ${player.name}`) : ['- Tidak ada']),
    ].join('\n');

    const text = [
      formatPlayerGroup(war.clan?.name || 'Clan', clanNonAttacking),
      formatPlayerGroup(war.opponent?.name || 'Opponent', opponentNonAttacking),
    ].join('\n\n');

    try {
      await copyTextToClipboard(text);
      setCopyStatus('copied');
    } catch (error) {
      console.error('Failed to copy CWL player list:', error);
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
                  Pantau Serangan CWL
                </h2>
                <span className="rounded-full border border-zinc-700/70 bg-zinc-900/80 px-2.5 py-1 text-[10px] font-bold text-zinc-400">
                  {totalNonAttacking} pemain
                </span>
              </div>
              <p className="mt-0.5 text-xs text-zinc-500">
                Pemain yang belum menggunakan serangannya di ronde ini
              </p>
            </div>
          </div>

          {totalNonAttacking > 0 && (
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
          )}
        </div>

        {totalNonAttacking === 0 ? (
          <div className="relative flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-5 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
              <Check size={22} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-emerald-200">
                Semua Serangan Sudah Digunakan
              </h3>
              <p className="mt-1 text-xs text-emerald-300/70">
                Kedua clan telah menyelesaikan serangan CWL ronde ini.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative grid gap-4 lg:grid-cols-2">
            <PlayerGroup
              title={war.clan?.name || 'Clan'}
              players={clanNonAttacking}
              tone="amber"
            />
            <PlayerGroup
              title={war.opponent?.name || 'Opponent'}
              players={opponentNonAttacking}
              tone="blue"
            />
          </div>
        )}

        <div className="relative mt-5 flex items-center gap-2 border-t border-zinc-800/60 pt-4 text-xs text-zinc-500">
          <Zap size={14} className="shrink-0 text-amber-500" />
          <span>
            Di CWL, setiap pemain mendapat satu serangan per ronde.
          </span>
        </div>
      </div>
    </section>
  );
}

interface PlayerGroupProps {
  title: string;
  players: CWLPlayer[];
  tone: 'amber' | 'blue';
}

function PlayerGroup({ title, players, tone }: PlayerGroupProps) {
  const toneClasses = tone === 'amber'
    ? {
        border: 'border-amber-500/15',
        badge: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
        dot: 'bg-amber-400',
      }
    : {
        border: 'border-blue-500/15',
        badge: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
        dot: 'bg-blue-400',
      };

  return (
    <div className={`overflow-hidden rounded-2xl border bg-zinc-950/40 ${toneClasses.border}`}>
      <div className="flex items-center justify-between border-b border-zinc-800/60 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`size-2 shrink-0 rounded-full ${toneClasses.dot}`} />
          <h3 className="truncate text-xs font-black uppercase tracking-wider text-zinc-300">
            {title}
          </h3>
        </div>
        <span className={`ml-2 shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${toneClasses.badge}`}>
          {players.length}
        </span>
      </div>

      {players.length > 0 ? (
        <div className="divide-y divide-zinc-800/50">
          {players.map((player, idx) => (
            <div
              key={player.tag}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-3 py-3 transition-colors hover:bg-zinc-900/70 sm:px-4"
            >
              <span className={`inline-flex size-7 items-center justify-center rounded-lg border text-xs font-black ${toneClasses.badge}`}>
                {player.mapPosition ?? idx + 1}
              </span>
              <div className="min-w-0">
                <span className="block truncate text-sm font-bold text-zinc-100">
                  {player.name}
                </span>
                <span className="mt-0.5 block truncate font-mono text-[9px] text-zinc-500">
                  {player.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-24 items-center justify-center px-4 text-center">
          <p className="text-xs font-medium text-zinc-500">
            Semua pemain clan ini sudah menyerang.
          </p>
        </div>
      )}
    </div>
  );
}
