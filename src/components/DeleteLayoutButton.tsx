'use client';

import { Trash2 } from 'lucide-react';
import { deleteLayout } from '@/app/admin/dashboard/action';

interface DeleteLayoutButtonProps {
  layoutId: number;
  variant?: 'desktop' | 'mobile';
}

export default function DeleteLayoutButton({ layoutId, variant = 'desktop' }: DeleteLayoutButtonProps) {
  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (window.confirm('Yakin mau delete layout ini?')) {
      await deleteLayout(layoutId);
    }
  };

  if (variant === 'mobile') {
    return (
      <form onSubmit={handleDelete}>
        <button 
          type="submit" 
          className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <Trash2 size={16} />
          <span className="text-sm font-semibold">Delete</span>
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleDelete}>
      <button 
        type="submit" 
        className="inline-flex items-center gap-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-1.5 rounded-lg transition text-sm font-semibold"
      >
        <Trash2 size={14} />
        Delete
      </button>
    </form>
  );
}
