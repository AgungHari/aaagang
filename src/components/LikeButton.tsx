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
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition font-semibold text-sm ${
        hasLiked
          ? 'bg-red-500/20 text-red-400 cursor-not-allowed'
          : 'bg-red-600/20 hover:bg-red-600/30 text-red-400 active:scale-[0.98]'
      }`}
    >
      <ThumbsUp size={16} />
      <span>{likeCount} {hasLiked ? '' : 'Like'}</span>
    </button>
  );
}
