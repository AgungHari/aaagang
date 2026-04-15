export const TimelineItem = ({ year, text }: { year: string; text: string }) => (
  <div>
    <span className="block text-amber-500 font-black uppercase text-[10px] mb-1 tracking-widest">{year}</span>
    <p className="text-zinc-400 text-sm leading-relaxed">{text}</p>
  </div>
);