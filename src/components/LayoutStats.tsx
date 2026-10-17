'use client';

import { useState, useEffect } from 'react';
import { Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import LikeButton from './LikeButton';
import { incrementViewCount } from '@/app/layout/action';

interface LayoutStatsProps {
  layoutId: number;
  viewCount: number;
  likeCount: number;
  copyLink: string;
}

export default function LayoutStats({
  layoutId,
  viewCount,
  likeCount,
  copyLink,
}: LayoutStatsProps) {
  const [currentViews, setCurrentViews] = useState(viewCount);

  useEffect(() => {
    const storageKey = 'viewedLayouts';
    let viewedLayouts: number[] = [];

    try {
      viewedLayouts = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
    } catch (error) {
      viewedLayouts = [];
    }

    if (!viewedLayouts.includes(layoutId)) {
      incrementViewCount(layoutId).then(result => {
        if (result.success) {
          setCurrentViews(prev => prev + 1);
          viewedLayouts.push(layoutId);
          try {
            sessionStorage.setItem(storageKey, JSON.stringify(viewedLayouts));
          } catch (error) {
            // ignore storage failures
          }
        }
      });
    }
  }, [layoutId]);

  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
      <div className="inline-flex min-h-10 items-center gap-2 px-1 text-sm text-zinc-500">
        <Eye size={16} />
        <span>{currentViews} views</span>
      </div>
      <LikeButton layoutId={layoutId} initialCount={likeCount} />
      <Link
        href={copyLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-10 shrink-0 items-center gap-2 px-1 text-sm font-medium text-amber-400 transition-colors hover:text-amber-200 focus-visible:outline-none focus-visible:text-amber-200"
      >
        <ExternalLink size={16} />
        Import
      </Link>
    </div>
  );
}
