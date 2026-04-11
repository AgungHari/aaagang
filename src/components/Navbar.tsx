'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar({ clanName, badge }: { clanName: string, badge: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "MEMBERS", href: "/members" },
    { name: "TENTANG KAMI", href: "/tentang" },
    // Tambah rute baru di sini nanti
  ];

  return (
    <nav className="relative z-50">
      <div className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="font-black text-2xl tracking-tighter italic text-amber-500 flex items-center gap-2">
          <img src={badge} alt="Badge" className="w-8 h-8 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          {clanName}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-[10px] font-black tracking-[0.2em]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-all border-b-2 uppercase pb-1 ${
                pathname === link.href
                  ? 'text-white border-amber-500 tracking-widest'
                  : 'text-zinc-500 border-transparent hover:text-amber-500'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden text-amber-500 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`
        absolute top-full left-0 w-full bg-[#080808]/95 backdrop-blur-xl border-b border-zinc-800 transition-all duration-300 ease-in-out overflow-hidden md:hidden
        ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
      `}>
        <div className="flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-xs font-black tracking-[0.3em] uppercase py-2 transition-colors ${
                pathname === link.href ? 'text-amber-500' : 'text-zinc-500'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}