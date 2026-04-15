import { LucideIcon } from "lucide-react";

interface AboutCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const AboutCard = ({ icon: Icon, title, description }: AboutCardProps) => (
  <div className="p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] hover:border-amber-500/30 transition-all group">
    <Icon className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
    <h3 className="text-xl font-black italic uppercase mb-2">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
  </div>
);