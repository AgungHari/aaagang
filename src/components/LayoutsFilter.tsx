'use client';

import { useState, useMemo } from 'react';
import { Check, ChevronDown, Filter, RotateCcw, Tags, ArrowUpDown } from 'lucide-react';
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
  comment_count: number;
  is_active: number;
}

interface LayoutsFilterProps {
  layouts: Layout[];
}

export default function LayoutsFilter({ layouts }: LayoutsFilterProps) {
  const [selectedTH, setSelectedTH] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<'newest' | 'views'>('newest');
  const [openDropdown, setOpenDropdown] = useState<'townHall' | 'tag' | 'sort' | null>(null);

  const baseFileNumbers = useMemo(() => {
    const chronologicalLayouts = layouts
      .filter(layout => layout.is_active === 1)
      .toSorted((a, b) => {
        const aTime = new Date(a.upload_date).getTime();
        const bTime = new Date(b.upload_date).getTime();

        if (Number.isNaN(aTime)) return Number.isNaN(bTime) ? a.id - b.id : 1;
        if (Number.isNaN(bTime)) return -1;
        return aTime - bTime || a.id - b.id;
      });

    return new Map(
      chronologicalLayouts.map((layout, index) => [Number(layout.id), index + 1])
    );
  }, [layouts]);

  const toggleDropdown = (dropdown: 'townHall' | 'tag' | 'sort') => {
    setOpenDropdown((current) => current === dropdown ? null : dropdown);
  };

  const optionClass = (selected: boolean) =>
    `flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
      selected
        ? 'bg-amber-500/10 font-semibold text-amber-300'
        : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
    }`;

  const dropdownClass =
    'absolute left-0 top-full z-50 mt-2 min-w-48 overflow-hidden rounded-xl border border-zinc-700/80 bg-zinc-950/95 p-1.5 shadow-[0_16px_45px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl';

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
      <div className="mb-8 rounded-2xl border border-zinc-800/70 bg-zinc-950/55 p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
            <Filter size={13} className="text-amber-400" />
            Refine layouts
          </div>
          {(selectedTH !== null || selectedTag !== null) && (
            <button
              type="button"
              onClick={() => {
                setSelectedTH(null);
                setSelectedTag(null);
                setOpenDropdown(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500 transition-colors hover:bg-white/5 hover:text-amber-300"
            >
              <RotateCcw size={12} />
              Reset filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
        {/* TH Level Filter */}
        <div className="relative">
          <button
            type="button"
            aria-expanded={openDropdown === 'townHall'}
            aria-haspopup="menu"
            onClick={() => toggleDropdown('townHall')}
            className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              selectedTH !== null || openDropdown === 'townHall'
                ? 'border-amber-400/50 bg-amber-400/10 text-amber-200'
                : 'border-zinc-700/80 bg-zinc-900/70 text-zinc-300 hover:border-amber-400/35 hover:text-amber-200'
            }`}
          >
            <Filter size={14} />
            <span>TH {selectedTH ?? 'Level'}</span>
            <ChevronDown size={13} className={`text-zinc-500 transition-transform ${openDropdown === 'townHall' ? 'rotate-180' : ''}`} />
          </button>

          {openDropdown === 'townHall' && (
            <div className={dropdownClass} role="menu" aria-label="Filter by Town Hall">
              <p className="px-3 pb-2 pt-1 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-600">Town Hall level</p>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={selectedTH === null}
                onClick={() => {
                  setSelectedTH(null);
                  setOpenDropdown(null);
                }}
                className={optionClass(selectedTH === null)}
              >
                All Town Halls
                {selectedTH === null && <Check size={14} className="text-amber-400" />}
              </button>
              {thLevels.map(th => (
                <button
                  key={th}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selectedTH === th}
                  onClick={() => {
                    setSelectedTH(th);
                    setOpenDropdown(null);
                  }}
                  className={optionClass(selectedTH === th)}
                >
                  TH {th}
                  {selectedTH === th && <Check size={14} className="text-amber-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Base Tag Filter */}
        <div className="relative">
          <button
            type="button"
            aria-expanded={openDropdown === 'tag'}
            aria-haspopup="menu"
            onClick={() => toggleDropdown('tag')}
            className={`inline-flex h-10 max-w-56 items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              selectedTag !== null || openDropdown === 'tag'
                ? 'border-amber-400/50 bg-amber-400/10 text-amber-200'
                : 'border-zinc-700/80 bg-zinc-900/70 text-zinc-300 hover:border-amber-400/35 hover:text-amber-200'
            }`}
          >
            <Tags size={14} className="shrink-0" />
            <span className="truncate">{selectedTag ?? 'Base tag'}</span>
            <ChevronDown size={13} className={`shrink-0 text-zinc-500 transition-transform ${openDropdown === 'tag' ? 'rotate-180' : ''}`} />
          </button>

          {openDropdown === 'tag' && (
            <div className={dropdownClass} role="menu" aria-label="Filter by base tag">
              <p className="px-3 pb-2 pt-1 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-600">Base type</p>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={selectedTag === null}
                onClick={() => {
                  setSelectedTag(null);
                  setOpenDropdown(null);
                }}
                className={optionClass(selectedTag === null)}
              >
                All base types
                {selectedTag === null && <Check size={14} className="text-amber-400" />}
              </button>
              {baseTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selectedTag === tag}
                  onClick={() => {
                    setSelectedTag(tag);
                    setOpenDropdown(null);
                  }}
                  className={optionClass(selectedTag === tag)}
                >
                  {tag}
                  {selectedTag === tag && <Check size={14} className="text-amber-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Filter */}
        <div className="relative">
          <button
            type="button"
            aria-expanded={openDropdown === 'sort'}
            aria-haspopup="menu"
            onClick={() => toggleDropdown('sort')}
            className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              openDropdown === 'sort'
                ? 'border-amber-400/50 bg-amber-400/10 text-amber-200'
                : 'border-zinc-700/80 bg-zinc-900/70 text-zinc-300 hover:border-amber-400/35 hover:text-amber-200'
            }`}
          >
            <ArrowUpDown size={14} />
            <span>{sortMode === 'views' ? 'Most viewed' : 'Newest'}</span>
            <ChevronDown size={13} className={`text-zinc-500 transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
          </button>

          {openDropdown === 'sort' && (
            <div className={dropdownClass} role="menu" aria-label="Sort layouts">
              <p className="px-3 pb-2 pt-1 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-600">Sort by</p>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={sortMode === 'newest'}
                onClick={() => {
                  setSortMode('newest');
                  setOpenDropdown(null);
                }}
                className={optionClass(sortMode === 'newest')}
              >
                Newest
                {sortMode === 'newest' && <Check size={14} className="text-amber-400" />}
              </button>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={sortMode === 'views'}
                onClick={() => {
                  setSortMode('views');
                  setOpenDropdown(null);
                }}
                className={optionClass(sortMode === 'views')}
              >
                Most Viewed
                {sortMode === 'views' && <Check size={14} className="text-amber-400" />}
              </button>
            </div>
          )}
        </div>

        {/* Count Badge */}
        <span className="text-sm text-gray-400 ml-auto md:ml-0">
          {filteredLayouts.length} layout{filteredLayouts.length !== 1 ? 's' : ''}
        </span>
        </div>
      </div>

      {/* Layouts Grid */}
      {filteredLayouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLayouts.map((layout, index) => {
            const isNewest = newestLayoutIds.has(Number(layout.id));

            return (
                <ScrollReveal key={layout.id} delay={index * 0.002}>
                <LayoutCard
                  id={Number(layout.id)}
                  baseFileNumber={baseFileNumbers.get(Number(layout.id)) ?? 0}
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
                  comment_count={Number(layout.comment_count || 0)}
                  is_active={Number(layout.is_active || 1)}
                  isNewest={isNewest}
                  isPriority={index === 0}
                />
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
