import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export default function DecorativeHeroes() {
  return (
    <>
      {/* Archer Queen Decoration */}
      <div className="hidden md:block absolute 
      top-[5%] left-[-18%] 
      md:top-[4%] md:left-[-24%] 
      lg:top-[4.5%] lg:left-[-20%]
      xl:top-[7%] xl:left-[-28%] 
      2xl:top-[7%] 2xl:left-[-17%] 
      3xl:top-[7%] 3xl:left-[-12%]
      -z-10 opacity-10 pointer-events-none"> 
      {/* xl 3xl, macbook imac kontol */}
       <ScrollReveal>
        <Image 
          src="/2.svg" 
          alt="Archer Queen" 
          width={500}
          height={500}
          className="w-40 md:w-96 lg:w-110 xl:w-200 h-auto object-contain"
        />
        </ScrollReveal>
      </div>
      <div className="hidden md:block absolute 
      top-[3%] right-[-16%] 
      md:top-[4%] md:right-[-21%] 
      lg:top-[4.5%] lg:right-[-21%]
      xl:top-[7%] xl:right-[-34%]
      2xl:top-[7%] 2xl:right-[-22%]
      3xl:top-[7%] 3xl:right-[-15%]
      -z-10 opacity-10 pointer-events-none">
       <ScrollReveal>
        <Image 
          src="/1.svg" 
          alt="Warden" 
          width={500}
          height={500}
          loading="eager"
          className="w-40 md:w-96 lg:w-120 xl:w-215 h-auto object-contain"
        />
        </ScrollReveal>
      </div>
    </>
  );
}
