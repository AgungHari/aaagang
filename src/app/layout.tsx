import type { Metadata } from "next";
import ConsoleLogger from "@/components/ConsoleLogger";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import GoogleAdSense from "@/components/GoogleAdSense";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://3agang.pro"),
  title: {
    default: "AAA GANG - Clash Of Clans",
    template: "%s | AAA GANG" 
  },
  description: "Clan ini adalah clan yang diramalkan akan menjadi clan terkuat! Donasi lancar jaya, always war walaupun kalah wkwkk ayo sokin sini. Semua TH bisa join dan wajib saling respect!",
  keywords: ["AAA GANG", "Clash of Clans Indonesia", "CoC Clan Dashboard", "AAA GANG Stats", "Open Member Clan Indonesia", "Website Clan indonesia"],
  openGraph: {
    title: "AAA GANG - Clash Of Clans",
    description: "Official Website for AAA GANG Clan. Cek donasi dan status war kami secara real-time!",
    url: "https://3agang.pro", 
    siteName: "AAA GANG",
    images: [
      {
        url: "/apple-touch-icon.png", 
        width: 800,
        height: 600,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AAA GANG - Clash Of Clans",
    description: "Statistik real-time klan AAA GANG",
    images: ["/apple-touch-icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col relative bg-[#050505] text-white">
        <GoogleAnalytics />
        <GoogleAdSense />
        <div className="absolute inset-x-0 top-0 h-full overflow-hidden pointer-events-none -z-10">
          
          {/* Lampu 1 */}
          <div 
            className="absolute 
              top-25 right-50 w-[80vw] h-[80vw] blur-[70px] opacity-25 
              

              md:-top-5 md:left-10 md:w-[50vw] md:h-[50vw] md:blur-[80px] md:opacity-25
              
              lg:top-0 lg:left-16 lg:w-[45vw] lg:h-[45vw] lg:blur-[90px] lg:opacity-25
              
              xl:top-0 xl:left-30 xl:w-[30vw] xl:h-[30vw] xl:blur-[100px] xl:opacity-20 
              
              rounded-full"
            style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
          />
          <div 
            className="absolute top-50 -right-70 w-[30vw] h-[30vw] rounded-full blur-[120px] opacity-20"
            style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
          />
          
          {/* Lampu 2 */}
          {/* <div 
            className="absolute top-[60%] -left-[10%] w-[30vw] h-[30vw] rounded-full blur-[100px] opacity-15"
            style={{ background: 'radial-gradient(circle, #d97706 0%, transparent 70%)' }}
          /> */}

          <div 
            className="absolute top-[30%] left-[10%] w-[30vw] h-[30vw] rounded-full blur-[100px] opacity-15"
            style={{ background: 'radial-gradient(circle, #d97706 0%, transparent 70%)' }}
          />
          <div 
            className="absolute top-[47%] right-[20%] w-[20vw] h-[20vw] rounded-full blur-[100px] opacity-15"
            style={{ background: 'radial-gradient(circle, #d97706 0%, transparent 70%)' }}
          />
          
        </div>
        {/* -------------------------------------------- */}

        <ConsoleLogger />
        <main className="relative z-10 flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}