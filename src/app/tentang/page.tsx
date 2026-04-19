import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SectionDivider } from "@/components/SectionDivider";
import { getClanData } from "@/lib/coc";
import { AboutCard } from "@/components/AboutCard";
import { TimelineItem } from "@/components/TimelineItem";
import { Shield, Target, Zap, Users, Heart, Clock, ShieldCheck, HandHeart, Swords, Medal, MessageCircle, Repeat } from "lucide-react";

export default async function AboutPage() {
  const clan = await getClanData();
  if (!clan) return <div className="text-white text-center py-20">DATABASE ERROR...</div>;

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

  return (
    <main className="min-h-screen text-zinc-100 font-sans">
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      <section className="max-w-4xl mx-auto px-6 pt-24 pb-32">
        {/* Header Tetap Manual Karena Unik */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <Shield size={12} /> About Us
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none mb-6">
            MENCARI <br /> YANG <span className="text-amber-500">TERTAWA</span>
          </h1>
          <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-2xl mx-auto italic font-medium">
            Di AAA GANG, kami percaya bahwa kekuatan sejati bukan hanya soal jumlah bintang atau kemenangan, tapi juga tentang loyalitas, kekompakan, dan tentu saja, kemampuan untuk tertawa bersama saat menghadapi kekalahan.
          </p>
        </div>

        {/* Vision Grid - Pakai Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {visions.map((v, i) => <AboutCard key={i} {...v} />)}
        </div>

        <SectionDivider label="Timeline 2013–2026" />

        {/* Timeline - Pakai Map */}
        <div className="mb-20">
           <div className="space-y-10">
              {timeline.map((t, i) => <TimelineItem key={i} {...t} />)}
           </div>
        </div>

        <SectionDivider label="RULES" />

        {/* Rules Grid - Pakai Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {rules.map((r, i) => <AboutCard key={i} {...r} />)}
        </div>

        <SectionDivider label="Syarat Jadi Elder" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {elder.map((r, i) => <AboutCard key={i} {...r} />)}
        </div>
      </section>
      <Footer clan={clan} />
    </main>
  );
}