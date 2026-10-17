import {
  ArrowDown,
  ArrowUp,
  CalendarBlank,
  Fire,
  Shield,
  Sword,
  Trophy,
  UsersThree,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

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
      small?: string;
      large?: string;
      medium?: string;
    };
  };
}

interface WarLogCardProps {
  war: WarLogItem;
  index: number;
}

function formatWarDate(dateString: string) {
  const apiDate = dateString.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(.*)$/);
  const normalizedDate = apiDate
    ? `${apiDate[1]}-${apiDate[2]}-${apiDate[3]}T${apiDate[4]}:${apiDate[5]}:${apiDate[6]}${apiDate[7]}`
    : dateString;
  const date = new Date(normalizedDate);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function DestructionBar({ value, subdued }: { value: number; subdued: boolean }) {
  const percentage = Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) : 0;

  return (
    <div className="mt-2 h-1 overflow-hidden rounded-full bg-zinc-800">
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${subdued ? "bg-zinc-600" : "bg-gradient-to-r from-amber-600 to-amber-300"}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default function WarLogCard({ war, index }: WarLogCardProps) {
  const result = war.result ?? "cancelled";
  const isWin = result === "win";
  const isLoss = result === "lose";
  const isTie = result === "tie";
  const resultLabel = isWin ? "Victory" : isLoss ? "Defeat" : isTie ? "Draw" : "Cancelled";
  const resultStyle = isWin
    ? "border-amber-400/25 bg-amber-400/10 text-amber-300"
    : isLoss
      ? "border-rose-400/20 bg-rose-400/[0.07] text-rose-300"
      : isTie
        ? "border-sky-400/20 bg-sky-400/[0.07] text-sky-300"
        : "border-zinc-700 bg-zinc-800/60 text-zinc-400";
  const subdued = isLoss || result === "cancelled";
  const scoreClass = subdued ? "text-zinc-400" : "text-zinc-100";
  const teamName = war.clan.name || "AAA GANG";
  const starDifference = war.clan.stars - war.opponent.stars;

  return (
    <ScrollReveal delay={Math.min(index * 0.025, 0.2)} mobileDelay={0.01}>
      <article className="group relative h-full overflow-hidden rounded-2xl border border-zinc-800/70 bg-transparent p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-[0_20px_55px_-38px_rgba(245,158,11,0.45)] sm:p-6">
        <div className="pointer-events-none absolute -right-12 -top-14 size-40 rounded-full bg-amber-500/[0.035] blur-3xl transition-colors group-hover:bg-amber-500/[0.08]" />

        <header className="relative mb-5 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {war.opponent.badgeUrls?.small ? (
              <Image
                src={war.opponent.badgeUrls.small}
                alt={`${war.opponent.name} clan badge`}
                width={44}
                height={44}
                unoptimized
                className="size-11 shrink-0 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 text-zinc-600">
                <Shield size={22} weight="duotone" />
              </div>
            )}
            <div className="min-w-0">
              <p className="mb-1 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.17em] text-zinc-600">
                <CalendarBlank size={12} />
                {formatWarDate(war.endTime)}
              </p>
              <h3 className="truncate text-base font-black uppercase italic tracking-tight text-zinc-100 transition-colors group-hover:text-amber-200 sm:text-lg">
                vs {war.opponent.name}
              </h3>
            </div>
          </div>
          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.13em] ${resultStyle}`}>
            {resultLabel}
          </span>
        </header>

        <div className="relative rounded-xl border border-zinc-800/60 bg-black/20 p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
            <div className="min-w-0">
              <p className="mb-1 truncate text-[9px] font-black uppercase tracking-[0.15em] text-zinc-600">
                {teamName}
              </p>
              <p className={`text-3xl font-black tabular-nums tracking-tight sm:text-4xl ${scoreClass}`}>
                {war.clan.stars}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Sword size={16} weight="duotone" className={subdued ? "text-zinc-600" : "text-amber-400"} />
              <span className="text-[8px] font-black uppercase tracking-[0.15em] text-zinc-700">Stars</span>
            </div>
            <div className="min-w-0 text-right">
              <p className="mb-1 truncate text-[9px] font-black uppercase tracking-[0.15em] text-zinc-600">
                {war.opponent.name}
              </p>
              <p className={`text-3xl font-black tabular-nums tracking-tight sm:text-4xl ${scoreClass}`}>
                {war.opponent.stars}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-zinc-800/60 pt-3">
            <div>
              <div className="flex items-center justify-between gap-2 text-[9px] font-bold">
                <span className="text-zinc-600">Destruction</span>
                <span className={subdued ? "text-zinc-400" : "text-amber-200"}>
                  {war.clan.destructionPercentage.toFixed(1)}%
                </span>
              </div>
              <DestructionBar value={war.clan.destructionPercentage} subdued={subdued} />
            </div>
            <div>
              <div className="flex items-center justify-between gap-2 text-[9px] font-bold">
                <span className="text-zinc-600">Opponent</span>
                <span className={subdued ? "text-zinc-400" : "text-amber-200"}>
                  {war.opponent.destructionPercentage.toFixed(1)}%
                </span>
              </div>
              <DestructionBar value={war.opponent.destructionPercentage} subdued={subdued} />
            </div>
          </div>
        </div>

        <footer className="relative mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-zinc-800/60 pt-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] font-bold text-zinc-500">
            <span className="flex items-center gap-1.5">
              <UsersThree size={13} className="text-zinc-600" />
              {war.teamSize} vs {war.teamSize}
            </span>
            <span className="flex items-center gap-1.5">
              <Fire size={13} className="text-zinc-600" />
              {war.attacksPerMember} attacks
            </span>
            {war.result === "tie" ? (
              <span className="text-sky-300">Even battle</span>
            ) : (
              <span className={`flex items-center gap-1 ${starDifference > 0 ? "text-amber-300" : "text-zinc-500"}`}>
                {starDifference > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {Math.abs(starDifference)} star{Math.abs(starDifference) === 1 ? "" : "s"}
              </span>
            )}
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-600">
            +{war.clan.expEarned.toLocaleString()} XP
          </span>
        </footer>
      </article>
    </ScrollReveal>
  );
}
