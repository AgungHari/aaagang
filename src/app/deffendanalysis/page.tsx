import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getClanData } from "@/lib/coc";

export default async function DefendAnalysisPage() {
  const clan = await getClanData();

  if (!clan) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black text-amber-500 mb-6">Defend Analysis</h1>
          <p className="text-zinc-400">Data clan sedang tidak tersedia. Coba lagi beberapa saat nanti.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      <section className="pt-28 pb-16 max-w-6xl mx-auto px-6">
        <div className="rounded-3xl border border-zinc-800/70 bg-zinc-900/70 p-8 shadow-xl shadow-black/20 backdrop-blur-lg">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.4em] text-amber-500">Defend Analysis</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-black text-white">Upload Base Image untuk Analisis Pertahanan</h1>
            <p className="mt-4 max-w-3xl text-zinc-400 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Phasellus vehicula sapien ut sem convallis, sit amet mollis velit consequat. Fusce nec tortor vitae purus scelerisque convallis.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-zinc-800 bg-black/60 p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Image Upload</h2>
                <p className="text-sm text-zinc-400 mb-6">
                  Pilih gambar base atau layout yang ingin dianalisis. Integrasi dengan model YOLO dari Hugging Face akan ditambahkan nanti.
                </p>

                <form className="space-y-6">
                  <label className="block text-sm font-semibold text-zinc-200">Upload Base Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 shadow-inner focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />

                  <label className="block text-sm font-semibold text-zinc-200">Deskripsi Singkat</label>
                  <textarea
                    rows={5}
                    placeholder="Contoh: basis TH14 war defense, radar 3-point air defense..."
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 shadow-inner focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />

                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-400"
                  >
                    Simpan Analisis (Coming Soon)
                  </button>
                </form>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Catatan</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet ipsum vel neque pellentesque placerat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed mt-4">
                  Aliquam erat volutpat. Nam ultricies tellus sed nibh pretium, et lacinia purus pulvinar. Integer quis sapien vitae elit pretium consequat eget sit amet eros.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Tentang Fitur Ini</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sodales, lorem in fringilla mollis, enim eros pellentesque eros, at fermentum nisl arcu et turpis.
                </p>
                <div className="space-y-4 text-sm text-zinc-400">
                  <div>
                    <span className="font-semibold text-white">• Input Gambar</span>
                    <p className="mt-2">Upload image saja dulu. Nanti model YOLO akan memproses objek dan pertahanan.</p>
                  </div>
                  <div>
                    <span className="font-semibold text-white">• Integrasi HF</span>
                    <p className="mt-2">Integrasi dengan Hugging Face akan ditambahkan setelah model siap.</p>
                  </div>
                  <div>
                    <span className="font-semibold text-white">• Rencana Analisis</span>
                    <p className="mt-2">Analisis akan menyorot struktur defense, trap placement, dan weak point.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-4">
                <h4 className="text-sm uppercase tracking-[0.3em] text-amber-500 mb-3">Lorem Ipsum</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sagittis orci quis magna lobortis, vitae convallis quam venenatis. Donec molestie sem ut orci egestas, vitae fringilla elit tincidunt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer clan={clan} />
    </main>
  );
}
