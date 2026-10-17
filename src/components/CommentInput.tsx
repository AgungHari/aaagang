'use client';

import { useRef, useState } from 'react';
import {
  Bold,
  Code,
  Italic,
  List,
  Loader2,
  Send,
  Smile,
  Strikethrough,
} from 'lucide-react';
import { generateRandomName } from '@/lib/generateRandomName';

interface CommentInputProps {
  layoutId: number;
  onCommentAdded: () => void;
}

const emojis = [
  '😀',
  '😂',
  '🥰',
  '😎',
  '🤔',
  '😭',
  '🔥',
  '❤️',
  '👏',
  '🎉',
  '💪',
  '⚔️',
];

export default function CommentInput({
  layoutId,
  onCommentAdded,
}: CommentInputProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const replaceSelection = (
    text: string,
    selectionStart: number,
    selectionEnd = selectionStart,
  ) => {
    setContent(
      content.slice(0, selectionStart) +
        text +
        content.slice(selectionEnd),
    );

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(
        selectionStart + text.length,
        selectionStart + text.length,
      );
    });
  };

  const insertFormatting = (before: string, after = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const selectedText = content.slice(selectionStart, selectionEnd);
    const placeholder = 'teks';
    const formattedText = `${before}${selectedText || placeholder}${after}`;
    const cursorStart = selectionStart + before.length;
    const cursorEnd =
      cursorStart + (selectedText ? selectedText.length : placeholder.length);

    setContent((currentContent) =>
      currentContent.slice(0, selectionStart) +
      formattedText +
      currentContent.slice(selectionEnd),
    );

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const insertList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const selectedText = content.slice(selectionStart, selectionEnd);
    const listText = selectedText
      ? selectedText.split('\n').map((line) => `- ${line}`).join('\n')
      : '- ';

    replaceSelection(listText, selectionStart, selectionEnd);
  };

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    replaceSelection(emoji, textarea.selectionStart, textarea.selectionEnd);
    setIsEmojiPickerOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!content.trim()) {
      setError('Komentar tidak boleh kosong');
      return;
    }

    if (content.length > 1000) {
      setError('Komentar terlalu panjang (maksimal 1000 karakter)');
      return;
    }

    setIsLoading(true);

    try {
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
    <div className="mb-8 border-b border-zinc-800/70 pb-5">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="comment-content" className="sr-only">
          Tulis komentar
        </label>
        <textarea
          ref={textareaRef}
          id="comment-content"
          placeholder="Tulis komentarmu di sini..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
          disabled={isLoading}
          rows={4}
          className="w-full resize-y bg-transparent px-0 py-2 text-sm leading-relaxed text-zinc-100 placeholder-zinc-500 focus:outline-none disabled:opacity-50"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/70 pt-3">
          <div className="flex items-center gap-1 text-zinc-400">
            <button
              type="button"
              onClick={() => insertFormatting('**')}
              disabled={isLoading}
              aria-label="Teks tebal"
              title="Tebal"
              className="p-2 transition hover:text-amber-400 disabled:opacity-50"
            >
              <Bold size={17} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*')}
              disabled={isLoading}
              aria-label="Teks miring"
              title="Miring"
              className="p-2 transition hover:text-amber-400 disabled:opacity-50"
            >
              <Italic size={17} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('~~')}
              disabled={isLoading}
              aria-label="Teks coret"
              title="Coret"
              className="p-2 transition hover:text-amber-400 disabled:opacity-50"
            >
              <Strikethrough size={17} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('`')}
              disabled={isLoading}
              aria-label="Teks kode"
              title="Kode"
              className="p-2 transition hover:text-amber-400 disabled:opacity-50"
            >
              <Code size={17} />
            </button>
            <button
              type="button"
              onClick={insertList}
              disabled={isLoading}
              aria-label="Daftar"
              title="Daftar"
              className="p-2 transition hover:text-amber-400 disabled:opacity-50"
            >
              <List size={17} />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsEmojiPickerOpen((open) => !open)}
                disabled={isLoading}
                aria-label="Pilih emoji"
                aria-expanded={isEmojiPickerOpen}
                aria-haspopup="true"
                title="Emoji"
                className="p-2 transition hover:text-amber-400 disabled:opacity-50"
              >
                <Smile size={17} />
              </button>
              {isEmojiPickerOpen && (
                <div
                  role="group"
                  aria-label="Pilih emoji"
                  className="absolute bottom-full left-0 z-10 mb-2 grid w-60 grid-cols-6 gap-1 rounded-lg border border-zinc-700 bg-zinc-900 p-2 shadow-xl"
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') setIsEmojiPickerOpen(false);
                  }}
                >
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => insertEmoji(emoji)}
                      aria-label={`Masukkan emoji ${emoji}`}
                      className="flex size-9 items-center justify-center rounded text-lg transition hover:bg-zinc-800"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`text-xs ${content.length > 950 ? 'text-amber-400' : 'text-zinc-500'}`}
              aria-live="polite"
            >
              {content.length}/1000
            </span>
            <button
              type="submit"
              disabled={isLoading || !content.trim()}
              className="flex items-center gap-2 text-sm font-medium text-amber-400 transition hover:text-amber-300 disabled:cursor-not-allowed disabled:text-zinc-600"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {isLoading ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-xs text-red-400">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="text-xs text-green-400">
            {success}
          </p>
        )}
      </form>
    </div>
  );
}
