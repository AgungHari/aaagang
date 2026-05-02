import Script from 'next/script';

export default function GoogleAdSense() {
  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  // Mencegah error jika ID belum diset di .env
  if (!adSenseId) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`} 
      crossOrigin="anonymous"
    />
  );
}