'use client';

import { useState, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import LayoutCard from '@/components/LayoutCard';

interface Layout {
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
}

interface LayoutsFilterProps {
  layouts: Layout[];
}

export default function LayoutsFilter({ layouts }: LayoutsFilterProps) {
  const [selectedTH, setSelectedTH] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isOpenTH, setIsOpenTH] = useState(false);
  const [isOpenTag, setIsOpenTag] = useState(false);

  // Get unique TH levels dari layouts, sorted
  const thLevels = useMemo(() => {
    const levels = [...new Set(layouts.map(l => l.th_level))];
    return levels.sort((a, b) => b - a); // Descending order
  }, [layouts]);

  // Get unique base tags dari layouts, sorted
  const baseTags = useMemo(() => {
    const tags = [...new Set(layouts.map(l => l.base_tag))];
    return tags.sort();
  }, [layouts]);

  // Filter layouts berdasarkan selected TH dan Tag
  const filteredLayouts = useMemo(() => {
    return layouts.filter(layout => {
      const matchTH = !selectedTH || layout.th_level === selectedTH;
      const matchTag = !selectedTag || layout.base_tag === selectedTag;
      return matchTH && matchTag;
    });
  }, [layouts, selectedTH, selectedTag]);

  return (
    <>
      {/* Filter Buttons & Dropdowns */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {/* TH Level Filter */}
        <div className="relative">
          <button
            onClick={() => setIsOpenTH(!isOpenTH)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 rounded-lg transition text-amber-500 font-semibold text-sm"
          >
            <Filter size={16} />
            <span>TH {selectedTH ? selectedTH : 'Level'}</span>
          </button>

          {/* TH Dropdown Menu */}
          {isOpenTH && (
            <div className="absolute top-full left-0 mt-2 bg-zinc-900 border border-white/10 rounded-lg shadow-lg z-50 min-w-40">
              {/* Reset Filter */}
              <button
                onClick={() => {
                  setSelectedTH(null);
                  setIsOpenTH(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-white/5 transition text-sm text-gray-300 border-b border-white/5 flex items-center gap-2"
              >
                <X size={14} />
                Clear
              </button>

              {/* TH Level Options */}
              {thLevels.map(th => (
                <button
                  key={th}
                  onClick={() => {
                    setSelectedTH(th);
                    setIsOpenTH(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-white/5 transition text-sm ${
                    selectedTH === th
                      ? 'bg-amber-500/20 text-amber-400 font-semibold'
                      : 'text-gray-300'
                  }`}
                >
                  TH {th}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Base Tag Filter */}
        <div className="relative">
          <button
            onClick={() => setIsOpenTag(!isOpenTag)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/50 rounded-lg transition text-blue-400 font-semibold text-sm"
          >
            <Filter size={16} />
            <span>{selectedTag ? selectedTag : 'Base Tag'}</span>
          </button>

          {/* Tag Dropdown Menu */}
          {isOpenTag && (
            <div className="absolute top-full left-0 mt-2 bg-zinc-900 border border-white/10 rounded-lg shadow-lg z-50 min-w-40">
              {/* Reset Filter */}
              <button
                onClick={() => {
                  setSelectedTag(null);
                  setIsOpenTag(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-white/5 transition text-sm text-gray-300 border-b border-white/5 flex items-center gap-2"
              >
                <X size={14} />
                Clear
              </button>

              {/* Tag Options */}
              {baseTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(tag);
                    setIsOpenTag(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-white/5 transition text-sm ${
                    selectedTag === tag
                      ? 'bg-blue-500/20 text-blue-400 font-semibold'
                      : 'text-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Count Badge */}
        <span className="text-sm text-gray-400 ml-auto md:ml-0">
          {filteredLayouts.length} layout{filteredLayouts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Layouts Grid */}
      {filteredLayouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLayouts.map((layout) => (
            <ScrollReveal key={layout.id} delay={filteredLayouts.indexOf(layout) * 0.02}>
              <Link 
                href={`/layout/${Number(layout.id)}`}
                className="hover:opacity-90 transition-opacity"
              >
                <LayoutCard
                  id={Number(layout.id)}
                  th_level={Number(layout.th_level)}
                  base_tag={String(layout.base_tag)}
                  copy_link={String(layout.copy_link)}
                  image_url={String(layout.image_url)}
                  description={String(layout.description || "")}
                  source_type={String(layout.source_type || "")}
                  source_url={String(layout.source_url || "")}
                  upload_date={String(layout.upload_date)}
                  view_count={Number(layout.view_count || 0)}
                  like_count={Number(layout.like_count || 0)}
                  is_active={Number(layout.is_active || 1)}
                />
              </Link>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {selectedTH && selectedTag 
              ? `Tidak ada layouts untuk TH Level ${selectedTH} dengan tag ${selectedTag}.`
              : selectedTH 
              ? `Tidak ada layouts untuk TH Level ${selectedTH}. Coba filter yang lain.`
              : `Tidak ada layouts dengan tag ${selectedTag}. Coba filter yang lain.`
            }
          </p>
        </div>
      )}
    </>
  );
}
