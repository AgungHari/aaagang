'use client';

import { useEffect, useState } from 'react';

type BrowserVideoProps = {
    className?: string;
};

export default function BrowserVideo({ className }: BrowserVideoProps) {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);

    useEffect(() => {
        const userAgent = navigator.userAgent;
        const isSafari = /Safari/i.test(userAgent) &&
            !/Chrome|CriOS|FxiOS|Edg/i.test(userAgent);

        setVideoSrc(isSafari ? '/About_Safari.mov' : '/About_Main.webm');
    }, []);

    return (
        <video
            src={videoSrc ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            className={className}
        />
    );
}
