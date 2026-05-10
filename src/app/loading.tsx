export default function Loading() {
  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-amber-500 selection:text-black overflow-x-hidden font-sans relative">
      <div className="border-b border-zinc-800/60 bg-zinc-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="h-8 w-28 rounded-full bg-zinc-800 animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-20 rounded-full bg-zinc-800 animate-pulse" />
            <div className="h-8 w-20 rounded-full bg-zinc-800 animate-pulse" />
            <div className="h-8 w-20 rounded-full bg-zinc-800 animate-pulse" />
          </div>
        </div>
      </div>

      {/* <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
        <div className="space-y-12">
          <div className="rounded-[3rem] border border-zinc-800/60 bg-zinc-900/40 p-10 md:p-14">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-5">
                <div className="h-14 w-72 rounded-full bg-zinc-800 animate-pulse" />
                <div className="h-6 w-full max-w-2xl rounded-full bg-zinc-800 animate-pulse" />
                <div className="h-6 w-5/6 rounded-full bg-zinc-800 animate-pulse" />
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="h-12 w-32 rounded-full bg-zinc-800 animate-pulse" />
                  <div className="h-12 w-32 rounded-full bg-zinc-800 animate-pulse" />
                </div>
              </div>
              <div className="h-64 w-full max-w-xl rounded-[2rem] bg-zinc-800 animate-pulse" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4 rounded-[2rem] border border-zinc-800/60 bg-zinc-900/40 p-6 animate-pulse">
              <div className="h-8 w-32 rounded-full bg-zinc-800" />
              <div className="h-28 rounded-[1.75rem] bg-zinc-800" />
            </div>
            <div className="space-y-4 rounded-[2rem] border border-zinc-800/60 bg-zinc-900/40 p-6 animate-pulse">
              <div className="h-8 w-32 rounded-full bg-zinc-800" />
              <div className="h-28 rounded-[1.75rem] bg-zinc-800" />
            </div>
            <div className="space-y-4 rounded-[2rem] border border-zinc-800/60 bg-zinc-900/40 p-6 animate-pulse">
              <div className="h-8 w-32 rounded-full bg-zinc-800" />
              <div className="h-28 rounded-[1.75rem] bg-zinc-800" />
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5 rounded-[3rem] border border-zinc-800/60 bg-zinc-900/40 p-8 animate-pulse">
              <div className="h-8 w-48 rounded-full bg-zinc-800" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-24 rounded-[2rem] bg-zinc-800" />
                <div className="h-24 rounded-[2rem] bg-zinc-800" />
              </div>
            </div>
            <div className="rounded-[3rem] border border-zinc-800/60 bg-zinc-900/40 p-8 animate-pulse">
              <div className="h-8 w-40 rounded-full bg-zinc-800 mb-6" />
              <div className="h-64 rounded-[2.5rem] bg-zinc-800" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-7 w-40 rounded-full bg-zinc-800 animate-pulse" />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="h-40 rounded-[2rem] bg-zinc-800 animate-pulse" />
              <div className="h-40 rounded-[2rem] bg-zinc-800 animate-pulse" />
              <div className="h-40 rounded-[2rem] bg-zinc-800 animate-pulse" />
              <div className="h-40 rounded-[2rem] bg-zinc-800 animate-pulse" />
            </div>
          </div>
        </div>
      </div> */}
    </main>
  );
}
