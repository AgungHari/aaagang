import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrowserVideo from "@/components/BrowserVideo";
import { SectionDivider } from "@/components/SectionDivider";
import { getClanData } from "@/lib/coc";
import { AboutCard } from "@/components/AboutCard";
import { TimelineItem } from "@/components/TimelineItem";
import ScrollReveal from "@/components/ScrollReveal";
import {
  ArrowClockwise,
  ChatCircleText,
  Clock,
  HandHeart,
  Heart,
  Lightning,
  Medal,
  ShieldCheck,
  Sword,
  Target,
  UsersThree,
} from "@phosphor-icons/react/ssr";

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
    { icon: UsersThree, title: "Komunitas", description: "Bukan sekadar clan biasa, AAA GANG adalah tempat berkumpulnya para pemain yang menghargai loyalitas dan respect satu sama lain." }
  ];

  const rules = [
    { icon: Heart, title: "Saling Menghormati", description: "Respect satu sama lain. Hindari hinaan terkait ras, suku, maupun agama." },
    { icon: Lightning, title: "Tetap Aktif", description: "Wajib aktif minimal seminggu sekali. Kalau berhalangan, cukup beri kabar." },
    { icon: Clock, title: "Bebas Menyerang", description: "Tidak ada aturan nomor saat war—bebas serang, siapa cepat dia dapat!" },
    { icon: ShieldCheck, title: "Jaga Komitmen", description: "Bergabung berarti bersedia berkomitmen pada nilai dan komunitas clan." }
  ];

  const elder = [
    { icon: HandHeart, title: "Ringan Tangan", description: "Aktif membantu clan melalui donasi dan memenuhi request." },
    { icon: Sword, title: "Siap Berperang", description: "Sering login dan aktif berpartisipasi dalam war." },
    { icon: Medal, title: "Berprestasi", description: "Rutin menunjukkan performa kuat dan meraih gelar seperti Giant Slayer, Blitzkrieg, atau Perfect Attack." },
    { icon: ChatCircleText, title: "Komunikatif", description: "Sering berinteraksi dan menjaga suasana positif bersama member lain." },
    { icon: ArrowClockwise, title: "Konsisten di CWL", description: "Menyelesaikan semua serangan CWL selama tujuh hari berturut-turut." }
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
      <section className="relative isolate min-h-[100svh] w-full mb-20 overflow-hidden bg-[#050505]">
        <BrowserVideo
          src="/About_Main.webm"
          safariSrc="/About_Safari.mov"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-56 bg-gradient-to-b from-transparent via-[#050505]/75 to-[#050505] sm:h-72" />

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 md:px-12">
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

      <section className="mx-auto max-w-4xl px-5 pb-28 sm:px-8" id="about-us">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-amber-500">Yang menyatukan kami</p>
          <h2 className="text-3xl uppercase leading-tight text-zinc-100 sm:text-4xl" style={{ fontFamily: "'Docallisme', sans-serif" }}>
            Bukan sekadar <span className="text-amber-500">clan</span>
          </h2>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {visions.map((v, i) => (
            <ScrollReveal key={v.title} delay={i * 0.06}>
              <AboutCard {...v} />
            </ScrollReveal>
          ))}
        </div>

        <SectionDivider label="Timeline 2013–2026" />

        <div className="relative mb-8 space-y-4 before:absolute before:bottom-2 before:left-3 before:top-2 before:w-px before:bg-gradient-to-b before:from-transparent before:via-amber-500/50 before:to-transparent before:content-[''] md:space-y-7 md:before:left-1/2 md:before:-translate-x-1/2">
              {timeline.map((t, i) => (
                <ScrollReveal key={t.year} delay={Math.min(i * 0.04, 0.2)}>
                  <TimelineItem {...t} index={i} />
                </ScrollReveal>
              ))}
        </div>

        <SectionDivider label="RULES" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {rules.map((r, i) => (
            <ScrollReveal key={r.title} delay={i * 0.04}>
              <AboutCard {...r} />
            </ScrollReveal>
          ))}
        </div>

        <SectionDivider label="Syarat Jadi Elder" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {elder.map((r, i) => (
            <ScrollReveal key={r.title} delay={i * 0.04}>
              <AboutCard {...r} />
            </ScrollReveal>
          ))}
        </div>
      </section>
      <Footer clan={clan} />
    </main>
  );
}