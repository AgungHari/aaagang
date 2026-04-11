import { Users, Shield, Trophy, Zap, Heart, Medal, Sword, Flame } from "lucide-react";
import { getClanData } from "@/lib/coc";
import Link from "next/link";

export default async function MembersPage() {
  const clan = await getClanData();

  if (!clan) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-black text-4xl italic">
      DATABASE ERROR...
    </div>
  );

  // Mapping bobot role untuk pengurutan hierarki
  const roleWeight: Record<string, number> = {
    leader: 4,
    coLeader: 3,
    admin: 2, // admin di API CoC adalah Elder
    member: 1,
  };

  const members = [...clan.memberList].sort((a, b) => {
    // 1. Urutkan berdasarkan bobot role (Paling tinggi di atas)
    const weightA = roleWeight[a.role] || 0;
    const weightB = roleWeight[b.role] || 0;

    if (weightA !== weightB) {
      return weightB - weightA;
    }

    // 2. Jika role sama, urutkan berdasarkan trophies terbanyak
    return b.trophies - a.trophies;
  });

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 font-sans">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto relative z-20">
        <Link href="/" className="font-black text-2xl tracking-tighter italic text-amber-500 flex items-center gap-2">
          <img src={clan.badgeUrls.small} alt="Badge" className="w-8 h-8" />
          {clan.name}
        </Link>
        <div className="flex gap-6 text-[10px] md:text-xs font-black text-zinc-500 tracking-[0.2em]">
          <a href="/members" className="text-white border-b-2 border-amber-500 tracking-widest uppercase">MEMBERS</a>
          <a href="/" className="hover:text-amber-500 transition-all border-b border-transparent hover:border-amber-500 uppercase">HOME</a>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 pt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <Users size={12} /> Personnel Directory
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
              CLAN <span className="text-amber-500">MEMBERS</span>
            </h1>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black italic text-zinc-800">{clan.members} / 50</div>
            <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">Active Slots</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m: any, i: number) => (
            <div key={m.tag} className="p-6 bg-zinc-900/20 border border-zinc-800/50 rounded-[2rem] hover:border-amber-500/30 transition-all group relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 blur-3xl rounded-full group-hover:bg-amber-500/10 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black italic text-zinc-800 group-hover:text-amber-500/20 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-3">
                    {m.leagueTier?.iconUrls?.small && (
                      <img 
                        src={m.leagueTier.iconUrls.small} 
                        alt={m.leagueTier.name} 
                        className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.3)] group-hover:scale-110 transition-transform" 
                      />
                    )}
                    <div>
                      <div className="font-black uppercase italic text-lg tracking-tight leading-none mb-1 flex items-center gap-2">
                        {m.name}
                      </div>
                      <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex flex-col">
                        <span>{m.role === 'admin' ? 'Elder' : m.role === 'leader' ? 'Leader' : m.role === 'coLeader' ? 'Co-Leader' : 'Member'} • TH {m.townHallLevel}</span>
                        <span className="text-amber-500/60 text-[7px] mt-0.5">{m.leagueTier?.name || "Unranked"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-zinc-800/50 pt-4 relative z-10">
                <StatMini label="Trophies" value={m.trophies} icon={<Trophy size={10}/>} color="text-amber-500" />
                <StatMini label="Donated" value={m.donations} icon={<Heart size={10}/>} color="text-red-500" />
                <StatMini label="Received" value={m.donationsReceived} icon={<Zap size={10}/>} color="text-blue-500" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER - IDENTIK DENGAN HOMEPAGE */}
      <footer className="mt-32 border-t border-zinc-900/50 bg-[#030303] relative overflow-hidden">
        {/* Ghost Badge Background */}
        <img 
          src={clan.badgeUrls.medium} 
          alt="" 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] opacity-[0.02] grayscale pointer-events-none" 
        />

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 mb-16">
            <FooterStat label="Clan Level" value={clan.clanLevel} icon={<Medal size={14} className="text-amber-500/50" />} />
            <FooterStat label="Strategic Assets" value={`${clan.members}/50`} icon={<Users size={14} className="text-amber-500/50" />} />
            <FooterStat label="Battle Wins" value={clan.warWins} icon={<Sword size={14} className="text-amber-500/50" />} />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center border-t border-zinc-800/50 pt-10 gap-6">
            <div className="flex items-center gap-3">
              <img src={clan.badgeUrls.small} alt="Badge" className="w-6 h-6 grayscale opacity-30" />
              <div className="text-left">
                <div className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase italic leading-none">
                  {clan.name}
                </div>
                <div className="text-[7px] text-zinc-700 font-bold uppercase tracking-widest mt-1">
                  Clan Tag: {clan.tag}
                </div>
              </div>
            </div>

            <div className="text-[9px] text-zinc-700 font-bold tracking-[0.5em] uppercase text-center md:text-right">
               EST. 2016 • ANAK ANAK ANJING (AAA) • INDONESIA
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

// --- SUB COMPONENTS ---
function StatMini({ label, value, icon, color }: any) {
  return (
    <div>
      <div className={`flex items-center gap-1 text-[10px] font-black italic ${color}`}>
        {icon} {value.toLocaleString()}
      </div>
      <div className="text-[7px] text-zinc-600 font-bold uppercase tracking-tighter">{label}</div>
    </div>
  );
}

function FooterStat({ label, value, icon }: { label: string, value: any, icon?: React.ReactNode }) {
  return (
    <div className="text-center group">
      <div className="flex items-center justify-center gap-2 mb-1">
        {icon}
        <div className="text-2xl font-black text-zinc-300 italic group-hover:text-amber-500 transition-colors">{value}</div>
      </div>
      <div className="text-[8px] text-zinc-600 uppercase tracking-[0.4em] font-black">{label}</div>
    </div>
  );
}