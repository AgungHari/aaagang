// src/app/privacy/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getClanData } from "@/lib/coc";
import Link from "next/link";
import { Shield } from "lucide-react";

export default async function PrivacyPage() {
  const clan = await getClanData();

  if (!clan) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <h1 className="text-amber-600 text-5xl md:text-6xl mb-6" style={{ fontFamily: "'Docallisme', sans-serif" }}>
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

  return (
    <main className="min-h-screen text-zinc-100 selection:bg-amber-500 selection:text-black overflow-x-hidden font-sans relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://3agang.pro/privacy/#webpage",
          "url": "https://3agang.pro/privacy",
          "name": "Privacy Policy - AAA GANGS Clash of Clans",
          "description": "Kebijakan privasi penggunaan website AAA GANGS Clash of Clans community.",
          "publisher": { "@id": "https://3agang.pro/#organization" }
        }) }}
      />

      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-7">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 animate-slide-up">
            <Shield size={12} /> Privacy
          </div>
          <h1 className="text-5xl md:text-6xl uppercase leading-tight mb-4 animate-slide-up" style={{ fontFamily: "'Docallisme', sans-serif" }}>
            Privacy <span className="text-amber-500">Policy</span>
          </h1>
          <p className="text-zinc-400 text-base max-w-2xl mx-auto animate-slide-up">
            Kebijakan privasi penggunaan website AAA GANGS Clash of Clans community.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="space-y-8">
          <ScrollReveal delay={0.05}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                Pendahuluan
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                AAA GANG ("kami", "kita", atau "klan") berkomitmen untuk melindungi privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan melindungi informasi Anda saat Anda mengunjungi situs web kami di 3agang.pro (selanjutnya disebut "Situs").
              </p>
              <p className="text-zinc-300 mt-4 leading-relaxed">
                Dengan mengakses atau menggunakan Situs kami, Anda mengakui bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh semua ketentuan yang diuraikan dalam Kebijakan Privasi ini.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                Informasi yang Kami Kumpulkan
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Kami dapat mengumpulkan informasi tentang Anda dengan berbagai cara, termasuk:
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2 text-amber-500">Informasi Pribadi</h3>
              <p className="text-zinc-300 leading-relaxed">
                Saat Anda menggunakan Situs kami, kami dapat mengumpulkan jenis informasi pribadi berikut:
              </p>
              <ul className="list-disc list-inside text-zinc-300 mt-2 space-y-1">
                <li>Alamat IP dan informasi browser</li>
                <li>Informasi yang Anda berikan saat menggunakan layanan <Link href="/sigma" className="text-amber-500 hover:underline">Ask SIGMA</Link></li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2 text-amber-500">Data Penggunaan</h3>
              <p className="text-zinc-300 leading-relaxed">
                Kami juga dapat mengumpulkan informasi tentang cara Anda menggunakan Situs kami, termasuk:
              </p>
              <ul className="list-disc list-inside text-zinc-300 mt-2 space-y-1">
                <li>Halaman yang Anda kunjungi</li>
                <li>Waktu yang dihabiskan di halaman tersebut</li>
                <li>Layout yang Anda lihat atau unduh</li>
                <li>Situs web atau sumber yang mengarahkan Anda ke Situs kami</li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                Cara Kami Menggunakan Informasi Anda
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Kami dapat menggunakan informasi yang kami kumpulkan untuk berbagai tujuan, termasuk:
              </p>
              <ul className="list-disc list-inside text-zinc-300 mt-2 space-y-1">
                <li>Menyediakan, memelihara, dan meningkatkan Situs kami</li>
                <li>Memantau dan menganalisis pola penggunaan dan tren</li>
                <li>Mempersonalisasi pengalaman Anda</li>
                <li>Melindungi dari, mengidentifikasi, dan mencegah penipuan dan aktivitas ilegal lainnya</li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.09}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                Cookie dan Teknologi Pelacakan
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Kami menggunakan cookie dan teknologi pelacakan serupa untuk melacak aktivitas di Situs kami dan menyimpan informasi tertentu. Cookie adalah file dengan jumlah data kecil yang dapat mencakup pengidentifikasi unik anonim.
              </p>
              <p className="text-zinc-300 mt-4 leading-relaxed">
                Anda dapat menginstruksikan browser Anda untuk menolak semua cookie atau untuk menunjukkan ketika cookie sedang dikirim. Namun, jika Anda tidak menerima cookie, Anda mungkin tidak dapat menggunakan beberapa bagian dari Situs kami.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                Layanan SIGMA
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Layanan <Link href="/sigma" className="text-amber-500 hover:underline">Ask SIGMA</Link> kami menggunakan penyimpanan lokal (localStorage) di browser Anda untuk menyimpan riwayat percakapan. Ini berarti:
              </p>
              <ul className="list-disc list-inside text-zinc-300 mt-2 space-y-1">
                <li>Riwayat percakapan hanya disimpan di perangkat Anda dan tidak dikirim ke server kami</li>
                <li>Kami tidak memiliki akses ke riwayat percakapan Anda</li>
                <li>Data akan hilang jika Anda membersihkan cache browser atau menggunakan perangkat lain</li>
                <li>Kami tidak memerlukan login atau akun untuk menggunakan layanan ini</li>
              </ul>
              <p className="text-zinc-300 mt-4 leading-relaxed">
                Kami tidak menyimpan atau mengumpulkan data percakapan dari layanan SIGMA di server kami.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.11}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                Layanan Pihak Ketiga
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Kami dapat menggunakan layanan pihak ketiga seperti Google Analytics untuk membantu kami memahami bagaimana pengguna kami menggunakan Situs. Penyedia layanan pihak ketiga ini dapat menggunakan cookie, web beacon, dan teknologi lainnya untuk mengumpulkan informasi tentang penggunaan Situs kami.
              </p>
              <p className="text-zinc-300 mt-4 leading-relaxed">
                Situs kami juga dapat berisi tautan ke situs web lain yang tidak dioperasikan oleh kami. Jika Anda mengklik tautan pihak ketiga, Anda akan diarahkan ke situs pihak ketiga tersebut. Kami sangat menyarankan Anda untuk meninjau Kebijakan Privasi setiap situs yang Anda kunjungi.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                Keamanan Data
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Kami menerapkan langkah-langkah teknis dan organisasi yang sesuai untuk melindungi keamanan informasi pribadi Anda. Namun, harap diketahui bahwa tidak ada metode transmisi melalui Internet atau metode penyimpanan elektronik yang 100% aman.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.13}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                Privasi Anak-Anak
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Situs kami tidak ditujukan untuk anak-anak di bawah usia 13 tahun. Kami tidak dengan sengaja mengumpulkan informasi pribadi dari anak-anak di bawah usia 13 tahun. Jika Anda adalah orang tua atau wali dan Anda mengetahui bahwa anak Anda telah memberikan informasi pribadi kepada kami, silakan hubungi kami.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.14}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-amber-500">
                Perubahan pada Kebijakan Privasi
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Kami dapat memperbarui Kebijakan Privasi kami dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan apa pun dengan memposting Kebijakan Privasi baru di halaman ini dan memperbarui tanggal "Terakhir Diperbarui" di bagian atas.
              </p>
              <p className="text-zinc-300 mt-4 leading-relaxed">
                Anda disarankan untuk meninjau Kebijakan Privasi ini secara berkala untuk perubahan apa pun. Perubahan pada Kebijakan Privasi ini berlaku ketika diposting di halaman ini.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
              <h2 className="text-2xl font-bold uppercase mb-4 text-white">
                Hubungi Kami
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami menggunakan formulir kontak di situs web kami atau melalui <Link href="/sigma" className="text-amber-500 hover:underline">Ask SIGMA</Link>.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 text-center">
            <p className="text-zinc-500 text-sm">
              Terakhir diperbarui: 01 Mei 2026
            </p>
          </div>
        </div>
      </section>

      <Footer clan={clan} />
    </main>
  );
}