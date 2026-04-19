import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Users, Trophy, Zap, Heart } from "lucide-react";
import { getClanData } from "@/lib/coc";

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
    <main className="min-h-screen text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* 1. Navbar: Pakai komponen yang sama dengan Home */}
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      <section className="max-w-7xl mx-auto px-6 pt-24">
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

        {/* Member Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m: any, i: number) => (
            <Link 
              href={`/members/${encodeURIComponent(m.tag)}`} 
              key={m.tag} 
              className="block group active:scale-[0.98] transition-all"
            >
              <div className="p-6 bg-zinc-900/20 border border-zinc-800/50 rounded-[2rem] hover:border-amber-500/30 transition-all group relative overflow-hidden h-full">
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
                        <div className="font-black uppercase italic text-lg tracking-tight leading-none mb-1 group-hover:text-amber-500 transition-colors">
                          {m.name}
                        </div>
                        <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex flex-col gap-0.5">
                          <span className="text-zinc-600 font-mono tracking-normal text-[8px] bg-zinc-800/50 w-fit px-1 rounded">
                            {m.tag}
                          </span>
                          <span>
                            {m.role === 'admin' ? 'Elder' : m.role === 'leader' ? 'Leader' : m.role === 'coLeader' ? 'Co-Leader' : 'Member'} • TH {m.townHallLevel}
                          </span>
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
                
                {/* Indikator Klik */}
                <div className="absolute bottom-2 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[7px] font-black italic text-amber-500 uppercase tracking-widest">Full Profile →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Footer: Mengirimkan object clan yang sama */}
      <Footer clan={clan} />

    </main>
  );
}

// --- SUB COMPONENT (Local only for this page) ---
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