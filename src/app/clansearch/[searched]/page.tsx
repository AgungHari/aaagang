import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Shield, Trophy, Users, Swords, MapPin, Clock, TrendingUp, Heart, Zap, ExternalLink } from "lucide-react";
import { getClanDataByTag } from "@/lib/coc";

interface ClanDetailPageProps {
  params: Promise<{
    searched: string;
  }>;
}

export default async function ClanDetailPage({ params }: ClanDetailPageProps) {
  const resolvedParams = await params;
  const decodedTag = decodeURIComponent(resolvedParams.searched);

  let clanData: any;
  let mainClanData: any;

  try {
    const [clan, mainClan] = await Promise.all([
      getClanDataByTag(decodedTag),
      getClanDataByTag("Q9YY02J9"), // Main clan untuk navbar/footer
    ]);

    if (!clan) notFound();
    clanData = clan;
    mainClanData = mainClan;
  } catch (error) {
    console.error("Error fetching clan:", error);
    notFound();
  }

  const membersSorted = [...(clanData.memberList || [])].sort((a: any, b: any) => {
    const roleOrder: { [key: string]: number } = {
      leader: 0,
      coLeader: 1,
      admin: 2,
      member: 3,
    };
    return (roleOrder[a.role] ?? 999) - (roleOrder[b.role] ?? 999);
  });

  const capitalDistricts = clanData.clanCapital?.districts || [];

  const roleColors: { [key: string]: string } = {
    leader: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    coLeader: "text-orange-500 bg-orange-500/10 border-orange-500/30",
    admin: "text-blue-500 bg-blue-500/10 border-blue-500/30",
    member: "text-zinc-400 bg-zinc-800/20 border-zinc-700/30",
  };

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      leader: "Leader",
      coLeader: "Co-Leader",
      admin: "Elder",
      member: "Member",
    };
    return labels[role] || role;
  };

  const districtImages: { [key: string]: string } = {
    "Capital Peak": "/Building_CC_Capital_Hall_level_10.webp",
    "Barbarian Camp": "/Troop_BB_Raged_Barbarian_no_grass.webp",
    "Wizard Valley": "/Super_Troop_Super_Wizard_2.webp",
    "Balloon Lagoon": "/Troop_HV_Balloon_2.webp",
    "Builder's Workshop": "/Villager_CC_Grand_Builder_4_shadow.webp",
    "Dragon Cliffs": "/edragon_marketing_02-metal.webp",
    "Golem Quarry": "/Mega_Troop_CC_Mountain_Golem_2.webp",
    "Skeleton Park": "/MinionPrince_DarkDays_f75_withGroundshadows.webp",
    "Goblin Mines": "/Villager_HV_Goblin_Builder.webp",
  };

  return (
    <main className="min-h-screen text-zinc-100 font-poppins selection:bg-amber-500 selection:text-black">
      <Navbar clanName={mainClanData?.name} badge="/badge_clan.webp" />

      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        {/* Back Button */}
        <Link
          href="/clansearch"
          className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors mb-8 text-sm font-semibold uppercase tracking-wide"
        >
          <ArrowLeft size={16} /> Back to Search
        </Link>

        {/* Clan Header */}
        <div className="mb-12 animate-slide-up">
          <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
            {clanData.badgeUrls?.large && (
              <img
                src={clanData.badgeUrls.large}
                alt={clanData.name}
                className="w-32 h-32 object-contain drop-shadow-[0_0_16px_rgba(245,158,11,0.4)] md:w-40 md:h-40"
              />
            )}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                <Shield size={12} /> Clan Profile
              </div>
              <h1
                className="text-5xl md:text-6xl font-black uppercase italic mb-4 leading-none"
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
                {clanData.warLeague && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <Trophy size={14} />
                    <span className="font-semibold">{clanData.warLeague.name}</span>
                  </div>
                )}
                {clanData.description && (
                  <p className="text-zinc-400 italic mt-4">&quot;{clanData.description}&quot;</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-slide-up">
          <StatCard
            icon={<Trophy className="text-amber-500" size={20} />}
            label="Clan Points"
            value={(clanData.clanPoints ?? 0).toLocaleString()}
          />
          <StatCard
            icon={<Swords className="text-red-500" size={20} />}
            label="War Wins"
            value={(clanData.warWins ?? 0).toLocaleString()}
          />
          <StatCard
            icon={<Users className="text-blue-500" size={20} />}
            label="Members"
            value={`${clanData.members ?? 0}/${50}`}
          />
          <StatCard
            icon={<TrendingUp className="text-green-500" size={20} />}
            label="War Frequency"
            value={clanData.warFrequency || "—"}
          />
        </div>

        {/* Members Section */}
        <div className="mb-12 animate-slide-up">
          <div className="flex items-center gap-2 mb-6">
            <Users size={20} className="text-amber-500" />
            <h2 className="text-3xl uppercase" style={{ fontFamily: "'Docallisme', sans-serif" }}>
              Members <span className="text-amber-500">({membersSorted.length})</span>
            </h2>
          </div>

          {membersSorted.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {membersSorted.map((member: any, idx: number) => (
                <Link
                  key={member.tag}
                  href={`/search/${encodeURIComponent(member.tag)}`}
                  className="block group active:scale-[0.98] transition-all"
                >
                  <div className="p-6 bg-zinc-900/20 border border-zinc-800/50 rounded-[2rem] hover:border-amber-500/30 transition-all group relative overflow-hidden h-full">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 blur-3xl rounded-full group-hover:bg-amber-500/10 transition-colors"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-black italic text-zinc-800 group-hover:text-amber-500/20 transition-colors">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="flex items-center gap-3">
                          {member.leagueTier?.iconUrls?.small && (
                            <img
                              src={member.leagueTier.iconUrls.small}
                              alt={member.leagueTier.name}
                              className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.3)] group-hover:scale-110 transition-transform"
                            />
                          )}
                          <div>
                            <div className="font-black uppercase italic text-lg tracking-tight leading-none mb-1 group-hover:text-amber-500 transition-colors">
                              {member.name}
                            </div>
                            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex flex-col gap-0.5">
                              <span className="text-zinc-600 font-mono tracking-normal text-[8px] bg-zinc-800/50 w-fit px-1 rounded">
                                {member.tag}
                              </span>
                              <span>
                                {getRoleLabel(member.role)} • TH {member.townHallLevel}
                              </span>
                              <span className="text-amber-500/60 text-[7px] mt-0.5">
                                {member.leagueTier?.name || "Unranked"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-zinc-800/50 pt-4 relative z-10">
                      <StatMini
                        label="Donations"
                        value={member.donations ?? 0}
                        icon={<Heart size={10} />}
                        color="text-blue-400"
                      />
                      <StatMini
                        label="Received"
                        value={member.donationsReceived ?? member.received ?? 0}
                        icon={<Zap size={10} />}
                        color="text-purple-400"
                      />
                      <StatMini
                        label="Trophies"
                        value={member.trophies ?? 0}
                        icon={<Trophy size={10} />}
                        color="text-yellow-500"
                      />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm rounded-[2rem] pointer-events-none">
                      <div className="flex flex-col items-center gap-2 text-amber-400">
                        <ExternalLink size={24} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-wider">View Full Profile</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
              <p className="text-zinc-500">No members found</p>
            </div>
          )}
        </div>

        {/* Capital Districts Section */}
        {capitalDistricts.length > 0 && (
          <div className="animate-slide-up">
            <div className="flex items-center gap-2 mb-6">
              <MapPin size={20} className="text-amber-500" />
              <h2 className="text-3xl uppercase" style={{ fontFamily: "'Docallisme', sans-serif" }}>
                Capital Districts <span className="text-amber-500">({capitalDistricts.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {capitalDistricts.map((district: any, idx: number) => {
                const districtName = district.name || `District ${idx + 1}`;
                const districtImage = districtImages[districtName];
                return (
                  <div key={idx} className="group relative bg-zinc-900/20 border border-zinc-800/50 rounded-2xl hover:border-amber-500/30 transition-all overflow-hidden h-64">
                    {districtImage && (
                      <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                        <img src={districtImage} alt={districtName} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950/90"></div>
                    <div className="relative z-10 h-full flex flex-col justify-between p-6">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-bold uppercase text-sm tracking-wider text-amber-50 leading-tight">{districtName}</h3>
                          <span className="text-[9px] font-black bg-amber-500/20 text-amber-300 px-2 py-1 rounded border border-amber-500/30">Lvl {district.districtHallLevel}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-[10px] text-zinc-300">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">ID:</span>
                          <span className="font-mono font-semibold text-amber-400">{district.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <Footer clan={mainClanData} />
    </main>
  );
}

// --- SUB COMPONENTS ---
function StatCard({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="p-4 bg-zinc-900/20 border border-zinc-800/50 rounded-xl hover:border-amber-500/30 transition-all">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-black">{value}</div>
    </div>
  );
}

function StatMini({ label, value, icon, color }: any) {
  return (
    <div>
      <div className={`flex items-center gap-1 text-[10px] font-black italic ${color}`}>
        {icon} {value.toLocaleString()}
      </div>
      <div className="text-[7px] text-zinc-600 font-bold uppercase tracking-tighter">{label}</div>
    </div>
  );
}
