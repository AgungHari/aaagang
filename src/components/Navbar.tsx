'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Timer, Handshake, Shield, Brain, Sigma, Search, User, Users, Import, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});
// suksma gemini pro 3.1
export default function Navbar({ clanName, badge }: { clanName: string, badge: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Personel", href: "/members" },
    { name: "About Us", href: "/tentang" },
    { name: "War Log", href: "/warlog" },
    { name: "News", href: "/news" },
  ];

  const featureLinks = [
    { name: "Base Layouts", href: "/layout", disabled: false, icon: Import, description: "Explore & Import base layouts", image: "/BattleCopter_Boat_Pose01_NoShadow.webp" },
    { name: "Player Search", href: "/search", disabled: false, icon: User, description: "Cari & Stalk players", image: "/GW_DarkDays_f22_2k_V2.webp" },
    { name: "Clan Search", href: "/clansearch", disabled: true, icon: Users, description: "Cari & Stalk clans", image: "/BK_DE_Pose02_NoShadows.webp" },
    { name: "Attack Coaching", href: "/coaching", disabled: true, icon: Brain, description: "Attack Pathing Berbasis AI", image: "/Hero_Equipment_BK_Barbarian_Puppet.webp" },
    { name: "Deffend Analysis", href: "/deffendanalysis", disabled: true, icon: Shield, description: "Analisa Defffense Berbasis AI", image: "/Building_HV_Clan_Castle_level_14.webp" },
    { name: "CWL Live Reports", href: "/cwlsearch", disabled: true, icon: Trophy, description: "Live Report CWL", image: "/Icon_HV_CWL_Champion_3.webp" },
    { name: "Friendly Wars", href: "/friendlywars", disabled: true, icon: Handshake, description: "Tantangan Friendly Wars", image: "/Hero_Equipment_AQ_WWEActionFigure.webp" },
    { name: "More Feature..", href: "/comingsoon", disabled: true, icon: Timer, description: "Tantangan Friendly Wars", image: "/Hero_Pet_HV_Mighty_Yak_1_grass.webp" },
  ];

  return (
    <>
      {/* 1. CONTAINER UTAMA - Pindahkan posisi fixed dan backdrop-blur ke sini, Agung : Suksma Gemmini anjay */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-[999] w-full backdrop-blur-xl transition-colors duration-300 ${
          isDropdownOpen ? 'border-b border-zinc-800/50 bg-black/10' : 'border-transparent bg-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
      >
        
        {/* 2. NAVBAR CONTENT - Hapus class fixed dan backdrop dari sini, biarkan fleksibel */}
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
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1 text-xs font-semibold tracking-[0.1em] transition-all hover:text-amber-500 ${featureLinks.some(link => pathname === link.href) ? 'text-amber-500' : 'text-zinc-400'}`}
              >
                Features
                <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/sigma" className={`hidden lg:flex items-center gap-2 px-6 py-2.5 font-400 text-xs tracking-[0.1em] transition-all rounded rounded-tl-3xl rounded-br-3xl rounded-bl-3xl ${poppins.className} ${pathname === '/sigma' ? 'border-2 border-amber-500 text-amber-500 hover:bg-amber-600/10' : 'border-1 border-zinc-800/70 bg-zinc-900/90 hover:bg-amber-700 text-white'}`}>
              <Sigma size={14}/>
              <span>Ask Sigma</span>
            </Link>

            <button onClick={() => setIsOpen(true)} className="lg:hidden text-amber-500 p-2 hover:bg-amber-500/10 rounded transition">
              <Menu size={26} className="active:scale-90 transition" />
            </button>
          </div>
        </nav>

        {/* 3. MEGA MENU CONTENT - Berada di dalam Header, menggunakan CSS Grid untuk animasi buka/tutup */}
        <div className={`w-full transition-all duration-300 ease-in-out grid ${
          isDropdownOpen ? 'grid-rows-[1fr] opacity-100 visible pointer-events-auto' : 'grid-rows-[0fr] opacity-0 invisible pointer-events-none'
        }`}>
          <div className="overflow-hidden">
            <div className="max-w-full px-6 md:px-16 lg:px-24 xl:px-32 pb-8 pt-4">
              
              {/* Title Section */}
              <div className="mb-8 pb-6 border-b border-zinc-800/50">
                <h3 className="text-lg font-bold text-white mb-1">Explore Features</h3>
                <p className="text-zinc-400 text-sm">Nikmati Fitur Unggulan Kami</p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {featureLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.disabled ? "#" : link.href}
                      onClick={(e) => {
                        if (link.disabled) e.preventDefault();
                        else setIsDropdownOpen(false);
                      }}
                      className={`group relative p-4 rounded-xl transition-all drop-shadow duration-300 overflow-hidden ${link.disabled ? 'bg-zinc-900/30 opacity-50 cursor-not-allowed' : pathname === link.href ? 'bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30' : 'bg-zinc-900/50 border border-zinc-800/30 hover:bg-zinc-800/70 hover:border-amber-500/30'}`}
                    >
                      {link.image && (
                        <img 
                          src={link.image} 
                          alt={link.name}
                          className="absolute -right-6 -bottom-6 size-40 opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700 -rotate-12 pointer-events-none"
                        />
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

              {/* Footer Section */}
              <div className="mt-6 pt-6 border-t border-zinc-800/50">
                <p className="text-xs text-zinc-500">
                  Need help? <Link href="/contact" className="text-amber-500 hover:text-amber-400 transition">Contact us</Link> or check the <Link href="/faq" className="text-amber-500 hover:text-amber-400 transition">FAQ</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu */}
      <div className={`
        fixed inset-0 z-998 bg-black/40 backdrop-blur-xl flex flex-col items-center justify-center text-lg gap-8 lg:hidden transition-transform duration-300 overflow-hidden ${poppins.className}
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className={`text-sm font-semibold transition-colors ${
              pathname === link.href ? 'text-amber-500' : 'text-zinc-400 hover:text-amber-500'
            }`}
          >
            {link.name}
          </Link>
        ))}

        {/* Features Section - Direct Display */}
        <div className="flex flex-col items-center gap-4 pt-4 border-t border-zinc-700 w-full px-6">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Features</span>
          {featureLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.disabled ? "#" : link.href}
                onClick={(e) => {
                  if (link.disabled) {
                    e.preventDefault();
                  } else {
                    setIsOpen(false);
                  }
                }}
                className={`w-full p-4 rounded-xl transition-all flex items-center gap-3 ${
                  link.disabled
                    ? 'text-zinc-600 opacity-50 cursor-not-allowed bg-zinc-900/20'
                    : pathname === link.href
                    ? 'text-amber-500 bg-amber-500/10 border border-amber-500/30'
                    : 'text-zinc-400 hover:text-amber-500 hover:bg-zinc-800/50'
                }`}
              >
                <IconComponent size={18} />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{link.name}</span>
                  <span className="text-xs opacity-70">{link.description}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <button 
          onClick={() => setIsOpen(false)} 
          className="active:ring-2 active:ring-amber-500 aspect-square size-10 p-1 items-center justify-center bg-amber-600 hover:bg-amber-700 transition text-white rounded-md flex mt-4"
        >
          <X size={24} />
        </button>
      </div>
    </>
  );
}