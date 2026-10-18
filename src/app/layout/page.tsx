export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutsFilter from "@/components/LayoutsFilter";
import LayoutPageChat from "@/components/LayoutPageChat";
import { getClanData } from "@/lib/coc";
import { createClient } from "@libsql/client";
import { ArrowDown, Sparkle, Sword } from "@phosphor-icons/react/ssr";
import Image from "next/image";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export default async function LayoutPage() {
  const [clan, layoutsResult] = await Promise.all([
    getClanData(),
    client.execute(`
      SELECT layouts.*, COALESCE(comment_counts.comment_count, 0) AS comment_count
      FROM layouts
      LEFT JOIN (
        SELECT layout_id, COUNT(*) AS comment_count
        FROM layout_comments
        WHERE is_visible = TRUE
        GROUP BY layout_id
      ) AS comment_counts ON comment_counts.layout_id = layouts.id
      ORDER BY layouts.upload_date DESC
    `),
  ]);

  if (!clan) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-4 py-24 text-center text-zinc-100">
        <h1 className="mb-6 text-5xl text-amber-500 md:text-6xl" style={{ fontFamily: "'Docallisme', sans-serif" }}>
          SUPERCELL MAINTENANCE
        </h1>
        <p className="mb-10 max-w-lg text-sm leading-7 text-zinc-400">
          We couldn&apos;t fetch the clan data right now. Check in-game or visit our status page.
        </p>
        <a
          href="https://status.3agang.pro"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-zinc-700 bg-zinc-900/70 px-6 py-3 text-sm font-bold text-zinc-200 transition-colors hover:border-amber-500/40 hover:text-amber-300"
        >
          Check System Status
        </a>
      </main>
    );
  }

  const serializedLayouts = JSON.parse(JSON.stringify(layoutsResult.rows));
  const activeLayouts = serializedLayouts.filter((layout: { is_active?: number }) => layout.is_active === 1);
  const townHallLevels = Array.from(
    new Set<number>(activeLayouts.map((layout: { th_level: number }) => Number(layout.th_level))),
  ).sort((a, b) => b - a);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://3agang.pro/layout/#collection",
    url: "https://3agang.pro/layout",
    name: "Koleksi Base Layout Clash of Clans - AAA GANGS",
    description: "Kumpulan base layout COC terkuat. Cari desain War, Trophy, dan Farming base dengan link copy resmi.",
    publisher: { "@id": "https://3agang.pro/#organization" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: serializedLayouts.length,
      itemListElement: serializedLayouts.slice(0, 10).map((layout: { id: number; th_level: number }, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://3agang.pro/layout/${layout.id}`,
        name: `Base Layout TH ${layout.th_level}`,
      })),
    },
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] font-poppins text-zinc-100 selection:bg-amber-500 selection:text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-[#050505] pb-14 pt-32 sm:pb-20 md:min-h-[88svh] md:pb-24">
        <Image
          src="/SkeletonKingdom_Clean_BG.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/55 to-black/15" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#050505] via-black/15 to-black/20" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_48%,rgba(245,158,11,0.12),transparent_45%)]" />

        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-black/45 px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.24em] text-amber-300 backdrop-blur-md sm:text-[10px]">
              <Sword size={14} weight="duotone" />
              AAA GANG · BASE ARCHIVE
            </div>
            <h1 className="text-5xl font-black uppercase italic leading-[0.9] tracking-tight text-white sm:text-6xl md:text-7xl" style={{ fontFamily: "'Docallisme', sans-serif" }}>
              BUILD YOUR
              <br />
              <span className="text-amber-400">PERFECT</span> DEFENSE
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
              Temukan inspirasi base untuk war, trophy, dan farming. Pilih desain, lihat detailnya, lalu salin langsung ke game.
            </p>
            <a
              href="#layout-collection"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-black transition-colors hover:bg-amber-300"
            >
              Explore layouts <ArrowDown size={15} weight="bold" />
            </a>
          </div>

          <div className="mt-12 flex max-w-2xl flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/15 pt-5 sm:mt-16">
            <div>
              <p className="text-xl font-black tabular-nums text-zinc-100 sm:text-2xl">{activeLayouts.length}</p>
              <p className="mt-1 text-[8px] font-black uppercase tracking-[0.17em] text-zinc-400">Available bases</p>
            </div>
            <span className="hidden h-9 w-px bg-white/15 sm:block" />
            <div>
              <p className="text-xl font-black tabular-nums text-zinc-100 sm:text-2xl">{townHallLevels.length}</p>
              <p className="mt-1 text-[8px] font-black uppercase tracking-[0.17em] text-zinc-400">Town Hall levels</p>
            </div>
            <span className="hidden h-9 w-px bg-white/15 sm:block" />
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-400">
              War <span className="px-1 text-amber-400">·</span> Trophy <span className="px-1 text-amber-400">·</span> Farming
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <div className="mb-16 overflow-hidden rounded-[1.75rem] border border-zinc-800/70 bg-gradient-to-br from-zinc-900/35 via-transparent to-amber-950/10 sm:mb-20">
          <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-10 lg:p-10">
            <div>
              <div className="mb-4 inline-flex size-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] text-amber-300">
                <Sparkle size={22} weight="duotone" />
              </div>
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.24em] text-amber-400">Need a recommendation?</p>
              <h2 className="text-3xl font-black uppercase italic leading-tight text-zinc-100 sm:text-4xl" style={{ fontFamily: "'Docallisme', sans-serif" }}>
                Ask <span className="text-amber-400">Sigma</span>
              </h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-zinc-400">
                Tanya Sigma untuk menemukan base yang sesuai dengan Town Hall dan strategi bermainmu.
              </p>
            </div>
            <LayoutPageChat clanName={clan.name} />
          </div>
        </div>

        <div id="layout-collection" className="scroll-mt-24">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:mb-9 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.25em] text-amber-400">Find your next setup</p>
              <h2 className="text-3xl font-black uppercase italic tracking-tight text-zinc-100 sm:text-4xl">
                Base <span className="text-amber-400">Collection</span>
              </h2>
            </div>
            <p className="max-w-md text-xs leading-6 text-zinc-500 sm:text-right">
              Filter berdasarkan Town Hall atau tipe base, lalu urutkan berdasarkan yang terbaru atau paling sering dilihat.
            </p>
          </div>

          {serializedLayouts.length > 0 ? (
            <LayoutsFilter layouts={serializedLayouts} />
          ) : (
            <div className="rounded-2xl border border-zinc-800/60 px-5 py-16 text-center">
              <p className="text-sm font-bold text-zinc-400">Belum ada base layout yang tersedia.</p>
            </div>
          )}
        </div>
      </section>

      <Footer clan={clan} />
    </main>
  );
}
