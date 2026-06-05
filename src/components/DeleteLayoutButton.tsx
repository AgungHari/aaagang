'use client';

import { Trash2, Loader2 } from 'lucide-react';
import { deleteLayout } from '@/app/admin/(protected)/dashboard/action';
import { useTransition, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer } from './Toast';
import { useToast } from './useToast';

interface DeleteLayoutButtonProps {
  layoutId: number;
  variant?: 'desktop' | 'mobile';
}

export default function DeleteLayoutButton({ layoutId, variant = 'desktop' }: DeleteLayoutButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toasts, removeToast, success, error } = useToast();
  const [showToast, setShowToast] = useState(false);

  const handleDelete = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      if (window.confirm('Yakin mau delete layout ini?')) {
        startTransition(async () => {
          try {
            await deleteLayout(layoutId);
            success('Layout berhasil dihapus!');
            setShowToast(true);
            // Refresh data setelah delete berhasil
            setTimeout(() => router.refresh(), 500);
          } catch (err) {
            error('Gagal menghapus layout. Silahkan coba lagi.');
            setShowToast(true);
            console.error('Delete failed:', err);
          }
        });
      }
    },
    [layoutId, router, success, error]
  );

  if (variant === 'mobile') {
    return (
      <>
        <form onSubmit={handleDelete}>
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-red-600/20 hover:bg-red-600/30 disabled:bg-red-600/10 disabled:opacity-60 text-red-400 py-2 rounded-lg flex items-center justify-center gap-2 transition disabled:cursor-not-allowed"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            <span className="text-sm font-semibold">{isPending ? 'Deleting...' : 'Delete'}</span>
          </button>
        </form>
        {showToast && <ToastContainer toasts={toasts} onClose={removeToast} />}
      </>
    );
  }

  return (
    <>
      <form onSubmit={handleDelete}>
        <button 
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1 bg-red-600/20 hover:bg-red-600/30 disabled:bg-red-600/10 disabled:opacity-60 text-red-400 px-3 py-1.5 rounded-lg transition text-sm font-semibold disabled:cursor-not-allowed"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          {isPending ? 'Deleting...' : 'Delete'}
        </button>
      </form>
      {showToast && <ToastContainer toasts={toasts} onClose={removeToast} />}
    </>
  );
}
