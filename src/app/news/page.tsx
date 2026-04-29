import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { getClanData } from "@/lib/coc";
import { fetchNewsContent, fetchEsportContent, parseNewsData, parseEsportData } from "@/lib/newsHelper";
import { Newspaper } from "lucide-react";
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
  
  // Get featured articles
  const featuredArticle = articles?.[0];
  const remainingArticles = articles?.slice(1) || [];

  return (
    <main className="min-h-screen text-zinc-100 font-sans">
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />
      
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-7">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 animate-slide-up">
            <Newspaper size={12} /> Game News
          </div>
          <h1 className="text-5xl md:text-6xl uppercase leading-tight mb-4 animate-slide-up" style={{ fontFamily: "'Docallisme', sans-serif" }}>
            News & <span className="text-amber-500">Updates</span>
          </h1>
          <p className="text-zinc-400 text-base max-w-2xl mx-auto animate-slide-up">
            Tetap update dengan berita terbaru dari Clash of Clans, strategi perang, dan event terbaru. 
          </p>
          <p className="text-xs md:text-sm text-amber-300/80 animate-slide-up">
            Disclaimer: This site is a clan/community project and not affiliated with Supercell. 
            Clash of Clans is property of Supercell.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="max-w-6xl mx-auto px-6 mb-16">
          <div className="relative group cursor-pointer overflow-hidden rounded-xl">
            <div className="relative h-80 md:h-96 bg-zinc-900 overflow-hidden rounded-xl border border-zinc-800/50 group-hover:border-amber-500/30 transition-all duration-500 animate-slide-up">
              {featuredArticle.thumbnail?.large?.path ? (
                <>
                  <img
                    src={`https://clashofclans.inbox.supercell.com${featuredArticle.thumbnail.large.path}`}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-900/20 to-zinc-900" />
              )}

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                {featuredArticle.categories?.[0] && (
                  <div
                    className="inline-block px-3 py-1 rounded text-xs font-bold text-white mb-3"
                    style={{ backgroundColor: `${featuredArticle.categories[0].color || '#f97316'}dd` }}
                  >
                    {featuredArticle.categories[0].title}
                  </div>
                )}
                <h2 className="text-2xl md:text-3xl font-bold uppercase mb-2 text-white">
                  {featuredArticle.title}
                </h2>
                <p className="text-sm text-zinc-300">
                  {new Date(featuredArticle.postDate).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <a href={`/news/article/${featuredArticle.id}`} className="absolute inset-0 z-30" />
          </div>
        </section>
      )}

      {/* Main News Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl uppercase mb-3 animate-slide-up" style={{ fontFamily: "'Docallisme', sans-serif" }}>
          Latest <span className="text-amber-500">Stories</span>
        </h2>
        <p className="text-zinc-400 mb-12 animate-slide-up"> Dapatkan informasi terbaru langsung dari Supercell dan tetap terupdate dengan semua berita, patch notes, dan pengumuman penting untuk pengalaman bermain yang lebih maksimal.</p>

        {remainingArticles && remainingArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingArticles.map((article) => (
              <ScrollReveal key={article.id}>
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
          <div className="text-center py-20">
            <p className="text-zinc-400">Tidak ada berita tersedia saat ini.</p>
          </div>
        )}
      </section>

      {/* Esports Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-zinc-800/50">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl uppercase mb-3" style={{ fontFamily: "'Docallisme', sans-serif" }}>
          Esports <span className="text-amber-500">Coverage</span>
        </h2>
        <p className="text-zinc-400 mb-12"> 
          Dapatkan informasi terbaru langsung dari Supercell dan tetap terupdate dengan semua berita, patch notes, dan pengumuman penting untuk pengalaman bermain yang lebih maksimal.
        </p>

        {esportArticles && esportArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {esportArticles.map((article) => (
              <ScrollReveal key={article.id}>
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
          <div className="text-center py-20">
            <p className="text-zinc-400">Tidak ada konten esports tersedia saat ini.</p>
          </div>
        )}
      </section>

      <Footer clan={clan} />
    </main>
  );
}
