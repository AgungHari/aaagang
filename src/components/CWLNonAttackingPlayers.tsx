'use client';

import { AlertCircle } from 'lucide-react';

interface CWLNonAttackingPlayersProps {
  war: any;
  isWar: boolean;
}

const PlayerCard = ({ player }: { player: any }) => (
  <div className="p-3 bg-zinc-800/40 border border-zinc-700/30 rounded-lg hover:bg-zinc-800/60 transition-colors">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="font-semibold text-zinc-100">{player.name}</p>
        <p className="text-xs text-zinc-500 font-mono mt-1">{player.tag}</p>
      </div>
      <div className="text-right">
        <div className="inline-flex items-center gap-2 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded text-xs font-bold text-red-300">
          ⚠️ Not Attacked
        </div>
      </div>
    </div>
  </div>
);

const ClanNonAttackingSection = ({ clanName, players, color }: { clanName: string; players: any[]; color: string }) => {
  if (players.length === 0) return null;

  return (
    <div>
      <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${color}`}>
        <span className={`w-2 h-2 rounded-full ${color === 'text-amber-400' ? 'bg-amber-500' : 'bg-blue-500'}`} />
        {clanName}
      </h4>
      <div className="space-y-2">
        {players.map((player: any) => (
          <PlayerCard key={player.tag} player={player} />
        ))}
      </div>
    </div>
  );
};

export default function CWLNonAttackingPlayers({ war, isWar }: CWLNonAttackingPlayersProps) {
  // Skip rendering during preparation phase
  if (!isWar || war?.state === 'preparation' || (!war.clan?.members && !war.opponent?.members)) return null;

  // Players dari clan yang belum attack
  const clanNonAttacking = (war.clan?.members || []).filter(
    (member: any) => !member.attacks || member.attacks.length === 0
  );

  // Players dari opponent yang belum attack
  const opponentNonAttacking = (war.opponent?.members || []).filter(
    (member: any) => !member.attacks || member.attacks.length === 0
  );

  // Jika keduanya sudah 100% attack
  if (clanNonAttacking.length === 0 && opponentNonAttacking.length === 0) {
    return (
      <div className="p-8 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-cyan-500/10 border border-green-500/40 rounded-2xl backdrop-blur-sm">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="text-5xl animate-bounce">🏆</div>
          <div>
            <h3 className="text-2xl font-black text-green-300 mb-2 uppercase tracking-wide">
              Both Clans 100% Attack!
            </h3>
            <p className="text-sm text-green-400/90">
              Sempurna! Semua player dari kedua clan sudah melakukan attack mereka. Pertarungan total!
            </p>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-lg">
              <p className="text-xs font-semibold text-green-300">⚡ Maximum Engagement</p>
            </div>
            <div className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 rounded-lg">
              <p className="text-xs font-semibold text-cyan-300">✓ Full Utilization</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-zinc-900/20 backdrop-blur-sm border border-zinc-800/40 rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle size={20} className="text-amber-500" />
        <h3 className="text-lg font-bold">
          Players Belum Attack <span className="text-amber-400">({clanNonAttacking.length + opponentNonAttacking.length})</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Clan Players */}
        {clanNonAttacking.length > 0 && (
          <ClanNonAttackingSection
            clanName={war.clan?.name}
            players={clanNonAttacking}
            color="text-amber-400"
          />
        )}
        {clanNonAttacking.length === 0 && (
          <div className="p-6 bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-2 border-amber-500/40 rounded-xl backdrop-blur-sm group hover:border-amber-500/60 transition-all">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="text-4xl group-hover:scale-110 transition-transform">⭐</div>
              <div>
                <p className="text-sm font-black text-amber-300 uppercase tracking-wide">{war.clan?.name}</p>
                <p className="text-xs text-amber-400/80 mt-1">100% Attack Completion</p>
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-2" />
            </div>
          </div>
        )}

        {/* Opponent Players */}
        {opponentNonAttacking.length > 0 && (
          <ClanNonAttackingSection
            clanName={war.opponent?.name}
            players={opponentNonAttacking}
            color="text-blue-400"
          />
        )}
        {opponentNonAttacking.length === 0 && (
          <div className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border-2 border-blue-500/40 rounded-xl backdrop-blur-sm group hover:border-blue-500/60 transition-all">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="text-4xl group-hover:scale-110 transition-transform">⭐</div>
              <div>
                <p className="text-sm font-black text-blue-300 uppercase tracking-wide">{war.opponent?.name}</p>
                <p className="text-xs text-blue-400/80 mt-1">100% Attack Completion</p>
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-3 bg-amber-500/5 border border-amber-500/20 rounded text-xs text-amber-300/80">
        💡 Di CWL, setiap player hanya punya 1 slot attack. Player di sini belum menggunakannya.
      </div>
    </div>
  );
}
