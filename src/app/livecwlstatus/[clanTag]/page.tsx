import { getCWLByTag, getCWLWarByTag, getClanDataByTag } from "@/lib/coc";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy, Swords, Loader } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CWLWarCard from "@/components/CWLWarCard";
import ScrollReveal from "@/components/ScrollReveal";

interface CWLOverviewPageProps {
  params: Promise<{
    clanTag: string;
  }>;
}

export default async function CWLOverviewPage({ params }: CWLOverviewPageProps) {
  const resolvedParams = await params;
  const decodedTag = decodeURIComponent(resolvedParams.clanTag);

  let leagueGroup: any;
  let mainClanData: any;
  let searchedClanData: any;
  let allWarsData: any[] = [];

  try {
    const [league, mainClan, searchedClan] = await Promise.all([
      getCWLByTag(decodedTag),
      getClanDataByTag("Q9YY02J9"), // Main clan untuk navbar/footer
      getClanDataByTag(decodedTag), // Searched clan for header
    ]);

    if (!league) notFound();
    leagueGroup = league;
    mainClanData = mainClan;
    searchedClanData = searchedClan;

    // Fetch all war data for accurate clan names
    const allWarTags = leagueGroup.rounds.flatMap((round: any) => round.warTags);
    const warPromises = allWarTags.map((warTag: string) => getCWLWarByTag(warTag));
    allWarsData = await Promise.all(warPromises);
  } catch (error) {
    console.error("Error fetching CWL data:", error);
    notFound();
  }

  // Build a map of warTag -> war data for quick lookup
  const warDataMap: { [key: string]: any } = {};
  const allWarTags = leagueGroup.rounds.flatMap((round: any) => round.warTags);
  allWarTags.forEach((warTag: string, index: number) => {
    if (allWarsData[index]) {
      warDataMap[warTag] = allWarsData[index];
    }
  });

  return (
    <main className="min-h-screen text-zinc-100 font-poppins selection:bg-amber-500 selection:text-black">
      <Navbar clanName={mainClanData?.name} badge="/badge_clan.webp" />

      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Back Button */}
        <Link
          href="/livecwlstatus"
          className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors mb-8 text-sm font-semibold uppercase tracking-wide"
        >
          <ArrowLeft size={16} /> Back to Search
        </Link>

        {/* CWL Header */}
        <div className="mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Trophy size={12} /> CWL League
          </div>
          <h1
            className="text-5xl md:text-6xl uppercase italic mb-4"
            style={{ fontFamily: "'Docallisme', sans-serif" }}
          >
            Season <span className="text-amber-500">{leagueGroup.season}</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl">
            Jelajahi semua {leagueGroup.rounds.length * 4} pertempuran (7 rounds x 4 wars) dari CWL terbaru. Klik setiap war untuk melihat detail lengkap dan attack tracking.
          </p>
        </div>

        {/* League Stats */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="p-4 bg-zinc-900/20 backdrop-blur-sm border border-zinc-800/40 rounded-lg">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Total Clans</p>
              <p className="text-2xl font-bold text-amber-500">{leagueGroup.clans.length}</p>
            </div>
            <div className="p-4 bg-zinc-900/20 backdrop-blur-sm border border-zinc-800/40 rounded-lg">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Rounds</p>
              <p className="text-2xl font-bold text-amber-500">{leagueGroup.rounds.length}</p>
            </div>
            <div className="p-4 bg-zinc-900/20 backdrop-blur-sm border border-zinc-800/40 rounded-lg">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Total Wars</p>
              <p className="text-2xl font-bold text-amber-500">{leagueGroup.rounds.length * 4}</p>
            </div>
            <div className="p-4 bg-zinc-900/20 backdrop-blur-sm border border-zinc-800/40 rounded-lg">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">State</p>
              <p className="text-xl font-bold capitalize text-amber-500">
                {leagueGroup.state === 'preparation' && '🔵 Prep'}
                {leagueGroup.state === 'inWar' && '🟠 War'}
                {leagueGroup.state === 'ended' && '🟢 Ended'}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Wars Grid by Rounds */}
        <div className="space-y-8">
          {leagueGroup.rounds.map((round: any, roundIndex: number) => (
            <div key={roundIndex} className="animate-fade-in">
              {/* Round Header */}
              <div className="mb-4 pb-3 border-b border-zinc-800/40">
                <h2 className="text-xl font-bold uppercase tracking-wide">
                  Day <span className="text-amber-500">{roundIndex + 1}</span>
                </h2>
              </div>

              {/* 4 Wars per Round in Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {round.warTags.map((warTag: string, warIndex: number) => {
                  const warData = warDataMap[warTag];
                  
                  let clan1: any, clan2: any;
                  if (warData && warData.clan && warData.opponent) {
                    clan1 = {
                      tag: warData.clan.tag,
                      name: warData.clan.name,
                      badgeUrl: warData.clan.badgeUrls?.medium,
                      stars: warData.clan.stars || 0,
                      destructionPercent: warData.clan.destructionPercentage || 0,
                    };
                    clan2 = {
                      tag: warData.opponent.tag,
                      name: warData.opponent.name,
                      badgeUrl: warData.opponent.badgeUrls?.medium,
                      stars: warData.opponent.stars || 0,
                      destructionPercent: warData.opponent.destructionPercentage || 0,
                    };
                  } else {
                    clan1 = { tag: warTag, name: "Loading...", badgeUrl: undefined };
                    clan2 = { tag: "", name: "Loading...", badgeUrl: undefined };
                  }

                  return (
                    <CWLWarCard
                      key={warTag}
                      clan1={clan1}
                      clan2={clan2}
                      warState={warData?.state || (leagueGroup.state === 'ended' ? 'warEnded' : leagueGroup.state)}
                      warTag={warTag}
                      roundNum={roundIndex + 1}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 p-6 bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-xl">
          <p className="text-sm text-zinc-300 leading-relaxed">
            💡 <strong>Tips:</strong> Klik setiap war card untuk melihat detail pertempuran lengkap, attack tracking, dan performa pemain dari masing-masing clan.
          </p>
        </div>
      </section>

      <Footer clan={mainClanData} />
    </main>
  );
}
