'use client';

import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  offset: number;
  itemsPerPage: number;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  offset,
  itemsPerPage,
}: PaginationControlsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleNavigation = (page: number) => {
    startTransition(() => {
      router.push(`?page=${page}`);
      // Scroll ke atas
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  return (
    <div className="flex justify-between items-center p-6 border-t border-white/10 bg-black/30">
      <div className="text-sm text-gray-400">
        Showing <span className="font-semibold text-white">{offset + 1}</span> to{" "}
        <span className="font-semibold text-white">
          {Math.min(offset + itemsPerPage, totalItems)}
        </span>{" "}
        of <span className="font-semibold text-white">{totalItems}</span> layouts
      </div>

      <div className="flex gap-2 items-center">
        {currentPage > 1 && (
          <button
            onClick={() => handleNavigation(currentPage - 1)}
            disabled={isPending}
            className="flex items-center gap-1 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 disabled:bg-zinc-800/30 disabled:opacity-60 text-gray-300 hover:text-white disabled:cursor-not-allowed rounded-lg transition text-sm font-medium"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <ChevronLeft size={16} />}
            Previous
          </button>
        )}

        <div className="flex items-center gap-1 px-3 py-2">
          <span className="text-gray-400 text-sm">
            Page <span className="font-semibold text-white">{currentPage}</span> of{" "}
            <span className="font-semibold text-white">{totalPages}</span>
          </span>
        </div>

        {currentPage < totalPages && (
          <button
            onClick={() => handleNavigation(currentPage + 1)}
            disabled={isPending}
            className="flex items-center gap-1 px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 disabled:bg-amber-600/10 disabled:opacity-60 text-amber-400 disabled:cursor-not-allowed rounded-lg transition text-sm font-medium"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <>
              Next
              <ChevronRight size={16} />
            </>}
          </button>
        )}
      </div>
    </div>
  );
}
