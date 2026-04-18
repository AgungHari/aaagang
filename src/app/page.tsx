import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TiltedImage from "@/components/TiltImage";
import Link from "next/link";
import { 
  Sigma, Baby, Swords, Trophy, Heart, Flame, Zap, 
  Crown, UserPlus, Castle, Crosshair, Medal, CrownIcon, Star, StarHalf, StarOff, Timer, ChessQueen, CheckIcon, HandHeart
} from "lucide-react";
import { getClanData, getCurrentWar } from "@/lib/coc";

export const revalidate = 60;

export default async function Home() {
  const [clan, war] = await Promise.all([getClanData(), getCurrentWar()]);

  if (!clan) {
    return (
      <div className="text-white text-center py-20 font-black tracking-tighter text-5xl">
        DATABASE ERROR... <br/>RECHECK API TOKEN!
      </div>
    );
  }

  // --- LOGIC DATA ---
  const members = [...clan.memberList];
  const newMembers = members.filter(m => m.previousClanRank === 0);
  const topDonators = [...members].sort((a, b) => b.donations - a.donations).slice(0, 3);
  const topLeagues = [...members].sort((a, b) => b.trophies - a.trophies).slice(0, 3);
  const topReceived = [...members].sort((a, b) => b.donationsReceived - a.donationsReceived).slice(0, 3);

  // MOCK DATA - Remove after checking
  const mockNewMembers = [
    { tag: '#NEWMEMBER1', name: 'Ninja Fighter', townHallLevel: 10, previousClanRank: 0 },
    { tag: '#NEWMEMBER2', name: 'Sky Warrior', townHallLevel: 9, previousClanRank: 0 },
    { tag: '#NEWMEMBER3', name: 'Thunder Storm', townHallLevel: 11, previousClanRank: 0 },
  ];
  
  // Use mock data if no real new members
  const displayNewMembers = newMembers.length > 0 ? newMembers : mockNewMembers;

  const isWar = war && war.state !== 'notInWar';

  const getWarHighlights = () => {
    if (!isWar || !war.clan.members) return [];
    const highlights: { name: string; type: string; desc: string; priority: number }[] = [];
    
    war.clan.members.forEach((m: any) => {
      if (!m.attacks) return;
      m.attacks.forEach((atk: any) => {
        const opponent = war.opponent.members.find((opp: any) => opp.tag === atk.defenderTag);
        const opponentName = opponent?.name || "Enemy";
        
        if (atk.stars === 3 && opponent?.mapPosition === 1) {
          highlights.push({ 
            name: m.name, type: "King Slayer", priority: 1,
            desc: `ELIMINATED THE ENEMY KING 1. ${opponentName}! ` 
          });
        }
        else if (atk.stars === 3 && opponent && opponent.townhallLevel > m.townhallLevel) {
          highlights.push({ 
            name: m.name, type: "Giant Slayer", priority: 2,
            desc: `Destroy ${opponent.mapPosition}. ${opponentName} (TH ${opponent.townhallLevel}) as TH ${m.townhallLevel}!` 
          });
        }
        else if (atk.stars === 3 && atk.duration < 100) {
          highlights.push({ 
            name: m.name, type: "Blitzkrieg", priority: 3,
            desc: `3-Starred ${opponent.mapPosition}. ${opponentName} in just ${atk.duration}s!` 
          });
        }
        else if (atk.stars === 3) {
          highlights.push({ 
            name: m.name, type: "Perfect 3 Star Attack", priority: 4,
            desc: `Flawless 100% vs ${opponent.mapPosition}. ${opponentName}!` 
          });
        }
        else if (atk.stars === 2){
          highlights.push({
            name: m.name, type: "Nice Attack 2 Star", priority: 5, desc:`${atk.destructionPercentage}% vs ${opponent.mapPosition}. ${opponentName} - Nice try!`
          });
        }
        else if (atk.stars === 1) {
          highlights.push({ 
            name: m.name, type: "Unlucky 1 Star", priority: 6,
            desc: `${atk.destructionPercentage}% vs ${opponent.mapPosition}. ${opponentName} - So close!` 
          });
        }
      });
    });

    return highlights.sort((a, b) => a.priority - b.priority);
  };

  const highlights = getWarHighlights();

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-amber-500 selection:text-black overflow-x-hidden font-sans">
      
      {/* 1. Navbar Component */}
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      {/* Hero Section - Merged from HeroSection.tsx */}
      <section className="relative flex flex-col items-center justify-center px-4 md:px-16 lg:px-24 xl:px-32 pt-20 pb-20">
        <div className="absolute top-30 -z-10 left-1/4 size-72 bg-amber-600/10 blur-[300px]"></div>
        
        {/* Clan Badge */}
        <div className="flex items-center gap-2 rounded-full p-1 pr-3 mt-10 text-amber-100 bg-amber-200/15 border border-amber-500/20 mb-8">
          <span className="bg-amber-800 text-white text-xs px-3.5 py-1 rounded-full font-black">
            {clan.memberList?.length < 50 ? "OPEN" : "CLOSED"}
          </span>
          <p className="flex items-center gap-1 text-sm">
            <span>{50 - clan.memberList?.length} Slot Left !</span>
            <Flame size={16} />
          </p>
        </div>
        
        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-center mb-6 max-w-4xl italic leading-tight">
          <span className="text-white">AAA</span>{" "}
          <span className="text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.3)] italic"> GANG</span>
        </h1>
        
        {/* Clan Description */}
        <p className="text-base text-center text-slate-300 max-w-2xl mb-8 font-medium">
          {clan.description}
        </p>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-8 mb-16">
          <a
            href="https://link.clashofclans.com/en/?action=OpenClanProfile&tag=Q9YY02J9"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-7 h-11 font-black transition-all flex items-center justify-center"
          >
            Join Now
          </a>
          <Link 
            href="/kontak"
            className="flex items-center gap-2 border-2 border-amber-900 hover:bg-amber-950/50 transition rounded-full px-6 h-11 font-medium"
          >
            <Sigma strokeWidth={1} size={18} />
            <span>Ask Sigma</span>
          </Link>
        </div>
        
        {/* Clan Stats */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-14 mb-10">
          <div className="flex items-center gap-2">
            <Baby className="size-5 text-amber-600" />
            <span className="text-slate-400 font-medium">Newbie Friendly</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="size-5 text-amber-600" />
            <span className="text-slate-400 font-medium">Level {clan.clanLevel} Clan</span>
          </div>
          <div className="flex items-center gap-2">
            <Swords className="size-5 text-amber-600" />
            <span className="text-slate-400 font-medium">Always War</span>
          </div>
          <div className="flex items-center gap-2">
            <HandHeart className="size-5 text-amber-600" />
            <span className="text-slate-400 font-medium">Donasi Lancar</span>
          </div>
        </div>
        
        {/* Tilt Image */}
        <TiltedImage />
      </section>

      {/* --- WELCOME NEW MEMBER SECTION --- */}
      {newMembers.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-12 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="text-zinc-600 text-center text-[9px] font-black tracking-[0.5em] uppercase mb-4 block">Welcome Our Newest Member</span>
            <div className="flex flex-wrap justify-center gap-4">
              {newMembers.map((m) => (
                <div key={m.tag} className="px-6 py-3 bg-zinc-900/30 border border-amber-500/20 rounded-2xl flex items-center gap-3 group hover:border-amber-500/50 transition-all">
                  <UserPlus className="text-amber-500 group-hover:scale-110 transition-transform" size={16} />
                  <div className="text-left">
                    <div className="text-sm font-black uppercase tracking-tighter">{m.name}</div>
                    <div className="text-[9px] text-zinc-500 font-bold uppercase italic">TH {m.townHallLevel} • Joined Recently</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Leaderboard Cards */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LeaderboardCard title="Donation Kings" icon={<Heart size={20} className="text-red-500" />} data={topDonators} dataKey="donations" suffix="Troops" />
        <LeaderboardCard title="Ranked Trophy" icon={<Trophy size={20} className="text-amber-500" />} data={topLeagues} dataKey="trophies" suffix="Trophies" />
        <LeaderboardCard title="Most Active" icon={<Zap size={20} className="text-blue-500" />} data={topReceived} dataKey="donationsReceived" suffix="Reqs" />
      </div>

      {/* Clan Capital & War Status */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-10 bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] flex items-center justify-between group hover:border-amber-500/30 transition-all overflow-hidden relative">
          <Castle className="absolute -right-4 -bottom-4 size-32 text-zinc-800/20 -rotate-12 group-hover:text-amber-500/10 transition-colors" />
          <div className="relative z-10">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-2">Clan Capital District</div>
            <div className="text-3xl font-black italic uppercase text-amber-500 tracking-tighter">
              {clan.capitalLeague?.name || "Unranked"}
            </div>
            <div className="mt-4 text-lg font-black italic">{clan.clanCapitalPoints?.toLocaleString()} <span className="text-[8px] text-zinc-600 uppercase tracking-widest block">Capital Points</span></div>
          </div>
        </div>

        <div className={`p-10 border rounded-[2.5rem] flex items-center justify-between transition-all overflow-hidden relative group ${isWar ? 'bg-red-500/5 border-red-500/20' : 'bg-zinc-900/20 border-zinc-800/50'}`}>
          <Crosshair className={`absolute -right-4 -bottom-4 size-32 -rotate-12 opacity-10`} />
          <div className="relative z-10">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-1">
              Live War Status
            </div>
            <div className="text-[7px] text-zinc-600 uppercase tracking-[0.4em] mb-4"> (Refreshes every 60 seconds for the latest overview)</div>
            <div className={`text-3xl font-black italic uppercase tracking-tighter ${isWar ? 'text-red-500 animate-pulse' : 'text-zinc-400'}`}>
              {isWar ? `VS ${war.opponent.name}` : "Resting / Neutral"}
            </div>
            {isWar && (
              <div className="mt-4 flex gap-6 text-lg font-black italic">
                <div>{war.clan.stars} - {war.opponent.stars} <span className="text-[8px] text-zinc-600 uppercase block">Stars</span></div>
                <div>{war.clan.attacks} / {war.teamSize * 2} <span className="text-[8px] text-zinc-600 uppercase block">Attacks</span></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hall of Fame */}
      {isWar && highlights.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-12">
          <div className="p-8 bg-zinc-900/10 border border-zinc-800/50 rounded-[2.5rem]">
            <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-8">
              <Medal size={14} className="text-amber-500" /> Live War Hall of Fame
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {highlights.map((h, i) => (
                <div key={i} className={`p-5 bg-zinc-950/40 border rounded-2xl group transition-all ${
                  h.type === 'Unlucky 1 Star' ? 'border-zinc-800/50 grayscale opacity-60' : h.type === 'Nice Attack 2 Star' ? 'border-amber-500/10 hover:border-amber-800/30 opacity-80' : 'border-amber-500/10 hover:border-amber-500/30'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-1.5 rounded-lg ${h.type.includes('Unlucky') ? 'bg-zinc-800 text-zinc-500': h.type === 'Nice Attack 2 Star' ? 'bg-amber-800/10 text-amber-800' : 'bg-amber-500/10 text-amber-500'}`}>
                      {h.type.includes('Unlucky') ? <StarOff size={14}/> : 
                        h.type === 'King Slayer' ? <ChessQueen size={14}/> :
                        h.type === 'Giant Slayer' ? <CrownIcon size={14}/> :
                        h.type === 'Blitzkrieg' ? <Timer size={14}/> :
                        h.type === 'Perfect 3 Star Attack' ? <Star size={14}/> :
                        h.type === 'Nice Attack 2 Star' ? <StarHalf size={14}/> :
                        <Zap size={14}/>
                      }
                    </div>
                    <div className="text-xs font-black uppercase italic tracking-tight">{h.name}</div>
                  </div>
                  <div className={`text-[9px] font-bold uppercase tracking-tighter leading-tight ${h.type.includes('Unlucky') ? 'text-zinc-500' : 'text-amber-500/70'}`}>
                    {h.type}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-medium italic mt-1 line-clamp-1">{h.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Footer Component */}
      <Footer clan={clan} />

    </main>
  );
}

// --- REFINED SUB COMPONENTS ---
function LeaderboardCard({ title, icon, data, dataKey, suffix }: any) {
  return (
    <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] p-8 hover:border-zinc-700 transition-all group shadow-2xl">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800">{icon}</div>
        <h3 className="text-xl font-black italic uppercase tracking-tighter">{title}</h3>
      </div>
      <div className="space-y-6">
        {data.map((member: any, index: number) => (
          <div key={member.tag} className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <span className={`text-2xl font-black italic ${index === 0 ? 'text-amber-500' : 'text-zinc-800'}`}>0{index + 1}</span>
              <div>
                <div className="text-sm font-black uppercase tracking-tight flex items-center gap-2 leading-none">
                  {member.name} {index === 0 && <Crown size={12} className="text-amber-500" />}
                </div>
                <div className="text-[9px] text-zinc-600 font-bold uppercase mt-1">TH {member.townHallLevel}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-zinc-300 leading-none">{member[dataKey].toLocaleString()}</div>
              <div className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest mt-1">{suffix}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}