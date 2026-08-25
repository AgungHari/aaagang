import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Users, Trophy, Zap, Heart, Shield, Sword } from "lucide-react";
import { getClanData, getAliansiData } from "@/lib/coc";
import ScrollReveal from "@/components/ScrollReveal";

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

function StatCard({ label, value, icon, color }: any) {
  return (
    <div className={`flex flex-col items-center text-center justify-center p-2.5 bg-zinc-950/40 rounded-lg border border-zinc-800/30 hover:border-zinc-700/50 transition-all`}>
      <div className={`flex items-center gap-1 text-[9px] font-black italic ${color} mb-1`}>
        {icon} {value?.toLocaleString() || 0}
      </div>
      <div className="text-[7px] text-zinc-600 font-bold uppercase tracking-tighter leading-none">{label}</div>
    </div>
  );
}

export default async function MembersPage() {
  const clan = await getClanData();
  const aliansi = await getAliansiData();

  if (!clan) {
      return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <h1 className="text-amber-600 text-5xl md:text-6xl mb-6 " style={{ fontFamily: "'Docallisme', sans-serif" }}>
            SUPERCELL MAINTENANCE
          </h1>
          <p className="text-gray-400 text-md mb-10 max-w-lg font-poppins">
            We couldn&apos;t fetch the data right now. Check in-game for the maintenance timer or visit our status page.
          </p>
          
          <a 
            href="https://status.3agang.pro" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-zinc-600/30 font-sans rounded-xl border border-zinc-500/10 hover:bg-zinc-500/10"
          >
            <span className="relative flex items-center gap-2">
              <span className="flex h-3 w-3">
                <span className="animate-ping relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Check System Status
            </span>
          </a>
        </div>
      );
    }

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

  // Hitung total member dari kedua klan
  const totalMembers = clan.members + (aliansi?.members || 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://3agang.pro/members/#collection",
    "url": "https://3agang.pro/members",
    "name": "Direktori Anggota Clan AAA GANGS",
    "description": "Daftar personil resmi clan AAA GANGS. Pantau statistik trophy, donasi, dan role anggota secara real-time.",
    "publisher": { "@id": "https://3agang.pro/#organization" },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": members.length,
      "itemListElement": members.map((m: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://3agang.pro/members/${encodeURIComponent(m.tag)}`,
        "name": m.name
      }))
    }
  };

  return (
    <main className="min-h-screen text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 1. Navbar: Pakai komponen yang sama dengan Home */}
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      <section className="max-w-7xl mx-auto px-6 pt-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-slide-up">
          <Users size={12} /> Alliance Directory
        </div>

        {/* Clan Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 animate-slide-up">
          {/* Main Clan Card */}
          <div className="group relative overflow-hidden rounded-[2rem] bg-zinc-900/20 border border-amber-500/30 p-6 hover:border-amber-500/60 transition-all">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full group-hover:bg-amber-500/20 transition-colors"></div>
            
            <div className="relative z-10">
              {/* Top Section: Badge & Info */}
              <div className="flex flex-wrap gap-6 items-start mb-6">
                {/* Badge Container */}
                <div className="relative">
                  {clan.badgeUrls?.small && (
                    <div className="relative w-24 h-24 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl flex items-center justify-center p-3 group-hover:border-amber-500/30 transition-colors shadow-inner">
                      <img 
                        src={clan.badgeUrls.small} 
                        alt={clan.name} 
                        className="w-full h-full object-contain drop-shadow-[0_0_16px_rgba(245,158,11,0.4)] group-hover:scale-110 transition-transform"
                      />
                      {/* Clan Level Badge */}
                      {clan.clanLevel && (
                        <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-amber-500 text-black text-[8px] font-black rounded-md shadow-lg tracking-tight">
                          LVL {clan.clanLevel}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Clan Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-black uppercase italic text-white tracking-tight leading-none mb-1">
                    {clan.name}
                  </h3>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">
                    {clan.tag}
                  </div>
                  {clan.warLeague?.name && (
                    <div className="text-amber-500/70 text-[10px] font-bold uppercase tracking-widest">
                      {clan.warLeague.name}
                    </div>
                  )}
                </div>

                <div className="grid w-full grid-cols-3 gap-2 md:flex md:w-auto md:shrink-0">
                  <StatCard label="Clan Points" value={clan.clanPoints} icon={<Trophy size={10}/>} color="text-amber-500" />
                  <StatCard label="War Wins" value={clan.warWins} icon={<Sword size={10}/>} color="text-rose-500" />
                  <StatCard label="Members" value={clan.members} icon={<Users size={10}/>} color="text-cyan-500" />
                </div>
              </div>

              <div className="flex items-end gap-6 mb-4">
                {/* Leader Info */}
                <div className="shrink-0">
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">Leader</div>
                <div className="text-sm font-black text-amber-500">
                  {(() => {
                    const leader = clan.memberList.find((m: any) => m.role === 'leader');
                    return leader ? leader.name : 'N/A';
                  })()}
                </div>
                </div>

                {/* Member Progress Bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Members</span>
                    <span className="text-[10px] font-black text-amber-500">{clan.members}/50</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800/50 rounded-full overflow-hidden border border-amber-500/20">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                      style={{ width: `${(clan.members / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Aliansi Clan Card */}
          {aliansi && (
            <div className="group relative overflow-hidden rounded-[2rem] bg-zinc-900/20 border border-purple-500/30 p-6 hover:border-purple-500/60 transition-all">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full group-hover:bg-purple-500/20 transition-colors"></div>
              
              <div className="relative z-10">
                {/* Top Section: Badge & Info */}
                <div className="flex flex-wrap gap-6 items-start mb-6">
                  {/* Badge Container */}
                  <div className="relative">
                    {aliansi.badgeUrls?.small && (
                      <div className="relative w-24 h-24 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl flex items-center justify-center p-3 group-hover:border-purple-500/30 transition-colors shadow-inner">
                        <img 
                          src={aliansi.badgeUrls.small} 
                          alt={aliansi.name} 
                          className="w-full h-full object-contain drop-shadow-[0_0_16px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform"
                        />
                        {/* Clan Level Badge */}
                        {aliansi.clanLevel && (
                          <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-purple-500 text-white text-[8px] font-black rounded-md shadow-lg tracking-tight">
                            LVL {aliansi.clanLevel}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Clan Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black uppercase italic text-white tracking-tight leading-none mb-1">
                      {aliansi.name}
                    </h3>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">
                      {aliansi.tag}
                    </div>
                    {aliansi.warLeague?.name && (
                      <div className="text-purple-500/70 text-[10px] font-bold uppercase tracking-widest">
                        {aliansi.warLeague.name}
                      </div>
                    )}
                  </div>

                  <div className="grid w-full grid-cols-3 gap-2 md:flex md:w-auto md:shrink-0">
                    <StatCard label="Clan Points" value={aliansi.clanPoints} icon={<Trophy size={10}/>} color="text-purple-500" />
                    <StatCard label="War Wins" value={aliansi.warWins} icon={<Sword size={10}/>} color="text-rose-500" />
                    <StatCard label="Members" value={aliansi.members} icon={<Users size={10}/>} color="text-cyan-500" />
                  </div>
                </div>

                <div className="flex items-end gap-6 mb-4">
                  {/* Leader Info */}
                  <div className="shrink-0">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">Leader</div>
                  <div className="text-sm font-black text-purple-500">
                    {(() => {
                      const leader = aliansi.memberList.find((m: any) => m.role === 'leader');
                      return leader ? leader.name : 'N/A';
                    })()}
                  </div>
                  </div>

                  {/* Member Progress Bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Members</span>
                      <span className="text-[10px] font-black text-purple-500">{aliansi.members}/50</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800/50 rounded-full overflow-hidden border border-purple-500/20">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
                        style={{ width: `${(aliansi.members / 50) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-7xl uppercase italic leading-none animate-slide-up" style={{ fontFamily: "'Docallisme', sans-serif" }}>
              GANG <span className="text-amber-500">MEMBERS</span>
            </h1>
          </div>
          <div className="text-right animate-slide-up">
            <div className="text-4xl font-black italic text-zinc-800">{totalMembers} / 100</div>
            <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">Active Slots</div>
          </div>
        </div>

        {/* Member Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m: any, i: number) => (
            <ScrollReveal key={m.tag} delay={i * 0.02}>
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
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Aliansi Section */}
      {aliansi && (
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div>
            <h1 className="text-5xl md:text-7xl uppercase italic leading-none animate-slide-up mb-12" style={{ fontFamily: "'Docallisme', sans-serif" }}>
              GOBLIN <span className="text-purple-500">MEMBERS</span>
            </h1>
          </div>

          {/* Aliansi Member Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(() => {
              const aliansiMembers = [...aliansi.memberList].sort((a, b) => {
                const weightA = roleWeight[a.role] || 0;
                const weightB = roleWeight[b.role] || 0;
                if (weightA !== weightB) {
                  return weightB - weightA;
                }
                return b.trophies - a.trophies;
              });
              return aliansiMembers.map((m: any, i: number) => (
                <ScrollReveal key={m.tag} delay={i * 0.02}>
                  <Link href={`/members/${encodeURIComponent(m.tag)}`} className="block group active:scale-[0.98] transition-all">
                    <div className="p-6 bg-zinc-900/20 border border-zinc-800/50 rounded-[2rem] hover:border-purple-500/30 transition-all group relative overflow-hidden h-full">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/5 blur-3xl rounded-full group-hover:bg-purple-500/10 transition-colors"></div>
                      
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-black italic text-zinc-800 group-hover:text-purple-500/20 transition-colors">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div className="flex items-center gap-3">
                            {m.leagueTier?.iconUrls?.small && (
                              <img 
                                src={m.leagueTier.iconUrls.small} 
                                alt={m.leagueTier.name} 
                                className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform" 
                              />
                            )}
                            <div>
                              <div className="font-black uppercase italic text-lg tracking-tight leading-none mb-1 group-hover:text-purple-500 transition-colors">
                                {m.name}
                              </div>
                              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex flex-col gap-0.5">
                                <span className="text-zinc-600 font-mono tracking-normal text-[8px] bg-zinc-800/50 w-fit px-1 rounded">
                                  {m.tag}
                                </span>
                                <span>
                                  {m.role === 'admin' ? 'Elder' : m.role === 'leader' ? 'Leader' : m.role === 'coLeader' ? 'Co-Leader' : 'Member'} • TH {m.townHallLevel}
                                </span>
                                <span className="text-purple-500/60 text-[7px] mt-0.5">{m.leagueTier?.name || "Unranked"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 border-t border-zinc-800/50 pt-4 relative z-10">
                        <StatMini label="Trophies" value={m.trophies} icon={<Trophy size={10}/>} color="text-purple-500" />
                        <StatMini label="Donated" value={m.donations} icon={<Heart size={10}/>} color="text-red-500" />
                        <StatMini label="Received" value={m.donationsReceived} icon={<Zap size={10}/>} color="text-blue-500" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ));
            })()}
          </div>
        </section>
      )}

      {/* 2. Footer: Mengirimkan object clan yang sama */}
      <Footer clan={clan} />

    </main>
  );
}