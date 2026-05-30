'use client';

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Search, Trophy, Heart, Zap, Shield, ArrowRight, Play } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function SearchPage() {
  const [searchTag, setSearchTag] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [clanData, setClanData] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch clan data on mount untuk navbar/footer
  useEffect(() => {
    const fetchClan = async () => {
      try {
        const res = await fetch("/api/clan");
        const data = await res.json();
        setClanData(data);
      } catch (error) {
        console.error("Error fetching clan:", error);
      }
    };
    fetchClan();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTag.trim()) return;

    // Bersihkan atau pastikan tag diawali tanda # jika user lupa memasukkannya
    let formattedTag = searchTag.trim();
    if (!formattedTag.startsWith("#")) {
      formattedTag = `#${formattedTag}`;
    }

    setLoading(true);
    setHasSearched(true);
    setSearchResults([]);

    try {
      const res = await fetch(`/api/player?tag=${encodeURIComponent(formattedTag)}`);
      if (res.ok) {
        const playerData = await res.json();
        setSearchResults([playerData]);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      searchResults: [];
    } finally {
      setLoading(false);
    }
  };

  if (!clanData) {
    return (
      <main className="min-h-screen text-zinc-100 font-poppins selection:bg-amber-500 selection:text-black">
        <section className="max-w-4xl mx-auto px-6 pt-32 pb-16">
          <div className="animate-pulse space-y-8">
            <div className="h-6 w-32 rounded-full bg-zinc-900/80 border border-zinc-800/50" />
            <div className="space-y-3">
              <div className="h-16 w-2/3 rounded-2xl bg-zinc-900/80" />
              <div className="h-4 w-1/2 rounded-lg bg-zinc-900/40" />
            </div>
            <div className="h-16 rounded-2xl bg-zinc-900/80 border border-zinc-800/50" />
            <div className="h-56 max-w-md mx-auto rounded-[2.5rem] bg-zinc-900/80 border border-zinc-800/50" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative w-full min-h-screen text-zinc-100 font-poppins selection:bg-amber-500 selection:text-black overflow-x-hidden">
      {/* Background Ornamen Gradien Halus */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <Navbar clanName={clanData.name} badge="/badge_clan.webp" />

      <section className="relative max-w-4xl mx-auto px-6 pt-32 pb-24 z-10">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-5">
            <Search size={12} className="stroke-[3]" /> Player Search
          </div>
          <h1 className="text-5xl md:text-7xl uppercase italic leading-none" style={{ fontFamily: "'Docallisme', sans-serif" }}>
            Find <span className="text-amber-500 drop-shadow-[0_4px_12px_rgba(245,158,11,0.15)]">Player</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
            Dapatkan detail player Clash of Clans favoritmu dengan memasukkan tag mereka. Cari tahu level, liga, statistik perang, dan banyak lagi dalam sekejap!
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-16">
          <div className="flex flex-col sm:flex-row gap-3 p-2 bg-zinc-900/30 backdrop-blur-md border border-zinc-800/80 rounded-2xl focus-within:border-amber-500/40 focus-within:ring-4 focus-within:ring-amber-500/5 transition-all duration-300">
            <div className="flex-1 flex items-center gap-3 px-3">
              <span className="text-zinc-500 font-bold text-lg select-none pl-1">#</span>
              <input
                type="text"
                placeholder="Masukkan player tag (contoh: GRUR8QU)"
                value={searchTag.replace('#', '')} // Menampilkan tanpa '#' di input agar bersih, logika tetap aman
                onChange={(e) => setSearchTag(e.target.value)}
                className="w-full py-3 bg-transparent text-white placeholder-zinc-500 focus:outline-none font-medium tracking-wide"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,158,11,0.15)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.3)] active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search size={16} className="stroke-[2.5]" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Video Tutorial Section (Hanya tampil sebelum search) */}
        {!hasSearched && (
          <ScrollReveal delay={0.1}>
            <div className="mb-8 p-4 bg-zinc-900/20 border border-zinc-900/50 rounded-[2rem] backdrop-blur-sm mx-auto shadow-2xl relative group hover:border-zinc-800 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-3 px-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-colors">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"/>Cara Salin Tag Akun
              </div>
              
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-inner">
                <video
                  src="/playersearchs.mp4" 
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Results */}
        {hasSearched && (
          <div className="mt-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                <p className="text-zinc-400 text-sm font-medium">Memindai database Supercell...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="h-[1px] w-8 bg-zinc-800" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                    {searchResults.length} Player Found
                  </p>
                  <div className="h-[1px] flex-1 bg-zinc-800 hidden md:block" />
                </div>
                
                {/* Centered Premium Profile Showcase */}
                <div className="flex justify-center">
                  {searchResults.map((player, i) => (
                    <ScrollReveal key={player.tag} delay={i * 0.05}>
                      <Link
                        href={`/search/${encodeURIComponent(player.tag)}`}
                        className="block group active:scale-[0.99] transition-all duration-300 w-full max-w-md"
                      >
                        <div className="p-8 bg-gradient-to-b from-zinc-900/60 to-zinc-900/20 backdrop-blur-md border border-zinc-800 rounded-[2.5rem] hover:border-amber-500/40 transition-all duration-500 group relative overflow-hidden shadow-xl">
                          
                          {/* Ambient Glow Mask */}
                          <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/[0.03] blur-3xl rounded-full group-hover:bg-amber-500/[0.07] transition-all duration-500"></div>

                          {/* Top Section: Badges & Name */}
                          <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-zinc-800/60 relative z-10">
                            
                            {/* League Badge Container */}
                            <div className="relative mb-4 w-20 h-20 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl flex items-center justify-center p-3 group-hover:border-amber-500/30 transition-colors shadow-inner">
                              {player.leagueTier?.iconUrls?.small ? (
                                <img
                                  src={player.leagueTier.iconUrls.small}
                                  alt={player.leagueTier.name}
                                  className="w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(245,158,11,0.2)] group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <Shield className="w-8 h-8 text-zinc-600" />
                              )}
                              {/* TH Level Small Badge */}
                              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-amber-500 text-black text-[9px] rounded-md shadow-lg tracking-tight">
                                TH {player.townHallLevel}
                              </div>
                            </div>

                            {/* Identity */}
                            <h2 className="font-black uppercase italic text-2xl tracking-tight text-zinc-100 group-hover:text-amber-400 transition-colors duration-300">
                              {player.name}
                            </h2>
                            <span className="mt-1.5 text-xs font-mono font-semibold text-zinc-500 bg-zinc-950/80 px-2.5 py-1 rounded-lg border border-zinc-800/50 tracking-wider">
                              {player.tag}
                            </span>
                            <p className="text-amber-500/70 text-[11px] font-bold uppercase tracking-widest mt-2">
                              {player.leagueTier?.name || "Unranked"}
                            </p>
                          </div>

                          {/* Middle Section: Stats Grid Grid */}
                          <div className="grid grid-cols-3 gap-3 relative z-10 mb-6">
                            <StatMini label="Trophies" value={player.trophies} icon={<Trophy size={12} />} color="text-amber-500" bg="bg-amber-500/[0.02] border-amber-500/10" />
                            <StatMini label="War Stars" value={player.warStars} icon={<Heart size={12} />} color="text-rose-500" bg="bg-rose-500/[0.02] border-rose-500/10" />
                            <StatMini label="Exp Level" value={player.expLevel} icon={<Zap size={12} />} color="text-cyan-500" bg="bg-cyan-500/[0.02] border-cyan-500/10" />
                          </div>

                          {/* Bottom Action Hint */}
                          <div className="flex items-center justify-center gap-1.5 text-zinc-500 group-hover:text-amber-500 transition-colors duration-300 pt-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">View Full Profile</span>
                            <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-zinc-900/10 border border-zinc-900/60 rounded-[2rem] animate-slide-up max-w-xl mx-auto">
                <p className="text-zinc-400 font-semibold text-lg">Player Tidak Ditemukan</p>
                <p className="text-zinc-500 text-sm mt-2 max-w-xs mx-auto px-4">
                  Pastikan tag yang dimasukkan sudah benar dan terdaftar di server Supercell.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        {!hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-16 animate-slide-up">
            <div className="p-6 bg-zinc-900/20 border border-zinc-900/60 rounded-2xl backdrop-blur-sm hover:border-zinc-800 transition-colors duration-300">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4 text-sm">#</div>
              <h3 className="font-bold text-zinc-200 text-base mb-2">Format Tag Resmi</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tag pemain Clash of Clans selalu terdiri dari kombinasi huruf dan angka unik tanpa spasi. Kamu bisa memasukkannya dengan atau tanpa tanda pagar (#).
              </p>
            </div>
            <div className="p-6 bg-zinc-900/20 border border-zinc-900/60 rounded-2xl backdrop-blur-sm hover:border-zinc-800 transition-colors duration-300">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4">
                  <Search size={13} />
                </div>
                <h3 className="font-bold text-zinc-200 text-base mb-2">Cara Menemukan Tag</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                    Buka game Clash of Clans, ketuk profil pemain di pojok kiri atas. Tag unik kamu akan tertera persis di bawah nama akun. Cukup salin dan tempel di sini.
                </p>
              </div>
          </div>
        )}
      </section>

      <Footer clan={clanData} />
    </main>
  );
}

// --- SUB COMPONENT (UPGRADED) ---
function StatMini({ label, value, icon, color, bg }: { label: string; value: any; icon: React.ReactNode; color: string; bg: string }) {
  return (
    <div className={`p-3 bg-zinc-950/40 rounded-xl border ${bg} flex flex-col items-center text-center justify-center transition-all duration-300`}>
      <div className={`flex items-center gap-1.5 text-xs font-black italic ${color} mb-1`}>
        {icon} 
        <span>{value !== undefined && value !== null ? value.toLocaleString() : '0'}</span>
      </div>
      <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight">{label}</div>
    </div>
  );
}