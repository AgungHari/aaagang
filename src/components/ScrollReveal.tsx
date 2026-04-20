"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  delay?: number;
  mobileDelay?: number; 
  className?: string;
}

export default function ScrollReveal({ children, delay = 0, mobileDelay, className = "" }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  const finalDelay = (isMobile && mobileDelay !== undefined) ? mobileDelay : delay;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-100px" }} 
      transition={{ 
        duration: 0.6, 
        delay: finalDelay, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}