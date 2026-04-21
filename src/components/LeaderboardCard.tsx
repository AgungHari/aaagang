import { Crown } from "lucide-react";

interface Member {
  tag: string;
  name: string;
  townHallLevel: number;
  [key: string]: any;
}

interface LeaderboardCardProps {
  title: string;
  icon: React.ReactNode;
  data: Member[];
  dataKey: string;
  suffix: string;
}

export default function LeaderboardCard({ 
  title, 
  icon, 
  data, 
  dataKey, 
  suffix 
}: LeaderboardCardProps) {
  return (
    <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] p-8 hover:border-zinc-700 transition-all group shadow-2xl">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800">{icon}</div>
        <h3 className="text-xl font-black italic uppercase tracking-tighter">{title}</h3>
      </div>
      <div className="space-y-6">
        {data.map((member: Member, index: number) => (
          <div key={member.tag} className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <span className={`text-2xl font-black italic ${index === 0 ? 'text-amber-500' : 'text-zinc-800'}`}>0{index + 1}</span>
              <div>
                <div className="text-sm font-black uppercase tracking-tight flex items-center gap-2 leading-none">
                  {member.name} {index === 0 && <Crown size={12} className="text-amber-500" />}
                </div>
                <div className="text-[9px] text-zinc-600 font-bold uppercase mt-1">TH {member.townHallLevel}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-zinc-300 leading-none">{member[dataKey].toLocaleString()}</div>
              <div className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest mt-1">{suffix}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
