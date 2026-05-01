'use client';

import CookieConsent from 'react-cookie-consent';

export default function CookieConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Terima"
      enableDeclineButton
      declineButtonText="Tolak"
      cookieName="AAA_GANG_COOKIE_CONSENT"
      // Menggunakan disableStyles agar kita bisa pakai Tailwind murni
      disableStyles={true}
      // Container dengan Zinc-900 transparansi 20% + Blur
      containerClasses="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-md bg-zinc-900/20 backdrop-blur-md text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-2xl flex flex-col gap-4 z-[9999]"
      contentClasses="text-sm leading-relaxed"
      buttonWrapperClasses="flex items-center gap-3 justify-end"
      // Styling tombol Terima (Amber/Gold sesuai selera klan)
      buttonClasses="bg-amber-500 hover:bg-amber-600 text-zinc-900 px-5 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
      // Styling tombol Tolak
      declineButtonClasses="text-zinc-400 hover:text-zinc-100 px-4 py-2 text-sm font-medium transition-colors"
      expires={365}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">🍪</span>
        <p>
          Kami menggunakan cookies untuk meningkatkan pengalaman di 
          <span className="font-bold text-amber-500"> 3agang.pro</span>.
        </p>
      </div>
    </CookieConsent>
  );
}