import { getPlayerData } from "@/lib/player";
import { getClanData } from "@/lib/coc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, Star, Shield, Sword, ArrowLeft, Building2, Zap } from "lucide-react";
import Link from "next/link";

// --- MAPPING ASSETS (DI LUAR FUNCTION AGAR RAPI) ---
const HERO_ASSETS: Record<string, string> = {
  "Barbarian King": "BK_DE_Pose02_NoShadows.webp",
  "Archer Queen": "Hero_Skin_AQ_Dark_Ages_Queen_2.webp",
  "Grand Warden": "GW_DarkDays_f22_2k_V2.webp",
  "Royal Champion": "Hero_Skin_RC_Space_Champion_4.webp",
  "Minion Prince": "MinionPrince_LNY_f45_4k.webp",
  "Dragon Duke": "DD_SoundOfClash_f03_4k.webp",
  "Battle Machine": "BattleMachineSteamPunk3_NoShadow.webp",
  "Battle Copter": "BattleCopter_Boat_Pose01_NoShadow.webp"
};

const EQ_ASSETS: Record<string, string> = {
  "Giant Gauntlet": "Hero_Equipment_BQ_Giant_Gauntlet.webp",
  "Rocket Spear": "HeroGear_RoyalChampion_RocketSpear_Equipment_03.webp",
  "Rocket Backpack": "HG_DD_DeadlyDash_Marketing.webp",
  "Electro Fangs": "HG_DD_Electro_Fangs.webp",
  "Spiky Ball": "Hero_Equipment_BK_Spiky_Ball.webp",
  "Snake Bracelet": "Hero_Equipment_BK_SnakeBracelet.webp",
  "Dark Crown": "HeroGear_MP_DarkCrown_2k.webp",
  "Magic Mirror": "Hero_Equipment_AQ_Magic_Mirror.webp",
  "Electro Boots": "Hero_Equipment_RC_ElectroBoots.webp",
  "Lavaloon Puppet": "icon_gear_GW_LavaloonPuppet.webp",
  "Action Figure": "Hero_Equipment_AQ_WWEActionFigure.webp",
  "Barbarian Puppet": "Hero_Equipment_BK_Barbarian_Puppet.webp",
  "Rage Vial": "Hero_Equipment_BK_Rage_Vial.webp",
  "Archer Puppet": "Hero_Equipment_AQ_Archer_Puppet.webp",
  "Invisibility Vial": "Hero_Equipment_AQ_Invisibility_Vial.webp",
  "Eternal Tome": "Hero_Equipment_GW_Eternal_Tome.webp",
  "Life Gem": "Hero_Equipment_GW_Life_Gem.webp",
  "Seeking Shield": "Hero_Equipment_RC_Seeking_Shield.webp",
  "Royal Gem": "Hero_Equipment_RC_Royal_Gem.webp",
  "Earthquake Boots": "Hero_Equipment_BK_Earthquake_Boots.webp",
  "Hog Rider Puppet": "Hero_Equipment_RC_Hog_Rider_Doll.webp",
  "Vampstache": "Hero_Equipment_BK_Vampstache.webp",
  "Haste Vial": "Hero_Equipment_RC_Haste_Vial.webp",
  "Giant Arrow": "Hero_Equipment_AQ_Giant_Arrow.webp",
  "Healer Puppet": "Hero_Equipment_AQ_Healer_Puppet.webp",
  "Rage Gem": "Hero_Equipment_GW_Rage_Gem.webp",
  "Healing Tome": "Hero_Equipment_GW_Healing_Tome.webp",
  "Henchmen Puppet": "Hero_Equipment_MP_Henchman.webp",
  "Dark Orb": "Hero_Equipment_MP_DarkOrb.webp",
  "Metal Pants": "HeroEquipment_MP_IronPants.webp",
  "Fire Heart": "HG_DD_FlameHeart_Marketing.webp",
  "Stun Blaster": "HG_DD_StunBlast_Marketing.webp",
  "Meteor Staff": "HeroGear_MP_MeteoriteSceptre.webp",
  "Stick Horse": "HeroGear_BK_StickFireHorse.webp",
  "Flame Blower": "HG_DD_FlameBreath_Marketing.webp",
  "Noble Iron": "HeroEquipment_MP_IronPants.webp",
  "Fireball":"Hero_Equipment_GW_Fireball.webp",
  "Heroic Torch": "HeroGear_GW_Olympic_Torch_hh0000.webp",
  "Frost Flake": "Hero_Equipment_rc_frost_flake.webp",
  "Frozen Arrow": "Hero_Equipment_AQ_Frozen_Arrow.webp",
  // Heroic Torch, Stick Horse, Noble Iron, and Flame Blower do not have matching public art yet.
};

