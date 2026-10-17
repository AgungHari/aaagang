import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MonetagVignette from '@/components/MonetagVignette';
import { fetchNewsContent, parseNewsData, extractYouTubeId } from '@/lib/newsHelper';
import { getClanData } from '@/lib/coc';
import Link from 'next/link';

import { CalendarDays, ChevronLeft, Newspaper } from 'lucide-react';

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: articleId } = await params;

  const [newsData, clan] = await Promise.all([
    fetchNewsContent(),
    getClanData(),
  ]);

  if (!newsData || !clan) {
    return (
      <main className="min-h-screen text-zinc-100 font-sans">
        <Navbar clanName="AAA GANG" badge="/badge_clan.webp" />
        <section className="max-w-4xl mx-auto px-6 pt-32 pb-32 text-center">
          <h1 className="text-3xl font-bold text-amber-600 mb-4">
            Unable to load content
          </h1>
          <Link
            href="/news"
            className="text-amber-500 hover:text-amber-400 transition-colors"
          >
            ← Back to News
          </Link>
        </section>
      </main>
    );
  }

  const articles = parseNewsData(newsData);
  const article = articles.find((a: any) => a.id === articleId);

  if (!article) {
    return (
      <main className="min-h-screen text-zinc-100 font-sans">
        <Navbar clanName={clan.name} badge="/badge_clan.webp" />
        <section className="max-w-4xl mx-auto px-6 pt-32 pb-32 text-center">
          <h1 className="text-3xl font-bold text-amber-600 mb-4">
            Article not found
          </h1>
          <Link
            href="/news"
            className="text-amber-500 hover:text-amber-400 transition-colors"
          >
            ← Back to News
          </Link>
        </section>
      </main>
    );
  }

  const heroImagePath =
    article.heroImage?.medium?.path ||
    article.thumbnail?.large?.path ||
    article.thumbnail?.medium?.path ||
    null;

  const heroImageUrl = heroImagePath
    ? `https://clashofclans.inbox.supercell.com${heroImagePath}`
    : null;

  const videoUrl =
    article.type === 'videoNewsEntry'
      ? article.embed?.url
      : undefined;

  const youtubeId = videoUrl ? extractYouTubeId(videoUrl) : null;
  const youtubeEmbedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}`
    : null;

  const formattedDate = new Date(article.postDate).toLocaleDateString(
    'id-ID',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  const plainTextDescription = article.details?.[0]?.body
    ? article.details[0].body
        .replace(/<[^>]*>?/gm, '') // Hilangkan semua tag HTML
        .slice(0, 160)
    : "Berita terbaru seputar Clash of Clans dan AAA GANGS.";

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": plainTextDescription,
    "image": [heroImageUrl || "https://3agang.pro/default-news-thumb.jpg"],
    "datePublished": new Date(article.postDate).toISOString(),
    "dateModified": new Date(article.postDate).toISOString(),
    "author": {
      "@type": "Organization",
      "name": "AAA GANGS",
      "url": "https://3agang.pro"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AAA GANGS",
      "logo": {
        "@type": "ImageObject",
        "url": "https://3agang.pro/badge_clan.webp"
      }
    }
  };

  // ADVANCED: Jika ini berita video, kita tambahkan Schema VideoObject
  if (youtubeId) {
    jsonLd["video"] = {
      "@type": "VideoObject",
      "name": article.title,
      "description": plainTextDescription,
      "thumbnailUrl": [
        `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      ],
      "uploadDate": new Date(article.postDate).toISOString(),
      "embedUrl": youtubeEmbedUrl
    };
  }

  return (
    <main className="min-h-screen text-zinc-100 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />
      <MonetagVignette />

      <section className="mx-auto max-w-5xl px-4 pb-20 pt-24 animate-fade-inY sm:px-6">
        {/* Back Button */}
        <Link
          href="/news"
          className="group mb-7 inline-flex items-center gap-2 rounded-full border border-zinc-800/70 bg-zinc-900/40 px-4 py-2 text-sm font-semibold text-zinc-300 transition-all hover:border-amber-500/30 hover:text-amber-400"
        >
          <ChevronLeft size={17} className="transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke berita</span>
        </Link>

        {/* Article title and hero media */}
        <div className="relative mb-10 overflow-hidden rounded-[2rem] border border-zinc-800/70 bg-gradient-to-br from-zinc-900/80 via-zinc-950/90 to-amber-950/20 shadow-2xl sm:mb-12">
          <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-amber-500/[0.07] blur-3xl" />
          <header className="relative p-6 sm:p-8 md:p-10">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
                <Newspaper size={13} /> Berita
              </span>
              {article.categories && article.categories[0] && (
                <span
                  className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{
                    backgroundColor: `${article.categories[0].color || '#f97316'}99`,
                  }}
                >
                  {article.categories[0].title}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-black/20 px-3 py-1.5 text-[10px] font-medium text-zinc-400">
                <CalendarDays size={13} className="text-amber-500" />
                {formattedDate}
              </span>
            </div>

            <h1
              className="max-w-4xl text-3xl uppercase leading-[1.08] text-amber-500 sm:text-4xl md:text-5xl lg:text-6xl"
              style={{ fontFamily: "'Docallisme', sans-serif" }}
            >
              {article.title}
            </h1>
            <div className="mt-6 h-px w-24 bg-gradient-to-r from-amber-500 to-transparent" />
          </header>

          <div className="relative px-3 pb-3 sm:px-4 sm:pb-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-[1.5rem] border border-zinc-800/70 bg-gradient-to-br from-zinc-800 to-zinc-950">
            {youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                title={article.title}
                className="absolute inset-0 h-full w-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : heroImageUrl ? (
              <img src={heroImageUrl} alt={article.title} className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
            )}
            </div>
          </div>
        </div>

        {/* Content */}
        {article.details && article.details.length > 0 && (
          <article className="rounded-[2rem] border border-zinc-800/60 bg-zinc-900/20 p-5 shadow-xl sm:p-8 md:p-10">
            <div className="mb-7 flex items-center gap-3 border-b border-zinc-800/70 pb-5">
              <span className="h-7 w-1 rounded-full bg-amber-500" />
              <h2 className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
                Isi Berita
              </h2>
            </div>
            <div className="space-y-8 text-zinc-300">
            {article.details.map((detail: any, index: number) => (
              <div
                key={index}
                className="leading-relaxed text-sm md:text-base"
              >
                <div
                  className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-wide prose-headings:text-amber-400 prose-a:text-amber-400 prose-a:underline-offset-4 hover:prose-a:text-amber-300 prose-strong:text-zinc-100 prose-em:text-zinc-200 prose-p:leading-8 prose-p:text-zinc-300 prose-li:text-zinc-300 prose-hr:border-zinc-800"
                  dangerouslySetInnerHTML={{
                    __html: (detail.body || '')
                      .replace(/&lt;/g, '<')
                      .replace(/&gt;/g, '>')
                      .replace(/&quot;/g, '"')
                      .replace(/&#039;/g, "'")
                      .replace(/&amp;/g, '&')
                      // Remove <p> tags inside <li> tags for better list formatting
                      .replace(/<li><p>/g, '<li>')
                      .replace(/<\/p><\/li>/g, '</li>')
                      // Format text elements
                      .replace(/<p>/g, '<p class="mb-3">')
                      .replace(/<ul>/g, '<ul class="list-disc list-inside mb-3 space-y-2">')
                      .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-3 space-y-2">')
                      .replace(/<li>/g, '<li class="text-zinc-300">')
                      .replace(/<h[1-6]>/g, '<h2 class="text-xl font-bold text-amber-500 mt-6 mb-3">')
                      // Format tables with responsive wrapper
                      .replace(/<table>/g, '<div class="overflow-x-auto mb-4 rounded-lg border border-zinc-700"><table class="w-full border-collapse border border-zinc-700">')
                      .replace(/<\/table>/g, '</table></div>')
                      .replace(/<tr>/g, '<tr class="border border-zinc-700">')
                      .replace(/<td>/g, '<td class="border border-zinc-700 px-3 py-2 text-zinc-300 whitespace-nowrap">')
                      .replace(/<th>/g, '<th class="border border-zinc-700 px-3 py-2 bg-zinc-800 text-amber-500 font-bold whitespace-nowrap">'),
                  }}
                />
              </div>
            ))}
            </div>
          </article>
        )}
      </section>

      <Footer clan={clan} />
    </main>
  );
}
