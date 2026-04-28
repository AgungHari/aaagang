import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TiltedImage from "@/components/TiltImage";
import ScrollReveal from "@/components/ScrollReveal";
import HallOfFame from "@/components/HallOfFame";
import LeaderboardCard from "@/components/LeaderboardCard";
import ClanCapitalCard from "@/components/ClanCapitalCard";
import WarStatusCard from "@/components/WarStatusCard";
import WarTestimonial from "@/components/WarTestimonial";
import DecorativeHeroes from "@/components/DecorativeHeroes";
import MorphingTitle from "@/components/MorphingTitle";
import Link from "next/link";
import Image from "next/image";
import { 
  Sigma,
  UserPlus, ChevronRightIcon
} from "lucide-react";
import { getClanData, getCurrentWar, getWarLog } from "@/lib/coc";

export const revalidate = 60;

export default async function Home() {
  const [clan, war, warLog] = await Promise.all([getClanData(), getCurrentWar(), getWarLog()]);

  if (!clan) {
      return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <h1 className="text-amber-600 text-5xl md:text-6xl mb-6 " style={{ fontFamily: "'Docallisme', sans-serif" }}>
            SUPERCELL MAINTENANCE
          </h1>
          <p className="text-gray-400 text-md mb-10 max-w-lg font-poppins">
            We couldn&apos;t fetch the data right now. Check in-game for the maintenance timer or visit our status page.
          </p>
          
          <a 
            href="https://status.3agang.pro" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-zinc-600/30 font-sans rounded-xl border border-zinc-500/10 hover:bg-zinc-500/10"
          >
            <span className="relative flex items-center gap-2">
              <span className="flex h-3 w-3">
                <span className="animate-ping relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Check System Status
            </span>
          </a>
        </div>
      );
    }

  // --- LOGIC DATA ---
  const members = [...clan.memberList];
  const newMembers = members.filter(m => m.previousClanRank === 0);
  const topDonators = [...members].sort((a, b) => b.donations - a.donations).slice(0, 3);
  const topLeagues = [...members].sort((a, b) => b.trophies - a.trophies).slice(0, 3);
  const topReceived = [...members].sort((a, b) => b.donationsReceived - a.donationsReceived).slice(0, 3);

  const isWar = war && war.state !== 'notInWar';
  // MOCK DATA - Remove after checking
  const mockNewMembers = [
    { tag: '#NEWMEMBER1', name: 'Ninja Fighter', townHallLevel: 10, previousClanRank: 0 },
    { tag: '#NEWMEMBER2', name: 'Sky Warrior', townHallLevel: 9, previousClanRank: 0 },
    { tag: '#NEWMEMBER3', name: 'Thunder Storm', townHallLevel: 11, previousClanRank: 0 },
  ];
  
  // Use mock data if no real new members
  const displayNewMembers = newMembers.length > 0 ? newMembers : mockNewMembers;

  return (
    <main className="min-h-screen text-zinc-100 selection:bg-amber-500 selection:text-black overflow-x-hidden font-sans relative">
      <DecorativeHeroes />
      
      {/* 1. Navbar Component */}
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      {/* Hero Section - Merged from HeroSection.tsx */}
      <section className="relative flex flex-col items-center justify-center px-4 md:px-16 lg:px-24 xl:px-32 pt-20 pb-20">
        <div className="absolute top-30 -z-10 left-1/4 size-72 bg-amber-600/10 blur-[300px]"></div>
        
        {/* Clan Badge */}
        <div className="flex items-center gap-2 rounded-full p-1 pr-3 mt-23 font-poppins text-amber-100 bg-amber-200/15 border border-amber-500/20  animate-slide-up">
          <span className="bg-amber-800 text-white text-xs px-3.5 py-1 rounded-full font-black">
            {clan.memberList?.length < 50 ? "OPEN" : "CLOSED"}
          </span>
          <p className="flex items-center gap-1 text-sm">
            <span>{clan.memberList?.length} Gangstas on deck</span>
            <ChevronRightIcon size={16} />
          </p>
        </div>
        
        {/* Main Title */}
        <MorphingTitle />
        
        {/* Clan Description */}
        <p className="text-base text-center text-slate-300 max-w-lg md:max-w-lg lg:max-w-lg mb-8 font-poppins animate-slide-up">
          Di sini strategi dimainkan, sesuai dengan yang diramalkan kami akan menang dengan mudah. 
        </p>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-1 mb-16">
          <a
            href="https://link.clashofclans.com/en/?action=OpenClanProfile&tag=Q9YY02J9"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-700 font-poppins hover:bg-amber-900 text-white rounded-xl px-7 h-11 font-400 transition-all flex items-center justify-center animate-slide-up"
          >
            Join Now
          </a>
          <Link 
            href="/sigma"
            className="flex items-center gap-1 border-2 border-amber-900 hover:bg-amber-950/50 transition rounded rounded-tl-3xl rounded-br-3xl rounded-bl-3xl px-6 h-11 font-medium animate-slide-up"
          >
            <Sigma strokeWidth={1} size={18} />
            <span>Ask Sigma</span>
          </Link>
        </div>
        
        {/* Clan Stats */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-14">
          <div className="flex items-center gap-2 animate-slide-up">
            <Image className="opacity-80 saturate-60 hue-rotate-100" src="/1_newb.png" alt="Newbie Friendly" width={20} height={20}/>
            <span className="text-slate-400 font-medium">Newbie Friendly</span>
          </div>
          <div className="flex items-center gap-2 animate-slide-up">
            <Image className="opacity-80 saturate-60" src="/3_war.png" alt="Always War" width={20} height={20}/>
            <span className="text-slate-400 font-medium">Always War</span>
          </div>
          <div className="flex items-center gap-2 animate-slide-up">
            <Image className="opacity-80 saturate-90 hue-rotate-260" src="/2_donat.png" alt="Donasi Lancar" width={20} height={20}/>
            <span className="text-slate-400 font-medium">Donasi Lancar</span>
          </div>
        </div>
        
        {/* Tilt Image */}
        <TiltedImage />
      </section>

      {/* --- WELCOME NEW MEMBER SECTION --- */}
      {newMembers.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-12 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 animate-slide-up">
            <span className="text-zinc-600 text-center text-[9px] font-black tracking-[0.5em] uppercase mb-4 block">Welcome Our Newest Member</span>
            <div className="flex flex-wrap justify-center gap-4">
              {newMembers.map((m) => (
                <div key={m.tag} className="px-6 py-3 bg-zinc-900/30 border border-amber-500/20 rounded-2xl flex items-center gap-3 group hover:border-amber-500/50 transition-all">
                  <UserPlus className="text-amber-500 group-hover:scale-110 transition-transform" size={16} />
                  <div className="text-left">
                    <div className="text-sm font-black uppercase tracking-tighter">{m.name}</div>
                    <div className="text-[9px] text-zinc-500 font-bold uppercase italic">TH {m.townHallLevel} • Joined Recently</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Leaderboard Cards */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ScrollReveal delay={0.1} mobileDelay={0.1}>
          <LeaderboardCard title="Donation Kings" icon={<Image src="/Icon_HV_donate_Troops.png" alt="Donate" width={30} height={30} />} data={topDonators} dataKey="donations" suffix="Troops" />
        </ScrollReveal>
        <ScrollReveal delay={0.2} mobileDelay={0.1}>
          <LeaderboardCard title="Ranked Trophy" icon={<Image src="/Icon_HV_CWL_Champion_3.webp" alt="League" width={30} height={30} />} data={topLeagues} dataKey="trophies" suffix="Trophies" />
        </ScrollReveal>
        <div className="md:col-span-2 lg:col-span-1 md:w-1/2 lg:w-full md:justify-self-center">
          <ScrollReveal delay={0.3} mobileDelay={0.1}>
            <LeaderboardCard title="Most Active" icon={<Image src="/Building_HV_Clan_Castle_level_14.webp" alt="Request" width={30} height={30} />} data={topReceived} dataKey="donationsReceived" suffix="Reqs" />
          </ScrollReveal>
        </div>
      </div>

      {/* Clan Capital & War Status */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <ClanCapitalCard
          capitalLeagueName={clan.capitalLeague?.name}
          clanCapitalPoints={clan.clanCapitalPoints}
        />
        <WarStatusCard
          isWar={isWar}
          state={war?.state}
          opponentName={war?.opponent.name}
          opponentBadgeUrl={war?.opponent.badgeUrls.medium}
          clanStars={war?.clan.stars}
          opponentStars={war?.opponent.stars}
          clanAttacks={war?.clan.attacks}
          totalAttacks={war ? war.teamSize * 2 : 0}
        />
      </div>

      <WarTestimonial warLog={warLog} />

      {/* Hall of Fame */}
      <HallOfFame isWar={isWar} war={war} />

      {/* War Testimonials - War Chronicles */}


      {/* 2. Footer Component */}
      <Footer clan={clan} />

    </main>
  );
}