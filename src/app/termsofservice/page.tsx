import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TermsOfServiceAccordion from "@/components/TermsOfServiceAccordion";
import { getClanData } from "@/lib/coc";
import { Scale } from "lucide-react";

export default async function TermsOfServicePage() {
  const clan = await getClanData();

  if (!clan) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <h1 className="text-amber-600 text-5xl md:text-6xl mb-6 " style={{ fontFamily: "'Docallisme', sans-serif" }}>
          SUPERCELL MAINTENANCE
        </h1>
        <p className="text-gray-400 text-md mb-10 max-w-lg font-poppins">
          We couldn't fetch the data right now. Check in-game for the maintenance timer or visit our status page.
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
    "@type": "WebPage",
    "@id": "https://3agang.pro/termsofservice/#webpage",
    "url": "https://3agang.pro/termsofservice",
    "name": "Terms of Service - AAA GANGS Clash of Clans",
    "description": "Syarat dan ketentuan penggunaan website AAA GANGS Clash of Clans community.",
    "publisher": { "@id": "https://3agang.pro/#organization" },
    "potentialAction": {
      "@type": "ReadAction",
      "target": ["https://3agang.pro/termsofservice"]
    }
  };

  return (
    <main className="min-h-screen text-zinc-100 selection:bg-amber-500 selection:text-black overflow-x-hidden font-sans relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-7">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 animate-slide-up">
            <Scale size={12} /> Legal
          </div>
          <h1 className="text-5xl md:text-6xl uppercase leading-tight mb-4 animate-slide-up" style={{ fontFamily: "'Docallisme', sans-serif" }}>
            Terms of <span className="text-amber-500">Service</span>
          </h1>
          <p className="text-zinc-400 text-base max-w-2xl mx-auto animate-slide-up">
            Syarat dan ketentuan penggunaan website AAA GANGS Clash of Clans community.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <TermsOfServiceAccordion />

      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      <Footer clan={clan} />
    </main>
  );
}