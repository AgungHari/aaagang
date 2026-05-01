import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LikeButton from "@/components/LikeButton";
import { getClanData } from "@/lib/coc";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Eye, Play, MessageSquare, ExternalLink } from "lucide-react";
import { createClient } from "@libsql/client";
import ReactMarkdown from "react-markdown";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

function parseDescription(markdown: string): { title: string; content: string } {
  if (!markdown) {
    return { title: "Base Layout", content: "" };
  }

  const lines = markdown.split("\n");
  let title = "Base Layout";
  let content = markdown;

  if (lines[0]?.startsWith("# ")) {
    title = lines[0].replace(/^# /, "").trim();
    content = lines.slice(1).join("\n").trim();
  } else if (lines[0]) {
    title = lines[0];
    content = lines.slice(1).join("\n").trim();
  }

  return { title, content };
}

export default async function LayoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const clan = await getClanData();
  const { id } = await params;

  if (!clan) {
    return (
      <div className="text-white text-center py-20 font-black tracking-tighter text-5xl">
        DATABASE ERROR... <br/>RECHECK API TOKEN!
      </div>
    );
  }

  // Fetch layout detail
  const layoutResult = await client.execute({
    sql: "SELECT * FROM layouts WHERE id = ?",
    args: [id],
  });

  const layout = layoutResult.rows[0];

  if (!layout) {
    return (
      <main className="min-h-screen text-zinc-100 selection:bg-amber-500 selection:text-black overflow-x-hidden font-sans">
        <Navbar clanName={clan.name} badge="/badge_clan.webp" />
        <section className="pt-32 pb-20 px-6 md:px-16 lg:px-24 xl:px-32">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/layout"
              className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition mb-8 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
              Back to Layouts
            </Link>
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Layout tidak ditemukan</p>
            </div>
          </div>
        </section>
        <Footer clan={clan} />
      </main>
    );
  }

  // Fetch related layouts (same TH level, limit 3)
  const relatedResult = await client.execute({
    sql: "SELECT * FROM layouts WHERE th_level = ? AND id != ? AND is_active = 1 LIMIT 3",
    args: [layout.th_level, id],
  });
  const relatedLayouts = relatedResult.rows;

  // Ensure all values from database are properly typed
  const description = layout.description ? String(layout.description) : "";
  const { title, content } = parseDescription(description);
  const formattedDate = new Date(String(layout.upload_date)).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const getSourceIcon = () => {
    const sourceType = String(layout.source_type || "").toLowerCase();
    if (sourceType === "youtube") {
      return <Play size={16} />;
    }
    if (sourceType === "reddit") {
      return <MessageSquare size={16} />;
    }
    return <ExternalLink size={16} />;
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${title} - Town Hall ${layout.th_level} Base Layout`,
    "description": content.slice(0, 160).replace(/[#*]/g, ''),
    "image": String(layout.image_url),
    "datePublished": new Date(String(layout.upload_date)).toISOString(),
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
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://3agang.pro/layout/${id}`
    }
  };

  return (
    <main className="min-h-screen text-zinc-100 selection:bg-amber-500 selection:text-black overflow-x-hidden font-poppins">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      {/* Content Section */}
      <section className="pt-32 pb-20 px-6 md:px-16 lg:px-24 xl:px-32 animate-fade-inY">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/layout"
            className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
            Back to Layouts
          </Link>

          {/* Layout Detail */}
          <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl overflow-hidden mb-12">
            {/* Image */}
            {layout.image_url && (
              <div className="relative w-full aspect-video overflow-hidden bg-zinc-800">
                <Image
                  src={String(layout.image_url)}
                  alt={String(title)}
                  fill
                  sizes="(max-width: 768px) 100vw, 70vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="p-8">
              {/* Meta Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-white/10">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                    Town Hall Level
                  </p>
                  <p className="text-3xl font-bold ">TH {Number(layout.th_level)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">
                    Base Tag
                  </p>
                  <p className="text-2xl font-bold text-white">{String(layout.base_tag)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                    Uploaded
                  </p>
                  <p className="text-lg font-semibold text-zinc-400">{formattedDate}</p>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-semibold mb-8 text-amber-500">
                {String(title)}
              </h1>

              {/* Full Description */}
              <div className="space-y-8">
                {content && (
                  <div>
                    <div className="text-zinc-200/70 leading-relaxed prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-3">{children}</p>,
                          h1: ({ children }) => <h1 className="text-2xl font-bold mb-3">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-xl font-bold mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                          ul: ({ children }) => <ul className="mb-3 pl-6 space-y-1">{children}</ul>,
                          li: ({ children }) => <li className="list-disc">{children}</li>,
                          code: ({ children }) => <code className="bg-zinc-800 px-2 py-1 rounded text-blue-300">{children}</code>,
                          blockquote: ({ children }) => <blockquote className="border-l-4 border-amber-500 pl-4 py-2 italic text-gray-400">{children}</blockquote>,
                        }}
                      >
                        {content}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Copy Link */}
                <div>
                  <h2 className="text-xl font-semibold text-amber-500 mb-4">
                    Copy Base Link
                  </h2>
                  <div className="bg-zinc-800/50 border border-white/10 rounded-lg p-4">
                    <code className="text-sm text-blue-400 break-all font-mono">
                      {String(layout.copy_link)}
                    </code>
                  </div>
                </div>

                {/* Source Information */}
                {layout.source_url && (
                  <div>
                    <h2 className="text-xl font-semibold text-amber-500 mb-4">
                      Sumber
                    </h2>
                    <a
                      href={String(layout.source_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-zinc-600/20 hover:bg-zinc-600/30 text-zinc-400 px-4 py-3 rounded-lg transition font-semibold"
                    >
                      {getSourceIcon()}
                      <span>{String(layout.source_type || "External Link")}</span>
                    </a>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Eye size={18} />
                    <span className="text-sm">{Number(layout.view_count)} <span className="hidden md:inline">Views</span></span>
                  </div>
                  <LikeButton 
                    layoutId={Number(layout.id)}
                    initialCount={Number(layout.like_count)}
                  />
                    <Link
                    href={String(layout.copy_link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-900 text-white px-4 py-2 rounded-lg transition font-semibold text-sm shrink-0"
                  >
                    <ExternalLink size={16} />
                    Import
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related Layouts */}
          {relatedLayouts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">
                Layouts TH {Number(layout.th_level)} Lainnya
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedLayouts.map((related: any) => (
                  <Link
                    key={Number(related.id)}
                    href={`/layout/${Number(related.id)}`}
                    className="group bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all"
                  >
                    {related.image_url && (
                      <div className="relative w-full aspect-video overflow-hidden bg-zinc-800">
                        <Image
                          src={String(related.image_url)}
                          alt={String(related.base_tag)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-white group-hover:text-amber-500 transition-colors line-clamp-2">
                        {String(parseDescription(String(related.description || "")).title)}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {String(related.base_tag)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer clan={clan} />
    </main>
  );
}
