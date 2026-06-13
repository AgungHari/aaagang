'use client';

import { Trophy, Shield, Swords, Users, Zap } from 'lucide-react';

interface CWLWarStatusCardProps {
  state: string;
  clanData: {
    name: string;
    tag: string;
    badgeUrl?: string;
    members: number;
    clanLevel: number;
    stars: number;
    destructionPercent: number;
    attacks: number;
  };
  opponentData: {
    name: string;
    tag: string;
    badgeUrl?: string;
    members: number;
    clanLevel: number;
    stars: number;
    destructionPercent: number;
    attacks: number;
  };
}

export default function CWLWarStatusCard({
  state,
  clanData,
  opponentData,
}: CWLWarStatusCardProps) {
  const stateConfig = {
    preparation: {
      label: '🔵 Preparation',
      bgClass: 'bg-blue-500/10 border-blue-500/30',
      textClass: 'text-blue-300',
    },
    inWar: {
      label: '🟠 In War',
      bgClass: 'bg-amber-500/10 border-amber-500/30',
      textClass: 'text-amber-300',
    },
    warEnded: {
      label: '🟢 War Ended',
      bgClass: 'bg-green-500/10 border-green-500/30',
      textClass: 'text-green-300',
    },
  };

  const currentState = stateConfig[state as keyof typeof stateConfig] || stateConfig.preparation;
  const isWarEnded = state === 'warEnded';

  return (
    <div className={`w-full p-8 rounded-2xl border backdrop-blur-sm ${currentState.bgClass} transition-all`}>
      {/* Status Badge */}
      <div className="flex justify-center mb-8">
        <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide border ${currentState.bgClass}`}>
          {currentState.label}
        </span>
      </div>

      {/* Main War Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Your Clan */}
        <div className="flex flex-col items-center">
          {/* Badge */}
          {clanData.badgeUrl && (
            <div className="mb-4 relative">
              <div className="w-24 h-24 rounded-full border-2 border-amber-500/30 p-1 bg-zinc-900/50">
                <img
                  src={clanData.badgeUrl}
                  alt={clanData.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {clanData.clanLevel}
              </span>
            </div>
          )}

          {/* Clan Info */}
          <h3 className="text-xl font-bold text-center text-amber-400 mb-2">{clanData.name}</h3>
          <p className="text-xs text-zinc-400 font-mono mb-4">{clanData.tag}</p>

          {/* Stats Grid */}
          <div className="w-full space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-zinc-800/30 rounded-lg">
              <span className="text-zinc-400 flex items-center gap-2">
                <Users size={14} /> Members
              </span>
              <span className="font-bold">{clanData.members}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-zinc-800/30 rounded-lg">
              <span className="text-zinc-400 flex items-center gap-2">
                <Trophy size={14} /> Stars
              </span>
              <span className="font-bold text-amber-400">{clanData.stars} ⭐</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-zinc-800/30 rounded-lg">
              <span className="text-zinc-400 flex items-center gap-2">
                <Zap size={14} /> Destruction
              </span>
              <span className="font-bold text-amber-400">{clanData.destructionPercent.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-zinc-800/30 rounded-lg">
              <span className="text-zinc-400 flex items-center gap-2">
                <Swords size={14} /> Attacks
              </span>
              <span className="font-bold">{clanData.attacks}/{clanData.members}</span>
            </div>
          </div>
        </div>

        {/* VS Center */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-16 h-16 rounded-full border-2 border-zinc-700 flex items-center justify-center bg-zinc-900/50 mb-4">
            <span className="text-2xl font-black text-zinc-400">VS</span>
          </div>
          {!isWarEnded && (
            <div className="text-center">
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">CWL War</p>
            </div>
          )}
          {isWarEnded && (
            <div className="text-center">
              <p className="text-xs text-green-400 uppercase tracking-widest font-semibold">War Finished</p>
            </div>
          )}
        </div>

        {/* Opponent Clan */}
        <div className="flex flex-col items-center">
          {/* Badge */}
          {opponentData.badgeUrl && (
            <div className="mb-4 relative">
              <div className="w-24 h-24 rounded-full border-2 border-blue-500/30 p-1 bg-zinc-900/50">
                <img
                  src={opponentData.badgeUrl}
                  alt={opponentData.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {opponentData.clanLevel}
              </span>
            </div>
          )}

          {/* Clan Info */}
          <h3 className="text-xl font-bold text-center text-blue-400 mb-2">{opponentData.name}</h3>
          <p className="text-xs text-zinc-400 font-mono mb-4">{opponentData.tag}</p>

          {/* Stats Grid */}
          <div className="w-full space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-zinc-800/30 rounded-lg">
              <span className="text-zinc-400 flex items-center gap-2">
                <Users size={14} /> Members
              </span>
              <span className="font-bold">{opponentData.members}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-zinc-800/30 rounded-lg">
              <span className="text-zinc-400 flex items-center gap-2">
                <Trophy size={14} /> Stars
              </span>
              <span className="font-bold text-blue-400">{opponentData.stars} ⭐</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-zinc-800/30 rounded-lg">
              <span className="text-zinc-400 flex items-center gap-2">
                <Zap size={14} /> Destruction
              </span>
              <span className="font-bold text-blue-400">{opponentData.destructionPercent.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-zinc-800/30 rounded-lg">
              <span className="text-zinc-400 flex items-center gap-2">
                <Swords size={14} /> Attacks
              </span>
              <span className="font-bold">{opponentData.attacks}/{opponentData.members}</span>
            </div>
          </div>
        </div>
      </div>

      {/* War Result Summary (if war ended) */}
      {isWarEnded && (
        <div className="pt-6 border-t border-zinc-700/50">
          <div className="text-center mb-4">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">War Result</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Your Clan Result */}
            <div className="text-center">
              <p className="text-sm text-zinc-400 mb-3">{clanData.name}</p>
              <p className={`text-3xl font-black ${clanData.stars > opponentData.stars ? 'text-green-400' : clanData.stars === opponentData.stars ? 'text-amber-400' : 'text-red-400'}`}>
                {clanData.stars > opponentData.stars ? 'WINNER 🏆' : clanData.stars === opponentData.stars ? 'DRAW ⚔️' : 'LOSER'}
              </p>
            </div>

            {/* Divider */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-zinc-600 text-lg font-bold">VS</div>
            </div>

            {/* Opponent Result */}
            <div className="text-center">
              <p className="text-sm text-zinc-400 mb-3">{opponentData.name}</p>
              <p className={`text-3xl font-black ${opponentData.stars > clanData.stars ? 'text-green-400' : opponentData.stars === clanData.stars ? 'text-amber-400' : 'text-red-400'}`}>
                {opponentData.stars > clanData.stars ? 'WINNER 🏆' : opponentData.stars === clanData.stars ? 'DRAW ⚔️' : 'LOSER'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
