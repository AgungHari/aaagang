'use client';

import { useState, useMemo } from 'react';
import { Filter, X, Tags, ArrowUpDown } from 'lucide-react';
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
  const [sortMode, setSortMode] = useState<'newest' | 'views'>('newest');
  const [isOpenTH, setIsOpenTH] = useState(false);
  const [isOpenTag, setIsOpenTag] = useState(false);
  const [isOpenSort, setIsOpenSort] = useState(false);

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

  // Filter layouts berdasarkan selected TH, Tag, dan is_active status
  const filteredLayouts = useMemo(() => {
    const activeLayouts = layouts.filter(layout => {
      const matchTH = !selectedTH || layout.th_level === selectedTH;
      const matchTag = !selectedTag || layout.base_tag === selectedTag;
      const isActive = layout.is_active === 1;
      return matchTH && matchTag && isActive;
    });

    return [...activeLayouts].sort((a, b) => {
      if (sortMode === 'views') {
        return (Number(b.view_count) || 0) - (Number(a.view_count) || 0);
      }

      const aTime = new Date(a.upload_date).getTime();
      const bTime = new Date(b.upload_date).getTime();
      return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
    });
  }, [layouts, selectedTH, selectedTag, sortMode]);

  const newestDateKey = useMemo(() => {
    const validDates = filteredLayouts
      .map(layout => new Date(layout.upload_date).getTime())
      .filter(time => !Number.isNaN(time));

    if (validDates.length === 0) {
      return null;
    }

    const newestTimestamp = Math.max(...validDates);
    const newestDate = new Date(newestTimestamp);

    return new Date(
      newestDate.getFullYear(),
      newestDate.getMonth(),
      newestDate.getDate()
    ).getTime();
  }, [filteredLayouts]);

  const newestLayoutIds = useMemo(() => {
    if (!newestDateKey) {
      return new Set<number>();
    }

    return new Set(
      filteredLayouts
        .filter(layout => {
          const date = new Date(layout.upload_date);
          if (Number.isNaN(date.getTime())) {
            return false;
          }

          const layoutDateKey = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          ).getTime();

          return layoutDateKey === newestDateKey;
        })
        .map(layout => Number(layout.id))
    );
  }, [filteredLayouts, newestDateKey]);

  return (
    <>
      {/* Filter Buttons & Dropdowns */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {/* TH Level Filter */}
        <div className="relative">
          <button
            onClick={() => setIsOpenTH(!isOpenTH)}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900/80 border border-amber-500/30 hover:border-amber-500/60 rounded-xl transition text-amber-400 font-semibold text-sm shadow-[0_0_0_1px_rgba(251,191,36,0.08)]"
          >
            <Filter size={14} className="opacity-90" />
            <span className="hidden sm:inline">TH {selectedTH ? selectedTH : 'Level'}</span>
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
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900/80 border border-blue-500/30 hover:border-blue-500/60 rounded-xl transition text-blue-400 font-semibold text-sm shadow-[0_0_0_1px_rgba(96,165,250,0.08)]"
          >
            <Tags size={14} className="opacity-90" />
            <span className="hidden sm:inline">{selectedTag ? selectedTag : 'Base Tag'}</span>
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

        {/* Sort Filter */}
        <div className="relative">
          <button
            onClick={() => setIsOpenSort(!isOpenSort)}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900/80 border border-violet-500/30 hover:border-violet-500/60 rounded-xl transition text-violet-400 font-semibold text-sm shadow-[0_0_0_1px_rgba(167,139,250,0.08)]"
          >
            <ArrowUpDown size={14} className="opacity-90" />
            <span className="hidden sm:inline">{sortMode === 'views' ? 'Most Viewed' : 'Newest'}</span>
          </button>

          {isOpenSort && (
            <div className="absolute top-full left-0 mt-2 bg-zinc-900 border border-white/10 rounded-lg shadow-lg z-50 min-w-44">
              <button
                onClick={() => {
                  setSortMode('newest');
                  setIsOpenSort(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-white/5 transition text-sm ${
                  sortMode === 'newest'
                    ? 'bg-violet-500/20 text-violet-400 font-semibold'
                    : 'text-gray-300'
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => {
                  setSortMode('views');
                  setIsOpenSort(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-white/5 transition text-sm ${
                  sortMode === 'views'
                    ? 'bg-violet-500/20 text-violet-400 font-semibold'
                    : 'text-gray-300'
                }`}
              >
                Most Viewed
              </button>
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
          {filteredLayouts.map((layout, index) => {
            const isNewest = newestLayoutIds.has(Number(layout.id));

            return (
                <ScrollReveal key={layout.id} delay={index * 0.002}>
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
                    isNewest={isNewest}
                    isPriority={index === 0}
                  />
                </Link>
              </ScrollReveal>
            );
          })}
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
