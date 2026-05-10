import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutsFilter from "@/components/LayoutsFilter";
import LayoutPageChat from "@/components/LayoutPageChat";
import { getClanData } from "@/lib/coc";
import { createClient } from "@libsql/client";
import ScrollReveal from "@/components/ScrollReveal";
import { Hammer } from "lucide-react";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export default async function LayoutPage() {
  const [clan, layoutsResult] = await Promise.all([
    getClanData(),
    client.execute("SELECT * FROM layouts ORDER BY upload_date DESC"),
  ]);

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

  const layouts = layoutsResult.rows;

  // Serialize layouts ke plain objects untuk Client Component
  const serializedLayouts = JSON.parse(JSON.stringify(layouts));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://3agang.pro/layout/#collection",
    "url": "https://3agang.pro/layout",
    "name": "Koleksi Base Layout Clash of Clans - AAA GANGS",
    "description": "Kumpulan base layout COC terkuat dari TH 13 sampai TH 16. Cari desain War, Trophy, dan Farming base dengan link copy resmi.",
    "publisher": { "@id": "https://3agang.pro/#organization" },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": serializedLayouts.length,
      "itemListElement": serializedLayouts.slice(0, 10).map((layout: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://3agang.pro/layout/${layout.id}`,
        "name": `Base Layout TH ${layout.th_level}`
      }))
    }
  };

  return (
    <main className="min-h-screen text-zinc-100 selection:bg-amber-500 selection:text-black overflow-x-hidden font-poppins">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      {/* Content Section */}
      <section className="pt-32 pb-20 px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-7xl mx-auto">
          {/* <div className="flex justify-center mb-4 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">
              <Hammer size={12} /> Koleksi Base
            </div>
          </div> */}
          {/* <h1 className="text-4xl md:text-5xl mb-8 animate-slide-up mx-auto text-center" style={{ fontFamily: "'Docallisme', sans-serif" }}>
            BASE <span className="text-amber-500">LAYOUTS</span>
          </h1>

          <p className="text-gray-300 leading-relaxed mb-12 max-w-4xl animate-slide-up mx-auto text-center">
            Temukan inspirasi base layouts terbaik dari AAA GANG, Data di scrap otomatis!
          </p> */}

          {/* Chat Interface */}
          <div className="mb-8 animate-slide-up max-w-4xl mx-auto">
            <LayoutPageChat clanName={clan.name} />
          </div>

          {/* Layouts Filter & Grid */}
          {serializedLayouts.length > 0 ? (
            <div className="animate-slide-up">
              <LayoutsFilter layouts={serializedLayouts} />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Belum ada base layouts. Admin silakan tambahkan layout baru.</p>
            </div>
          )}
        </div>
      </section>

      <Footer clan={clan} />
    </main>
  );
}
