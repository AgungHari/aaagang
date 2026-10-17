import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfitableAdUnit from "@/components/ProfitableAdUnit";
import { getClanData } from "@/lib/coc";
import { Zap } from "lucide-react";
import ChatInterface from "./ChatInterface"; // Import client component tadi
import Image from "next/image";

export default async function KontakPage() {
  const clan = await getClanData();

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
    const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://3agang.pro/sigma/#service",
        "name": "SIGMA AI - Clash of Clans Assistant",
        "description": "Asisten AI khusus Clan AAA GANGS. Memberikan informasi seputar strategi base, aturan klan, dan panduan bermain Clash of Clans secara real-time.",
        "provider": { "@id": "https://3agang.pro/#organization" },
        "serviceType": "Artificial Intelligence Assistant",
        "areaServed": "Worldwide",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "SIGMA AI Capabilities",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Strategi Base Layout" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Informasi Rules Clan" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Panduan Upgrade Hero & Trops" } }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Apa itu SIGMA AI?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SIGMA AI adalah asisten cerdas berbasis LLM yang dikembangkan khusus untuk komunitas AAA GANGS guna membantu pemain memahami strategi Clash of Clans dan informasi klan."
            }
          },
          {
            "@type": "Question",
            "name": "Bagaimana cara bergabung dengan AAA GANGS?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Anda bisa menanyakan langsung ke SIGMA AI mengenai slot member yang tersedia atau langsung klik link Join di homepage 3agang.pro."
            }
          }
        ]
      }
    ]
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Navbar: Persis seperti di Member Page */}
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      <section className="relative isolate flex min-h-[55svh] items-end overflow-hidden bg-[#050505] pb-20 pt-32 sm:min-h-[62svh] sm:pb-24">
        <Image
          src="/Clashiversary14_ONLY_BG.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/45 to-black/15" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#050505] via-black/25 to-black/15" />

        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="max-w-3xl animate-slide-up">
            <div className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">
              <Zap size={12} /> Your Clash companion
            </div>
            <h1
              className="text-5xl font-black uppercase italic leading-[0.9] tracking-tight text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.75)] sm:text-6xl md:text-8xl"
              style={{ fontFamily: "'Docallisme', sans-serif" }}
            >
              Ask <span className="text-amber-400">Sigma</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-zinc-200/85 sm:text-base">
              Strategy, clan info, and Clash questions. Let&apos;s figure it out together.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-12 w-full max-w-5xl px-4 pb-20 sm:-mt-16 sm:px-8">
        <ChatInterface />
      </section>

      {/* Footer: Persis seperti di Member Page */}
      <Footer clan={clan} />

    </main>
  );
}