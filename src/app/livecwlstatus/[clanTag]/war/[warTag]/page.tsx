import { getCWLWarByTag, getClanDataByTag } from "@/lib/coc";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield, Trophy, Swords, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CWLWarStatusCard from "@/components/CWLWarStatusCard";
import CWLHallOfFame from "@/components/CWLHallOfFame";
import CWLNonAttackingPlayers from "@/components/CWLNonAttackingPlayers";
import ScrollReveal from "@/components/ScrollReveal";

interface CWLWarDetailPageProps {
  params: Promise<{
    clanTag: string;
    warTag: string;
  }>;
}

export default async function CWLWarDetailPage({ params }: CWLWarDetailPageProps) {
  const resolvedParams = await params;
  const decodedClanTag = decodeURIComponent(resolvedParams.clanTag);
  const decodedWarTag = decodeURIComponent(resolvedParams.warTag);

  let warData: any;
  let mainClanData: any;
  let clanData: any;

  try {
    const [war, mainClan, clan] = await Promise.all([
      getCWLWarByTag(decodedWarTag),
      getClanDataByTag("Q9YY02J9"), // Main clan untuk navbar/footer
      getClanDataByTag(decodedClanTag), // Searched clan for header (optional, for context)
    ]);

    if (!war) notFound();
    warData = war;
    mainClanData = mainClan;
    clanData = clan;
  } catch (error) {
    console.error("Error fetching CWL war data:", error);
    notFound();
  }

  const isWar = warData && (warData.state === "inWar" || warData.state === "warEnded");

  return (
    <main className="min-h-screen text-zinc-100 font-poppins selection:bg-amber-500 selection:text-black">
      <Navbar clanName={mainClanData?.name} badge="/badge_clan.webp" />

      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        {/* Back Button */}
        <Link
          href={`/livecwlstatus/${encodeURIComponent(decodedClanTag)}`}
          className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors mb-8 text-sm font-semibold uppercase tracking-wide"
        >
          <ArrowLeft size={16} /> Back to CWL Overview
        </Link>

        {/* War Header */}
        <div className="mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Shield size={12} /> CWL War Details
          </div>
        </div>

        {/* War Status Card - Main matchup */}
        {isWar && (
          <ScrollReveal>
            <div className="mb-12">
              <CWLWarStatusCard
                state={warData.state}
                clanData={{
                  name: warData.clan?.name || "Unknown Clan",
                  tag: warData.clan?.tag || "",
                  badgeUrl: warData.clan?.badgeUrls?.medium,
                  members: warData.clan?.members?.length || 0,
                  clanLevel: warData.clan?.clanLevel || 0,
                  stars: warData.clan?.stars || 0,
                  destructionPercent: warData.clan?.destructionPercentage || 0,
                  attacks: warData.clan?.attacks || 0,
                }}
                opponentData={{
                  name: warData.opponent?.name || "Unknown Clan",
                  tag: warData.opponent?.tag || "",
                  badgeUrl: warData.opponent?.badgeUrls?.medium,
                  members: warData.opponent?.members?.length || 0,
                  clanLevel: warData.opponent?.clanLevel || 0,
                  stars: warData.opponent?.stars || 0,
                  destructionPercent: warData.opponent?.destructionPercentage || 0,
                  attacks: warData.opponent?.attacks || 0,
                }}
              />
            </div>
          </ScrollReveal>
        )}

        {/* Hall of Fame */}
        {isWar && warData.clan?.members && (
          <ScrollReveal>
            <div className="mb-12">
              <CWLHallOfFame isWar={true} war={warData} />
            </div>
          </ScrollReveal>
        )}

        {/* Non Attacking Players */}
        {isWar && warData.clan?.members && (
          <ScrollReveal>
            <div className="mb-12">
              <CWLNonAttackingPlayers war={warData} isWar={true} />
            </div>
          </ScrollReveal>
        )}

      </section>

      <Footer clan={mainClanData} />
    </main>
  );
}
