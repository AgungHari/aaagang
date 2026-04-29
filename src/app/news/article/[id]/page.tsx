import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchNewsContent, parseNewsData, extractYouTubeId } from '@/lib/newsHelper';
import { getClanData } from '@/lib/coc';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

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

  const heroImageUrl = article.heroImage?.medium?.path
    ? `https://clashofclans.inbox.supercell.com${article.heroImage.medium.path}`
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
        `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
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

      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 animate-fade-inY">
        {/* Back Button */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors mb-8 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to News
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          {/* Category */}
          {article.categories && article.categories[0] && (
            <div
              className="inline-block px-3 py-1 rounded text-xs font-bold text-white mb-4"
              style={{
                backgroundColor: `${article.categories[0].color}cc`,
              }}
            >
              {article.categories[0].title}
            </div>
          )}

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-4 uppercase text-amber-500 italic"
            style={{ fontFamily: "'Docallisme', sans-serif" }}
          >
            {article.title}
          </h1>

          {/* Date */}
          <p className="text-zinc-500 text-sm md:text-base">{formattedDate}</p>
        </div>

        {/* Hero Image or Video */}
        <div className="w-full mb-12 rounded-lg overflow-hidden bg-zinc-900/50 border border-zinc-800/50">
          {youtubeEmbedUrl ? (
            <iframe
              src={youtubeEmbedUrl}
              title={article.title}
              className="w-full aspect-video"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : heroImageUrl ? (
            <img src={heroImageUrl} alt={article.title} className="w-full h-auto" />
          ) : (
            <div className="aspect-video w-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
          )}
        </div>

        {/* Content */}
        {article.details && article.details.length > 0 && (
          <div className="text-zinc-300 space-y-6">
            {article.details.map((detail: any, index: number) => (
              <div
                key={index}
                className="leading-relaxed text-sm md:text-base"
              >
                <div
                  className="prose prose-invert max-w-none prose-headings:text-amber-500 prose-a:text-amber-500 prose-a:hover:text-amber-400 prose-strong:text-zinc-100 prose-em:text-zinc-200 prose-p:text-zinc-300 prose-li:text-zinc-300"
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
        )}
      </section>

      <Footer clan={clan} />
    </main>
  );
}
