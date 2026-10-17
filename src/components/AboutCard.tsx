import type { Icon } from "@phosphor-icons/react";

interface AboutCardProps {
  icon: Icon;
  title: string;
  description: string;
}

export const AboutCard = ({ icon: IconComponent, title, description }: AboutCardProps) => (
  <article className="group relative h-full overflow-hidden rounded-[2rem] border border-zinc-800/60 bg-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-[0_20px_60px_-30px_rgba(245,158,11,0.2)] sm:p-8">
    <div className="pointer-events-none absolute -right-12 -top-16 size-40 rounded-full bg-amber-500/[0.04] blur-3xl transition-colors group-hover:bg-amber-500/[0.09]" />
    <div className="relative">
      <div className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/[0.08] text-amber-400 shadow-inner shadow-amber-500/5 transition-all duration-300 group-hover:scale-105 group-hover:border-amber-400/40 group-hover:bg-amber-500/15">
        <IconComponent size={28} weight="duotone" />
      </div>
      <h3 className="mb-3 text-lg font-black uppercase italic tracking-tight text-zinc-100 transition-colors group-hover:text-amber-200 sm:text-xl">
        {title}
      </h3>
      <p className="text-sm leading-7 text-zinc-400">{description}</p>
    </div>
  </article>
);