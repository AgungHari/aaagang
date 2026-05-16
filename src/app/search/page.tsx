'use client';

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Search, Trophy, Heart, Zap } from "lucide-react";
import { useEffect } from "react";
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

    setLoading(true);
    setHasSearched(true);
    setSearchResults([]);

    try {
      const res = await fetch(`/api/player?tag=${encodeURIComponent(searchTag)}`);
      if (res.ok) {
        const playerData = await res.json();
        setSearchResults([playerData]);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (!clanData) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="flex items-center justify-center py-32">
          <p className="text-zinc-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-zinc-100 font-poppins selection:bg-amber-500 selection:text-black">
      <Navbar clanName={clanData.name} badge="/badge_clan.webp" />

      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <div className="mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Search size={12} /> Player Search
          </div>
          <h1 className="text-6xl md:text-7xl uppercase italic leading-none" style={{ fontFamily: "'Docallisme', sans-serif" }}>
            Find <span className="text-amber-500">Player</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mt-4 max-w-2xl">
            Dapatkan detail player Clash of Clans favoritmu dengan memasukkan tag mereka. Cari tahu level, liga, statistik perang, dan banyak lagi dalam sekejap!
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-16 animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Masukkan player tag (contoh: #GRUR8QU)"
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              className="flex-1 px-4 py-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 text-black font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Search size={18} />
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* Results */}
        {hasSearched && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-zinc-500">Sedang mencari player...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4 animate-slide-up">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">
                  {searchResults.length} Result Found
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((player, i) => (
                    <ScrollReveal key={player.tag} delay={i * 0.05}>
                      <Link
                        href={`/search/${encodeURIComponent(player.tag)}`}
                        className="block group active:scale-[0.98] transition-all"
                      >
                        <div className="p-6 bg-zinc-900/20 border border-zinc-800/50 rounded-[2rem] hover:border-amber-500/30 transition-all group relative overflow-hidden h-full">
                          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 blur-3xl rounded-full group-hover:bg-amber-500/10 transition-colors"></div>

                          <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="flex items-center gap-4">
                              {player.leagueTier?.iconUrls?.small && (
                                <img
                                  src={player.leagueTier.iconUrls.small}
                                  alt={player.leagueTier.name}
                                  className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.3)] group-hover:scale-110 transition-transform"
                                />
                              )}
                              <div>
                                <div className="font-black uppercase italic text-lg tracking-tight leading-none mb-1 group-hover:text-amber-500 transition-colors">
                                  {player.name}
                                </div>
                                <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex flex-col gap-0.5">
                                  <span className="text-zinc-600 tracking-normal text-[8px] bg-zinc-800/50 w-fit px-1 rounded">
                                    {player.tag}
                                  </span>
                                  <span>
                                    Exp {player.expLevel} • TH {player.townHallLevel}
                                  </span>
                                  <span className="text-amber-500/60 text-[7px] mt-0.5">
                                    {player.leagueTier?.name || "Unranked"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 border-t border-zinc-800/50 pt-4 relative z-10">
                            <StatMini label="Trophies" value={player.trophies} icon={<Trophy size={10} />} color="text-amber-500" />
                            <StatMini label="War Stars" value={player.warStars} icon={<Heart size={10} />} color="text-red-500" />
                            <StatMini label="Exp Level" value={player.expLevel} icon={<Zap size={10} />} color="text-blue-500" />
                          </div>

                          {/* Indikator Klik */}
                          <div className="absolute bottom-2 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[7px] font-black italic text-amber-500 uppercase tracking-widest">
                              Full Profile →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 animate-slide-up">
                <p className="text-zinc-500 text-lg">Player tidak ditemukan</p>
                <p className="text-zinc-600 text-sm mt-2">Pastikan tag yang Anda masukkan benar. Contoh: #ABC123XYZ</p>
              </div>
            )}
          </>
        )}

        {/* Info Section */}
        {!hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 animate-slide-up">
            <div className="p-6 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
              <h3 className="font-black uppercase tracking-tighter text-lg mb-3">Format Tag</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Tag pemain Clash of Clans selalu dimulai dengan karakter # diikuti oleh kombinasi huruf dan angka. Contoh: #GRUR8QU

              </p>
            </div>
            <div className="p-6 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
              <h3 className="font-black uppercase tracking-tighter text-lg mb-3">Cara Menemukan Tag</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Buka profil pemain di game Clash of Clans, tag akan ditampilkan di bawah nama pemain. Salin dan tempel di search bar di atas.
              </p>
            </div>
          </div>
        )}
      </section>

      <Footer clan={clanData} />
    </main>
  );
}

// --- SUB COMPONENT ---
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
