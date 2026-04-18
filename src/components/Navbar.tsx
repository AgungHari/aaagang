'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Poppins } from "next/font/google";
import { Sigma } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

export default function Navbar({ clanName, badge }: { clanName: string, badge: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Personel", href: "/members" },
    { name: "About Us", href: "/tentang" },
    { name: "Chat", href: "/kontak" },
  ];

  return (
    <>
      <motion.nav 
        className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur bg-black/20"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
      >
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <img 
            src={badge} 
            alt="Badge" 
            className="w-8 h-8 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
          />
          <span className="font-black text-xl tracking-tighter text-amber-500 hidden sm:inline">
            {clanName}
          </span>
        </Link>

        {/* Desktop Menu - Centered */}
        <div className={`hidden md:flex items-center gap-6 transition duration-500 absolute left-1/2 transform -translate-x-1/2 ${poppins.className}`}>
          {navLinks.slice(0, -1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-semibold tracking-[0.1em] transition-all ${
                pathname === link.href
                  ? 'text-amber-500'
                  : 'text-zinc-400 hover:text-amber-500'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side - CTA and Mobile Menu */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Let's Talk Button - Desktop */}
          <Link
            href="/kontak"
            className={`hidden md:flex items-center gap-2 px-6 py-2.5 font-400 text-xs tracking-[0.1em] transition-all rounded-full ${poppins.className} ${
              pathname === '/kontak'
                ? 'border-2 border-amber-500 text-amber-500 hover:bg-amber-600/10'
                : 'bg-zinc-800 hover:bg-amber-500 text-white'
            }`}
          >
            <Sigma size={14}/>
            <span>Ask Sigma</span>
          </Link>

          {/* Mobile Toggle Button */}
          <button 
            onClick={() => setIsOpen(true)} 
            className="md:hidden text-amber-500 p-2 hover:bg-amber-500/10 rounded transition"
          >
            <Menu size={26} className="active:scale-90 transition" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu */}
      <div className={`
        fixed inset-0 z-40 bg-black/40 backdrop-blur-xl flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 overflow-hidden ${poppins.className}
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className={`text-sm font-semibold tracking-[0.2em] transition-colors ${
              pathname === link.href ? 'text-amber-500' : 'text-zinc-400 hover:text-amber-500'
            }`}
          >
            {link.name}
          </Link>
        ))}
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