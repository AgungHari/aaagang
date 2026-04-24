import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutCard from "@/components/LayoutCard";
import { getClanData } from "@/lib/coc";
import { createClient } from "@libsql/client";
import Link from "next/link";
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

          {/* Layouts Grid */}
          {layouts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {layouts.map((layout: any) => (
                <ScrollReveal key={layout.id} delay={layouts.indexOf(layout) * 0.02}>
                  <Link 
                      key={layout.id}
                      href={`/layout/${Number(layout.id)}`}
                      className="hover:opacity-90 transition-opacity"
                    >
                    <LayoutCard
                      id={Number(layout.id)}
                      th_level={Number(layout.th_level)}
                      base_tag={String(layout.base_tag)}
                      copy_link={String(layout.copy_link)}
                      image_url={String(layout.image_url)}
                      description={String(layout.description || "")}
                      source_type={String(layout.source_type || "")}
                      source_url={String(layout.source_url || "")}
                      upload_date={String(layout.upload_date)}
                      view_count={Number(layout.view_count || 0)}
                      like_count={Number(layout.like_count || 0)}
                      is_active={Number(layout.is_active || 1)}
                    />
                  </Link>
                </ScrollReveal>
              ))}
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
