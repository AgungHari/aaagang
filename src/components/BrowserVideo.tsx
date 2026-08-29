'use client';

import { useEffect, useState } from 'react';

type BrowserVideoProps = {
    className?: string;
    src: string;
    safariSrc: string;
};

export default function BrowserVideo({
    className,
    src,
    safariSrc,
}: BrowserVideoProps) {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);

    useEffect(() => {
        const userAgent = navigator.userAgent;
        const isSafari = /Safari/i.test(userAgent) &&
            !/Chrome|CriOS|FxiOS|Edg/i.test(userAgent);

        setVideoSrc(isSafari ? safariSrc : src);
    }, [safariSrc, src]);

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
