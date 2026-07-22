'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface PrivacySection {
  id: number;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

const privacySections: PrivacySection[] = [
  {
    id: 1,
    title: 'Pendahuluan',
    paragraphs: [
      'AAA GANG ("kami", "kita", atau "klan") berkomitmen untuk melindungi privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan melindungi informasi Anda saat Anda mengunjungi situs web kami di 3agang.pro (selanjutnya disebut "Situs").',
      'Dengan mengakses atau menggunakan Situs kami, Anda mengakui bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh semua ketentuan yang diuraikan dalam Kebijakan Privasi ini.'
    ],
  },
  {
    id: 2,
    title: 'Informasi yang Kami Kumpulkan',
    paragraphs: [
      'Kami dapat mengumpulkan informasi tentang Anda dengan berbagai cara, termasuk informasi pribadi seperti alamat IP dan informasi browser, serta informasi yang Anda berikan saat menggunakan layanan Ask SIGMA.',
      'Kami juga dapat mengumpulkan data penggunaan seperti halaman yang Anda kunjungi, waktu yang dihabiskan di halaman tersebut, layout yang Anda lihat atau unduh, serta sumber yang mengarahkan Anda ke Situs kami.'
    ],
  },
  {
    id: 3,
    title: 'Cara Kami Menggunakan Informasi Anda',
    paragraphs: [
      'Kami dapat menggunakan informasi yang kami kumpulkan untuk menyediakan, memelihara, dan meningkatkan Situs kami, memantau pola penggunaan, mempersonalisasi pengalaman, serta melindungi dari penipuan dan aktivitas ilegal.'
    ],
    bullets: [
      'Menyediakan, memelihara, dan meningkatkan Situs kami',
      'Memantau dan menganalisis pola penggunaan dan tren',
      'Mempersonalisasi pengalaman Anda',
      'Melindungi dari, mengidentifikasi, dan mencegah penipuan dan aktivitas ilegal lainnya'
    ],
  },
  {
    id: 4,
    title: 'Cookie dan Teknologi Pelacakan',
    paragraphs: [
      'Kami menggunakan cookie dan teknologi pelacakan serupa untuk melacak aktivitas di Situs kami dan menyimpan informasi tertentu. Cookie adalah file dengan jumlah data kecil yang dapat mencakup pengidentifikasi unik anonim.',
      'Anda dapat menginstruksikan browser Anda untuk menolak semua cookie atau untuk menunjukkan ketika cookie sedang dikirim. Namun, jika tidak menerima cookie, Anda mungkin tidak dapat menggunakan beberapa bagian dari Situs kami.'
    ],
  },
  {
    id: 5,
    title: 'Layanan SIGMA',
    paragraphs: [
      'Layanan Ask SIGMA kami menggunakan penyimpanan lokal (localStorage) di browser Anda untuk menyimpan riwayat percakapan. Ini berarti riwayat percakapan hanya disimpan di perangkat Anda dan tidak dikirim ke server kami.'
    ],
    bullets: [
      'Riwayat percakapan hanya disimpan di perangkat Anda dan tidak dikirim ke server kami',
      'Kami tidak memiliki akses ke riwayat percakapan Anda',
      'Data akan hilang jika Anda membersihkan cache browser atau menggunakan perangkat lain',
      'Kami tidak memerlukan login atau akun untuk menggunakan layanan ini'
    ],
  },
  {
    id: 6,
    title: 'Layanan Pihak Ketiga',
    paragraphs: [
      'Kami dapat menggunakan layanan pihak ketiga seperti Google Analytics untuk membantu kami memahami bagaimana pengguna kami menggunakan Situs. Penyedia layanan pihak ketiga ini dapat menggunakan cookie, web beacon, dan teknologi lainnya untuk mengumpulkan informasi tentang penggunaan Situs kami.',
      'Situs kami juga dapat berisi tautan ke situs web lain yang tidak dioperasikan oleh kami. Jika Anda mengklik tautan pihak ketiga, Anda akan diarahkan ke situs pihak ketiga tersebut.'
    ],
  },
  {
    id: 7,
    title: 'Keamanan Data',
    paragraphs: [
      'Kami menerapkan langkah-langkah teknis dan organisasi yang sesuai untuk melindungi keamanan informasi pribadi Anda. Namun, harap diketahui bahwa tidak ada metode transmisi melalui Internet atau metode penyimpanan elektronik yang 100% aman.'
    ],
  },
  {
    id: 8,
    title: 'Privasi Anak-Anak',
    paragraphs: [
      'Situs kami tidak ditujukan untuk anak-anak di bawah usia 13 tahun. Kami tidak dengan sengaja mengumpulkan informasi pribadi dari anak-anak di bawah usia 13 tahun. Jika Anda adalah orang tua atau wali dan Anda mengetahui bahwa anak Anda telah memberikan informasi pribadi kepada kami, silakan hubungi kami.'
    ],
  },
  {
    id: 9,
    title: 'Perubahan pada Kebijakan Privasi',
    paragraphs: [
      'Kami dapat memperbarui Kebijakan Privasi kami dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan apa pun dengan memposting Kebijakan Privasi baru di halaman ini dan memperbarui tanggal Terakhir Diperbarui di bagian bawah.',
      'Anda disarankan untuk meninjau Kebijakan Privasi ini secara berkala untuk perubahan apa pun. Perubahan pada Kebijakan Privasi ini berlaku ketika diposting di halaman ini.'
    ],
  },
  {
    id: 10,
    title: 'Hubungi Kami',
    paragraphs: [
      'Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui formulir kontak di situs web kami atau melalui layanan Ask SIGMA.'
    ],
  },
];

export default function PrivacyPolicyAccordion() {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const toggleExpand = (id: number) => {
    setExpandedId((currentId) => (currentId === id ? null : id));
  };

  return (
    <section className="max-w-4xl mx-auto px-6 pb-24">
      <div className="space-y-4">
        {privacySections.map((item) => (
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
                  {item.paragraphs.map((paragraph, index) => (
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
