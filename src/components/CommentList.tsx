'use client';

import { useEffect, useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircleWarning, Loader2 } from 'lucide-react';

interface Comment {
  id: number;
  layout_id: number;
  content: string;
  author_name: string;
  like_count: number;
  dislike_count: number;
  created_at: string;
}

interface CommentListProps {
  layoutId: number;
  refreshTrigger: number;
}

export default function CommentList({
  layoutId,
  refreshTrigger,
}: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [dislikedComments, setDislikedComments] = useState<Set<number>>(new Set());
  const [reportedComments, setReportedComments] = useState<Set<number>>(new Set());

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/comments?layoutId=${layoutId}`);

      if (!response.ok) {
        throw new Error('Gagal mengambil komentar');
      }

      const data = await response.json();
      setComments(data.comments);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [layoutId, refreshTrigger]);

  const handleLike = async (commentId: number) => {
    if (likedComments.has(commentId)) return; // Prevent double click

    try {
      setLikedComments((prev) => new Set([...prev, commentId]));

      const response = await fetch('/api/comments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId,
          layoutId,
          action: 'like',
        }),
      });

      if (!response.ok) throw new Error('Gagal like komentar');

      const data = await response.json();

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                like_count: data.like_count,
              }
            : comment
        )
      );
    } catch (err) {
      console.error(err);
      setLikedComments((prev) => {
        const updated = new Set(prev);
        updated.delete(commentId);
        return updated;
      });
    }
  };

  const handleDislike = async (commentId: number) => {
    if (dislikedComments.has(commentId)) return; // Prevent double click

    try {
      setDislikedComments((prev) => new Set([...prev, commentId]));

      const response = await fetch('/api/comments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId,
          layoutId,
          action: 'dislike',
        }),
      });

      if (!response.ok) throw new Error('Gagal dislike komentar');

      const data = await response.json();

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                dislike_count: data.dislike_count,
              }
            : comment
        )
      );
    } catch (err) {
      console.error(err);
      setDislikedComments((prev) => {
        const updated = new Set(prev);
        updated.delete(commentId);
        return updated;
      });
    }
  };

  const handleReport = async (commentId: number) => {
    if (reportedComments.has(commentId)) return; // Prevent double click

    try {
      setReportedComments((prev) => new Set([...prev, commentId]));

      const response = await fetch('/api/comments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId,
          layoutId,
          action: 'report',
        }),
      });

      if (!response.ok) throw new Error('Gagal report komentar');

      const data = await response.json();

      // If comment is hidden (report > 5), remove it from list
      if (!data.is_visible) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      }
    } catch (err) {
      console.error(err);
      setReportedComments((prev) => {
        const updated = new Set(prev);
        updated.delete(commentId);
        return updated;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg text-red-300">
        {error}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-400">
        <p>Belum ada komentar. Jadilah yang pertama berkomentar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="border-b border-zinc-800/50 p-4 hover:border-zinc-700/50 transition"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold text-white-500">
                {comment.author_name}
              </p>
              <p className="text-xs text-zinc-500">
                {new Date(String(comment.created_at)).toLocaleString('id-ID', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Content */}
          <p className="text-zinc-200 text-sm mb-4 leading-relaxed">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex gap-4 items-center">
            <button
              onClick={() => handleLike(comment.id)}
              disabled={likedComments.has(comment.id)}
              className="flex items-center gap-1 text-zinc-400 hover:text-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <ThumbsUp size={16} />
              <span>{comment.like_count}</span>
            </button>
            <button
              onClick={() => handleDislike(comment.id)}
              disabled={dislikedComments.has(comment.id)}
              className="flex items-center gap-1 text-zinc-400 hover:text-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <ThumbsDown size={16} />
              <span>{comment.dislike_count}</span>
            </button>
            <button
              onClick={() => handleReport(comment.id)}
              disabled={reportedComments.has(comment.id)}
              className="flex items-center gap-1 text-zinc-400 hover:text-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              title="Lapor komentar ini"
            >
              <MessageCircleWarning size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
