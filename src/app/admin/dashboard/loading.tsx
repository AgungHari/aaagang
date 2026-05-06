export default function Loading() {
  return (
    <main className="min-h-screen text-zinc-100 bg-zinc-950 font-poppins selection:bg-amber-500 selection:text-black overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12 animate-pulse">
          <div className="h-12 w-64 rounded-full bg-zinc-800" />
          <div className="mt-4 h-6 w-48 rounded-full bg-zinc-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-zinc-800/60 bg-zinc-900/80 p-6 space-y-4 animate-pulse">
              <div className="h-4 w-40 rounded-full bg-zinc-800" />
              <div className="h-10 w-full rounded-2xl bg-zinc-800" />
              <div className="h-4 w-5/6 rounded-full bg-zinc-800" />
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-zinc-800/60 bg-zinc-900/80 overflow-hidden animate-pulse">
          <div className="h-16 bg-zinc-800" />
          <div className="space-y-3 p-6">
            <div className="h-4 w-3/4 rounded-full bg-zinc-800" />
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="h-16 rounded-2xl bg-zinc-800 col-span-1" />
                <div className="h-4 rounded-full bg-zinc-800 col-span-3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
