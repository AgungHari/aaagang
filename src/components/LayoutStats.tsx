'use client';

import Link from 'next/link';
import { Eye, ExternalLink } from 'lucide-react';
import LikeButton from './LikeButton';

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
  return (
    <div className="flex items-center gap-6 pt-4 border-t border-white/10">
      <div className="flex items-center gap-2 text-gray-400">
        <Eye size={18} />
        <span className="text-sm">
          {viewCount} <span className="hidden md:inline">Views</span>
        </span>
      </div>
      <LikeButton layoutId={layoutId} initialCount={likeCount} />
      <Link
        href={copyLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-900 text-white px-4 py-2 rounded-lg transition font-semibold text-sm shrink-0"
      >
        <ExternalLink size={16} />
        Import
      </Link>
    </div>
  );
}
