import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
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
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="space-y-8">
            <ScrollReveal delay={0.05}>
              <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
                <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                  1. Pengenalan
                </h2>
                <p className="text-zinc-300 leading-relaxed">
                  Selamat datang di 3agang.pro. Syarat dan Ketentuan Layanan ini ("Syarat") mengatur penggunaan Anda terhadap Website dan layanan yang disediakan oleh AAA GANGS Clash of Clans Community. Dengan mengakses atau menggunakan Website, Anda setuju untuk mematuhi dan terikat oleh Syarat ini. Jika Anda tidak setuju dengan Syarat ini, Anda tidak boleh menggunakan Website atau layanan apa pun yang disediakan.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
                <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                  2. Ketentuan Umum
                </h2>
                <p className="text-zinc-300 leading-relaxed">
                  Anda harus berusia setidaknya 13 tahun untuk menggunakan Website dan layanan kami. Dengan menggunakan Website, Anda mengonfirmasi bahwa Anda memenuhi persyaratan usia ini.
                </p>
                <p className="text-zinc-300 leading-relaxed mt-4">
                  Dengan mengakses Website, Anda setuju untuk menggunakannya hanya untuk tujuan yang sah dan sesuai dengan semua hukum dan peraturan lokal, nasional, dan internasional yang berlaku.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.07}>
              <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
                <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                  3. Layanan yang Disediakan
                </h2>
                <p className="text-zinc-300 leading-relaxed">
                  Kami menyediakan koleksi base layout Clash of Clans secara gratis, termasuk link copy untuk berbagai Town Hall level. Kami juga menyediakan fitur Sigma AI, chatbot cerdas yang dapat menjawab pertanyaan seputar Clash of Clans. Beberapa layanan premium Sigma AI mungkin tersedia di masa depan sebagai bagian dari layanan coaching.
                </p>
                <ul className="mt-4 space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Semua layanan kami disediakan secara gratis, tanpa biaya tersembunyi.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Kami tidak menjual base layout atau layanan premium lainnya.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Hasil penggunaan base layout dapat bervariasi tergantung pada strategi dan keterampilan pemain.</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                4. Hak dan Kewajiban Pengguna
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Anda bertanggung jawab untuk menggunakan base layout dan informasi dari Website dengan bijak. Kami tidak bertanggung jawab atas hasil penggunaan base layout dalam permainan Anda.
              </p>
              <p className="text-zinc-300 leading-relaxed mt-4">
                Sigma AI disediakan sebagai alat bantu untuk pertanyaan seputar Clash of Clans. Kami tidak menjamin keakuratan 100% dari jawaban yang diberikan, dan Anda tetap bertanggung jawab penuh atas penggunaan informasi dari Sigma AI. Pengguna bertanggung jawab untuk memverifikasi dan menggunakan informasi dari Sigma AI dengan bijak.
              </p>
            </div>
            </ScrollReveal>

            <ScrollReveal delay={0.09}>
              <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
                <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                  5. Konten dan Kekayaan Intelektual
                </h2>
                <p className="text-zinc-300 leading-relaxed">
                  Semua konten yang disediakan di Website ini, termasuk desain, teks, grafis, logo, dan materi lainnya, adalah properti eksklusif AAA GANGS atau pemberi lisensinya. Penggunaan tidak sah dari materi apa pun dari Website ini dilarang.
                </p>
                <p className="text-zinc-300 leading-relaxed mt-4">
                  Base layout yang kami bagikan adalah kreasi komunitas Clash of Clans dan kami hanya mendistribusikannya untuk kemudahan akses anggota komunitas. Anda diperbolehkan menggunakan, mendistribusikan ulang, atau bahkan menjual base layout tersebut karena kami tidak memiliki hak cipta atas base layout tersebut.
                </p>
                <p className="text-zinc-300 leading-relaxed mt-4">
                  Namun, hasil analisis, strategi, dan konten tambahan yang kami buat berdasarkan base layout tersebut (seperti tips penggunaan, strategi serangan, atau analisis kelemahan) adalah properti intelektual AAA GANGS dan tidak boleh didistribusikan ulang atau digunakan untuk tujuan komersial tanpa izin tertulis dari kami.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
                <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                  6. Pembatasan Tanggung Jawab
                </h2>
                <p className="text-zinc-300 leading-relaxed">
                  Website dan layanan kami disediakan "apa adanya" tanpa jaminan apa pun, baik tersurat maupun tersirat. Kami tidak menjamin operasi Website atau layanan yang tidak terputus atau bebas dari kesalahan.
                </p>
                <p className="text-zinc-300 leading-relaxed mt-4">
                  Dalam keadaan apa pun, AAA GANGS, leader, co leader, elder, member atau afiliasinya tidak bertanggung jawab atas kerusakan langsung, tidak langsung, insidental, khusus, atau konsekuensial yang timbul dari penggunaan Website atau layanan oleh Anda.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.11}>
              <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
                <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                  7. Perubahan Layanan
                </h2>
                <p className="text-zinc-300 leading-relaxed">
                  Kami berhak untuk memperbarui atau memodifikasi Syarat ini kapan saja. Perubahan apa pun akan diposting di halaman ini, dan tanggal pembaruan akan ditunjukkan.
                </p>
                <p className="text-zinc-300 leading-relaxed mt-4">
                  Dengan terus menggunakan Website setelah perubahan Syarat, Anda dianggap telah menyetujui Syarat yang diperbarui.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
                <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                  8. Hukum yang Berlaku
                </h2>
                <p className="text-zinc-300 leading-relaxed">
                  Syarat ini diatur oleh hukum Republik Indonesia. Segala sengketa yang timbul dari Syarat ini akan tunduk pada peraturan perundang-undangan di Indonesia.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.13}>
              <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
                <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                  9. Kontak
                </h2>
                <p className="text-zinc-300 leading-relaxed">
                  Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami melalui halaman <a href="/contact" className="text-amber-500 hover:underline">Contact</a>.
                </p>
              </div>
            </ScrollReveal>
          </div>

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