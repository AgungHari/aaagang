'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { generateRandomName } from '@/lib/generateRandomName';

interface CommentInputProps {
  layoutId: number;
  onCommentAdded: () => void;
}

export default function CommentInput({
  layoutId,
  onCommentAdded,
}: CommentInputProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!content.trim()) {
      setError('Komentar tidak boleh kosong');
      return;
    }

    if (content.length > 1000) {
      setError('Komentar terlalu panjang (max 1000 karakter)');
      return;
    }

    setIsLoading(true);

    try {
      // Generate random name on client
      const generatedName = generateRandomName();

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          layoutId,
          content: content.trim(),
          authorName: generatedName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Gagal menambahkan komentar');
      }

      setSuccess('Komentar berhasil ditambahkan!');
      setContent('');

      // Refresh comments after a short delay
      setTimeout(() => {
        onCommentAdded();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-lg p-4 mb-8 hover:border-zinc-700/50 transition">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Comment Content */}
        <textarea
          placeholder="Tulis komentarmu di sini..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
          disabled={isLoading}
          rows={3}
          className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition disabled:opacity-50 resize-none"
        />

        {/* Character count & Button Row */}
        <div className="flex justify-between items-center gap-3">
          <div className="text-xs text-zinc-500">
            {content.length}/1000
          </div>

          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 text-black font-semibold py-1.5 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-2 bg-red-900/20 border border-red-700/50 rounded-lg text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-2 bg-green-900/20 border border-green-700/50 rounded-lg text-green-300 text-xs">
            {success}
          </div>
        )}
      </form>
    </div>
  );
}
