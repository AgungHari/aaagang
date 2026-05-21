import { User, Copy, Check } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import { LoadingAnimation } from './LoadingAnimation';

interface GalleryItem {
  id: string;
  name: string;
  thLevel: number;
  imageUrl: string;
  baseUrl: string;
}

interface MessageItemProps {
  role: "user" | "ai";
  text: string;
  thinking?: string;
}

// Fungsi untuk parse [GALLERY_DATA] dari pesan
function parseGalleryData(text: string): { textContent: string; galleries: GalleryItem[] } {
  // Regex yang lebih fleksibel: match [GALLERY_DATA] diikuti JSON array
  const galleryRegex = /\[GALLERY_DATA\]\s*(\[[\s\S]*?\])\s*(?:\[\/GALLERY_DATA\])?/;
  const match = text.match(galleryRegex);

  let galleries: GalleryItem[] = [];
  let textContent = text;

  if (match && match[1]) {
    const jsonStr = match[1].trim();
    try {
      galleries = JSON.parse(jsonStr);
      // Hapus tag [GALLERY_DATA] dan JSON-nya dari teks
      textContent = text.replace(galleryRegex, '').trim();
    } catch (e) {
      console.warn('Invalid GALLERY_DATA JSON, ignoring gallery block:', jsonStr, e);
      textContent = text.replace(galleryRegex, '').trim();
      galleries = [];
    }
  }

  return { textContent, galleries };
}

const markdownComponents = {
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside my-3 ml-2 space-y-1">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-outside my-3 ml-6 space-y-1">{children}</ol>
  ),
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse border border-white/10">{children}</table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="border border-white/10 px-3 py-2 bg-white/5 font-semibold">{children}</th>
  ),
  td: ({ children }: any) => (
    <td className="border border-white/10 px-3 py-2">{children}</td>
  ),
};

// Komponen untuk menampilkan satu kartu gallery
function GalleryCard({ item }: { item: GalleryItem }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.baseUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <a href={item.baseUrl} target="_blank" rel="noopener noreferrer">
      <div className="group relative overflow-hidden rounded-lg border border-amber-500/20 bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10">
        {/* Image Container */}
        <div className="relative h-40 w-full overflow-hidden bg-zinc-950">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="relative p-4">
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-amber-100 group-hover:text-amber-300 transition-colors">
            {item.name}
          </h3>
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-block rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-300">
              TH {item.thLevel}
            </span>
          </div>

          {/* Copy Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleCopy();
            }}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-300 transition-all duration-200 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40"
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Layout</span>
              </>
            )}
          </button>
        </div>
      </div>
    </a>
  );
}

// Komponen untuk menampilkan grid gallery
function GalleryGrid({ items }: { items: GalleryItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="my-5 rounded-lg border border-amber-500/15 bg-black/30 p-4 backdrop-blur-sm">
      <p className="mb-4 text-xs font-semibold text-amber-300/70 uppercase tracking-widest">
        🔗 Recommended Layouts
      </p>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export function MessageItem({ role, text, thinking }: MessageItemProps) {
  const { textContent, galleries } = parseGalleryData(text);

  return (
    <div
      className={`flex items-end gap-3 ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      {role === "ai" && (
        <div className="h-10 w-10 rounded-full border border-amber-400/15 bg-amber-500/10 flex items-center justify-center text-amber-300">
          Σ
        </div>
      )}

      <div className={`max-w-[82%] rounded-2xl px-5 py-4 text-sm leading-7 break-words ${
        role === "ai"
          ? "bg-zinc-900/50 backdrop-blur-md border border-white/10 text-zinc-100"
          : "bg-amber-700/10 border border-amber-500/20 text-amber-100"
      }`}>
        {role === "ai" ? (
          <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-amber-300 prose-strong:font-semibold">
            
            {thinking && (
              <div className="mb-5 mt-1 rounded-xl bg-black/40 border border-white/5 p-4 font-sans text-zinc-400 shadow-inner">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  <span className="animate-pulse">Sigma is thinking</span> 
                </div>
                
                {/* Di sini keajaibannya! Kita pakai ReactMarkdown juga untuk 'thinking' */}
                <div className="text-sm italic opacity-80 border-l-2 border-zinc-700 pl-3 prose-strong:text-zinc-300">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    components={markdownComponents}
                  >
                    {thinking}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {textContent && (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {textContent}
              </ReactMarkdown>
            )}

            {!textContent && !thinking && <LoadingAnimation />}

            {galleries.length > 0 && <GalleryGrid items={galleries} />}
            
          </div>
        ) : (
          text
        )}
      </div>

      {role === "user" && (
        <div className="h-10 w-10 flex-shrink-0 rounded-full border border-zinc-700/70 bg-zinc-900 text-zinc-300 flex items-center justify-center">
          <User size={18} />
        </div>
      )}
    </div>
  );
}
