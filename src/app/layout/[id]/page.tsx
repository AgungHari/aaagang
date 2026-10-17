export const dynamic = 'force-dynamic';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutMetaInfo from "@/components/LayoutMetaInfo";
import LayoutDescription from "@/components/LayoutDescription";
import CopyLinkBox from "@/components/CopyLinkBox";
import MonetagVignette from "@/components/MonetagVignette";

import SourceSection from "@/components/SourceSection";
import LayoutStats from "@/components/LayoutStats";
import RelatedLayoutsList from "@/components/RelatedLayoutsList";
import CommentInput from "@/components/CommentInput";
import CommentList from "@/components/CommentList";
import LayoutCommentsWrapper from "@/components/LayoutCommentsWrapper";
import { getClanData } from "@/lib/coc";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

function getCloudinaryUrl(url: string, width = 800) {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  if (!url.includes("/upload/")) return url;
  if (url.includes("/f_auto") || url.includes("/q_auto")) return url;

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width},c_limit/`
  );
}

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

  const rawLayout = layoutResult.rows[0];
  // Convert to plain object for client component serialization
  const layout = rawLayout ? JSON.parse(JSON.stringify(rawLayout)) : null;

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
  // Convert to plain objects for client component serialization
  const relatedLayouts = relatedResult.rows.map(row => JSON.parse(JSON.stringify(row)));

  // Ensure all values from database are properly typed
  const description = layout.description ? String(layout.description) : "";
  const { title, content } = parseDescription(description);



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
    <main className="min-h-screen overflow-x-hidden bg-[#050505] font-poppins text-zinc-100 selection:bg-amber-500 selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar clanName={clan.name} badge="/badge_clan.webp" />

      <section className="relative isolate flex min-h-[72svh] items-end overflow-hidden bg-[#050505] pb-12 pt-32 sm:min-h-[78svh] sm:pb-16 md:pb-20">
        {layout.image_url && (
          <Image
            src={getCloudinaryUrl(String(layout.image_url), 1920)}
            alt=""
            fill
            sizes="100vw"
            priority
            className="absolute inset-0 -z-20 object-cover object-center"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/55 to-black/15" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#050505] via-black/30 to-black/30" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_60%,rgba(245,158,11,0.14),transparent_48%)]" />

        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <Link
            href="/layout"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-xs font-semibold text-zinc-200 backdrop-blur-md transition-colors hover:border-amber-400/40 hover:text-amber-200"
          >
            <ArrowLeft size={15} />
            Back to layouts
          </Link>

          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-amber-400/30 bg-black/45 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-amber-200 backdrop-blur-md">
                Town Hall {Number(layout.th_level)}
              </span>
              {layout.base_tag && (
                <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-200 backdrop-blur-md">
                  {String(layout.base_tag)}
                </span>
              )}
              {layout.source_type && (
                <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-300 backdrop-blur-md">
                  {String(layout.source_type)}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-black uppercase italic leading-[0.95] tracking-tight text-amber-300 drop-shadow-[0_3px_24px_rgba(0,0,0,0.85)] sm:text-5xl md:text-6xl" style={{ fontFamily: "'Docallisme', sans-serif" }}>
              {String(title)}
            </h1>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300/85">
              Base layout <span className="px-1 text-amber-400">/</span> AAA GANG collection
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
        <article>
          <div className="mb-8 border-b border-zinc-800/70 pb-6 sm:mb-10">
            <LayoutMetaInfo
              thLevel={Number(layout.th_level)}
              baseTag={String(layout.base_tag)}
              uploadDate={String(layout.upload_date)}
            />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400">
              Base strategy <span className="px-1 text-zinc-700">/</span> Town Hall {Number(layout.th_level)}
            </p>
          </div>

          <div className="max-w-none text-zinc-300">
            <LayoutDescription content={content} />
          </div>
        </article>

        <section className="mt-10 py-2 sm:mt-12" aria-labelledby="base-actions-title">
          <div className="mb-5">
            <p className="mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-amber-400">Ready for battle?</p>
            <h2 id="base-actions-title" className="text-xl font-black text-zinc-100 sm:text-2xl">
              Use this base
            </h2>
          </div>

          <LayoutStats
            layoutId={Number(layout.id)}
            viewCount={Number(layout.view_count)}
            likeCount={Number(layout.like_count)}
            copyLink={String(layout.copy_link)}
          />
          <div className="mt-5">
            <CopyLinkBox copyLink={String(layout.copy_link)} />
          </div>
          {layout.source_url && (
            <div className="mt-5">
              <SourceSection
                sourceUrl={String(layout.source_url)}
                sourceType={String(layout.source_type || "")}
              />
            </div>
          )}
        </section>

        <MonetagVignette />

        <div className="mt-10 border-t border-zinc-800/70 pt-8 sm:mt-12">
          <LayoutCommentsWrapper layoutId={Number(layout.id)} />
        </div>

        <div className="mt-12">
          <RelatedLayoutsList
            layouts={relatedLayouts}
            thLevel={Number(layout.th_level)}
          />
        </div>
      </section>

      <Footer clan={clan} />
    </main>
  );
}
