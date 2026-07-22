'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface TermsSection {
  id: number;
  title: string;
  content: string[];
}

const termsSections: TermsSection[] = [
  {
    id: 1,
    title: '1. Pengenalan',
    content: [
      'Selamat datang di 3agang.pro. Syarat dan Ketentuan Layanan ini ("Syarat") mengatur penggunaan Anda terhadap Website dan layanan yang disediakan oleh AAA GANGS Clash of Clans Community. Dengan mengakses atau menggunakan Website, Anda setuju untuk mematuhi dan terikat oleh Syarat ini. Jika Anda tidak setuju dengan Syarat ini, Anda tidak boleh menggunakan Website atau layanan apa pun yang disediakan.'
    ],
  },
  {
    id: 2,
    title: '2. Ketentuan Umum',
    content: [
      'Anda harus berusia setidaknya 13 tahun untuk menggunakan Website dan layanan kami. Dengan menggunakan Website, Anda mengonfirmasi bahwa Anda memenuhi persyaratan usia ini.',
      'Dengan mengakses Website, Anda setuju untuk menggunakannya hanya untuk tujuan yang sah dan sesuai dengan semua hukum dan peraturan lokal, nasional, dan internasional yang berlaku.'
    ],
  },
  {
    id: 3,
    title: '3. Layanan yang Disediakan',
    content: [
      'Kami menyediakan koleksi base layout Clash of Clans secara gratis, termasuk link copy untuk berbagai Town Hall level. Kami juga menyediakan fitur Sigma AI, chatbot cerdas yang dapat menjawab pertanyaan seputar Clash of Clans. Beberapa layanan premium Sigma AI mungkin tersedia di masa depan sebagai bagian dari layanan coaching.',
      'Semua layanan kami disediakan secara gratis, tanpa biaya tersembunyi. Kami tidak menjual base layout atau layanan premium lainnya. Hasil penggunaan base layout dapat bervariasi tergantung pada strategi dan keterampilan pemain.'
    ],
  },
  {
    id: 4,
    title: '4. Hak dan Kewajiban Pengguna',
    content: [
      'Anda bertanggung jawab untuk menggunakan base layout dan informasi dari Website dengan bijak. Kami tidak bertanggung jawab atas hasil penggunaan base layout dalam permainan Anda.',
      'Sigma AI disediakan sebagai alat bantu untuk pertanyaan seputar Clash of Clans. Kami tidak menjamin keakuratan 100% dari jawaban yang diberikan, dan Anda tetap bertanggung jawab penuh atas penggunaan informasi dari Sigma AI. Pengguna bertanggung jawab untuk memverifikasi dan menggunakan informasi dari Sigma AI dengan bijak.'
    ],
  },
  {
    id: 5,
    title: '5. Konten dan Kekayaan Intelektual',
    content: [
      'Semua konten yang disediakan di Website ini, termasuk desain, teks, grafis, logo, dan materi lainnya, adalah properti eksklusif AAA GANGS atau pemberi lisensinya. Penggunaan tidak sah dari materi apa pun dari Website ini dilarang.',
      'Base layout yang kami bagikan adalah kreasi komunitas Clash of Clans dan kami hanya mendistribusikannya untuk kemudahan akses anggota komunitas. Anda diperbolehkan menggunakan, mendistribusikan ulang, atau bahkan menjual base layout tersebut karena kami tidak memiliki hak cipta atas base layout tersebut.',
      'Namun, hasil analisis, strategi, dan konten tambahan yang kami buat berdasarkan base layout tersebut (seperti tips penggunaan, strategi serangan, atau analisis kelemahan) adalah properti intelektual AAA GANGS dan tidak boleh didistribusikan ulang atau digunakan untuk tujuan komersial tanpa izin tertulis dari kami.'
    ],
  },
  {
    id: 6,
    title: '6. Pembatasan Tanggung Jawab',
    content: [
      'Website dan layanan kami disediakan "apa adanya" tanpa jaminan apa pun, baik tersurat maupun tersirat. Kami tidak menjamin operasi Website atau layanan yang tidak terputus atau bebas dari kesalahan.',
      'Dalam keadaan apa pun, AAA GANGS, leader, co leader, elder, member atau afiliasinya tidak bertanggung jawab atas kerusakan langsung, tidak langsung, insidental, khusus, atau konsekuensial yang timbul dari penggunaan Website atau layanan oleh Anda.'
    ],
  },
  {
    id: 7,
    title: '7. Perubahan Layanan',
    content: [
      'Kami berhak untuk memperbarui atau memodifikasi Syarat ini kapan saja. Perubahan apa pun akan diposting di halaman ini, dan tanggal pembaruan akan ditunjukkan.',
      'Dengan terus menggunakan Website setelah perubahan Syarat, Anda dianggap telah menyetujui Syarat yang diperbarui.'
    ],
  },
  {
    id: 8,
    title: '8. Hukum yang Berlaku',
    content: [
      'Syarat ini diatur oleh hukum Republik Indonesia. Segala sengketa yang timbul dari Syarat ini akan tunduk pada peraturan perundang-undangan di Indonesia.'
    ],
  },
  {
    id: 9,
    title: '9. Kontak',
    content: [
      'Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami melalui halaman Contact.'
    ],
  },
];

export default function TermsOfServiceAccordion() {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const toggleExpand = (id: number) => {
    setExpandedId((currentId) => (currentId === id ? null : id));
  };

  return (
    <section className="max-w-4xl mx-auto px-6 pb-24">
      <div className="space-y-4">
        {termsSections.map((item) => (
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
                  {item.content.map((paragraph, index) => (
                    <p key={`${item.id}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
