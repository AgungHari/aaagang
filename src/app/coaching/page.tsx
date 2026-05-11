'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CoachingPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setSubmitted(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!imageFile) {
      return;
    }
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar clanName="AAA GANG" badge="/badge_clan.webp" />

      <section className="relative pt-28 pb-16 px-6 md:px-12 lg:px-20 xl:px-32">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl border border-zinc-800/70 bg-zinc-950/80 p-10 shadow-xl shadow-amber-500/5 backdrop-blur-lg">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.35em] text-amber-500 font-black mb-4">Coaching Center</p>
                <h1 className="text-4xl md:text-5xl font-black text-white">Analisa Base & Strategi Serangan</h1>
                <p className="mt-4 max-w-2xl text-zinc-400 leading-8">
                  Halaman ini dirancang sebagai tempat pertama untuk menyimpan ide strategi serangan dan analisa base. Model PaliGemma anjay kamu sudah siap nanti, sementara ini kita pakai placeholder untuk menyiapkan UI dan alur kerja.
                </p>
              </div>
              <div className="rounded-3xl border border-zinc-800/70 bg-black/60 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-zinc-500 font-bold mb-3">Status Integrasi</p>
                <div className="space-y-3 text-sm text-zinc-300">
                  <p>• PaliGemma anjay model di HuggingFace siap digunakan.</p>
                  <p>• FastAPI endpoint sedang dipersiapkan.</p>
                  <p>• Input akan diproses untuk analisa base dan rekomendasi serangan.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-zinc-800/70 bg-zinc-950/80 p-8 shadow-xl shadow-amber-500/5 backdrop-blur-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Kirim Detail Base</h2>
              <p className="text-sm text-zinc-400 mb-6">
                Unggah screenshot base yang ingin dianalisa. Nanti model PaliGemma anjay akan menandai titik penting untuk strategi serangan secara otomatis.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block text-sm text-zinc-300">
                  Upload Screenshot Base
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-3 w-full rounded-3xl border border-zinc-700 bg-[#070707] px-4 py-4 text-sm text-white outline-none transition file:text-sm file:font-semibold file:bg-amber-500 file:text-black file:rounded-full file:px-4 file:py-2"
                  />
                </label>

                {imagePreviewUrl ? (
                  <div className="rounded-3xl border border-zinc-800 bg-black/50 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-3">Preview Screenshot</p>
                    <img src={imagePreviewUrl} alt="Screenshot preview" className="w-full rounded-3xl object-cover" />
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-3xl bg-amber-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-300"
                  disabled={!imageFile}
                >
                  Kirim Analisa
                </button>
              </form>

              {submitted ? (
                <div className="mt-6 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm text-amber-200">
                  Input berhasil disimpan secara lokal. Nanti akan dihubungkan ke model PaliGemma anjay dan FastAPI untuk analisa otomatis.
                </div>
              ) : null}
            </div>

            <div className="space-y-8">
              <div className="rounded-3xl border border-zinc-800/70 bg-zinc-950/80 p-8 shadow-xl shadow-amber-500/5 backdrop-blur-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Analisa Base</h2>
                <p className="text-sm leading-7 text-zinc-400">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque aliquam metus vel nibh efficitur, eget fringilla est venenatis. Integer posuere augue at sapien aliquam, a tincidunt velit gravida. Sed sit amet interdum dolor. Aliquam erat volutpat.
                </p>
                <ul className="mt-5 space-y-3 text-sm text-zinc-300">
                  <li>• Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                  <li>• Cras sed efficitur metus, sed semper urna.</li>
                  <li>• Curabitur et mauris nec nulla aliquet aliquet.</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-zinc-800/70 bg-zinc-950/80 p-8 shadow-xl shadow-amber-500/5 backdrop-blur-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Strategi Serangan</h2>
                <p className="text-sm leading-7 text-zinc-400">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vel lorem sit amet urna sagittis pretium. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.
                </p>
                <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm text-zinc-300">
                  <li>Gunakan kombinasi hero tepat untuk membuka sisi pertahanan utama.</li>
                  <li>Tambahkan funnel dengan pasukan terbang untuk mengisolasi pertahanan udara.</li>
                  <li>Lakukan penyesuaian target sesuai posisi inferno dan eagle artillery.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer clan={{ clanLevel: 16, members: 50, warWins: 999, name: 'AAA GANG', tag: '#Q9YY02J9' }} />
    </main>
  );
}
