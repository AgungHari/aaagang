"use client";

import BrowserVideo from "@/components/BrowserVideo";
import ScrollReveal from "@/components/ScrollReveal";

interface FeatureTutorialVideoProps {
  title: string;
  src: string;
  safariSrc: string;
  className?: string;
}

export default function FeatureTutorialVideo({
  title,
  src,
  safariSrc,
  className = "",
}: FeatureTutorialVideoProps) {
  return (
    <ScrollReveal delay={0.1}>
      <section
        aria-label={title}
        className={`mx-auto mb-8 w-full max-w-4xl rounded-[2rem] border border-zinc-900/50 bg-zinc-900/20 p-4 shadow-2xl backdrop-blur-sm transition-colors duration-300 hover:border-zinc-800 ${className}`}
      >
        <div className="mb-3 flex items-center gap-2 px-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <span className="size-2 animate-pulse rounded-full bg-amber-500" />
          {title}
        </div>

        <div className="relative aspect-video overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950 shadow-inner">
          <BrowserVideo
            src={src}
            safariSrc={safariSrc}
            className="h-full w-full object-cover"
          />
        </div>
      </section>
    </ScrollReveal>
  );
}
