import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQList from "@/components/faqItem";
import { getClanData } from "@/lib/coc";

// Hapus 'use client' dan FAQItem interface/array dari sini
export default async function FAQPage() {
  // Ini sekarang aman 100% karena berjalan di Server
  const clan = await getClanData();

  if (!clan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-24 px-4 text-center bg-zinc-950">
        <h1 className="text-amber-600 text-5xl md:text-6xl mb-6" style={{ fontFamily: "'Docallisme', sans-serif" }}>
          SUPERCELL MAINTENANCE
        </h1>
        <p className="text-zinc-400 text-md mb-10 max-w-lg font-poppins">
          We couldn&apos;t fetch the data right now. Check in-game for the maintenance timer or visit our status page.
        </p>
        <a
          href="https://status.3agang.pro"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-zinc-800/50 font-sans rounded-xl border border-zinc-700 hover:bg-zinc-700"
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

  return (
    <main className="min-h-screen text-zinc-100 selection:bg-amber-500 selection:text-black overflow-x-hidden font-poppins relative">
      <Navbar clanName="AAA GANGS" badge="/badge_clan.webp" />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 md:px-16 lg:px-24 xl:px-32 pt-20 pb-12">
        <div className="absolute top-20 -z-10 left-1/2 transform -translate-x-1/2 size-96 bg-amber-600/10 blur-[300px]"></div>
        
        <h1 className="text-5xl md:text-5xl mb-4 text-center mt-12" style={{ fontFamily: "'Docallisme', sans-serif" }}>
          FREQUENTLY ASKED <span className="text-amber-500">QUESTIONS</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-sm text-center max-w-2xl mb-8 font-poppins">
          Punya pertanyaan tentang AAA GANGS, fitur-fitur, dll? Cari jawabannya di sini atau hubungi kami langsung.
        </p>
      </section>

      {/* Panggil komponen FAQList di sini */}
      <FAQList />

      {/* Additional Help Section */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-br from-amber-900/20 to-amber-900/5 border border-amber-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3 text-amber-400">Masih Ada Pertanyaan?</h2>
          <p className="text-zinc-300 mb-6 font-poppins">
            Jika Anda tidak menemukan jawaban yang Anda cari, coba tanya langsung ke SIGMA atau hubungi leadership team kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="/sigma"
              className="px-6 py-3 bg-amber-700 hover:bg-amber-800 transition-colors rounded-xl font-semibold text-white"
            >
              Tanya SIGMA
            </a>
            <a 
              href="/contact"
              className="px-6 py-3 border-2 border-amber-500 hover:bg-amber-500/10 transition-colors rounded-xl font-semibold text-amber-400"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>

      <Footer clan={clan} />
    </main>
  );
}