import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getClanData } from "@/lib/coc";
import { Shield, Target, Zap, Users, Heart, UserX, Clock, ShieldCheck } from "lucide-react";

export default async function AboutPage() {
  const clan = await getClanData();

  if (!clan) return <div className="text-white text-center py-20">DATABASE ERROR...</div>;

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      <Navbar clanName={clan.name} badge={clan.badgeUrls.small} />

      <section className="max-w-4xl mx-auto px-6 pt-24 pb-32">
        {/* Header Section */}
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

        {/* Vision/Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] hover:border-amber-500/30 transition-all group">
            <Target className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-black italic uppercase mb-2">Visi Kami</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Membangun komunitas Clash of Clans yang solid, kompetitif, namun tetap santai. Kekalahan di War hanyalah bahan evaluasi (dan candaan) untuk kemenangan hari esok.
            </p>
          </div>
          
          <div className="p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] hover:border-amber-500/30 transition-all group">
            <Users className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-black italic uppercase mb-2">Komunitas</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Bukan sekadar clan biasa, AAA GANG adalah tempat berkumpulnya para pemain yang menghargai loyalitas dan respect satu sama lain.
            </p>
          </div>
        </div>

        {/* History / Fun Fact */}
        <div className="border-t border-zinc-800/50 pt-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-zinc-800/50"></div>
            <span className="text-[10px] font-black tracking-[0.5em] text-zinc-600 uppercase">Timeline 2013–2026</span>
            <div className="h-px flex-1 bg-zinc-800/50"></div>
          </div>
          <div className="space-y-5 text-zinc-400 text-sm leading-relaxed">
            <div>
              <span className="block text-amber-500 font-black uppercase text-xs mb-1">2013</span>
              Clash of Clans resmi dirilis di platform Android, membuka jalan bagi komunitas lokal untuk berkumpul dan membentuk tim pertama.
            </div>
            <div>
              <span className="block text-amber-500 font-black uppercase text-xs mb-1">2014</span>
              Brother War didirikan sebagai wadah pertama bagi tim lokal yang ingin bertanding serius tanpa mengorbankan kekeluargaan.
            </div>
            <div>
              <span className="block text-amber-500 font-black uppercase text-xs mb-1">2015</span>
              Perjalanan Brother War dihentikan sementara, namun pengalaman itu jadi pondasi bagi babak baru.
            </div>
            <div>
              <span className="block text-amber-500 font-black uppercase text-xs mb-1">2016</span>
              Pendiri Oxy bangkit kembali dan mendirikan AAA GANG dengan visi yang lebih tajam dan tekad yang lebih kuat.
            </div>
            <div>
              <span className="block text-amber-500 font-black uppercase text-xs mb-1">2018</span>
              AAA GANG mengambil jeda untuk mengevaluasi strategi dan kembali dengan energi baru di waktu yang tepat.
            </div>
            <div>
              <span className="block text-amber-500 font-black uppercase text-xs mb-1">2022–2023</span>
              Aktivitas kembali hidup bersama OG Clan, bukti bahwa akar kami masih kuat dan semangat tempur tetap menyala.
            </div>
            <div>
              <span className="block text-amber-500 font-black uppercase text-xs mb-1">2025–2026</span>
              AAA GANG kembali ke nama dan nilai yang menjadi identitas kami: loyalitas, kekompakan, dan kemenangan yang dibangun bersama.
            </div>
          </div>
        </div>

        <div className="mt-14">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-zinc-800/50"></div>
            <span className="text-[10px] font-black tracking-[0.5em] text-zinc-600 uppercase">Rules</span>
            <div className="h-px flex-1 bg-zinc-800/50"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] hover:border-amber-500/30 transition-all group">
              <Heart className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-xl font-black italic uppercase mb-2">Rule 1</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Respect satu sama lain (jangan hina ras suku maupun agama kepada pribadi lain)</p>
            </div>
            <div className="p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] hover:border-amber-500/30 transition-all group">
              <Zap className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-xl font-black italic uppercase mb-2">Rule 2</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Wajib on minimal seminggu sekali (kalau berhalangan izin)</p>
            </div>
            <div className="p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] hover:border-amber-500/30 transition-all group">
              <UserX className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-xl font-black italic uppercase mb-2">Rule 3</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Orang bernickname "Rheyy Xyzega" DILARANG KERAS JOIN (DIA RASIS)</p>
            </div>
            <div className="p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] hover:border-amber-500/30 transition-all group">
              <Target className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-xl font-black italic uppercase mb-2">Rule 4</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Anggota clan Leave of all maupun alumni clan adalah MUSUH KITA DAN DILARANG KERAS INVITE MAUPUN JOIN</p>
            </div>
            <div className="p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] hover:border-amber-500/30 transition-all group">
              <Clock className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-xl font-black italic uppercase mb-2">Rule 5</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Tidak ada aturan nomer saat war bebas serang siapa cepat dia dapat!</p>
            </div>
            <div className="p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] hover:border-amber-500/30 transition-all group">
              <ShieldCheck className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-xl font-black italic uppercase mb-2">Rule 6</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Memasuki clan artinya bersedia berkomitment kuat terhadap nilai-nilai dan komunitas clan</p>
            </div>
          </div>
        </div>
      </section>

      <Footer clan={clan} />
    </main>
  );
}