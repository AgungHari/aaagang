import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MonetagVignette from '@/components/MonetagVignette';
import { fetchEsportContent, parseEsportData, extractYouTubeId } from '@/lib/newsHelper';
import { getClanData } from '@/lib/coc';
import Link from 'next/link';

import { CalendarDays, ChevronLeft, Trophy } from 'lucide-react';

export default async function EsportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: esportId } = await params;

  const [esportData, clan] = await Promise.all([
    fetchEsportContent(),
    getClanData(),
  ]);

  if (!esportData || !clan) {
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

  const esportArticles = parseEsportData(esportData);
  const article = esportArticles.find((a: any) => a.id === esportId);

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

  const heroImageUrl = article.heroImage?.medium?.path
    ? `https://clashofclans.inbox.supercell.com${article.heroImage.medium.path}`
    : null;

  const videoUrl =
    article.embed?.url && !article.embed.url.includes('.m3u8')
      ? article.embed.url
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
  
  const firstTextBlock = article.details?.find((d: any) => d.type === 'textBlock' && d.body);
  const plainTextDescription = firstTextBlock?.body
    ? firstTextBlock.body
        .replace(/<[^>]*>?/gm, '') // Bersihkan tag HTML
        .slice(0, 160)
    : "Berita Esports terbaru seputar Clash of Clans.";

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": plainTextDescription,
    "image": [heroImageUrl || "https://3agang.pro/default-esport-thumb.jpg"],
    "datePublished": new Date(article.postDate).toISOString(),
    "dateModified": new Date(article.postDate).toISOString(),
    "author": {
      "@type": "Organization",
      "name": "AAA GANGS Esports",
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

  // Jika ada video YouTube utama, tambahkan VideoObject
  if (youtubeId) {
    jsonLd["video"] = {
      "@type": "VideoObject",
      "name": article.title,
      "description": plainTextDescription,
      "thumbnailUrl": [`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`],
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

        {/* Esports title and hero media */}
        <div className="relative mb-10 overflow-hidden rounded-[2rem] border border-zinc-800/70 bg-gradient-to-br from-zinc-900/80 via-zinc-950/90 to-amber-950/20 shadow-2xl sm:mb-12">
          <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-amber-500/[0.07] blur-3xl" />
          <header className="relative p-6 sm:p-8 md:p-10">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
                <Trophy size={13} /> Esports
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
                Liputan Esports
              </h2>
            </div>
            <div className="space-y-6 text-zinc-300">
            {article.details
              .filter((detail: any) => {
                // Include text blocks with body
                if (detail.type === 'textBlock' && detail.body) {
                  const cleanBody = detail.body.replace(/<[^>]*>/g, '').trim();
                  return cleanBody.length > 0;
                }
                // Include image blocks
                if (detail.type === 'imageBlock' && detail.image) {
                  return true;
                }
                // Include video blocks
                if (detail.type === 'videoBlock' && detail.embed) {
                  return true;
                }
                return false;
              })
              .map((detail: any, index: number) => (
                <div key={index} className="rounded-2xl border border-zinc-800/50 bg-black/20 p-4 leading-relaxed text-sm sm:p-6 md:text-base">
                  {/* Section Title */}
                  {detail.title && (
                    <h2 className="mb-4 border-l-2 border-amber-500 pl-3 text-lg font-black uppercase tracking-wide text-amber-400 md:text-2xl">
                      {detail.title}
                    </h2>
                  )}

                  {/* Image Block */}
                  {detail.type === 'imageBlock' && detail.image?.large && (
                    <div className="my-5 overflow-hidden rounded-xl border border-zinc-800/70 bg-zinc-900/50">
                      <img
                        src={`https://clashofclans.inbox.supercell.com${detail.image.large.path}`}
                        alt={detail.title || 'Article image'}
                        className="h-auto w-full"
                      />
                    </div>
                  )}

                  {/* Video Block */}
                  {detail.type === 'videoBlock' && detail.embed && (
                    <div className="my-5 overflow-hidden rounded-xl border border-zinc-800/70 bg-zinc-900/50">
                      {(() => {
                        const youtubeId = extractYouTubeId(detail.embed.url);
                        if (youtubeId) {
                          return (
                            <iframe
                              src={`https://www.youtube.com/embed/${youtubeId}`}
                              title={detail.title || 'Video'}
                              className="w-full aspect-video"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}

                  {/* Text Content */}
                  {detail.type === 'textBlock' && detail.body && (
                    <div
                      className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-wide prose-headings:text-amber-400 prose-a:text-amber-400 prose-a:underline-offset-4 hover:prose-a:text-amber-300 prose-strong:text-zinc-100 prose-em:text-zinc-200 prose-p:leading-8 prose-p:text-zinc-300 prose-li:text-zinc-300 prose-hr:border-zinc-700"
                      dangerouslySetInnerHTML={{
                        __html: detail.body
                          ?.replace(/&lt;/g, '<')
                          .replace(/&gt;/g, '>')
                          .replace(/&quot;/g, '"')
                          .replace(/&#039;/g, "'")
                          .replace(/&amp;/g, '&')
                          // Remove <p> tags inside <li> tags for better list formatting
                          .replace(/<li><p>/g, '<li>')
                          .replace(/<\/p><\/li>/g, '</li>')
                          // Format text elements
                          .replace(/<p>/g, '<p class="mb-4 leading-8">')
                          .replace(/<ul>/g, '<ul class="list-disc list-inside mb-3 space-y-2">')
                          .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-3 space-y-2">')
                          .replace(/<li>/g, '<li class="text-zinc-300">')
                          .replace(/<h[1-6]>/g, '<h2 class="text-xl font-bold text-amber-400 mt-7 mb-4 border-l-2 border-amber-500 pl-3">')
                          // Format tables with responsive wrapper
                          .replace(/<table>/g, '<div class="overflow-x-auto mb-4 rounded-lg border border-zinc-700"><table class="w-full border-collapse border border-zinc-700">')
                          .replace(/<\/table>/g, '</table></div>')
                          .replace(/<tr>/g, '<tr class="border border-zinc-700">')
                          .replace(/<td>/g, '<td class="border border-zinc-700 px-3 py-2 text-zinc-300 whitespace-nowrap">')
                          .replace(/<th>/g, '<th class="border border-zinc-700 px-3 py-2 bg-zinc-800 text-amber-400 font-bold whitespace-nowrap">')
                          // Keep social links but style them
                          .replace(/<a[^>]*href="javascript:window.sendCommand[^>]*>([^<]*)<\/a>/gi, 
                            '<span class="inline-block px-2 py-1 bg-amber-500/20 text-amber-500 rounded text-xs mx-1">$1</span>'),
                      }}
                    />
                  )}
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
