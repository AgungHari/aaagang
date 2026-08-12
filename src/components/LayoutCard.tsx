'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { siYoutube, siReddit} from 'simple-icons';
import { Eye, ThumbsUp, Copy, Play, MessageSquare, ExternalLink } from "lucide-react";
import { incrementLikeCount } from "@/app/layout/action";

interface LayoutCardProps {
  id: number;
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
  is_active: number;
  isNewest?: boolean;
}

export default function LayoutCard({
  id,
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
  is_active,
  isNewest = false,
}: LayoutCardProps) {
  const [views, setViews] = useState(view_count);
  const [likes, setLikes] = useState(like_count);
  const [isCopied, setIsCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Hide card jika is_active = 0
  if (!is_active) {
    return null;
  }

  // Handle copy link
  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(copy_link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Handle like count
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await incrementLikeCount(id);
    if (result.success) {
      setLikes(likes + 1);
    }
  };
  const renderSI = (icon: any, className = "text-white") => {
    const svg = icon.svg
      .replace(/fill="[^"]*"/g, "") // hapus semua fill
      .replace("<svg", '<svg fill="currentColor"'); // inject ke root

    return (
      <span
        dangerouslySetInnerHTML={{ __html: svg }}
        className={`w-4 h-4 inline-block ${className}`}
      />
    );  
  };

  // Get source icon
  const getSourceIcon = () => {
    if (source_type?.toLowerCase() === "youtube") {
      return renderSI(siYoutube, "text-zinc-200/70");
    }
    if (source_type?.toLowerCase() === "reddit") {
      return renderSI(siReddit, "text-zinc-200/70");
    }
    return <ExternalLink size={14} />;
  };

  // Format date
  const formattedDate = new Date(upload_date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Parse markdown dari description
  const { title, content } = parseDescription(description);

  return (
    <div 
      className={[
        "rounded-2xl overflow-hidden transition-all group cursor-pointer relative",
        isNewest
          ? "border border-amber-500/70 bg-gradient-to-b from-amber-600/10 via-zinc-900/20 to-zinc-900/60 shadow-[0_0_0_1px_rgba(245,158,11,0.35),0_0_22px_rgba(245,158,11,0.22),0_0_40px_rgba(217,119,6,0.14)]"
          : "bg-gradient-to-b from-amber-600/10 via-zinc-900/20 to-zinc-900/60 border border-zinc-800/50 hover:border-amber-500/50"
      ].join(" ")}
    >
      {isNewest && (
        <div className="absolute inset-x-0 top-0 z-20 flex justify-center pointer-events-none">
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-500/60 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.28)] animate-pulse">
            <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
            Newest
          </div>
        </div>
      )}

      {/* Image Section */}
      {image_url && !imageError && (
        <div className="relative w-full aspect-video overflow-hidden bg-zinc-800">
          <Image
            src={image_url}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-85"
            loading="lazy"
            onError={() => setImageError(true)}
          />
          {/* TH Level Badge */}
          <div className="absolute top-4 left-4 backdrop-blur text-white px-3 py-1 rounded-lg text-sm">
            TH {th_level}
          </div>

          {/* Open Link Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(copy_link, "_blank");
            }}
            className="absolute top-4 right-4 hover:bg-amber-700 backdrop-blur text-white p-2 rounded-lg transition flex items-center gap-2"
          >
            <ExternalLink size={16} />
            <span className="text-xs font-semibold">Copy</span>
          </button>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title and Tag */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3
              className={[
                "text-lg font-bold mb-2 line-clamp-2 transition-all",
                isNewest
                  ? "text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)] animate-pulse"
                  : "text-white"
              ].join(" ")}
            >
              {title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-block bg-zinc-700/40 text-zinc-300 px-3 py-1 rounded-lg font-semibold text-xs">
                {base_tag}
              </span>
              {isNewest && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.25em] text-amber-400 animate-pulse">
                  New
                </span>
              )}
              <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {content && (
          <div className="text-sm text-gray-300 line-clamp-2 prose prose-sm prose-invert max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="m-0">{children}</p>,
                h1: ({ children }) => <h1 className="text-base font-bold m-0">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-bold m-0">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xs font-bold m-0">{children}</h3>,
                ul: ({ children }) => <ul className="m-0 pl-4">{children}</ul>,
                li: ({ children }) => <li className="m-0">{children}</li>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}

        {/* Source Button */}
        {source_url && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(source_url, "_blank");
            }}
            className="inline-flex items-center gap-2 bg-purple-zinc/20 hover:bg-zinc-600/30 text-zinc-400 px-3 py-1.5 rounded-lg transition text-xs font-semibold"
          >
            {getSourceIcon()}
            <span>Source</span>
          </button>
        )}

        {/* Stats Footer */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Eye size={14} />
            <span>{views}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <ThumbsUp size={14} />
            <span>{likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Parse description markdown untuk extract judul
 * Format: # Title\n\nContent
 */
function parseDescription(markdown: string): { title: string; content: string } {
  if (!markdown) {
    return { title: "Base Layout", content: "" };
  }

  const lines = markdown.split("\n");
  let title = "Base Layout";
  let content = markdown;

  // Check if first line is h1
  if (lines[0]?.startsWith("# ")) {
    title = lines[0].replace(/^# /, "").trim();
    content = lines.slice(1).join("\n").trim();
  } else if (lines[0]) {
    // Use first line as title jika bukan markdown h1
    title = lines[0];
    content = lines.slice(1).join("\n").trim();
  }

  return { title, content };
}
