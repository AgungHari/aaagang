'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Handshake, Shield, Sigma, User, Users, Import, Trophy, Sword, ClipboardPenLine, Newspaper, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

export default function Navbar({ clanName, badge }: { clanName: string, badge: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"features" | "news" | null>(null);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Personel", href: "/members" },
    { name: "About Us", href: "/tentang" },
    { name: "War Log", href: "/warlog" },
  ];

  const featureLinks = [
    { name: "Base Layouts", href: "/layout", disabled: false, icon: Import, description: "Explore & Import base layouts", image: "/BattleCopter_Boat_Pose01_NoShadow.webp" },
    { name: "Player Search", href: "/search", disabled: false, icon: User, description: "Cari & Stalk players", image: "/GW_DarkDays_f22_2k_V2.webp" },
    { name: "Clan Search", href: "/clansearch", disabled: false, icon: Users, description: "Cari & Stalk clans", image: "/BK_DE_Pose02_NoShadows.webp" },
    { name: "Live War Status", href: "/livewarstatus", disabled: false, icon: Sword, description: "Statistik War Live", image: "/Icon_HV_CWL_Silver_13.webp" },
    { name: "CWL Live Reports", href: "/livecwlstatus", disabled: false, icon: ClipboardPenLine, description: "Live Report CWL", image: "/Icon_HV_CWL_Champion_3.webp" }, 
    { name: "Deffend Analysis", href: "/deffendanalysis", disabled: true, icon: Shield, description: "Analisa Defffense Berbasis AI", image: "/Hero_Pet_HV_Angry_Jelly_05.webp" },
    { name: "Attack Coaching", href: "/cwlsearch", disabled: true, icon: Trophy, description: "Attack Pathing Berbasis AI", image: "/Super_Troop_Super_Wizard_2.webp" },
    { name: "Friendly Wars", href: "/friendlywars", disabled: true, icon: Handshake, description: "Tantangan Friendly Wars", image: "/Troop_BB_Raged_Barbarian_no_grass.webp" },
  ];

  const newsLinks = [
    { name: "Latest News", href: "/news", disabled: false, icon: Newspaper, description: "Berita terbaru Clash of Clans", image: "/Decoration_BB_Ancient_Barbarian_Statue.webp" },
    { name: "Clash Wiki", href: "#", disabled: true, icon: BookOpen, description: "Panduan dan informasi Clash of Clans", image: "/quest_bookofcards.webp" },
  ];

  return (
    <>
      {/* 1. HEADER UTAMA DESKTOP */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-[999] w-full backdrop-blur-xl transition-colors duration-300 ${
          openDropdown ? 'border-b border-zinc-800/50 bg-black/10' : 'border-transparent bg-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
      >
        <nav className="w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition" style={{ fontFamily: "'Docallisme', sans-serif" }}>
            <img src={badge} alt="Badge" className="w-8 h-8 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          </Link>

          {/* Desktop Menu */}
          <div className={`hidden lg:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2 ${poppins.className}`}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`text-xs font-semibold tracking-[0.1em] transition-all ${pathname === link.href ? 'text-amber-500' : 'text-zinc-400 hover:text-amber-500'}`}>
                {link.name}
              </Link>
            ))}

            <div className="relative">
              <button
                onClick={() => setOpenDropdown((prev) => prev === "news" ? null : "news")}
                className={`flex items-center gap-1 text-xs font-semibold tracking-[0.1em] transition-all hover:text-amber-500 ${pathname === "/news" ? 'text-amber-500' : 'text-zinc-400'}`}
              >
                News
                <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === "news" ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenDropdown((prev) => prev === "features" ? null : "features")}
                className={`flex items-center gap-1 text-xs font-semibold tracking-[0.1em] transition-all hover:text-amber-500 ${featureLinks.some(link => pathname === link.href) ? 'text-amber-500' : 'text-zinc-400'}`}
              >
                Features
                <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === "features" ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right Side Desktop */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/sigma" className={`hidden lg:flex items-center gap-2 px-6 py-2.5 font-400 text-xs tracking-[0.1em] transition-all rounded rounded-tl-3xl rounded-br-3xl rounded-bl-3xl ${poppins.className} ${pathname === '/sigma' ? 'border-2 border-amber-500 text-amber-500 hover:bg-amber-600/10' : 'border-1 border-zinc-800/70 bg-zinc-900/90 hover:bg-amber-700 text-white'}`}>
              <Sigma size={14}/>
              <span>Ask Sigma</span>
            </Link>

            {/* Tombol Hamburger Mobile */}
            <button onClick={() => setIsOpen(true)} className="lg:hidden text-amber-500 p-2 hover:bg-amber-500/10 rounded transition">
              <Menu size={26} className="active:scale-90 transition" />
            </button>
          </div>
        </nav>

        {/* 2. MEGA MENU DESKTOP */}
        <div className={`w-full transition-all duration-300 ease-in-out grid ${
          openDropdown === "features" ? 'grid-rows-[1fr] opacity-100 visible pointer-events-auto' : 'grid-rows-[0fr] opacity-0 invisible pointer-events-none'
        }`}>
          <div className="overflow-hidden">
            <div className="max-w-full px-6 md:px-16 lg:px-24 xl:px-32 pb-8 pt-4">
              <div className="mb-8 pb-6 border-b border-zinc-800/50">
                <h3 className="text-lg font-bold text-white mb-1">Explore Features</h3>
                <p className="text-zinc-400 text-sm">Nikmati Fitur Unggulan Kami</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {featureLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.disabled ? "#" : link.href}
                      onClick={(e) => {
                        if (link.disabled) e.preventDefault();
                        else setOpenDropdown(null);
                      }}
                      className={`group relative p-4 rounded-xl transition-all drop-shadow duration-300 overflow-hidden ${link.disabled ? 'bg-zinc-900/30 opacity-50 cursor-not-allowed' : pathname === link.href ? 'bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30' : 'bg-zinc-900/50 border border-zinc-800/30 hover:bg-zinc-800/70 hover:border-amber-500/30'}`}
                    >
                      {link.image && (
                        <img src={link.image} alt={link.name} className="absolute -right-6 -top-2 size-30 opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700 pointer-events-none" />
                      )}
                      <div className="flex items-start gap-3 relative z-10">
                        <div className={`p-2.5 rounded-lg transition-all duration-300 flex-shrink-0 ${link.disabled ? 'bg-zinc-800/30' : pathname === link.href ? 'bg-amber-500/20 text-amber-500' : 'bg-zinc-800/50 text-zinc-400 group-hover:bg-amber-500/20 group-hover:text-amber-500'}`}>
                          <IconComponent size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-sm transition-colors ${link.disabled ? 'text-zinc-600' : pathname === link.href ? 'text-amber-500' : 'text-white group-hover:text-amber-500'}`}>{link.name}</h4>
                          <p className={`text-xs mt-0.5 transition-colors ${link.disabled ? 'text-zinc-700' : 'text-zinc-500 group-hover:text-zinc-400'}`}>{link.description}</p>
                          {link.disabled && <span className="text-xs text-zinc-600 font-medium mt-1.5 inline-block">Coming Soon</span>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-800/50">
                <p className="text-xs text-zinc-500">
                  Need help? <Link href="/contact" className="text-amber-500 hover:text-amber-400 transition">Contact us</Link> or check the <Link href="/faq" className="text-amber-500 hover:text-amber-400 transition">FAQ</Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NEWS MENU DESKTOP */}
        <div className={`w-full transition-all duration-300 ease-in-out grid ${
          openDropdown === "news" ? 'grid-rows-[1fr] opacity-100 visible pointer-events-auto' : 'grid-rows-[0fr] opacity-0 invisible pointer-events-none'
        }`}>
          <div className="overflow-hidden">
            <div className="max-w-full px-6 md:px-16 lg:px-24 xl:px-32 pb-8 pt-4">
              <div className="mb-8 pb-6 border-b border-zinc-800/50">
                <h3 className="text-lg font-bold text-white mb-1">News & Wiki</h3>
                <p className="text-zinc-400 text-sm">Berita dan pengetahuan Clash of Clans</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
                {newsLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.disabled ? "#" : link.href}
                      onClick={(event) => {
                        if (link.disabled) event.preventDefault();
                        else setOpenDropdown(null);
                      }}
                      className={`group relative p-4 rounded-xl transition-all duration-300 overflow-hidden ${link.disabled ? 'bg-zinc-900/30 opacity-50 cursor-not-allowed' : pathname === link.href ? 'bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30' : 'bg-zinc-900/50 border border-zinc-800/30 hover:bg-zinc-800/70 hover:border-amber-500/30'}`}
                    >
                      {link.image && (
                        <img src={link.image} alt={link.name} className="absolute -right-6 -top-2 size-30 opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700 pointer-events-none" />
                      )}
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-lg flex-shrink-0 ${link.disabled ? 'bg-zinc-800/30' : 'bg-zinc-800/50 text-zinc-400 group-hover:bg-amber-500/20 group-hover:text-amber-500'}`}>
                          <IconComponent size={20} />
                        </div>
                        <div>
                          <h4 className={`font-bold text-sm ${link.disabled ? 'text-zinc-600' : 'text-white group-hover:text-amber-500'}`}>{link.name}</h4>
                          <p className={`text-xs mt-0.5 ${link.disabled ? 'text-zinc-700' : 'text-zinc-500 group-hover:text-zinc-400'}`}>{link.description}</p>
                          {link.disabled && <span className="text-xs text-zinc-600 font-medium mt-1.5 inline-block">Coming Soon</span>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-800/50">
                <p className="text-xs text-zinc-500">
                  Need help? <Link href="/contact" className="text-amber-500 hover:text-amber-400 transition">Contact us</Link> or check the <Link href="/faq" className="text-amber-500 hover:text-amber-400 transition">FAQ</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* 3. MOBILE MENU OVERLAY */}
      <div 
        className={`fixed inset-0 z-[997] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* 4. MOBILE MENU (Udah pake Grid & bisa di-scroll) */}
      <div className={`
        fixed inset-0 z-[998] bg-black/80 backdrop-blur-xl flex flex-col pt-6 pb-12 overflow-y-auto lg:hidden transition-transform duration-300 ${poppins.className}
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Tombol Close di Atas Kanan */}
        <div className="w-full flex justify-end px-6 mb-20">
          {/* <button 
            onClick={() => setIsOpen(false)} 
            className="active:ring-2 active:ring-amber-500 aspect-square size-10 p-1 flex items-center justify-center bg-zinc-800/80 hover:bg-amber-600 transition text-white rounded-xl"
          >
          </button> */}
        </div>

        {/* Nav Links - Dijadikan tombol pil jejer */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 px-6 mb-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-sm font-semibold transition-colors px-4 py-2 rounded-full ${
                pathname === link.href 
                  ? 'text-amber-500 bg-amber-500/10' 
                  : 'text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        {/* News Section */}
        <div className="flex flex-col w-full px-4 mb-8">
          <div className="flex items-center justify-center mb-5">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
              News & Wiki
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {newsLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.disabled ? "#" : link.href}
                  onClick={(event) => {
                    if (link.disabled) event.preventDefault();
                    else setIsOpen(false);
                  }}
                  className={`w-full p-4 rounded-2xl transition-all flex flex-col items-center justify-center gap-3 text-center ${
                    link.disabled
                      ? 'text-zinc-600 opacity-50 cursor-not-allowed bg-zinc-900/40 border border-zinc-800/50'
                      : pathname === link.href
                      ? 'text-amber-500 bg-amber-500/10 border border-amber-500/30'
                      : 'text-zinc-400 bg-zinc-900/40 border border-zinc-800/50 hover:text-amber-500 hover:border-amber-500/30'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${link.disabled ? 'bg-zinc-800/30' : 'bg-zinc-800/60 text-zinc-300'}`}>
                    <IconComponent size={22} />
                  </div>
                  <span className="font-semibold text-xs leading-tight">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Features Section - Grid 2 Kolom */}
        <div className="flex flex-col w-full px-4 flex-1">
          <div className="flex items-center justify-center mb-5">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
               Features
             </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pb-8">
            {featureLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.disabled ? "#" : link.href}
                  onClick={(e) => {
                    if (link.disabled) e.preventDefault();
                    else setIsOpen(false);
                  }}
                  className={`w-full p-4 rounded-2xl transition-all flex flex-col items-center justify-center gap-3 text-center ${
                    link.disabled
                      ? 'text-zinc-600 opacity-50 cursor-not-allowed bg-zinc-900/40 border border-zinc-800/50'
                      : pathname === link.href
                      ? 'text-amber-500 bg-amber-500/10 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                      : 'text-zinc-400 bg-zinc-900/40 border border-zinc-800/50 hover:text-amber-500 hover:border-amber-500/30'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${
                    link.disabled 
                      ? 'bg-zinc-800/30' 
                      : pathname === link.href 
                      ? 'bg-amber-500/20 text-amber-500' 
                      : 'bg-zinc-800/60 text-zinc-300'
                  }`}>
                    <IconComponent size={22} />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-xs leading-tight mb-1">{link.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}