'use client';

import { useState } from 'react';
import { Trophy } from 'lucide-react';
import HallOfFame from './HOFForSearch';

interface CWLHallOfFameProps {
  war: any;
  isWar: boolean;
}

export default function CWLHallOfFame({ war, isWar }: CWLHallOfFameProps) {
  const [selectedClan, setSelectedClan] = useState<'clan' | 'opponent'>('clan');

  // Skip rendering during preparation phase or if no war data
  if (!isWar || war?.state === 'preparation' || (!war.clan?.members && !war.opponent?.members)) return null;

  const clanName = war.clan?.name || 'Clan';
  const opponentName = war.opponent?.name || 'Opponent';

  // Create a virtual war object for the selected clan
  const displayWar =
    selectedClan === 'clan'
      ? war
      : {
          ...war,
          clan: war.opponent,
          opponent: war.clan,
        };

  return (
    <div>
      {/* Clan Toggle */}
      <div className="flex items-center gap-2 mb-6">
        <Trophy size={20} className="text-amber-500" />
        <h2 className="text-lg font-bold">Hall of Fame</h2>
        <div className="ml-auto flex bg-zinc-900/40 border border-zinc-800/40 rounded-lg p-1">
          <button
            onClick={() => setSelectedClan('clan')}
            className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
              selectedClan === 'clan'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {clanName}
          </button>
          <button
            onClick={() => setSelectedClan('opponent')}
            className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
              selectedClan === 'opponent'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {opponentName}
          </button>
        </div>
      </div>

      {/* Hall of Fame Display */}
      <HallOfFame isWar={isWar} war={displayWar} />
    </div>
  );
}
