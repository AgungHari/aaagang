'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DMCASection {
  id: number;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

const dmcaSections: DMCASection[] = [
  {
    id: 1,
    title: '1. Pengenalan',
    paragraphs: [
      'Situs web AAA GANGS (3agang.pro) sangat menghargai kekayaan intelektual orang lain dan kami berkomitmen untuk mematuhi Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta (UU Hak Cipta) yang berlaku di Republik Indonesia, serta standar internasional Digital Millennium Copyright Act (DMCA).'
    ],
  },
  {
    id: 2,
    title: '2. Disclaimer Konten Penggemar Supercell',
    paragraphs: [
      'Situs web ini adalah platform komunitas tidak resmi yang dibuat oleh penggemar untuk klan AAA GANGS di game Clash of Clans.',
      'Materi ini tidak resmi dan tidak disponsori oleh Supercell. Konten ini tidak berafiliasi dengan, didukung, disponsori, atau secara khusus disetujui oleh Supercell dan Supercell tidak bertanggung jawab atas konten ini. Untuk informasi lebih lanjut, silakan lihat Kebijakan Konten Penggemar Supercell.',
      'Semua aset grafis, gambar, dan ikon terkait game Clash of Clans yang digunakan di situs ini adalah milik Supercell.'
    ],
  },
  {
    id: 3,
    title: '3. Konten yang Dilindungi',
    paragraphs: [
      'Kami melindungi semua konten asli yang dibuat oleh tim AAA GANGS, termasuk tetapi tidak terbatas pada:'
    ],
    bullets: [
      'Analisis strategi dan panduan permainan',
      'Konten editorial dan artikel',
      'Desain dan tata letak website',
      'Kode dan skrip asli yang dikembangkan oleh tim kami'
    ],
  },
  {
    id: 4,
    title: '4. Sumber dan Izin Base Layout',
    paragraphs: [
      'Semua base layout Clash of Clans yang disediakan di situs web ini telah dikumpulkan dan disajikan dengan memperhatikan hak cipta dan izin penggunaan yang sesuai. Kami bekerja sama dengan komunitas dan kreator untuk memastikan bahwa konten yang dibagikan mematuhi standar etika dan hukum yang berlaku.',
      'Base layout yang kami bagikan digunakan semata-mata untuk tujuan edukasi, berbagi strategi, dan pengembangan komunitas Clash of Clans. Kami menghargai kerja keras para kreator dan selalu terbuka untuk komunikasi jika ada pertanyaan atau kebutuhan klarifikasi mengenai penggunaan konten.'
    ],
  },
  {
    id: 5,
    title: '5. Pemberitahuan Pelanggaran Hak Cipta',
    paragraphs: [
      'Jika Anda adalah pemilik hak cipta, atau agen yang berwenang, dan Anda yakin bahwa ada konten di situs web 3agang.pro yang melanggar hak cipta Anda diatur secara khusus di dalam Pasal 55 dan 56 UU Nomor 28 Tahun 2014, Anda dapat mengajukan permintaan penghapusan dengan mengirimkan email kepada kami yang memuat informasi berikut:'
    ],
    bullets: [
      'Tanda tangan fisik atau elektronik dari pemilik hak cipta atau perwakilan yang berwenang',
      'Identifikasi karya berhak cipta yang diklaim telah dilanggar',
      'Identifikasi materi yang diklaim sebagai pelanggaran beserta lokasi spesifiknya (URL) di situs web kami agar kami dapat menemukannya',
      'Informasi kontak Anda, termasuk alamat, nomor telepon, dan alamat email aktif',
      'Pernyataan dengan itikad baik bahwa penggunaan materi tersebut tidak diizinkan oleh pemilik hak cipta, agennya, atau hukum',
      'Pernyataan bahwa informasi dalam pemberitahuan ini akurat, dan di bawah ancaman sumpah palsu, bahwa Anda berwenang untuk bertindak atas nama pemilik hak cipta'
    ],
  },
  {
    id: 6,
    title: '6. Sigma AI Chatbot',
    paragraphs: [
      'Layanan Sigma AI Chatbot kami menyediakan jawaban dan saran berdasarkan pertanyaan seputar Clash of Clans. Konten yang dihasilkan oleh Sigma AI berdasarkan input pengguna menjadi tanggung jawab pengguna. Kami tidak bertanggung jawab atas penggunaan konten AI yang melanggar hak cipta atau aturan komunitas.',
      'Pengguna diharapkan untuk menggunakan Sigma AI dengan bijak dan tidak menyebarkan informasi yang melanggar hak cipta, merugikan pihak lain, atau bertentangan dengan kebijakan komunitas Clash of Clans. Layanan Sigma AI Chatbot kami menyediakan jawaban dan saran berdasarkan pertanyaan seputar Clash of Clans. Versi gratis tersedia untuk semua pengguna, sementara layanan premium mungkin ditawarkan di masa depan sebagai bagian dari layanan coaching yang diperbolehkan oleh Kebijakan Konten Penggemar Supercell.'
    ],
  },
  {
    id: 7,
    title: '7. Repeat Infringer Policy',
    paragraphs: [
      'Kami menerapkan kebijakan untuk membatasi atau menghapus konten yang melanggar hak cipta dari situs web kami. Dalam keadaan tertentu, kami dapat memblokir alamat IP atau membatasi akses ke situs web kami untuk mencegah pelanggaran berulang, sesuai dengan kebijakan kami dan peraturan yang berlaku.'
    ],
  },
  {
    id: 8,
    title: '8. Modifications',
    paragraphs: [
      'Kami berhak untuk memodifikasi Kebijakan Hak Cipta ini kapan saja. Perubahan akan efektif segera setelah diposting di halaman ini. Penggunaan terus menerus dari situs web kami setelah perubahan dianggap sebagai penerimaan terhadap kebijakan yang diperbarui.'
    ],
  },
  {
    id: 9,
    title: '9. Kontak Hak Cipta',
    paragraphs: [
      'Semua laporan pelanggaran atau pertanyaan terkait hak cipta harap dikirimkan melalui email ke:',
      'Email: elder@3agang.pro',
      'Subjek Email: Laporan Pelanggaran Hak Cipta / DMCA Notice',
      'Kami akan merespons dan mengambil tindakan yang sesuai, termasuk menghapus atau menonaktifkan akses ke materi yang dipermasalahkan dalam waktu 3-5 hari kerja.'
    ],
  },
];

