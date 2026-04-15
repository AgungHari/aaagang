import { Medal, Users, Sword, Coffee, GitFork } from "lucide-react"; // Tambahin Github disini

interface FooterProps {
  clan: any;
}

export default function Footer({ clan }: FooterProps) {
  return (
    <footer className="mt-32 border-t border-zinc-900/50 bg-[#030303] relative overflow-hidden">
      <img 
        src="/badge_clan_medium.webp"
        alt="" 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] opacity-[0.02] grayscale pointer-events-none" 
      />
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 mb-16">
          <FooterStat label="Clan Level" value={clan.clanLevel} icon={<Medal size={14} className="text-amber-500/50" />} />
          <FooterStat label="Strategic Assets" value={`${clan.members}/50`} icon={<Users size={14} className="text-amber-500/50" />} />
          <FooterStat label="Battle Wins" value={clan.warWins} icon={<Sword size={14} className="text-amber-500/50" />} />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-zinc-800/50 pt-10 gap-8">
          
          {/* Bagian Kiri: Clan Info Tetap Aman */}
          <div className="flex items-center gap-3">
            <img src="/badge_clan.webp" alt="Badge" className="w-6 h-6 grayscale opacity-30" />
            <div className="text-left">
              <div className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase italic leading-none">{clan.name}</div>
              <div className="text-[7px] text-zinc-700 font-bold uppercase tracking-widest mt-1">Clan Tag: {clan.tag}</div>
            </div>
          </div>

          {/* Bagian Kanan: EST Info + Action Buttons Ditumpuk */}
          <div className="flex flex-col items-center md:items-end gap-4 mt-4 md:mt-0">
            <div className="text-[9px] text-zinc-700 font-bold tracking-[0.5em] uppercase text-center md:text-right">
               EST. 2016 • ANAK ANAK ANJING (AAA) • INDONESIA
            </div>
            
            {/* Grup Tombol */}
            <div className="flex flex-row items-center gap-2">
              {/* Tombol Ko-fi */}
              <a 
                href="https://ko-fi.com/oxy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3 py-1.5 border border-zinc-800/40 hover:border-[#29abe0]/40 hover:bg-[#29abe0]/5 rounded transition-all w-fit"
              >
                <Coffee size={10} className="text-zinc-600 group-hover:text-[#29abe0] transition-colors" />
                <span className="text-[7px] font-black tracking-[0.3em] text-zinc-600 uppercase group-hover:text-[#29abe0] transition-colors">
                  Buy me a coffee
                </span>
              </a>

              {/* Tombol GitHub */}
              <a 
                href="https://github.com/AgungHari/aaagang" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3 py-1.5 border border-zinc-800/40 hover:border-zinc-500/40 hover:bg-zinc-800/50 rounded transition-all w-fit"
              >
                <GitFork size={10} className="text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                <span className="text-[7px] font-black tracking-[0.3em] text-zinc-600 uppercase group-hover:text-zinc-300 transition-colors">
                  Fork
                </span>
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
}

function FooterStat({ label, value, icon }: { label: string, value: any, icon?: React.ReactNode }) {
  return (
    <div className="text-center group">
      <div className="flex items-center justify-center gap-2 mb-1">
        {icon}
        <div className="text-2xl font-black text-zinc-300 italic group-hover:text-amber-500 transition-colors">{value}</div>
      </div>
      <div className="text-[8px] text-zinc-600 uppercase tracking-[0.4em] font-black">{label}</div>
    </div>
  );
}