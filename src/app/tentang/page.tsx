import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrowserVideo from "@/components/BrowserVideo";
import { SectionDivider } from "@/components/SectionDivider";
import { getClanData } from "@/lib/coc";
import { AboutCard } from "@/components/AboutCard";
import { TimelineItem } from "@/components/TimelineItem";
import ScrollReveal from "@/components/ScrollReveal";
import { Shield, Target, Zap, Users, Heart, Clock, ShieldCheck, HandHeart, Swords, Medal, MessageCircle, Repeat } from "lucide-react";

export default async function AboutPage() {
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

  const visions = [
    { icon: Target, title: "Visi Kami", description: "Membangun komunitas Clash of Clans yang solid, kompetitif, namun tetap santai. Kekalahan di War hanyalah bahan evaluasi (dan candaan) untuk kemenangan hari esok." },
    { icon: Users, title: "Komunitas", description: "Bukan sekadar clan biasa, AAA GANG adalah tempat berkumpulnya para pemain yang menghargai loyalitas dan respect satu sama lain." }
  ];

  const rules = [
    { icon: Heart, title: "Rule 1", description: "Respect satu sama lain (jangan hina ras suku maupun agama kepada pribadi lain)" },
    { icon: Zap, title: "Rule 2", description: "Wajib on minimal seminggu sekali (kalau berhalangan bisa izin)" },
    { icon: Clock, title: "Rule 3", description: "Tidak ada aturan nomer saat war bebas serang siapa cepat dia dapat!" },
    { icon: ShieldCheck, title: "Rule 4", description: "Memasuki clan artinya bersedia berkomitment kuat terhadap nilai-nilai dan komunitas clan" }
  ];

  const elder = [
    { icon: HandHeart, title: "Rule 1", description: "Donasi dan Request tinggi." },
    { icon: Swords, title: "Rule 2", description: "Sering login dan aktif dalam war." },
    { icon: Medal, title: "Rule 3", description: "Sering mendapatkan gelar Giant Slayer, Blitzkrieg dan Perfect attack." },
    { icon: MessageCircle, title: "Rule 4", description: "Sering berinteraksi dengan member lain" },
    { icon: Repeat, title: "Rule 5", description: "CWL full attack 7 hari berturut-turut" }
  ];

  const timeline = [
    { year: "2013", text: "Clash of Clans resmi dirilis di platform Android, membuka jalan bagi komunitas lokal untuk berkumpul dan membentuk tim pertama." },
    { year: "2014", text: "Brother War didirikan sebagai wadah pertama bagi tim lokal yang ingin bertanding serius tanpa mengorbankan kekeluargaan." },
    { year: "2015", text: "Perjalanan Brother War dihentikan sementara, namun pengalaman itu jadi pondasi bagi babak baru." },
    { year: "2016", text: "Pendiri Oxy bangkit kembali dan mendirikan AAA GANG dengan visi yang lebih tajam dan tekad yang lebih kuat." },
    { year: "2018", text: "AAA GANG mengambil jeda untuk mengevaluasi strategi dan kembali dengan energi baru di waktu yang tepat." },
    { year: "2022-2023", text: "Aktivitas kembali hidup bersama OG Clan, bukti bahwa akar kami masih kuat dan semangat tempur tetap menyala." },
    { year: "2025-2026", text: "AAA GANG kembali ke identitas asli: Loyalitas & Kemenangan." }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": "https://3agang.pro/tentang/#about",
    "url": "https://3agang.pro/tentang",
    "name": "Tentang AAA GANGS - Sejarah, Visi, dan Aturan Klan",
    "description": "Pelajari sejarah panjang AAA GANGS sejak 2013, visi misi kami membangun komunitas Clash of Clans yang solid, serta aturan resmi menjadi anggota dan Elder.",
    "publisher": { "@id": "https://3agang.pro/#organization" },
    "mainEntity": {
      "@type": "Organization",
      "name": "AAA GANGS",
      "foundingDate": "2016",
      "knowsAbout": ["Clash of Clans", "Mobile Strategy Gaming", "Community Management"],
      "ethicsPolicy": "https://3agang.pro/tentang",
      "slogan": "Loyalitas & Kemenangan",
      "description": "AAA GANGS adalah komunitas Clash of Clans yang percaya bahwa kekuatan sejati ada pada loyalitas dan kekompakan tim."
    }
  };

  // Kita tambahkan juga Schema FAQ untuk Rules agar muncul di Google Search
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": rules.map((r) => ({
      "@type": "Question",
      "name": r.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": r.description
      }
    }))
  };

  return (
    <main className="min-h-screen text-zinc-100 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      {/* Video Hero Section */}
      <section className="relative w-full h-screen md:h-96 mt-[50px] mb-20 overflow-hidden">
        <BrowserVideo
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center px-6 md:px-12">
          <ScrollReveal delay={0.1}>
            <div className="max-w-2xl text-center">
              <h2 className="text-5xl md:text-7xl uppercase font-black italic leading-tight mb-4" style={{ fontFamily: "'Docallisme', sans-serif" }}>
                MENCARI <br /> YANG <span className="text-amber-500">TERTAWA</span>
              </h2>
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
                Di AAA GANG, kekuatan sejati adalah loyalitas, kekompakan, dan kemampuan untuk tertawa bersama saat menghadapi kekalahan.
              </p>
              <div className="flex gap-4">
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-32" id="about-us">
        {/* Vision Grid Section */}

        {/* Vision Grid - Pakai Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {visions.map((v, i) => <AboutCard key={i} {...v} />)}
        </div>

        <SectionDivider label="Timeline 2013–2026" />

        {/* Timeline - Pakai Map */}
        <div className="mb-20">
           <div className="space-y-10">
              {timeline.map((t, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <TimelineItem key={i} {...t} />
                </ScrollReveal>
              ))}
           </div>
        </div>

        <SectionDivider label="RULES" />

        {/* Rules Grid - Pakai Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {rules.map((r, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <AboutCard key={i} {...r} />
            </ScrollReveal>
          ))}
        </div>

        <SectionDivider label="Syarat Jadi Elder" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {elder.map((r, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <AboutCard key={i} {...r} />
            </ScrollReveal>
          ))}
        </div>
      </section>
      <Footer clan={clan} />
    </main>
  );
}