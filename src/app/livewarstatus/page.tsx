'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, ArrowRight, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeatureTutorialVideo from '@/components/FeatureTutorialVideo';
import Link from 'next/link';

export default function LiveWarStatusPage() {
  const router = useRouter();
  const [searchTag, setSearchTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [clanData, setClanData] = useState<any>(null);

  // Fetch main clan data on mount untuk navbar/footer
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

    let formattedTag = searchTag.trim();
    if (!formattedTag.startsWith("#")) {
      formattedTag = `#${formattedTag}`;
    }

    setLoading(true);

    try {
      // Validate clan exists
      const res = await fetch(`/api/clan?tag=${encodeURIComponent(formattedTag)}`);
      if (res.ok) {
        // Redirect to war status page
        router.push(`/livewarstatus/${encodeURIComponent(formattedTag)}`);
      } else {
        alert("Clan tidak ditemukan. Pastikan tag clan sudah benar.");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Terjadi kesalahan saat mencari clan.");
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
    <main className="relative isolate w-full min-h-screen overflow-x-hidden bg-[#050505] text-zinc-100 font-poppins selection:bg-amber-500 selection:text-black">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[760px] md:h-[900px]">
        <Image
          src="/DragonDuke_NOCHARS_001.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/15 via-[#050505]/35 to-[#050505]" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[760px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,158,11,0.16),transparent_52%)] md:h-[900px]" />

      <Navbar clanName={clanData.name} badge="/badge_clan.webp" />

      <section className="relative max-w-4xl mx-auto px-6 pt-32 pb-24 z-10">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-5">
            <Search size={12} className="stroke-[3]" /> Live War Status
          </div>
          <h1 className="text-5xl md:text-7xl uppercase italic leading-none" style={{ fontFamily: "'Docallisme', sans-serif" }}>
            Track <span className="text-amber-500 drop-shadow-[0_4px_12px_rgba(245,158,11,0.15)]">War</span>
          </h1>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-16">
          <div className="flex flex-col sm:flex-row gap-3 p-2 bg-zinc-900/30 backdrop-blur-md border border-zinc-800/80 rounded-2xl focus-within:border-amber-500/40 focus-within:ring-4 focus-within:ring-amber-500/5 transition-all duration-300">
            <div className="flex-1 flex items-center gap-3 px-3">
              <span className="text-zinc-500 font-bold text-lg select-none pl-1">#</span>
              <input
                type="text"
                placeholder="Masukkan clan tag (contoh: Q9YY02J9)"
                value={searchTag.replace('#', '')}
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

        <FeatureTutorialVideo
          title="Cara Set War Log Menjadi Public"
          src="/Feature_War.webm"
          safariSrc="/Feature_War_Safari.mov"
        />

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-16 animate-slide-up">
          <div className="p-6 bg-zinc-900/20 border border-zinc-900/60 rounded-2xl backdrop-blur-sm hover:border-zinc-800 transition-colors duration-300">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4">
              <Eye size={14} className="stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-zinc-200 text-base mb-2">Pastikan War Log di Set Public</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Pastikan War Log di set Public agar api bisa mengakses data war maupun history secara sempurna. Jika war log di set Private, maka data war tidak bisa diakses dan fitur live war status tidak akan berfungsi.
            </p>
          </div>
          <div className="p-6 bg-zinc-900/20 border border-zinc-900/60 rounded-2xl backdrop-blur-sm hover:border-zinc-800 transition-colors duration-300">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4">
              <Search size={14} className="stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-zinc-200 text-base mb-2">Cara Menemukan Tag Clan</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Buka profil clan di dalam game. Tag unik clan kamu tertera tepat di bawah nama besar clan. Cukup salin kode tersebut lalu tempel di kolom pencarian di atas.
            </p>
          </div>
          <div className="p-6 bg-zinc-900/20 border border-zinc-900/60 rounded-2xl backdrop-blur-sm hover:border-zinc-800 transition-colors duration-300 md:col-span-2 md:max-w-md md:mx-auto">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4 font-bold text-sm select-none">
              #
            </div>
            <h3 className="font-bold text-zinc-200 text-base mb-2">Format Tag Clan</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tag clan Clash of Clans selalu dimulai dengan karakter # diikuti kombinasi unik huruf dan angka. Kamu bisa mengetikkan dengan atau tanpa tanda tagar.
            </p>
          </div>

        </div>
      </section>

      <Footer clan={clanData} />
    </main>
  );
}
