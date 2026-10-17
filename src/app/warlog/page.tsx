import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WarLogFilter from "@/components/WarLogFilter";
import { getClanData, getWarLog } from "@/lib/coc";
import {
  ArrowDown,
  ArrowUp,
  CalendarBlank,
  Crosshair,
  Crown,
  Fire,
  Skull,
  Sword,
  Trophy,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import type { Icon } from "@phosphor-icons/react";

export const revalidate = 43200;

interface War {
  result: "win" | "lose" | "tie" | null;
  endTime: string;
  teamSize: number;
  attacksPerMember: number;
  clan: {
    name: string;
    stars: number;
    destructionPercentage: number;
    expEarned: number;
  };
  opponent: {
    name: string;
    stars: number;
    destructionPercentage: number;
  };
}

interface WarLogResponse {
  items?: War[];
}

function SummaryStat({
  icon: IconComponent,
  label,
  value,
  tone,
}: {
  icon: Icon;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="min-w-0 border-l border-white/15 pl-4 first:border-0 first:pl-0 sm:pl-6">
      <div className={`mb-2 flex items-center gap-2 ${tone}`}>
        <IconComponent size={16} weight="duotone" />
        <span className="text-[8px] font-black uppercase tracking-[0.16em] text-zinc-400 sm:text-[9px]">{label}</span>
      </div>
      <p className="text-xl font-black tabular-nums tracking-tight text-zinc-100 sm:text-2xl">{value}</p>
    </div>
  );
}

export default async function WarLogPage() {
  const [clanResponse, warLogResponse] = await Promise.all([getClanData(), getWarLog()]);
  const clan = clanResponse;

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

  const warLog = warLogResponse as WarLogResponse | null;
  const wars = (warLog?.items ?? []).filter((war) => war?.clan && war?.opponent);
  const totalXp = wars.reduce((total, war) => total + (war.clan.expEarned || 0), 0);
  const wins = wars.filter((war) => war.result === "win").length;
  const losses = wars.filter((war) => war.result === "lose").length;
  const ties = wars.filter((war) => war.result === "tie").length;
  const completedWars = wins + losses + ties;
  const winRate = completedWars ? Math.round((wins / completedWars) * 100) : 0;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://3agang.pro/warlog/#collection",
    url: "https://3agang.pro/warlog",
    name: "Arsip Pembantaian: War History AAA GANGS",
    description: "Rekam jejak pertempuran AAA GANGS di Clash of Clans. Data war log, perolehan bintang, dan total XP clan yang tercatat secara publik.",
    publisher: { "@id": "https://3agang.pro/#organization" },
    mainEntity: {
      "@type": "ItemList",
      name: "Recent War Logs",
      numberOfItems: wars.length,
      itemListElement: wars.slice(0, 10).map((war, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${war.clan.name} vs ${war.opponent.name} (${war.result?.toUpperCase() ?? "CANCELLED"})`,
        description: `Skor: ${war.clan.stars} - ${war.opponent.stars}. Destruksi: ${war.clan.destructionPercentage}%`,
      })),
    },
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] font-sans text-zinc-100 selection:bg-amber-500 selection:text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-[#050505] pb-12 pt-32 sm:pb-16 md:min-h-[88svh] md:pb-20">
        <Image
          src="/Sound_of_Clash_CLEAN_ONLY_BG.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/75 to-black/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#050505] via-black/20 to-black/25" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_55%,rgba(245,158,11,0.16),transparent_46%)]" />

        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-black/45 px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.24em] text-amber-300 backdrop-blur-md sm:text-[10px]">
              <Skull size={14} weight="duotone" />
              AAA GANG · WAR ARCHIVE
            </div>
            <h1 className="text-5xl font-black uppercase italic leading-[0.9] tracking-tight text-white sm:text-6xl md:text-7xl" style={{ fontFamily: "'Docallisme', sans-serif" }}>
              EVERY WAR
              <br />
              <span className="text-amber-400">LEAVES</span> A
              <br />
              LEGACY
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
              Setiap serangan punya cerita. Telusuri catatan pertempuran AAA GANG, dari kemenangan sempurna sampai hasil yang jadi pelajaran.
            </p>
            <a
              href="#war-archive"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-black transition-colors hover:bg-amber-300"
            >
              Explore war archive <ArrowDown size={15} weight="bold" />
            </a>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-y-5 border-t border-white/15 pt-5 sm:mt-16 sm:grid-cols-4 sm:gap-y-0">
            <SummaryStat icon={Sword} label="Battles" value={wars.length.toLocaleString()} tone="text-amber-300" />
            <SummaryStat icon={Crown} label="Victories" value={wins.toLocaleString()} tone="text-amber-300" />
            <SummaryStat icon={Crosshair} label="Win rate" value={`${winRate}%`} tone="text-emerald-300" />
            <SummaryStat icon={Trophy} label="Clan XP" value={totalXp.toLocaleString()} tone="text-amber-300" />
          </div>
        </div>
      </section>

      <section id="war-archive" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:mb-9 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[9px] font-black uppercase tracking-[0.25em] text-amber-400">The battle record</p>
            <h2 className="text-3xl font-black uppercase italic tracking-tight text-zinc-100 sm:text-4xl">
              War <span className="text-amber-400">Archive</span>
            </h2>
          </div>
          <p className="max-w-md text-xs leading-6 text-zinc-500 sm:text-right">
            Data publik war log mengikuti ketersediaan API Supercell dan hanya mencakup riwayat yang masih tersimpan.
          </p>
        </div>

        {wars.length > 0 ? (
          <WarLogFilter wars={wars} />
        ) : (
          <div className="rounded-2xl border border-zinc-800/60 px-5 py-16 text-center">
            <p className="text-sm font-bold text-zinc-400">Belum ada data war log yang tersedia.</p>
          </div>
        )}

        {completedWars > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-zinc-800/60 pt-5 text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-600">
            <span className="flex items-center gap-2"><Crown size={13} className="text-amber-400" /> {wins} victories</span>
            <span className="flex items-center gap-2"><Skull size={13} className="text-rose-400" /> {losses} defeats</span>
            <span className="flex items-center gap-2"><Trophy size={13} className="text-sky-400" /> {ties} draws</span>
            <span className="ml-auto flex items-center gap-2"><CalendarBlank size={13} /> Updated from public war log</span>
          </div>
        )}
      </section>

      <Footer clan={clan} />
    </main>
  );
}
