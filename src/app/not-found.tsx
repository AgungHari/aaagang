"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Construction } from "lucide-react"; 
import ScrollReveal from "@/components/ScrollReveal";
export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <ScrollReveal>
        {/* Icon atau Logo Klan */}
        <div className="flex justify-center">
           <Construction size={80} className="text-amber-600 animate-pulse" />
        </div>

        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white">
          404 <span className="text-amber-600">ERROR</span>
        </h1>
        
        <p className="text-zinc-500 uppercase tracking-[0.3em] font-bold text-xs md:text-sm">
          Salah Lewat Bos
        </p>

        <div className="pt-8">
          <Link 
            href="/"
            className="px-8 py-4 bg-amber-600 text-black font-black uppercase italic rounded-full hover:bg-amber-400 transition-all hover:scale-105 inline-block"
          >
            Back to Home Base
          </Link>
        </div>
        </ScrollReveal>
      
    </main>
  );
}