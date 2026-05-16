'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  id: number;
  title: string;
  description: string;
}

const faqItems: FAQItem[] = [
  {
    id: 1,
    title: "Apakah fitur yang disediakan di situs AAA GANG aman untuk digunakan?",
    description: "100% aman. Kami menggunakan data resmi secara langsung dari Clash of Clans API dan tidak pernah meminta informasi kredensial atau akses *login* ke akun Anda. Seluruh fitur kami dirancang murni untuk analitik dan peningkatan pengalaman bermain tanpa melanggar *Terms of Service* (ToS) dari Supercell. Kami juga secara rutin melakukan audit sistem untuk memastikan keamanan data dan kenyamanan komunitas."
  },
  {
    id: 2,
    title: "Base layout apa saja yang tersedia di sini?",
    description: "Kami menyediakan kurasi *base layout* yang komprehensif mulai dari Town Hall 9 hingga Town Hall 18. Setiap *layout* dilengkapi dengan metrik komunitas (likes, views, komentar), rekomendasi strategi, dan histori performa di Clan War. Anda dapat memfilter pencarian berdasarkan fungsi base (Farming, War, Trophy, Hybrid) atau kreatornya. Database kami diperbarui setiap hari agar Anda selalu mendapatkan meta pertahanan terbaik."
  },
  {
    id: 3,
    title: "Apakah base layout bisa langsung diimpor ke dalam game?",
    description: "Tentu bisa! Anda hanya perlu menekan tombol 'Import' pada *layout* yang diinginkan, dan sistem akan mengarahkan Anda langsung ke dalam game Clash of Clans untuk menyalin susunan *base* tersebut secara otomatis. Pastikan aplikasi Clash of Clans sudah terinstal dan Anda sudah *login* di perangkat yang sama."
  },
  {
    id: 4,
    title: "Dari mana sumber base layout yang ada di AAA GANG?",
    description: "Sumber *layout* kami berasal dari kontribusi eksklusif anggota AAA GANG, analisis hasil Clan War, serta kurasi dari meta top global pemain Clash of Clans. Setiap *base* melewati proses seleksi untuk memastikan kualitas pertahanannya. Kami selalu memantau *update* keseimbangan (balance changes) terbaru dari Supercell agar *layout* yang tersedia tetap relevan."
  },
  {
    id: 5,
    title: "Apakah fitur AI 'Ask Sigma' mencatat log percakapan saya?",
    description: "Tidak. Fitur AI Chatbot 'Sigma' beroperasi dengan kebijakan privasi yang ketat. Sigma dirancang untuk memberikan analisis dan saran strategi secara *real-time* tanpa menyimpan rekam jejak percakapan (*zero-logging policy*). Semua interaksi Anda dengan Sigma bersifat sesaat (ephemeral) demi menjaga privasi dan kenyamanan pengguna."
  },
  {
    id: 6,
    title: "Bagaimana cara kerja fitur Search Player, dan data apa saja yang diambil?",
    description: "Fitur ini bekerja dengan melakukan *query* langsung ke Clash of Clans API menggunakan Player Tag atau Nama. Data yang ditampilkan murni berupa statistik publik seperti level Town Hall, jumlah Trophy, keanggotaan klan, dan metrik performa lainnya. Kami menjamin akurasi data sesuai dengan kondisi *real-time* di server game."
  },
  {
    id: 7,
    title: "Apakah fitur pencarian bisa melihat isi chat di dalam game?",
    description: "Sama sekali tidak. Fitur pencarian kami hanya membaca data statistik publik yang diizinkan oleh Clash of Clans API. Akses ke log percakapan internal (Clan Chat) sangat dirahasiakan oleh pihak Supercell dan tidak akan pernah bisa diakses oleh platform pihak ketiga mana pun."
  },
  {
    id: 8,
    title: "Kenapa base saya tetap rata (kalah) meskipun sudah menggunakan layout dari AAA GANG?",
    description: "Sebuah *base layout* yang kuat meminimalkan risiko, namun bukan jaminan mutlak untuk menang. Hasil akhir sangat dipengaruhi oleh level *defense* (bangunan/hero) Anda saat ini, serta *skill* dan strategi dari *attacker*. Jadikan kekalahan sebagai bahan evaluasi—silakan analisis *replay* serangan musuh dan cobalah berbagai variasi *layout* lain di platform kami yang paling pas dengan kondisi Town Hall Anda."
  },
  {
    id: 9,
    title: "Bagaimana cara agar saya bisa mengunggah (upload) base layout buatan saya sendiri?",
    description: "Saat ini fitur untuk publikasi *base* mandiri masih dalam tahap pengembangan (Coming Soon). Ke depannya, kami akan membuka akses bagi seluruh anggota komunitas untuk mengunggah mahakarya *layout* mereka. Untuk sementara waktu, Anda bisa membagikan *link base* Anda melalui grup komunitas atau media sosial AAA GANG."
  },
  {
    id: 10,
    title: "Apakah AAA GANG memiliki keistimewaan/kasta khusus dari Supercell untuk Clan War?",
    description: "Tidak ada. AAA GANG bermain di ekosistem yang sama dengan klan lainnya di seluruh dunia tanpa perlakuan khusus dari algoritma *matchmaking* Supercell. Reputasi dan pencapaian kami di Clan War maupun CWL murni berasal dari dedikasi, kedisiplinan, dan strategi kolektif seluruh anggota klan."
  },
  {
    id: 11,
    title: "Apakah AAA GANG terafiliasi resmi dengan Clash of Clans?",
    description: "AAA GANG adalah komunitas independen yang dibentuk oleh dan untuk para pemain. Kami tidak berstatus sebagai klan ofisial atau mitra resmi (partner) dari Supercell. Kami berdedikasi untuk menciptakan ekosistem pendukung (*tools* dan komunitas) yang mandiri untuk meningkatkan keseruan bermain."
  },
  {
    id: 12,
    title: "Apakah AAA GANG merupakan aliansi atau jaringan dari banyak klan?",
    description: "Saat ini AAA GANG beroperasi sebagai entitas klan tunggal (*single clan*) dan tidak terikat dalam serikat, aliansi, atau sistem klan keluarga besar mana pun. Keputusan ekspansi atau pembentukan klan cabang di masa depan hanya akan dilakukan jika disetujui melalui forum musyawarah pengurus."
  },
  {
    id: 13,
    title: "Bagaimana struktur birokrasi dan kepengurusan di AAA GANG?",
    description: "Kami menerapkan struktur organisasi hierarkis (Member, Elder, Co-Leader, Leader). Leader memegang peran sebagai eksekutif tertinggi yang menentukan visi dan arah strategis klan. Namun, dalam pelaksanaannya, operasional harian berjalan secara dinamis melalui diskusi antar tingkat kepengurusan."
  },
  {
    id: 14,
    title: "Bagaimana aturan klaim target saat Clan War berlangsung?",
    description: "Setiap member memiliki hak untuk melakukan 'Klaim' (Call) pada *base* musuh yang ingin diserang. Klaim ini berlaku selama 30 menit. Jika tidak ada serangan (*attack*) dalam jeda waktu tersebut, hak klaim hangus dan *base* musuh menjadi target bebas bagi member lain. Aturan ini bersifat melatih kedisiplinan koordinasi; pelanggaran biasanya hanya dikenakan teguran ringan."
  },
  {
    id: 15,
    title: "Bagaimana pembagian peran antara Leader, Co-Leader, dan Elder?",
    description: "Elder bertindak sebagai mentor dan role-model bagi member baru. Leader adalah otoritas puncak, namun untuk menjaga keseimbangan operasional (check and balance), kewenangan manajemen keanggotaan (Invite/Kick) didelegasikan sepenuhnya kepada Co-Leader. Leader diwajibkan untuk berkoordinasi dengan jajaran Co-Leader sebelum mengeluarkan anggota, memastikan setiap keputusan diambil secara adil dan objektif demi menjaga soliditas klan."
  }
];

export default function FAQList() {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 pb-24">
      <div className="space-y-4">
        {faqItems.map((item) => (
          <div key={item.id} className="group">
            <button
              onClick={() => toggleExpand(item.id)}
              className="w-full flex items-center justify-between p-5 bg-zinc-900/40 border border-zinc-800/50 rounded-xl hover:border-amber-500/30 transition-all duration-300 group-hover:bg-zinc-900/60"
            >
              <span className="text-md font-semibold text-white text-left group-hover:text-amber-400 transition-colors">
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
              <div className="mt-2 p-5 bg-zinc-900/20 border border-zinc-800/30 border-t-0 rounded-b-xl animate-in fade-in slide-in-from-top-2 duration-300 text-justify">
                <p className="text-zinc-300 leading-relaxed font-poppins">
                  {item.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}