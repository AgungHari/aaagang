interface TimelineItemProps {
  year: string;
  text: string;
  index: number;
}

export const TimelineItem = ({ year, text, index }: TimelineItemProps) => (
  <article className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-3 md:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] md:gap-0">
    <div className="z-10 col-start-1 row-start-1 flex justify-center md:col-start-2">
      <span className="flex size-5 items-center justify-center rounded-full border border-amber-500/40 bg-[#050505] shadow-[0_0_20px_rgba(245,158,11,0.14)] transition-all duration-300">
        <span className="size-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
      </span>
    </div>

    <div
      className={`group relative col-start-2 row-start-1 overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-amber-950/20 via-[#050505]/80 to-[#050505] p-5 transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_16px_50px_-32px_rgba(245,158,11,0.35)] sm:p-6 ${index % 2 === 0 ? "md:col-start-1" : "md:col-start-3"}`}
    >
      <div className="pointer-events-none absolute -right-3 -top-8 select-none font-black leading-none text-amber-500/[0.045] transition-colors duration-300 group-hover:text-amber-500/[0.09]">
        <span className="text-7xl sm:text-8xl">{year}</span>
      </div>
      <div className="pointer-events-none absolute inset-y-5 left-0 w-px bg-gradient-to-b from-transparent via-amber-500/50 to-transparent opacity-70 transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-[9px] font-black uppercase tracking-[0.24em] text-zinc-600">
            Chapter {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px w-6 bg-amber-500/40" />
          <h3 className="text-lg font-black tracking-tight text-amber-400 sm:text-xl">
            {year}
          </h3>
        </div>
        <p className="max-w-prose text-sm leading-7 text-zinc-400 transition-colors group-hover:text-zinc-200">
          {text}
        </p>
      </div>
    </div>
  </article>
);
