import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AAA GANG - Clash Of Clans",
    template: "%s | AAA GANG" 
  },
  description: "Clan ini adalah clan yang diramalkan akan menjadi clan terkuat! Donasi lancar jaya, always war walaupun kalah wkwkk ayo sokin sini. Semua TH bisa join dan wajib saling respect!",
  keywords: ["AAA GANG", "Clash of Clans Indonesia", "CoC Clan Dashboard", "AAA GANG Stats", "Open Member Clan Indonesia", "Website Clan indonesia"],
  openGraph: {
    title: "AAA GANG - Clash Of Clans",
    description: "Official Website for AAA GANG Clan. Cek donasi dan status war kami secara real-time!",
    url: "https://3agang.pro", // Ganti kalau sudah deploy 
    siteName: "AAA GANG",
    images: [
      {
        url: "/apple-touch-icon.png", // Pakai icon klan gahar kamu tadi
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
