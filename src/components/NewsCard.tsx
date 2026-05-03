import Link from "next/link";
import { extractYouTubeId } from "@/lib/newsHelper";
import { Play } from "lucide-react";

interface NewsCardProps {
  id: string;
  title: string;
  thumbnail?: string;
  category?: {
    title: string;
    color?: string;
  };
  postDate: number;
  type: string;
  embedUrl?: string;
  isEsport?: boolean;
}

export default function NewsCard({
  id,
  title,
  thumbnail,
  category,
  postDate,
  type,
  embedUrl,
  isEsport = false,
}: NewsCardProps) {
  const isVideo = type === "videoNewsEntry";
  const formattedDate = new Date(postDate).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const youtubeId = embedUrl ? extractYouTubeId(embedUrl) : null;
  const youtubeEmbedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}`
    : null;

  return (
    <Link href={isEsport ? `/news/esports/${id}` : `/news/article/${id}`}>
      <article className="group cursor-pointer h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-lg mb-4 aspect-video bg-zinc-900/50 border border-amber-500/20 group-hover:border-amber-500/50 transition-all duration-300">
          {/* Thumbnail/Video Preview */}
          {youtubeEmbedUrl ? (
            <div className="relative w-full h-full bg-black overflow-hidden">
              <img
                src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-amber-500/80 rounded-full flex items-center justify-center group-hover:bg-amber-500 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-amber-500/20">
                  <Play size={32} className="text-white fill-white ml-1" />
                </div>
              </div>
            </div>
          ) : thumbnail ? (
            <>
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-900/30 to-zinc-900 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          )}

          {/* Category Badge - Enhanced */}
          {category && (
            <div
              className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-md shadow-lg border border-white/20 transition-all duration-300 group-hover:shadow-xl"
              style={{ backgroundColor: `${category.color || '#f97316'}dd` }}
            >
              {category.title}
            </div>
          )}

          {/* Video Badge - Enhanced */}
          {isVideo && (
            <div className="absolute top-4 right-4 px-2.5 py-1.5 rounded-full text-xs font-bold text-white bg-red-600/90 backdrop-blur-md flex items-center gap-1 shadow-lg border border-red-400/30 transition-all duration-300 group-hover:bg-red-500 group-hover:shadow-xl">
              <Play size={12} className="fill-white" />
              VIDEO
            </div>
          )}
        </div>

        {/* Content - Flex Grow */}
        <div className="space-y-3 flex-grow flex flex-col justify-between">
          {/* Title - Enhanced */}
          <h3 className="text-base md:text-lg leading-snug font-bold text-zinc-100 group-hover:text-amber-400 transition-colors duration-300 line-clamp-2 uppercase tracking-tight">
            {title}
          </h3>

          {/* Date - Enhanced */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 group-hover:text-amber-500/70 transition-colors duration-300">
            <div className="w-1 h-1 rounded-full bg-amber-500/50 group-hover:bg-amber-500 transition-colors" />
            {formattedDate}
          </div>
        </div>

        {/* Card Border Glow Effect */}
        <div className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl shadow-amber-500/10" />
      </article>
    </Link>
  );
}
