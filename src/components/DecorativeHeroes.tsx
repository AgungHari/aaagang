import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export default function DecorativeHeroes() {
  return (
    <>
      {/* Archer Queen Decoration */}
      <div className="hidden md:block absolute 
      top-[5%] left-[-18%] 
      md:top-[8%] md:left-[-24%] 
      lg:top-[9%] lg:left-[-16%] 
      -z-10 opacity-10 pointer-events-none">
       <ScrollReveal>
        <Image 
          src="/Hero_Skin_AQ_Dark_Ages_Queen_2.webp" 
          alt="Archer Queen" 
          width={500}
          height={500}
          className="w-40 md:w-96 lg:w-110 xl:w-200 h-auto object-contain"
        />
        </ScrollReveal>
      </div>
      <div className="hidden md:block absolute 
      top-[3%] right-[-16%] 
      md:top-[7%] md:right-[-17%] 
      lg:top-[7%] lg:right-[-16%] 
      -z-10 opacity-10 pointer-events-none">
       <ScrollReveal>
        <Image 
          src="/GW_DarkDays_f22_2k_V2.webp" 
          alt="Guardian" 
          width={500}
          height={500}
          className="w-40 md:w-96 lg:w-120 xl:w-215 h-auto object-contain"
        />
        </ScrollReveal>
      </div>
    </>
  );
}
