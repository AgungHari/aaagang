import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getClanData } from "@/lib/coc";
import { Zap } from "lucide-react";
import ChatInterface from "./ChatInterface"; // Import client component tadi

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
    <main className="min-h-screen text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Navbar: Persis seperti di Member Page */}
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 animate-slide-up">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Zap size={12} /> Let's Talk
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-widest uppercase italic leading-[0.8]" style={{ fontFamily: "'Docallisme', sans-serif" }}>
            TRIPLE <span className="text-amber-500">AI `SIGMA'</span>
          </h1>
          <p className="mt-5 text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            Tanya info klan, rules, base terkuat, grup discord, apapun yang kamu butuhkan!
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