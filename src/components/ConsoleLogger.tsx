"use client";

import { useEffect } from "react";

export default function ConsoleLogger() {
  useEffect(() => {
    // Teks ASCII Art (Bisa diganti sesukamu)
    console.log(
      "%c AAA GANG %c NI BOSS ",
      "color: #000; background: #F59E0B; font-size: 24px; font-weight: bold; border-radius: 5px 0 0 5px; padding: 5px;",
      "color: #F59E0B; background: #18181b; font-size: 24px; font-weight: bold; border-radius: 0 5px 5px 0; padding: 5px;"
    );

    console.log(
      "%cJangan ngintip bang \n" +
      "Mending join war sini\n" +
      "Login search klannya : #Q9YY02J9",
      "color: #888; font-size: 14px; font-style: italic; margin-top: 10px;"
    );
  }, []);

  return null; // Komponen ini tidak merender apapun di UI
}