const PET_ASSETS: Record<string, string> = {
  "L.A.S.S.I": "Hero_Pet_HV_L.A.S.S.I_1_grass.webp",
  "Mighty Yak": "Hero_Pet_HV_Mighty_Yak_1_grass.webp",
  "Electro Owl": "Hero_Pet_HV_Electro_Owl_grass.webp",
  "Unicorn": "Hero_Pet_HV_Unicorn_1_grass.webp",
  "Phoenix": "Hero_Pet_HV_Phoenix_2_grass.webp",
  "Poison Lizard": "Hero_Pet_HV_Poison_Lizard_1_grass.webp",
  "Diggy": "Hero_Pet_HV_Diggy_2_grass.webp",
  "Frosty": "Hero_Pet_HV_Frosty_3_grass.webp",
  "Angry Jelly": "Hero_Pet_HV_Angry_Jelly_05.webp",
  "Sneezy": "Icon_HV_Hero_Pets_Sneezy.webp",
  "Spirit Fox": "Hero_Pet_HV_Spirit_Fox_shadow.webp",
  "Greedy Raven": "pet_Greedy_Raven_3_grasspng.webp"
};

const BATTLE_PET_NAMES = new Set([
  "L.A.S.S.I",
  "Mighty Yak",
  "Electro Owl",
  "Unicorn",
  "Phoenix",
  "Poison Lizard",
  "Diggy",
  "Frosty",
  "Spirit Fox",
  "Angry Jelly",
  "Sneezy",
  "Greedy Raven"
]);

