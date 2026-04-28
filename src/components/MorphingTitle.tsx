'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRef } from "react";

const phrases = [
  "Raih kejayaan bersama",
  "Kuasai pertempuran", 
  "Atur strategi menang",
  "Jadilah yang terkuat",
];

export default function MorphingTitle() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % phrases.length);
    }, 5000); // Ubah text setiap 5 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-5xl/17 lg:text-6xl/21 text-center mb-3 max-w-4xl lg:max-w-4xl font-poppins font-medium animate-slide-up">
      <AnimatePresence mode="wait">
        <motion.span
          key={current}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {phrases[current]}
        </motion.span>
      </AnimatePresence>
      <br />
      <motion.span 
        className="px-3 rounded-xl text-nowrap bg-gradient-to-r bg-clip-text text-transparent"
        style={{ fontFamily: "'Docallisme', sans-serif" }}
        animate={{
          backgroundImage: [
            "linear-gradient(90deg, #fbbf24 95%, #f59e0b 100%)",
            "linear-gradient(90deg, #f59e0b 0%, #f97316 100%)", 
            "linear-gradient(90deg, #f97316 0%, #aa1a03 100%)", 
            "linear-gradient(90deg, #8a1e1a 0%, #aa1a03 100%)",
            "linear-gradient(90deg, #aa1a03 0%, #f97316 100%)", 
            "linear-gradient(90deg, #f97316 0%, #f59e0b 100%)",
            "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)",
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        AAA GANGS
      </motion.span>
    </h1>
  );
}
