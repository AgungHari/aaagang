import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import BasehuntSearch from "@/components/BasehuntSearch";

export const metadata: Metadata = {
  title: "Basehunt",
  description: "Temukan layout Clash of Clans yang mirip dengan screenshot base kamu.",
};

export default function BasehuntPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] font-poppins text-zinc-100 selection:bg-amber-500 selection:text-black">
      <Navbar clanName="AAA GANG" badge="/badge_clan.webp" />
      <BasehuntSearch />
    </main>
  );
}
