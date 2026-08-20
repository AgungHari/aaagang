export const dynamic = 'force-dynamic';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutMetaInfo from "@/components/LayoutMetaInfo";
import LayoutDescription from "@/components/LayoutDescription";
import CopyLinkBox from "@/components/CopyLinkBox";
import ProfitableAdUnit from "@/components/ProfitableAdUnit";

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
          <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl overflow-hidden mb-12 ">
            {/* Image */}
            {layout.image_url && (
              <div className="relative w-full aspect-video overflow-hidden bg-zinc-800">
                <Image
                  src={getCloudinaryUrl(String(layout.image_url), 1600)}
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
              <LayoutMetaInfo
                thLevel={Number(layout.th_level)}
                baseTag={String(layout.base_tag)}
                uploadDate={String(layout.upload_date)}
              />

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-semibold mb-8 text-amber-500">
                {String(title)}
              </h1>

              {/* Full Description */}
              <div className="space-y-8 text-justify">
                {/* Description */}
                <LayoutDescription content={content} />

                {/* Iklan Ad Unit */}
                {/* <ProfitableAdUnit /> */}

                {/* Copy Link */}
                <CopyLinkBox copyLink={String(layout.copy_link)} />

                {/* Source Information */}
                <SourceSection
                  sourceUrl={String(layout.source_url || "")}
                  sourceType={String(layout.source_type || "")}
                />

                {/* Stats */}
                <LayoutStats
                  layoutId={Number(layout.id)}
                  viewCount={Number(layout.view_count)}
                  likeCount={Number(layout.like_count)}
                  copyLink={String(layout.copy_link)}
                />
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-16">
            <LayoutCommentsWrapper layoutId={Number(layout.id)} />
          </div>

          {/* Related Layouts */}
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
