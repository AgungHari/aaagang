'use client';

import Link from 'next/link';
import Image from 'next/image';

interface RelatedLayout {
  id: number | string;
  image_url?: string;
  base_tag: string;
  description?: string;
}

interface RelatedLayoutsListProps {
  layouts: RelatedLayout[];
  thLevel: number;
}

function parseDescription(
  markdown: string
): { title: string; content: string } {
  if (!markdown) {
    return { title: 'Base Layout', content: '' };
  }

  const lines = markdown.split('\n');
  let title = 'Base Layout';
  let content = markdown;

  if (lines[0]?.startsWith('# ')) {
    title = lines[0].replace(/^# /, '').trim();
    content = lines.slice(1).join('\n').trim();
  } else if (lines[0]) {
    title = lines[0];
    content = lines.slice(1).join('\n').trim();
  }

  return { title, content };
}

export default function RelatedLayoutsList({
  layouts,
  thLevel,
}: RelatedLayoutsListProps) {
  if (layouts.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">
        Layouts TH {thLevel} Lainnya
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {layouts.map((related) => (
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
                {parseDescription(String(related.description || '')).title}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {String(related.base_tag)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
