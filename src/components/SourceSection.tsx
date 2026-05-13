'use client';

import { siYoutube, siReddit } from 'simple-icons';
import { ExternalLink } from 'lucide-react';

interface SourceSectionProps {
  sourceUrl: string;
  sourceType?: string;
}

const renderSI = (icon: any, className = "text-white") => {
  const svg = icon.svg
    .replace(/fill="[^"]*"/g, "") // hapus semua fill
    .replace("<svg", '<svg fill="currentColor"'); // inject ke root

  return (
    <span
      dangerouslySetInnerHTML={{ __html: svg }}
      className={`w-3 h-3 inline-block ${className}`}
    />
  );
};

function getSourceIcon(sourceType?: string) {
  const type = String(sourceType || '').toLowerCase();
  if (type === 'youtube') {
    return renderSI(siYoutube, "text-zinc-200/70");
  }
  if (type === 'reddit') {
    return renderSI(siReddit, "text-zinc-200/70");
  }
  return <ExternalLink size={15} />;
}

export default function SourceSection({
  sourceUrl,
  sourceType,
}: SourceSectionProps) {
  if (!sourceUrl) return null;

  return (
    <div>
      <h2 className="text-lg text-amber-500 mb-4">Source</h2>
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex text-sm items-center gap-2 bg-zinc-600/20 hover:bg-zinc-600/30 text-zinc-400 px-4 py-3 rounded-lg transition"
      >
        {getSourceIcon(sourceType)}
        <span>{sourceType || 'External Link'}</span>
      </a>
    </div>
  );
}
