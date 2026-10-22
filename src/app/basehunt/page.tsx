import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BasehuntSearch from "@/components/BasehuntSearch";
import { getClanData } from "@/lib/coc";

export const metadata: Metadata = {
  title: "Basehunt",
  description: "Temukan layout Clash of Clans yang mirip dengan screenshot base kamu.",
};

export default async function BasehuntPage() {
  let clan;
  try {
    clan = await getClanData();
  } catch (error) {
    console.error("Failed to load clan data for the Basehunt footer.", error);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] font-poppins text-zinc-100 selection:bg-amber-500 selection:text-black">
      <Navbar clanName="AAA GANG" badge="/badge_clan.webp" />
      <BasehuntSearch />
      <Footer clan={clan ?? { name: "AAA GANG", tag: "#Q9YY02J9" }} />
    </main>
  );
}
