export default function Loading() {
  return (
    <main className="min-h-screen text-zinc-100 font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
            <div className="w-3 h-3 bg-zinc-800 rounded-full animate-pulse" />
            <div className="w-24 h-3 bg-zinc-800 rounded-full animate-pulse" />
          </div>

          <div className="space-y-4">
            <div className="w-3/4 h-14 bg-zinc-800 rounded animate-pulse" />
            <div className="w-full h-4 bg-zinc-800 rounded animate-pulse" />
            <div className="w-5/6 h-4 bg-zinc-800 rounded animate-pulse" />
            <div className="w-4/6 h-4 bg-zinc-800 rounded animate-pulse" />
          </div>

          {/* Featured article skeleton */}
          <div className="space-y-4">
            <div className="w-full h-96 bg-zinc-800 rounded-xl animate-pulse" />
            <div className="space-y-3">
              <div className="w-32 h-6 bg-zinc-800 rounded animate-pulse" />
              <div className="w-2/3 h-10 bg-zinc-800 rounded animate-pulse" />
              <div className="w-1/3 h-4 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="w-2/3 h-8 bg-zinc-800 rounded animate-pulse" />
            <div className="w-full h-3 bg-zinc-800 rounded animate-pulse" />
          </div>

          {/* News cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-4 animate-pulse">
                <div className="w-full h-60 bg-zinc-800 rounded-xl" />
                <div className="space-y-3">
                  <div className="w-1/2 h-4 bg-zinc-800 rounded" />
                  <div className="w-full h-4 bg-zinc-800 rounded" />
                  <div className="w-4/6 h-4 bg-zinc-800 rounded" />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6 pt-12 border-t border-zinc-800/50">
            <div className="w-2/3 h-8 bg-zinc-800 rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-4 animate-pulse">
                  <div className="w-full h-48 bg-zinc-800 rounded-xl" />
                  <div className="w-3/4 h-4 bg-zinc-800 rounded" />
                  <div className="w-1/2 h-4 bg-zinc-800 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
