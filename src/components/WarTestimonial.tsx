import WarTestimonialCard from "@/components/WarTestimonialCard";
import SectionTitle from "@/components/SectionTitle";
import Marquee from "react-fast-marquee";
import ScrollReveal from "./ScrollReveal";

interface WarLogItem {
  result: "win" | "lose" | "tie" | null;
  endTime: string;
  teamSize: number;
  attacksPerMember: number;
  clan: {
    name: string;
    stars: number;
    destructionPercentage: number;
    expEarned: number;
  };
  opponent: {
    name: string;
    stars: number;
    destructionPercentage: number;
    badgeUrls?: {
      small: string;
      large: string;
      medium: string;
    };
  };
}

interface WarLogResponse {
  items: WarLogItem[];
}

interface WarTestimonialProps {
  warLog: WarLogResponse | null;
}

export default function WarTestimonial({ warLog }: WarTestimonialProps) {
  if (!warLog) return null;

  const validWars = warLog.items
    .filter((w) => w.clan && w.opponent)
    .slice(0, 8);

  if (validWars.length === 0) return null;

  return (
    // Container utama section
    <div id="war-testimonials" className="pt-10 px-4 md:px-16 lg:px-24 xl:px-32 mb-[300px]">

        <ScrollReveal delay={0.2}>
        <div className="max-w-4xl mx-auto mt-11 text-center mb-8">
            <h2 className="text-5xl md:text-5xl mb-4" style={{ fontFamily: "'Docallisme', sans-serif" }}>
                MAINKAN <span className="text-amber-500">DAN</span> <span className="text-amber-800">HABISI</span>
            </h2>
            <p className="text-zinc-400 text-sm md:text-sm font-poppins">
                Rasakan pengalaman perang paling berkelas dalam sejarah Clash Of Clans intip <span className="text-amber-500">Warlog</span> kami untuk full detail perang.
            </p>
        </div>
        </ScrollReveal>

      <div className="max-w-5xl mx-auto mt-11">

        {/* Row 1 */}
          <Marquee className="max-w-5xl mx-auto mt-11" gradient={true} speed={25} gradientColor="#050505">
            <div className="flex items-center justify-center py-5 overflow-hidden">
                {validWars.map((war, index) => (
                <div key={`left-${index}`} className="px-2 flex-shrink-0">
                    <WarTestimonialCard index={index} war={war} />
                </div>
                ))}
            </div>

          </Marquee>
        </div>

        {/* Row 2 */}
          <Marquee className="max-w-5xl mx-auto" gradient={true} speed={25} direction="right" gradientColor="#050505">
            <div className="flex items-center justify-center py-5 overflow-hidden">
                {validWars.map((war, index) => (
                <div key={`right-${index}`} className="px-2 flex-shrink-0">
                    <WarTestimonialCard index={index} war={war} />
                </div>
                ))}
            </div>
          </Marquee>
        </div>
  );
}
