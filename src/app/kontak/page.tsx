import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getClanData } from "@/lib/coc";
import { Zap } from "lucide-react";
import ChatInterface from "./ChatInterface"; // Import client component tadi

export default async function KontakPage() {
  const clan = await getClanData();

  if (!clan) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-black text-4xl italic">
      DATABASE ERROR...
    </div>
  );

  return (
    <main className="min-h-screen text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Navbar: Persis seperti di Member Page */}
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 animate-slide-up">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Zap size={12} /> Let's Talk
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
            AAA <span className="text-amber-500">INTELLIGENCE</span>
          </h1>
          <p className="mt-4 text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            Tanya info klan, rules, tutorial atau sekadar sapa asisten klan kami.
          </p>
        </div>

        {/* Masukkan Client Component Chat di sini */}
        <ChatInterface />
        
      </section>

      {/* Footer: Persis seperti di Member Page */}
      <Footer clan={clan} />

    </main>
  );
}