import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WarLogFilter from "@/components/WarLogFilter";
import { getWarLog, getClanData } from "@/lib/coc";
import { Users, Skull } from "lucide-react";

export const revalidate = 43200; // 12 hours

interface WarLogResponse {
  items: Array<{
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
  }>;
}

type War = WarLogResponse['items'][number];

export default async function WarLogPage() {
  const [clan, warLog] = await Promise.all([getClanData(), getWarLog()]);

  if (!clan || !warLog) {
    return (
      <div className="text-white text-center py-20 font-black tracking-tighter text-5xl">
        DATABASE ERROR... <br />
        FAILED TO LOAD WAR LOG!
      </div>
    );
  }

  const wars = (warLog as WarLogResponse).items || [];
  const validWars = wars.filter((w) => w.clan && w.opponent);

  // Serialize wars ke plain objects untuk Client Component
  const serializedWars = JSON.parse(JSON.stringify(validWars));

  // Calculate total experience
  const totalExpEarned = serializedWars.reduce((sum: number, w: War) => sum + (w.clan.expEarned || 0), 0);

  return (
    <main className="min-h-screen text-zinc-100 selection:bg-amber-500 selection:text-black overflow-x-hidden font-sans">
      {/* Navbar */}
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 md:px-16 lg:px-24 xl:px-32 pt-24 ">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 animate-slide-up"><Skull size={12} /> Arsip Pembantaian</div>
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-5xl md:text-7xl italic uppercase animate-slide-up" style={{ fontFamily: "'Docallisme', sans-serif" }} >
            War <span className="text-amber-500">History</span>
          </h1>
        </div>

        <p className="text-center text-slate-300 max-w-2xl mb-12 font-poppins animate-slide-up">
          Arsip pembantaian AAA GANG tersimpan abadi sejak era keemasan. Data sebelumnya telah menjadi sejarah yang tak tertulis. <br /> <span className="text-xs text-zinc-600">(Limitasi API Supercell: Data War Log AAA GANG hanya ter-index secara publik mulai tahun 2020.)</span>
        </p>
      </section>

      {/* War Log Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="mb-8 animate-slide-up">
          <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.5em] mb-2">
            Total Experience
          </p>
          <div className="text-3xl font-black text-amber-500">
            {totalExpEarned.toLocaleString()} XP
          </div>
        </div>

        {serializedWars.length > 0 ? (
          <div className="animate-slide-up">
            <WarLogFilter wars={serializedWars} />
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-500 font-bold">No war log data available</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer clan={clan} />
    </main>
  );
}