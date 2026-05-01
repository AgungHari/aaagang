// src/app/contact/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getClanData } from "@/lib/coc";
import Link from "next/link";
import { Mail, MapPin, Clock, ExternalLink, MessageCircle, Sigma } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default async function ContactPage() {
  const clan = await getClanData();

  if (!clan) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <h1 className="text-amber-600 text-5xl md:text-6xl mb-6" style={{ fontFamily: "'Docallisme', sans-serif" }}>
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 font-poppins">
       <ScrollReveal delay={0.1} mobileDelay={0.1}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl text-center tracking-wider mt-13 mb-4 text-amber-500" style={{ fontFamily: "'Docallisme', sans-serif" }}>
            CONTACT <span className="text-white">US</span>
          </h1>
          <p className="text-center text-zinc-400 mb-12 text-sm">
            Have questions or want to join our clan? Get in touch with us!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Clan Information */}
            <div className="bg-zinc-900/30 border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/50 transition-all flex flex-col">
              <h2 className="text-xl font-bold mb-4 text-white">Clan Information</h2>

              <div className="space-y-4 flex-grow">
                <div className="flex items-start gap-3">
                  <MapPin className="text-amber-500 mt-1 flex-shrink-0" size={18} />
                  <div>
                    <h3 className="text-white">Location</h3>
                    <p className="text-zinc-400 text-sm">Indonesia</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="text-amber-500 mt-1 flex-shrink-0" size={18} />
                  <div>
                    <h3 className="text-white">Established</h3>
                    <p className="text-zinc-400 text-sm">2016</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ExternalLink className="text-amber-500 mt-1 flex-shrink-0" size={18} />
                  <div>
                    <h3 className="text-white">Clan Tag</h3>
                    <p className="text-zinc-400 text-sm">#{clan.tag.replace(/^#/, '')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="https://link.clashofclans.com/en/?action=OpenClanProfile&tag=Q9YY02J9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-amber-700 hover:bg-amber-900 text-white rounded-xl px-7 h-11 font-400 transition-all flex items-center justify-center gap-2"
                >
                  <span>Join Clan in Game</span>
                  <ExternalLink size={16} />
                </Link>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="bg-zinc-900/30 border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/50 transition-all flex flex-col">
              <h2 className="text-xl font-bold mb-4 text-white">Contact Methods</h2>

              <div className="space-y-4.5 flex-grow">
                <Link
                  href="mailto:leader@3agang.pro"
                  className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl px-6 h-11 transition-all"
                >
                  <Mail size={16} />
                  <span>leader@3agang.pro</span>
                </Link>

                <Link
                  href="mailto:coleader@3agang.pro"
                  className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl px-6 h-11 transition-all"
                >
                  <Mail size={16} />
                  <span>coleader@3agang.pro</span>
                </Link>

                <Link
                  href="mailto:elder@3agang.pro"
                  className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl px-6 h-11 transition-all"
                >
                  <Mail size={16} />
                  <span>elder (Nia : +62 881-0827-88959)</span>
                </Link>

                <Link
                  href="/sigma"
                  className="w-full flex items-center justify-center gap-2 border-2 border-amber-900 hover:bg-amber-950/50 transition rounded rounded-tl-3xl rounded-br-3xl rounded-bl-3xl px-6 h-11"
                >
                  <Sigma size={16} />
                  <span>Ask SIGMA</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
       </ScrollReveal>
      </main>
      <Footer clan={clan} />
    </div>
  );
}