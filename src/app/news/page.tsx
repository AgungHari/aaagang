import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { getClanData } from "@/lib/coc";
import { fetchNewsContent, fetchEsportContent, parseNewsData, parseEsportData } from "@/lib/newsHelper";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, CalendarDays, Newspaper, Trophy } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default async function NewsPage() {
  const [clan, newsData, esportData] = await Promise.all([
    getClanData(),
    fetchNewsContent(),
    fetchEsportContent(),
  ]);

  if (!clan) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <h1 className="text-amber-600 text-5xl md:text-6xl mb-6 " style={{ fontFamily: "'Docallisme', sans-serif" }}>
          SUPERCELL MAINTENANCE
        </h1>
        <p className="text-gray-400 text-md mb-10 max-w-lg font-poppins">
          We couldn&apos;t fetch the data right now. Check in-game for the maintenance timer or visit our status page.
        </p>
        
        <a 
          href="https://status.3agang.pro" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-zinc-600/30 font-sans rounded-xl border border-zinc-500/10 hover:bg-zinc-500/10"
        >
          <span className="relative flex items-center gap-2">
            <span className="flex h-3 w-3">
              <span className="animate-ping relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Check System Status
          </span>
        </a>
      </div>
    );
  }

  const articles = parseNewsData(newsData);
  const esportArticles = parseEsportData(esportData);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://3agang.pro/news/#collection",
    "url": "https://3agang.pro/news",
    "name": "Pusat Berita & Esports Clash of Clans - AAA GANGS",
    "description": "Update terbaru seputar Clash of Clans, strategi game, dan berita turnamen Esports dunia langsung dari AAA GANGS.",
    "publisher": { "@id": "https://3agang.pro/#organization" },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Latest News & Esports",
      "itemListElement": [
        // Ambil 6 berita umum terbaru
        ...(articles?.slice(0, 6).map((article: any, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `https://3agang.pro/news/article/${article.id}`,
          "name": article.title
        })) || []),
        // Ambil 6 berita esport terbaru
        ...(esportArticles?.slice(0, 6).map((article: any, index: number) => ({
          "@type": "ListItem",
          "position": (articles?.slice(0, 6).length || 0) + index + 1,
          "url": `https://3agang.pro/news/esports/${article.id}`,
          "name": article.title
        })) || [])
      ]
    }
  };
  
  // Get featured article
  const featuredArticle = articles?.[0];
  const remainingArticles = articles?.slice(1) || [];

  return (
    <main className="min-h-screen text-zinc-100 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />
      
      {/* Full-bleed News Hero */}
      <section className="relative isolate min-h-[100svh] w-full overflow-hidden bg-zinc-950">
        {featuredArticle?.thumbnail?.large?.path ? (
          <img
            src={`https://clashofclans.inbox.supercell.com${featuredArticle.thumbnail.large.path}`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/40 via-zinc-900 to-zinc-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-56 bg-gradient-to-b from-transparent via-[#050505]/75 to-[#050505] sm:h-72" />
        <div className="pointer-events-none absolute -left-32 top-1/4 size-[30rem] rounded-full bg-amber-500/[0.09] blur-[140px]" />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-5 pb-20 pt-32 sm:px-8 sm:pb-24 sm:pt-36">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-black/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-amber-300 backdrop-blur-md">
              <Newspaper size={13} /> AAA GANG · NEWSROOM
            </div>
            <h1 className="text-5xl uppercase leading-[0.9] tracking-tight text-white drop-shadow-2xl sm:text-6xl md:text-7xl lg:text-8xl" style={{ fontFamily: "'Docallisme', sans-serif" }}>
              News <span className="text-amber-500">&</span>
              <br />
              <span className="text-amber-500">Updates</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-200 drop-shadow-md sm:text-base md:text-lg">
              Kabar terbaru, pembaruan game, dan cerita kompetitif Clash of Clans—dikurasi untuk para pemain.
            </p>

            {featuredArticle && (
              <Link
                href={`/news/article/${featuredArticle.id}`}
                className="group mt-9 block max-w-2xl border-l-2 border-amber-500 pl-4 transition-colors hover:border-amber-300 sm:pl-5"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.24em] text-amber-400">
                    Featured dispatch
                  </span>
                  {featuredArticle.categories?.[0] && (
                    <span className="rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-200 backdrop-blur-sm">
                      {featuredArticle.categories[0].title}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-black uppercase leading-snug text-zinc-100 transition-colors group-hover:text-amber-300 sm:text-xl md:text-2xl">
                  {featuredArticle.title}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-300">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={13} className="text-amber-400" />
                    {new Date(featuredArticle.postDate).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-300 transition-transform group-hover:translate-x-1">
                    Baca cerita <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>

        <a
          href="#latest-stories"
          aria-label="Scroll ke berita terbaru"
          className="absolute bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-zinc-200 backdrop-blur-md transition-colors hover:border-amber-400/50 hover:text-amber-300 sm:bottom-8 sm:right-8"
        >
          Latest stories <ArrowDown size={13} />
        </a>
      </section>

      {/* Latest Stories */}
      <section id="latest-stories" className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pt-20">
        <div className="mb-9 flex flex-col justify-between gap-4 border-b border-zinc-800/70 pb-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 text-[9px] font-black uppercase tracking-[0.25em] text-amber-500">The latest</div>
            <h2 className="text-3xl uppercase text-zinc-100 sm:text-4xl" style={{ fontFamily: "'Docallisme', sans-serif" }}>
              Latest <span className="text-amber-500">Stories</span>
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              Update dan pengumuman terbaru langsung dari dunia Clash of Clans.
            </p>
          </div>
          <a href="#esports" className="inline-flex items-center gap-2 self-start rounded-full border border-zinc-800 px-4 py-2 text-xs font-bold text-zinc-300 transition-colors hover:border-amber-500/30 hover:text-amber-400 sm:self-auto">
            Jelajahi esports <ArrowDown size={14} />
          </a>
        </div>

        {remainingArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-7 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {remainingArticles.map((article: any, index: number) => (
              <ScrollReveal key={article.id} delay={Math.min(index * 0.04, 0.2)} mobileDelay={0.04}>
                <NewsCard
                  id={article.id}
                  title={article.title}
                  thumbnail={
                    article.thumbnail?.medium?.path
                      ? `https://clashofclans.inbox.supercell.com${article.thumbnail.medium.path}`
                      : undefined
                  }
                  category={article.categories?.[0]}
                  postDate={article.postDate}
                  type={article.type}
                  embedUrl={article.type === "videoNewsEntry" ? article.embed?.url : undefined}
                />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-zinc-800/60 bg-zinc-900/20 px-6 py-16 text-center">
            <Newspaper size={24} className="mx-auto mb-3 text-amber-500/70" />
            <p className="text-sm text-zinc-400">Belum ada berita terbaru.</p>
          </div>
        )}
      </section>

      {/* Esports Desk */}
      <section id="esports" className="relative overflow-hidden border-t border-zinc-800/50 bg-[#050505]">
        <div className="pointer-events-none absolute -left-32 top-10 size-96 rounded-full bg-amber-500/[0.025] blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-9 border-b border-zinc-800/70 pb-6">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/[0.06] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.22em] text-amber-400">
                <Trophy size={12} /> Competitive scene
              </div>
              <h2 className="text-3xl uppercase text-zinc-100 sm:text-4xl" style={{ fontFamily: "'Docallisme', sans-serif" }}>
                Esports <span className="text-amber-500">Coverage</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                Turnamen, strategi kompetitif, dan kisah para pemain terbaik.
              </p>
            </div>
          </div>

          {esportArticles && esportArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-7 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {esportArticles.map((article: any, index: number) => (
                <ScrollReveal key={article.id} delay={Math.min(index * 0.04, 0.2)} mobileDelay={0.04}>
                  <NewsCard
                    id={article.id}
                    title={article.title}
                    thumbnail={
                      article.thumbnail?.medium?.path
                        ? `https://clashofclans.inbox.supercell.com${article.thumbnail.medium.path}`
                        : undefined
                    }
                    category={article.categories?.[0]}
                    postDate={article.postDate}
                    type={article.type}
                    embedUrl={article.embed?.url}
                    isEsport={true}
                  />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-zinc-800/60 bg-black/20 px-6 py-16 text-center">
              <Trophy size={24} className="mx-auto mb-3 text-amber-500/70" />
              <p className="text-sm text-zinc-400">Belum ada liputan esports tersedia.</p>
            </div>
          )}
        </div>
      </section>

      <Footer clan={clan} />
    </main>
  );
}
