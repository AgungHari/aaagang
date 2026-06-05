interface SectionTitleProps {
  text1: string;
  text2: string;
  text3: string;
}

export default function SectionTitle({ text1, text2, text3 }: SectionTitleProps) {
  return (
    <div className="relative flex flex-col items-center justify-center text-center mb-8">
      <span className="text-zinc-600 text-center text-[9px] font-black tracking-[0.5em] uppercase mb-4">
        {text1}
      </span>
      <h2 className="text-4xl md:text-5xl mb-4 max-w-2xl" style={{ fontFamily: "'Docallisme', sans-serif" }}>
        {text2}
      </h2>
      <p className="text-center text-slate-400 max-w-2xl text-sm">
        {text3}
      </p>
    </div>
  );
}
