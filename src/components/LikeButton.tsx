'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { incrementLikeCount } from '@/app/layout/action';

interface LikeButtonProps {
  layoutId: number;
  initialCount: number;
}

export default function LikeButton({ layoutId, initialCount }: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const likedLayouts = JSON.parse(localStorage.getItem('likedLayouts') || '[]');
    if (likedLayouts.includes(layoutId)) {
      setHasLiked(true);
    }
  }, [layoutId]);

  const handleLike = async () => {
    if (hasLiked || isLoading) return;

    setIsLoading(true);
    try {
      const result = await incrementLikeCount(layoutId);
      if (result.success) {
        setLikeCount(likeCount + 1);
        setHasLiked(true);
        
        // Save to localStorage
        const likedLayouts = JSON.parse(localStorage.getItem('likedLayouts') || '[]');
        likedLayouts.push(layoutId);
        localStorage.setItem('likedLayouts', JSON.stringify(likedLayouts));
      }
    } catch (error) {
      console.error('Error liking layout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={hasLiked || isLoading}
      className={`inline-flex min-h-10 items-center gap-2 px-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:text-amber-200 ${
        hasLiked
          ? 'text-amber-300'
          : 'text-zinc-400 hover:text-amber-200'
      }`}
    >
      <ThumbsUp size={16} />
      <span>
        <span>{likeCount}</span>
        <span className="hidden md:inline"> {hasLiked ? 'Liked' : 'Like'}</span>
      </span>
    </button>
  );
}
