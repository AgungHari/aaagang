'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

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
    <section className="border-t border-zinc-800/70 pt-8 sm:pt-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-amber-400">
            Explore more bases
          </p>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
            More Town Hall {thLevel} layouts
          </h2>
        </div>
        <span className="hidden shrink-0 text-xs font-medium text-zinc-500 sm:block">
          Same Town Hall
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {layouts.map((related) => (
          <Link
            key={Number(related.id)}
            href={`/layout/${Number(related.id)}`}
            className="group min-w-0"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-900">
              {related.image_url ? (
                <Image
                  src={String(related.image_url)}
                  alt={parseDescription(String(related.description || '')).title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03] group-hover:opacity-90"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-950" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-100" />
              <span className="absolute bottom-3 left-3 rounded-md border border-white/15 bg-black/50 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-100 backdrop-blur-sm">
                {String(related.base_tag)}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 px-0.5 pt-3">
              <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-zinc-200 transition-colors group-hover:text-amber-300 sm:text-base">
                {parseDescription(String(related.description || '')).title}
              </h3>
              <ArrowUpRight
                size={16}
                className="mt-1 shrink-0 text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-400"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