export default function DMCAAccordion() {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const toggleExpand = (id: number) => {
    setExpandedId((currentId) => (currentId === id ? null : id));
  };

  return (
    <section className="max-w-4xl mx-auto px-6 pb-24">
      <div className="space-y-4">
        {dmcaSections.map((item) => (
          <div key={item.id} className="group">
            <button
              onClick={() => toggleExpand(item.id)}
              className="w-full flex items-center justify-between p-5 bg-zinc-900/40 border border-zinc-800/50 rounded-xl hover:border-amber-500/30 transition-all duration-300 group-hover:bg-zinc-900/60"
            >
              <span className="text-lg font-semibold text-white text-left group-hover:text-amber-400 transition-colors">
                {item.title}
              </span>
              <ChevronDown
                size={24}
                className={`text-amber-500 flex-shrink-0 transition-transform duration-300 ${
                  expandedId === item.id ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expandedId === item.id && (
              <div className="mt-2 p-5 bg-zinc-900/20 border border-zinc-800/30 border-t-0 rounded-b-xl animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-4 text-zinc-300 leading-relaxed font-poppins">
                  {item.paragraphs?.map((paragraph, index) => (
                    <p key={`${item.id}-${index}`}>{paragraph}</p>
                  ))}
                  {item.bullets && (
                    <ul className="list-disc list-inside space-y-2 text-zinc-300">
                      {item.bullets.map((bullet, index) => (
                        <li key={`${item.id}-bullet-${index}`}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
