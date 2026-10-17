interface SectionDividerProps {
  label: string;
}

export const SectionDivider = ({ label }: SectionDividerProps) => {
  return (
    <div className="mb-7 mt-16 flex items-center gap-4 sm:mb-9 sm:mt-20">
      <span className="h-8 w-1 rounded-full bg-amber-500" />
      <span className="whitespace-nowrap text-xs font-black uppercase tracking-[0.24em] text-zinc-200 sm:text-sm">
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-zinc-700/80 to-transparent" />
    </div>
  );
};