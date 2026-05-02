import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getClanData } from "@/lib/coc";
import { ShieldCheck } from "lucide-react";

export default async function DMCAPage() {
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
    "@id": "https://3agang.pro/dmca/#webpage",
    "url": "https://3agang.pro/dmca",
    "name": "DMCA Policy - AAA GANGS Clash of Clans",
    "description": "Kebijakan DMCA untuk website AAA GANGS Clash of Clans community.",
    "publisher": { "@id": "https://3agang.pro/#organization" }
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
            <ShieldCheck size={12} /> DMCA
          </div>
          <h1 className="text-5xl md:text-6xl uppercase leading-tight mb-4 animate-slide-up" style={{ fontFamily: "'Docallisme', sans-serif" }}>
            DMCA <span className="text-amber-500">Policy</span>
          </h1>
          <p className="text-zinc-400 text-base max-w-2xl mx-auto animate-slide-up">
            Kebijakan DMCA untuk website AAA GANGS Clash of Clans community.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="space-y-8">
          <ScrollReveal delay={0.05}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                1. Pengenalan
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Situs web AAA GANGS (3agang.pro) sangat menghargai kekayaan intelektual orang lain dan kami berkomitmen untuk mematuhi Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta (UU Hak Cipta) yang berlaku di Republik Indonesia, serta standar internasional Digital Millennium Copyright Act (DMCA).
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                2. Disclaimer Konten Penggemar Supercell
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Situs web ini adalah platform komunitas tidak resmi yang dibuat oleh penggemar untuk klan AAA GANGS di game Clash of Clans.
              </p>
              <p className="text-zinc-300 mt-4 leading-relaxed">
                Materi ini tidak resmi dan tidak disponsori oleh Supercell. Konten ini tidak berafiliasi dengan, didukung, disponsori, atau secara khusus disetujui oleh Supercell dan Supercell tidak bertanggung jawab atas konten ini. Untuk informasi lebih lanjut, silakan lihat Kebijakan Konten Penggemar Supercell: <a href="https://www.supercell.com/fan-content-policy" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">www.supercell.com/fan-content-policy</a>.
              </p>
              <p className="text-zinc-300 mt-4 leading-relaxed">
                Semua aset grafis, gambar, dan ikon terkait game Clash of Clans yang digunakan di situs ini adalah milik Supercell.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.07}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                3. Konten yang Dilindungi
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Kami melindungi semua konten asli yang dibuat oleh tim AAA GANGS, termasuk tetapi tidak terbatas pada:
              </p>
              <ul className="mt-4 space-y-2 text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Analisis strategi dan panduan permainan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Konten editorial dan artikel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Desain dan tata letak website</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Kode dan skrip asli yang dikembangkan oleh tim kami</span>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                4. Sumber dan Izin Base Layout
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Semua base layout Clash of Clans yang disediakan di situs web ini telah dikumpulkan dan disajikan dengan memperhatikan hak cipta dan izin penggunaan yang sesuai. Kami bekerja sama dengan komunitas dan kreator untuk memastikan bahwa konten yang dibagikan mematuhi standar etika dan hukum yang berlaku.
              </p>
              <p className="text-zinc-300 mt-4 leading-relaxed">
                Base layout yang kami bagikan digunakan semata-mata untuk tujuan edukasi, berbagi strategi, dan pengembangan komunitas Clash of Clans. Kami menghargati kerja keras para kreator dan selalu terbuka untuk komunikasi jika ada pertanyaan atau kebutuhan klarifikasi mengenai penggunaan konten.
              </p>
            </div>
          </ScrollReveal>

            <ScrollReveal delay={0.09}>
              <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
                <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                  5. Pemberitahuan Pelanggaran Hak Cipta
                </h2>
                <p className="text-zinc-300 leading-relaxed">
                  Jika Anda adalah pemilik hak cipta, atau agen yang berwenang, dan Anda yakin bahwa ada konten di situs web 3agang.pro yang melanggar hak cipta Anda diatur secara khusus di dalam Pasal 55 dan 56 UU Nomor 28 Tahun 2014, Anda dapat mengajukan permintaan penghapusan dengan mengirimkan email kepada kami yang memuat informasi berikut:
                </p>
                <ul className="mt-4 space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Tanda tangan fisik atau elektronik dari pemilik hak cipta atau perwakilan yang berwenang</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Identifikasi karya berhak cipta yang diklaim telah dilanggar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Identifikasi materi yang diklaim sebagai pelanggaran beserta lokasi spesifiknya (URL) di situs web kami agar kami dapat menemukannya</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Informasi kontak Anda, termasuk alamat, nomor telepon, dan alamat email aktif</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Pernyataan dengan itikad baik bahwa penggunaan materi tersebut tidak diizinkan oleh pemilik hak cipta, agennya, atau hukum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Pernyataan bahwa informasi dalam pemberitahuan ini akurat, dan di bawah ancaman sumpah palsu, bahwa Anda berwenang untuk bertindak atas nama pemilik hak cipta</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
                <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                  6. Sigma AI Chatbot
                </h2>
                <p className="text-zinc-300 leading-relaxed">
                  Layanan Sigma AI Chatbot kami menyediakan jawaban dan saran berdasarkan pertanyaan seputar Clash of Clans. Konten yang dihasilkan oleh Sigma AI berdasarkan input pengguna menjadi tanggung jawab pengguna. Kami tidak bertanggung jawab atas penggunaan konten AI yang melanggar hak cipta atau aturan komunitas.
                </p>
                <p className="text-zinc-300 mt-4 leading-relaxed">
                  Pengguna diharapkan untuk menggunakan Sigma AI dengan bijak dan tidak menyebarkan informasi yang melanggar hak cipta, merugikan pihak lain, atau bertentangan dengan kebijakan komunitas Clash of Clans. Layanan Sigma AI Chatbot kami menyediakan jawaban dan saran berdasarkan pertanyaan seputar Clash of Clans. Versi gratis tersedia untuk semua pengguna, sementara layanan premium mungkin ditawarkan di masa depan sebagai bagian dari layanan coaching yang diperbolehkan oleh Kebijakan Konten Penggemar Supercell.
                </p>
              </div>
            </ScrollReveal>

          <ScrollReveal delay={0.11}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                7. Repeat Infringer Policy
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Kami menerapkan kebijakan untuk membatasi atau menghapus konten yang melanggar hak cipta dari situs web kami. Dalam keadaan tertentu, kami dapat memblokir alamat IP atau membatasi akses ke situs web kami untuk mencegah pelanggaran berulang, sesuai dengan kebijakan kami dan peraturan yang berlaku.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                8. Modifications
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Kami berhak untuk memodifikasi Kebijakan Hak Cipta ini kapan saja. Perubahan akan efektif segera setelah diposting di halaman ini. Penggunaan terus menerus dari situs web kami setelah perubahan dianggap sebagai penerimaan terhadap kebijakan yang diperbarui.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.13}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                9. Kontak Hak Cipta
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Semua laporan pelanggaran atau pertanyaan terkait hak cipta harap dikirimkan melalui email ke:
              </p>
              <p className="text-zinc-300 mt-4 leading-relaxed">
                Email: <a href="mailto:admin@3agang.pro" className="text-amber-500 hover:underline">elder@3agang.pro</a><br/>
                Subjek Email: Laporan Pelanggaran Hak Cipta / DMCA Notice
              </p>
              <p className="text-zinc-300 mt-4 leading-relaxed">
                Kami akan merespons dan mengambil tindakan yang sesuai, termasuk menghapus atau menonaktifkan akses ke materi yang dipermasalahkan dalam waktu 3-5 hari kerja.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 text-center">
            <p className="text-zinc-500 text-sm">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      <Footer clan={clan} />
    </main>
  );
}