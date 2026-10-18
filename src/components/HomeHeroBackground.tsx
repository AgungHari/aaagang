'use client';

import { useEffect, useState } from 'react';

export default function HomeHeroBackground() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isSafari =
      /Safari/i.test(userAgent) &&
      !/Chrome|CriOS|FxiOS|Edg/i.test(userAgent);

    setVideoSrc(
      isSafari ? '/herovideo_apple.mov' : '/herovideo_default.webm',
    );
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[280px] -z-20 overflow-hidden">
      <video
        src={videoSrc ?? undefined}
        aria-hidden="true"
        tabIndex={-1}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 size-full object-cover object-center opacity-45"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0.4)_58%,#050505_100%)]" />
    </div>
  );
}
