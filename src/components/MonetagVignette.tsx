import Script from 'next/script';

export default function MonetagVignette() {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <Script
      id="monetag-vignette"
      src="https://n6wxm.com/vignette.min.js"
      data-zone="12050439"
      strategy="afterInteractive"
    />
  );
}
