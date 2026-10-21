'use client';

import { useEffect, useState } from 'react';

type BrowserVideoProps = {
    className?: string;
    controls?: boolean;
    src: string;
    safariSrc: string;
};

export default function BrowserVideo({
    className,
    controls = false,
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
            controls={controls}
            className={className}
        />
    );
}
