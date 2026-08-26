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

interface ImageItem {
  id: string;
  name: string;
  imageUrl: string;
}

interface MessageItemProps {
  role: "user" | "ai";
  text: string;
  thinking?: string;
}

function parseGalleryJson(jsonStr: string): GalleryItem[] {
  const parse = (value: string) => {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as GalleryItem[] : [];
  };

  try {
    return parse(jsonStr);
  } catch {
    // Some models omit quotes around a URL even though the rest is valid JSON.
    const repairedJson = jsonStr.replace(
      /("(?:imageUrl|baseUrl)"\s*:\s*)(\[https?:\/\/[^\]]+\]\(https?:\/\/[^)]+\)|https?:\/\/[^\s,}\]]+)/g,
      '$1"$2"',
    );
    return parse(repairedJson);
  }
}

function normalizeGalleryItems(items: GalleryItem[]): GalleryItem[] {
  return items.map((item) => ({
    ...item,
    imageUrl: item.imageUrl.replace(/^\[([^\]]+)\]\(\1\)$/, '$1'),
    baseUrl: item.baseUrl.replace(/^\[([^\]]+)\]\(\1\)$/, '$1'),
  }));
}

// Fungsi untuk parse [GALLERY_DATA] dari pesan
function parseGalleryData(text: string): { textContent: string; galleries: GalleryItem[] } {
  let galleries: GalleryItem[] = [];
  let textContent = text;

  // Cari posisi [GALLERY_DATA]
  const startTag = '[GALLERY_DATA]';
  const endTag = '[/GALLERY_DATA]';
  const startIndex = text.indexOf(startTag);
  
  if (startIndex === -1) {
    return { textContent, galleries };
  }

  // Cari posisi [/GALLERY_DATA] atau gunakan bracket matching
  const closingTagIndex = text.indexOf(endTag, startIndex);
  let endIndex = closingTagIndex;
  let jsonStr = '';

  if (endIndex !== -1) {
    // Ada closing tag, ambil string diantara keduanya
    jsonStr = text.substring(startIndex + startTag.length, endIndex).trim();
  } else {
    // Tidak ada closing tag, gunakan bracket matching untuk menemukan array JSON
    let bracketCount = 0;
    let jsonStart = -1;
    let jsonEnd = -1;

    for (let i = startIndex + startTag.length; i < text.length; i++) {
      const char = text[i];
      
      if (char === '[') {
        if (jsonStart === -1) jsonStart = i;
        bracketCount++;
      } else if (char === ']') {
        bracketCount--;
        if (bracketCount === 0 && jsonStart !== -1) {
          jsonEnd = i + 1;
          break;
        }
      }
    }

    if (jsonStart !== -1 && jsonEnd !== -1) {
      jsonStr = text.substring(jsonStart, jsonEnd).trim();
      endIndex = jsonEnd;
    }
  }

  // Coba parse JSON
  if (jsonStr) {
    try {
      galleries = normalizeGalleryItems(parseGalleryJson(jsonStr));
      // Hapus tag [GALLERY_DATA] sampai [/GALLERY_DATA] atau sampai akhir array JSON
      if (endIndex !== -1) {
        const removalEnd = closingTagIndex !== -1
          ? endIndex + endTag.length
          : endIndex;
        textContent = (text.substring(0, startIndex) + text.substring(removalEnd)).trim();
      } else {
        // Jika tidak ada end tag, cari posisi akhir dari JSON
        const jsonMatch = text.substring(startIndex).match(/\[GALLERY_DATA\]\s*\[[\s\S]*?\]/);
        if (jsonMatch) {
          textContent = text.replace(jsonMatch[0], '').trim();
        }
      }
    } catch (e) {
      console.warn('Invalid GALLERY_DATA JSON:', jsonStr, e);
      galleries = [];
    }
  }

  return { textContent, galleries };
}

function parseImageData(text: string): { textContent: string; images: ImageItem[] } {
  let images: ImageItem[] = [];
  let textContent = text;
  const startTag = '[IMAGE]';
  const endTag = '[/IMAGE]';
  const startIndex = text.indexOf(startTag);

  if (startIndex === -1) {
    return { textContent, images };
  }

  let endIndex = text.indexOf(endTag, startIndex);
  let jsonStr = '';

  if (endIndex !== -1) {
    jsonStr = text.substring(startIndex + startTag.length, endIndex).trim();
  } else {
    let bracketCount = 0;
    let jsonStart = -1;
    let jsonEnd = -1;

    for (let i = startIndex + startTag.length; i < text.length; i++) {
      const char = text[i];

      if (char === '[') {
        if (jsonStart === -1) jsonStart = i;
        bracketCount++;
      } else if (char === ']') {
        bracketCount--;
        if (bracketCount === 0 && jsonStart !== -1) {
          jsonEnd = i + 1;
          break;
        }
      }
    }

    if (jsonStart !== -1 && jsonEnd !== -1) {
      jsonStr = text.substring(jsonStart, jsonEnd).trim();
      endIndex = jsonEnd;
    }
  }

  if (jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      images = Array.isArray(parsed) ? parsed : [];

      if (endIndex !== -1) {
        const removalEnd = text.indexOf(endTag, endIndex) === endIndex
          ? endIndex + endTag.length
          : endIndex;
        textContent = (text.substring(0, startIndex) + text.substring(removalEnd)).trim();
      }
    } catch (e) {
      console.warn('Invalid IMAGE JSON:', jsonStr, e);
    }
  }

  return { textContent, images };
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

function ImageCard({ item }: { item: ImageItem }) {
  return (
    <div className="group overflow-hidden rounded-lg border border-amber-500/20 bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10">
      <div className="relative h-40 w-full overflow-hidden bg-zinc-950">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-amber-100 transition-colors group-hover:text-amber-300">
          {item.name}
        </h3>
      </div>
    </div>
  );
}

function ImageGrid({ items }: { items: ImageItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="my-5 rounded-lg border border-amber-500/15 bg-black/30 p-4 backdrop-blur-sm">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-amber-300/70">
        Equipment Images
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ImageCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export function MessageItem({ role, text, thinking }: MessageItemProps) {
  const { textContent, galleries } = parseGalleryData(text);
  const { textContent: textWithoutImages, images } = parseImageData(textContent);

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

            {textWithoutImages && (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {textWithoutImages}
              </ReactMarkdown>
            )}

            {!textWithoutImages && !thinking && <LoadingAnimation />}

            {galleries.length > 0 && <GalleryGrid items={galleries} />}
            {images.length > 0 && <ImageGrid items={images} />}
            
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
