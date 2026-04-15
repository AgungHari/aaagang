interface SectionDividerProps {
  label: string;
}

export const SectionDivider = ({ label }: SectionDividerProps) => {
  return (
    <div className="flex items-center gap-4 mb-8 mt-14">
      {/* Garis Kiri */}
      <div className="h-px flex-1 bg-zinc-800/50"></div>
      
      {/* Label Tengah */}
      <span className="text-[10px] font-black tracking-[0.5em] text-zinc-600 uppercase whitespace-nowrap px-2">
        {label}
      </span>
      
      {/* Garis Kanan */}
      <div className="h-px flex-1 bg-zinc-800/50"></div>
    </div>
  );
};