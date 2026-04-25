import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutsFilter from "@/components/LayoutsFilter";
import { getClanData } from "@/lib/coc";
import { createClient } from "@libsql/client";
import ScrollReveal from "@/components/ScrollReveal";
import { Users } from "lucide-react";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export default async function LayoutPage() {
  const [clan, layoutsResult] = await Promise.all([
    getClanData(),
    client.execute("SELECT * FROM layouts ORDER BY upload_date DESC"),
  ]);

  if (!clan) {
    return (
      <div className="text-white text-center py-20 font-black tracking-tighter text-5xl">
        DATABASE ERROR... <br/>RECHECK API TOKEN!
      </div>
    );
  }

  const layouts = layoutsResult.rows;

  // Serialize layouts ke plain objects untuk Client Component
  const serializedLayouts = JSON.parse(JSON.stringify(layouts));

  return (
    <main className="min-h-screen text-zinc-100 selection:bg-amber-500 selection:text-black overflow-x-hidden font-poppins">
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      {/* Content Section */}
      <section className="pt-32 pb-20 px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 animate-slide-up">
              <Users size={12} /> Koleksi Base
          </div>
          <h1 className="text-4xl md:text-5xl mb-8 animate-slide-up" style={{ fontFamily: "'Docallisme', sans-serif" }}>
            BASE <span className="text-amber-500">LAYOUTS</span>
          </h1>

          <p className="text-gray-300 leading-relaxed mb-12 max-w-4xl animate-slide-up">
            Koleksi base layouts terbaik dari AAA GANG, Temukan inspirasi untuk pertahanan dan seranganmu di sini. Setiap layout dilengkapi dengan detail lengkap.
          </p>

          {/* Layouts Filter & Grid */}
          {serializedLayouts.length > 0 ? (
            <div className="animate-slide-up">
              <LayoutsFilter layouts={serializedLayouts} />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Belum ada base layouts. Admin silakan tambahkan layout baru.</p>
            </div>
          )}
        </div>
      </section>

      <Footer clan={clan} />
    </main>
  );
}
