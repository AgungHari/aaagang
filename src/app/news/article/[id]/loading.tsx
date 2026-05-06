export default function Loading() {
  return (
    <main className="min-h-screen text-zinc-100 font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
            <div className="w-3 h-3 bg-zinc-800 rounded-full animate-pulse" />
            <div className="w-24 h-3 bg-zinc-800 rounded-full animate-pulse" />
          </div>

          <div className="space-y-4">
            <div className="w-full h-10 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="w-1/2 h-4 bg-zinc-800 rounded-lg animate-pulse" />
          </div>

          <div className="w-full h-96 bg-zinc-800 rounded-xl animate-pulse" />

          <div className="space-y-4">
            <div className="w-24 h-6 bg-zinc-800 rounded animate-pulse" />
            <div className="w-full h-4 bg-zinc-800 rounded animate-pulse" />
            <div className="w-full h-4 bg-zinc-800 rounded animate-pulse" />
            <div className="w-5/6 h-4 bg-zinc-800 rounded animate-pulse" />
            <div className="w-full h-4 bg-zinc-800 rounded animate-pulse" />
            <div className="w-4/6 h-4 bg-zinc-800 rounded animate-pulse" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="w-full h-4 bg-zinc-800 rounded animate-pulse" />
                <div className="w-full h-4 bg-zinc-800 rounded animate-pulse" />
                <div className="w-5/6 h-4 bg-zinc-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