export default async function MemberDetailPage({ params }: { params: Promise<{ tag: string }> }) {
  const resolvedParams = await params; 
  const playerTag = decodeURIComponent(resolvedParams.tag);

  const [player, clan] = await Promise.all([
    getPlayerData(playerTag),
    getClanData()
  ]);

  if (!player || !clan) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-black italic uppercase">
        DATABASE ERROR / PLAYER NOT FOUND
      </div>
    );
  }

  const leagueIcon = player.leagueTier?.iconUrls?.large || player.league?.iconUrls?.medium || "https://clashofclans.com/assets/images/leagues/1.png";
  const homeHeroes = player.heroes?.filter((hero: any) => hero.name !== "Battle Machine" && hero.name !== "Battle Copter");
  const builderMachines = player.heroes?.filter((hero: any) => hero.name === "Battle Machine" || hero.name === "Battle Copter");

  // Generate player summary
  const topHero = homeHeroes?.reduce((max: any, hero: any) => (!max || hero.level > max.level) ? hero : max, null);
  
  // Handle clan.memberList untuk ambil info member
  let memberInfo: any = null;
  if (Array.isArray(clan.memberList)) {
    memberInfo = clan.memberList.find((m: any) => m.tag === player.tag);
  }
  
  const joinDate = memberInfo?.joinDate ? new Date(memberInfo.joinDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : 'Unknown';
  
  // Map role dengan benar sesuai API CoC
  const getRoleName = (role: string) => {
    switch(role) {
      case 'leader': return 'Leader';
      case 'coLeader': return 'Co-Leader';
      case 'admin': return 'Elder';
      default: return 'Member';
    }
  };
  
  const role = getRoleName(memberInfo?.role || 'member');
  
  const generateSummary = () => {
    const heroInfo = topHero ? ` ${topHero.name} dengan level ${topHero.level}` : '';
    const leagueName = player.leagueTier?.name || player.league?.name || 'Unranked';
    return `${player.name} adalah seorang pemain dengan level Town Hall ${player.townHallLevel} yang memiliki experience level ${player.expLevel} dan mendedikasikan diri Sebagai ${role} di AAA GANG. Di mana player ini berada di ${leagueName} dan telah membuktikan kemampuan perangnya di lapangan, dimana hal tersebut terbukti dengan meraih ${player.warStars} bintang pada perang klasik. Hero andalannya adalah ${heroInfo}. Pemain ini menunjukkan dedikasi yang konsisten terhadap permainan Clash Of Clans.`;
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": player.name,
      "identifier": player.tag,
      "description": generateSummary(),
      "image": leagueIcon,
      "affiliation": {
        "@id": "https://3agang.pro/#organization"
      },
      "knowsAbout": [
        "Clash of Clans",
        `Town Hall ${player.townHallLevel}`,
        "Strategy Gaming"
      ],
      "stats": [
        {
          "@type": "Observation",
          "name": "Trophies",
          "value": player.trophies
        },
        {
          "@type": "Observation",
          "name": "War Stars",
          "value": player.warStars
        }
      ]
    }
  };

  return (
    <main className="min-h-screen text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      <section className="max-w-5xl mx-auto px-6 pt-24 pb-12 animate-slide-up">
        {/* Tombol Back */}
        <Link href="/members" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-amber-500 transition-colors mb-12">
          <ArrowLeft size={12} /> Back to Directory
        </Link>

        {/* Header Profile (Sama seperti sebelumnya) */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full group-hover:bg-amber-500/30 transition-all"></div>
            <img src={leagueIcon} alt="League" className="w-32 h-32 md:w-48 md:h-48 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center gap-3 mb-4 justify-center md:justify-start">
              <span className="inline-flex items-center px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">
                Town Hall {player.townHallLevel}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full border border-zinc-800/60 bg-zinc-900/80 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
                {player.leagueTier?.name || player.league?.name || "UNRANKED"}
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.8] mb-4">{player.name}</h1>
            <div className="text-zinc-600 font-mono text-xs bg-zinc-900 px-2 py-1 rounded border border-zinc-800 inline-block">{player.tag}</div>
          </div>
        </div>

        {/* SECTION: PLAYER SUMMARY */}
        <div className="mb-16 p-6 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
          <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
            {generateSummary()}
          </p>
        </div>

        {/* Statistik Utama */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <StatLarge label="Trophies" value={player.trophies} sub={`${player.bestTrophies} Best`} icon={<Trophy className="text-amber-500" size={20}/>} />
          <StatLarge label="War Stars" value={player.warStars} sub="Total Earned" icon={<Star className="text-yellow-500" size={20}/>} />
          <StatLarge label="Experience" value={player.expLevel} sub="Level" icon={<Zap className="text-zinc-400" size={20}/>} />
          <StatLarge label="Builder Hall" value={player.builderHallLevel} sub="Level" icon={<Building2 className="text-blue-500" size={20}/>} />
        </div>

        {/* SECTION: HEROES & GEAR */}
        <div className="mb-20">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-4 text-zinc-800">
            Heroes & Gear <div className="h-px flex-1 bg-zinc-900"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {homeHeroes?.map((hero: any) => (
              <div key={hero.name} className="flex flex-col gap-4">
                {/* Hero Card */}
                <div className="p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] relative overflow-hidden min-h-[160px] flex flex-col justify-end group transition-all hover:border-amber-500/20">
                  {HERO_ASSETS[hero.name] && (
                    <img src={`/${HERO_ASSETS[hero.name]}`} className="absolute -right-6 -top-6 w-48 h-48 object-contain opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700" alt="" />
                  )}
                  <div className="relative z-10">
                    <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">{hero.name}</div>
                    <div className="text-5xl font-black italic tracking-tighter">LVL {hero.level}</div>
                  </div>
                </div>

                {/* Equipment Slot */}
                <div className="flex gap-3 px-2">
                  {hero.equipment?.map((eq: any) => (
                    <div key={eq.name} className="flex-1 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-3 flex items-center gap-4 hover:bg-zinc-800/80 transition-all group/eq">
                      <div className="w-12 h-12 bg-zinc-950 rounded-xl p-1.5 border border-zinc-800 flex-shrink-0">
                        <img src={`/${EQ_ASSETS[eq.name] || 'placeholder.webp'}`} className="w-full h-full object-contain" alt={eq.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[8px] font-black text-zinc-500 uppercase truncate mb-0.5">{eq.name}</div>
                        <div className="text-sm font-black italic text-amber-500">LVL {eq.level}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: BATTLE PETS */}
        <div className="mb-16">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-4 text-zinc-800">
            Battle Pets <div className="h-px flex-1 bg-zinc-900"></div>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {player.troops?.filter((t: any) => PET_ASSETS[t.name]).map((pet: any) => (
              <div key={pet.name} className="p-4 bg-zinc-900/20 border border-zinc-800/50 rounded-3xl flex flex-col items-center group hover:border-blue-500/30 transition-all">
                <div className="w-16 h-16 mb-3 relative">
                  <img src={`/${PET_ASSETS[pet.name]}`} alt={pet.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <div className="text-[8px] font-black text-zinc-600 uppercase mb-1">{pet.name}</div>
                <div className="text-xl font-black italic text-zinc-100 group-hover:text-blue-400">LVL {pet.level}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: BUILDER MACHINES */}
        {builderMachines?.length ? (
          <div className="mb-16">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-4 text-zinc-800">
              Builder Machines <div className="h-px flex-1 bg-zinc-900"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {builderMachines.map((machine: any) => (
                <div key={machine.name} className="p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] relative overflow-hidden min-h-[160px] flex flex-col justify-end group transition-all hover:border-cyan-500/20">
                  {HERO_ASSETS[machine.name] && (
                    <img src={`/${HERO_ASSETS[machine.name]}`} className="absolute -right-6 -top-6 w-48 h-48 object-contain opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700" alt="" />
                  )}
                  <div className="relative z-10">
                    <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">{machine.name}</div>
                    <div className="text-5xl font-black italic tracking-tighter">LVL {machine.level}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <Footer clan={clan} />
    </main>
  );
}

function StatLarge({ label, value, sub, icon }: any) {
  return (
    <div className="p-6 bg-zinc-900/10 border border-zinc-900 rounded-[2rem] hover:bg-zinc-900/20 transition-all group">
      <div className="flex items-center gap-3 mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</span>
      </div>
      <div className="text-3xl font-black italic mb-1 group-hover:text-amber-500 transition-colors">{value?.toLocaleString() || 0}</div>
      <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">{sub}</div>
    </div>
  );
}