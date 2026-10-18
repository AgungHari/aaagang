'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { siReddit, siYoutube } from "simple-icons";
import { Check, Copy, Eye, ExternalLink, LayoutGrid, MessageSquare, ThumbsUp } from "lucide-react";

function getCloudinaryUrl(url: string, width = 800) {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  if (!url.includes("/upload/")) return url;
  if (url.includes("/f_auto") || url.includes("/q_auto")) return url;

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width},c_limit/`
  );
}

interface LayoutCardProps {
  id: number;
  baseFileNumber: number;
  th_level: number;
  base_tag: string;
  copy_link: string;
  image_url: string;
  description: string;
  source_type: string;
  source_url: string;
  upload_date: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_active: number;
  isNewest?: boolean;
  isPriority?: boolean;
}

export default function LayoutCard({
  id,
  baseFileNumber,
  th_level,
  base_tag,
  copy_link,
  image_url,
  description,
  source_type,
  source_url,
  upload_date,
  view_count,
  like_count,
  comment_count,
  is_active,
  isNewest = false,
  isPriority = false,
}: LayoutCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!is_active) {
    return null;
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(copy_link);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy layout link:", error);
    }
  };

  const renderSourceIcon = (icon: { path: string }) => (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-3.5 fill-current"
    >
      <path d={icon.path} />
    </svg>
  );

  const sourceIcon =
    source_type?.toLowerCase() === "youtube"
      ? renderSourceIcon(siYoutube)
      : source_type?.toLowerCase() === "reddit"
        ? renderSourceIcon(siReddit)
        : <ExternalLink size={14} />;

  const formattedDate = new Date(upload_date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const { title, content } = parseDescription(description);
  const descriptionPreview = createDescriptionPreview(content);

  return (
    <article
      className={[
        "group/card relative isolate cursor-pointer overflow-hidden rounded-[1.6rem] border bg-[#090a0c] transition duration-300 hover:-translate-y-1",
        isNewest
          ? "border-amber-400/60 shadow-[0_18px_55px_-28px_rgba(245,158,11,0.45)]"
          : "border-zinc-800/80 hover:border-amber-500/40 hover:shadow-[0_18px_55px_-30px_rgba(245,158,11,0.25)]",
      ].join(" ")}
    >
      <Link
        href={`/layout/${id}`}
        aria-label={`Lihat detail ${title}`}
        className="absolute inset-0 z-10 rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />

      <div className="pointer-events-none relative block aspect-[1.3/1] overflow-hidden bg-zinc-900">
        {image_url && !imageError ? (
          <Image
            src={getCloudinaryUrl(image_url, 800)}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover/card:scale-105"
            loading={isPriority ? "eager" : "lazy"}
            preload={isPriority}
            fetchPriority={isPriority ? "high" : "auto"}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_40%,rgba(245,158,11,0.13),transparent_55%),linear-gradient(135deg,#18181b,#090a0c)]">
            <LayoutGrid size={42} strokeWidth={1} className="text-amber-400/50" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/85" />

        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
          <span className="rounded-md border border-white/15 bg-black/55 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-zinc-200 backdrop-blur-md">
            Base file · {baseFileNumber.toString().padStart(3, "0")}
          </span>
          {isNewest && (
            <span className="rounded-md border border-amber-300/50 bg-amber-400 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.17em] text-black shadow-[0_0_22px_rgba(245,158,11,0.25)]">
              New arrival
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-1 text-[8px] font-black uppercase tracking-[0.25em] text-amber-300">
              Defense blueprint
            </p>
            <h3 className="line-clamp-2 text-xl font-black leading-tight tracking-tight text-white drop-shadow-lg sm:text-2xl">
              {title}
            </h3>
          </div>
          <div className="shrink-0 border-l border-white/30 pl-3 text-right text-white">
            <span className="block text-[8px] font-black uppercase tracking-[0.2em] text-zinc-300">
              Town Hall
            </span>
            <span className="block text-3xl font-black leading-none tabular-nums">
              {th_level}
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none relative z-20 p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full border border-amber-400/20 bg-amber-300/[0.07] px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-amber-200">
            {base_tag}
          </span>
          <span className="text-[10px] font-medium tabular-nums text-zinc-500">
            {formattedDate}
          </span>
        </div>

        {descriptionPreview && (
          <p className="line-clamp-2 min-h-10 overflow-hidden text-ellipsis text-xs leading-5 text-zinc-400">
            {descriptionPreview}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/[0.08] pt-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-semibold tabular-nums text-zinc-400">
            <span className="inline-flex items-center gap-1.5" title="Views">
              <Eye size={13} className="text-zinc-500" />
              {view_count}
            </span>
            <span className="inline-flex items-center gap-1.5" title="Likes">
              <ThumbsUp size={13} className="text-zinc-500" />
              {like_count}
            </span>
            <span className="inline-flex items-center gap-1.5 text-amber-200" title="Komentar">
              <MessageSquare size={13} className="text-amber-400" />
              {comment_count}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <a
              href={copy_link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buka link untuk import layout ke Clash of Clans"
              className="pointer-events-auto inline-flex h-8 items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400 px-3 text-[9px] font-black uppercase tracking-[0.12em] text-zinc-950 transition hover:bg-amber-300"
            >
              Import
              <ExternalLink size={12} />
            </a>
            {source_url && (
              <a
                href={source_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Buka sumber ${source_type || "layout"}`}
                className="pointer-events-auto inline-flex size-8 items-center justify-center rounded-full border border-zinc-700/80 text-zinc-400 transition hover:border-zinc-500 hover:text-white"
              >
                {sourceIcon}
              </a>
            )}
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label={isCopied ? "Link layout tersalin" : "Salin link layout"}
              title={isCopied ? "Tersalin" : "Salin link layout"}
              className="pointer-events-auto inline-flex size-8 items-center justify-center rounded-full border border-amber-400/35 bg-amber-400/[0.08] text-amber-200 transition hover:border-amber-300 hover:bg-amber-400/15"
            >
              {isCopied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>
    </article>
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

function createDescriptionPreview(markdown: string): string {
  return markdown
    .replace(/^\s*([-*_]\s*){3,}$/gm, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
