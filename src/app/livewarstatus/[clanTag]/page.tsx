import { getCurrentWarByTag, getWarLogByTag, getClanDataByTag } from "@/lib/coc";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield, Trophy, Swords, Users, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WarStatusCard from "@/components/WarStatusCard";
import HallOfFame from "@/components/HOFForSearch";
import NonAttackingPlayers from "@/components/NonAttackingPlayers";
import WarLogCard from "@/components/WarLogCard";
import ScrollReveal from "@/components/ScrollReveal";

interface WarDetailPageProps {
  params: Promise<{
    clanTag: string;
  }>;
}

export default async function WarDetailPage({ params }: WarDetailPageProps) {
  const resolvedParams = await params;
  const decodedTag = decodeURIComponent(resolvedParams.clanTag);

  let warData: any;
  let warLog: any;
  let mainClanData: any;
  let clanData: any;

  try {
    const [war, log, mainClan, clan] = await Promise.all([
      getCurrentWarByTag(decodedTag),
      getWarLogByTag(decodedTag),
      getClanDataByTag("Q9YY02J9"), // Main clan untuk navbar/footer
      getClanDataByTag(decodedTag), // Searched clan for header
    ]);

    if (!clan) notFound();
    warData = war;
    warLog = log;
    mainClanData = mainClan;
    clanData = clan;
  } catch (error) {
    console.error("Error fetching war data:", error);
    notFound();
  }

  const isWar = warData && warData.state !== "notInWar";

  return (
    <main className="min-h-screen text-zinc-100 font-poppins selection:bg-amber-500 selection:text-black">
      <Navbar clanName={mainClanData?.name} badge="/badge_clan.webp" />

      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        {/* Back Button */}
        <Link
          href="/livewarstatus"
          className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors mb-8 text-sm font-semibold uppercase tracking-wide"
        >
          <ArrowLeft size={16} /> Back to Search
        </Link>

        {/* War Header */}
        <div className="mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Shield size={12} /> War Status
          </div>
          <h1
            className="text-5xl md:text-6xl uppercase italic mb-4"
            style={{ fontFamily: "'Docallisme', sans-serif" }}
          >
            {clanData.name}
          </h1>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3 text-zinc-400">
              <span className="px-3 py-1 bg-zinc-800/50 rounded-full font-mono font-bold text-amber-500">
                {clanData.tag}
              </span>
              <span className="text-zinc-500">Lvl {clanData.clanLevel}</span>
            </div>
          </div>
        </div>

        {/* War Status Section */}
        {isWar ? (
          <>
            {/* War Status Card */}
            <ScrollReveal delay={0.1} mobileDelay={0.1}>
              <div className="mb-12">
                <WarStatusCard
                  isWar={true}
                  state={warData?.state}
                  opponentName={warData?.opponent.name}
                  opponentBadgeUrl={warData?.opponent.badgeUrls?.medium}
                  clanStars={warData?.clan.stars}
                  opponentStars={warData?.opponent.stars}
                  clanAttacks={warData?.clan.attacks}
                  totalAttacks={warData ? warData.teamSize * 2 : 0}
                />
              </div>
            </ScrollReveal>

            {/* Hall of Fame */}
            <HallOfFame isWar={true} war={warData} />

            {/* Non-Attacking Players */}
            <NonAttackingPlayers isWar={true} war={warData} />
          </>
        ) : (
          <ScrollReveal delay={0.1} mobileDelay={0.1}>
            <div className="mb-12 text-center py-16 bg-zinc-900/10 border border-zinc-900/60 rounded-[2rem] animate-slide-up">
              <p className="text-zinc-400 font-semibold text-lg">Clan Tidak Sedang Dalam War / War log Diset Private</p>
              <p className="text-zinc-500 text-sm mt-2 max-w-xs mx-auto px-4">
                Lihat riwayat pertempuran clan di bawah untuk melihat performa mereka sebelumnya.
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* War Log Section */}
        {warLog && warLog.items && warLog.items.length > 0 && (
          <div className="mt-12 animate-slide-up">
            <div className="flex items-center gap-2 mb-6">
              <Trophy size={20} className="text-amber-500" />
              <h2 className="text-3xl uppercase" style={{ fontFamily: "'Docallisme', sans-serif" }}>
                War Log <span className="text-amber-500">({warLog.items.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warLog.items.map((war: any, idx: number) => (
                <ScrollReveal key={idx} delay={idx * 0.05} mobileDelay={0.1}>
                  <WarLogCard war={war} index={idx} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* No War History */}
        {(!warLog || !warLog.items || warLog.items.length === 0) && (
          <ScrollReveal delay={0.1} mobileDelay={0.1}>
            <div className="text-center py-16 bg-zinc-900/10 border border-zinc-900/60 rounded-[2rem] animate-slide-up mt-12">
              <p className="text-zinc-400 font-semibold text-lg">Tidak Ada Riwayat War</p>
              <p className="text-zinc-500 text-sm mt-2 max-w-xs mx-auto px-4">
                Clan ini belum memiliki riwayat pertempuran yang dapat ditampilkan.
              </p>
            </div>
          </ScrollReveal>
        )}
      </section>

      <Footer clan={mainClanData} />
    </main>
  );
}
