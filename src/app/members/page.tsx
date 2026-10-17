import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import { getAliansiData, getClanData } from "@/lib/coc";
import {
  ArrowUpRight,
  Heart,
  Lightning,
  Shield,
  Sword,
  Trophy,
  UsersThree,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import type { Icon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

interface ClanMember {
  name: string;
  tag: string;
  role: string;
  townHallLevel: number;
  trophies: number;
  donations: number;
  donationsReceived: number;
  leagueTier?: {
    name?: string;
    iconUrls?: {
      small?: string;
    };
  };
}

interface ClanData {
  name: string;
  tag: string;
  members: number;
  clanPoints: number;
  warWins: number;
  clanLevel?: number;
  badgeUrls?: {
    small?: string;
  };
  warLeague?: {
    name?: string;
  };
  memberList: ClanMember[];
}

interface StatTileProps {
  label: string;
  value: number;
  icon: Icon;
  colorClass: string;
}

function StatTile({ label, value, icon: StatIcon, colorClass }: StatTileProps) {
  return (
    <div className="min-w-0 rounded-xl border border-zinc-800/70 bg-black/30 px-3 py-3">
      <div className={`mb-1 flex items-center gap-1.5 text-sm font-black ${colorClass}`}>
        <StatIcon size={15} weight="duotone" />
        <span className="truncate">{value.toLocaleString()}</span>
      </div>
      <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-600">
        {label}
      </div>
    </div>
  );
}

function ClanOverview({ clan, allied = false }: { clan: ClanData; allied?: boolean }) {
  const leader = clan.memberList.find((member) => member.role === "leader");
  const memberCapacity = 50;
  const memberPercentage = Math.min((clan.members / memberCapacity) * 100, 100);
  const accentText = allied ? "text-purple-300" : "text-amber-300";
  const borderAccent = allied ? "border-purple-500/25 hover:border-purple-400/45" : "border-amber-500/25 hover:border-amber-400/45";
  const glowAccent = allied ? "bg-purple-500/[0.07] group-hover:bg-purple-500/[0.12]" : "bg-amber-500/[0.07] group-hover:bg-amber-500/[0.12]";
  const progressAccent = allied ? "from-purple-500 to-fuchsia-400" : "from-amber-500 to-yellow-300";

  return (
    <article className={`group relative overflow-hidden rounded-[1.75rem] border bg-[#080808] p-5 transition-colors duration-300 sm:p-6 ${borderAccent}`}>
      <div className={`pointer-events-none absolute -right-12 -top-14 size-48 rounded-full blur-3xl transition-colors duration-500 ${glowAccent}`} />
      <div className="relative">
        <div className="mb-6 flex items-center gap-4">
          {clan.badgeUrls?.small && (
            <div className="relative flex size-[4.5rem] shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-black/50 p-3">
              <img
                src={clan.badgeUrls.small}
                alt={`${clan.name} badge`}
                className="size-full object-contain drop-shadow-[0_0_14px_rgba(245,158,11,0.18)] transition-transform duration-300 group-hover:scale-110"
              />
              {clan.clanLevel && (
                <span className={`absolute -bottom-2 -right-2 rounded-md border border-black bg-zinc-900 px-2 py-1 text-[8px] font-black uppercase tracking-wider ${accentText}`}>
                  LVL {clan.clanLevel}
                </span>
              )}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className={`mb-1 text-[9px] font-black uppercase tracking-[0.22em] ${accentText}`}>
              {allied ? "Alliance clan" : "Main clan"}
            </div>
            <h2 className="truncate text-xl font-black uppercase italic tracking-tight text-zinc-100 sm:text-2xl">
              {clan.name}
            </h2>
            <p className="mt-1 font-mono text-xs text-zinc-500">{clan.tag}</p>
            {clan.warLeague?.name && (
              <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                {clan.warLeague.name}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2">
          <StatTile label="Points" value={clan.clanPoints} icon={Trophy} colorClass={accentText} />
          <StatTile label="War wins" value={clan.warWins} icon={Sword} colorClass="text-rose-300" />
          <StatTile label="Members" value={clan.members} icon={UsersThree} colorClass="text-cyan-300" />
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">Leader</div>
            <p className={`truncate text-sm font-bold ${accentText}`}>{leader?.name ?? "N/A"}</p>
          </div>
          <div className="w-36 shrink-0 sm:w-44">
            <div className="mb-2 flex justify-between text-[9px] font-bold uppercase tracking-wider">
              <span className="text-zinc-600">Roster</span>
              <span className={accentText}>{clan.members}/{memberCapacity}</span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-zinc-800"
              role="progressbar"
              aria-label={`${clan.name} member capacity`}
              aria-valuemin={0}
              aria-valuemax={memberCapacity}
              aria-valuenow={clan.members}
            >
              <div
                className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${progressAccent}`}
                style={{ width: `${memberPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function MemberCard({
  member,
  index,
  allied = false,
}: {
  member: ClanMember;
  index: number;
  allied?: boolean;
}) {
  const accentText = allied ? "text-purple-300" : "text-amber-300";
  const accentBorder = allied ? "group-hover:border-purple-400/40" : "group-hover:border-amber-400/40";
  const accentHoverText = allied ? "group-hover:text-purple-300" : "group-hover:text-amber-300";
  const accentGlow = allied ? "group-hover:bg-purple-500/[0.08]" : "group-hover:bg-amber-500/[0.08]";
  const accentNumber = allied ? "group-hover:text-purple-400/20" : "group-hover:text-amber-400/20";
  const roleLabel = member.role === "admin"
    ? "Elder"
    : member.role === "leader"
      ? "Leader"
      : member.role === "coLeader"
        ? "Co-Leader"
        : "Member";

  return (
    <ScrollReveal delay={Math.min(index * 0.025, 0.2)}>
      <Link
        href={`/members/${encodeURIComponent(member.tag)}`}
        className={`group relative isolate flex h-full min-h-52 flex-col overflow-hidden rounded-2xl border border-zinc-800/70 bg-transparent p-5 transition-all duration-300 hover:-translate-y-1 ${accentBorder} hover:shadow-[0_18px_45px_-32px_rgba(245,158,11,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500`}
      >
        <div className={`pointer-events-none absolute -right-8 -top-10 -z-0 size-36 rounded-full blur-3xl transition-colors duration-500 ${accentGlow}`} />
        <div className="relative z-10 flex flex-1 flex-col">
          <div className="mb-5 flex items-start gap-3">
            <span className={`pt-1 text-xl font-black italic leading-none text-zinc-800 transition-colors ${accentNumber}`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            {member.leagueTier?.iconUrls?.small ? (
              <img
                src={member.leagueTier.iconUrls.small}
                alt={member.leagueTier.name ?? "League"}
                className="size-10 shrink-0 object-contain transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-black/50 text-zinc-600">
                <Shield size={20} weight="duotone" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className={`truncate text-lg font-black uppercase italic leading-tight text-zinc-100 transition-colors ${accentHoverText}`}>
                {member.name}
              </h3>
              <p className="mt-1 truncate font-mono text-[10px] text-zinc-600">{member.tag}</p>
            </div>
            <ArrowUpRight
              size={16}
              className="shrink-0 text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-amber-400"
            />
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2 text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-500">
            <span className={`rounded-full border border-zinc-800 bg-black/40 px-2.5 py-1 ${accentText}`}>{roleLabel}</span>
            <span className="rounded-full border border-zinc-800 bg-black/40 px-2.5 py-1">TH {member.townHallLevel}</span>
            <span className="min-w-0 truncate">{member.leagueTier?.name ?? "Unranked"}</span>
          </div>

          <div className="mt-auto grid grid-cols-3 gap-3 border-t border-zinc-800/70 pt-4">
            <MemberStat label="Trophies" value={member.trophies} icon={<Trophy size={13} weight="duotone" />} color="text-amber-300" />
            <MemberStat label="Donated" value={member.donations} icon={<Heart size={13} weight="duotone" />} color="text-rose-300" />
            <MemberStat label="Received" value={member.donationsReceived} icon={<Lightning size={13} weight="duotone" />} color="text-cyan-300" />
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}

function MemberStat({ label, value, icon, color }: { label: string; value: number; icon: ReactNode; color: string }) {
  return (
    <div className="min-w-0">
      <div className={`mb-1 flex items-center gap-1 text-xs font-black ${color}`}>
        {icon}
        <span className="truncate">{value.toLocaleString()}</span>
      </div>
      <div className="truncate text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-600">{label}</div>
    </div>
  );
}

const roleWeight: Record<string, number> = {
  leader: 4,
  coLeader: 3,
  admin: 2,
  member: 1,
};

function sortMembers(members: ClanMember[]) {
  return [...members].sort((a, b) => {
    const roleDifference = (roleWeight[b.role] ?? 0) - (roleWeight[a.role] ?? 0);
    return roleDifference || b.trophies - a.trophies;
  });
}

function MemberSection({ clan, allied = false }: { clan: ClanData; allied?: boolean }) {
  const members = sortMembers(clan.memberList);

  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8" aria-labelledby={allied ? "alliance-members-title" : "gang-members-title"}>
      <div className="mb-7 flex items-end justify-between gap-5 sm:mb-9">
        <div>
          <p className={`mb-2 text-[9px] font-black uppercase tracking-[0.25em] ${allied ? "text-purple-300" : "text-amber-400"}`}>
            {allied ? "Stronger together" : "The roster"}
          </p>
          <h2
            id={allied ? "alliance-members-title" : "gang-members-title"}
            className="text-3xl font-black uppercase italic leading-none tracking-tight text-zinc-100 sm:text-4xl"
          >
            {allied ? <>{clan.name} <span className="text-purple-400">Members</span></> : <>Gang <span className="text-amber-400">Members</span></>}
          </h2>
        </div>
        <div className="shrink-0 text-right">
          <div className={`text-2xl font-black italic leading-none sm:text-3xl ${allied ? "text-purple-300" : "text-amber-300"}`}>
            {clan.members}<span className="text-sm text-zinc-700"> / 50</span>
          </div>
          <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-600">Members</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {members.map((member, index) => (
          <MemberCard key={member.tag} member={member} index={index} allied={allied} />
        ))}
      </div>
    </section>
  );
}

export default async function MembersPage() {
  const [clanResponse, allianceResponse] = await Promise.all([getClanData(), getAliansiData()]);
  const clan = clanResponse as ClanData | null;
  const alliance = allianceResponse as ClanData | null;

  if (!clan) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-4 py-24 text-center text-zinc-100">
        <h1 className="mb-6 text-5xl text-amber-500 md:text-6xl" style={{ fontFamily: "'Docallisme', sans-serif" }}>
          SUPERCELL MAINTENANCE
        </h1>
        <p className="mb-10 max-w-lg text-sm leading-7 text-zinc-400">
          We couldn&apos;t fetch the clan data right now. Check in-game or visit our status page.
        </p>
        <a
          href="https://status.3agang.pro"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-zinc-700 bg-zinc-900/70 px-6 py-3 text-sm font-bold text-zinc-200 transition-colors hover:border-amber-500/40 hover:text-amber-300"
        >
          Check System Status
        </a>
      </main>
    );
  }

  const totalMembers = clan.members + (alliance?.members ?? 0);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://3agang.pro/members/#collection",
    url: "https://3agang.pro/members",
    name: "Direktori Anggota Clan AAA GANGS",
    description: "Daftar personil resmi clan AAA GANGS. Pantau statistik trophy, donasi, dan role anggota secara real-time.",
    publisher: { "@id": "https://3agang.pro/#organization" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: clan.memberList.length,
      itemListElement: sortMembers(clan.memberList).map((member, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://3agang.pro/members/${encodeURIComponent(member.tag)}`,
        name: member.name,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[#050505] font-sans text-zinc-100 selection:bg-amber-500 selection:text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-[#050505] pb-14 pt-32 sm:pb-20 md:min-h-[88svh] md:pb-24">
        <Image
          src="/cosmiccurse_portalpanic_background.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/75 to-black/15" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#050505] via-black/20 to-black/30" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_22%_50%,rgba(245,158,11,0.13),transparent_45%)]" />

        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-black/45 px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.24em] text-amber-300 backdrop-blur-md sm:text-[10px]">
              <UsersThree size={14} weight="duotone" />
              AAA GANG · ALLIANCE DIRECTORY
            </div>
            <h1 className="text-5xl font-black uppercase italic leading-[0.9] tracking-tight text-white sm:text-6xl md:text-7xl" style={{ fontFamily: "'Docallisme', sans-serif" }}>
              THE GANG
              <br />
              <span className="text-amber-400">BEHIND</span> THE
              <br />
              BATTLE
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
              Kenali para pemain di balik setiap kemenangan. Lihat roster, peran, dan statistik anggota AAA GANG serta clan aliansi kami.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#gang-members-title"
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-black transition-colors hover:bg-amber-300"
              >
                Meet the roster <ArrowUpRight size={15} weight="bold" />
              </a>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.13em] text-zinc-300 backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                {totalMembers} warriors · {alliance ? "2 clans" : "1 clan"}
              </span>
            </div>
          </div>

          <div className="mt-14 flex max-w-2xl items-center gap-4 border-t border-white/15 pt-5 sm:mt-20">
            <div className="flex -space-x-2">
              {clan.badgeUrls?.small && (
                <div className="flex size-10 items-center justify-center rounded-full border border-amber-400/30 bg-black/70 p-2">
                  <img src={clan.badgeUrls.small} alt="" className="size-full object-contain" />
                </div>
              )}
              {alliance?.badgeUrls?.small && (
                <div className="flex size-10 items-center justify-center rounded-full border border-purple-400/30 bg-black/70 p-2">
                  <img src={alliance.badgeUrls.small} alt="" className="size-full object-contain" />
                </div>
              )}
            </div>
            <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-400">
              <span className="block text-zinc-200">One banner. One family.</span>
              {clan.name}{alliance ? ` + ${alliance.name}` : ""}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 sm:pb-20 sm:pt-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-amber-400" />
          <div>
            <p className="text-[9px] font-black uppercase leading-relaxed tracking-[0.22em] text-amber-400">Our banners</p>
            <h2 className="text-lg font-black uppercase tracking-tight text-zinc-100">Clans &amp; alliance</h2>
          </div>
        </div>
        <div className={`grid gap-4 ${alliance ? "md:grid-cols-2" : "max-w-2xl"}`}>
          <ClanOverview clan={clan} />
          {alliance && <ClanOverview clan={alliance} allied />}
        </div>
      </section>

      <MemberSection clan={clan} />
      {alliance && <MemberSection clan={alliance} allied />}
      <Footer clan={clan} />
    </main>
  );
}
