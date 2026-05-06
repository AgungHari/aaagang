export default function Loading() {
  return (
    <main className="min-h-screen text-zinc-100 selection:bg-amber-500 selection:text-black overflow-x-hidden font-poppins">
      {/* Navbar Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-full animate-pulse"></div>
              <div className="w-32 h-6 bg-zinc-800 rounded animate-pulse"></div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse"></div>
              <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse"></div>
              <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="pt-32 pb-20 px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-7xl mx-auto">
          {/* Badge Skeleton */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 mb-4">
            <div className="w-3 h-3 bg-zinc-800 rounded animate-pulse"></div>
            <div className="w-20 h-3 bg-zinc-800 rounded animate-pulse"></div>
          </div>

          {/* Title Skeleton */}
          <div className="w-80 h-12 bg-zinc-800 rounded mb-8 animate-pulse"></div>

          {/* Description Skeleton */}
          <div className="space-y-3 mb-12 max-w-4xl">
            <div className="w-full h-4 bg-zinc-800 rounded animate-pulse"></div>
            <div className="w-5/6 h-4 bg-zinc-800 rounded animate-pulse"></div>
            <div className="w-4/5 h-4 bg-zinc-800 rounded animate-pulse"></div>
          </div>

          {/* Filter Section Skeleton */}
          <div className="space-y-6">
            {/* Filter Buttons Skeleton */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="w-16 h-8 bg-zinc-800 rounded-full animate-pulse"></div>
              <div className="w-20 h-8 bg-zinc-800 rounded-full animate-pulse"></div>
              <div className="w-24 h-8 bg-zinc-800 rounded-full animate-pulse"></div>
              <div className="w-18 h-8 bg-zinc-800 rounded-full animate-pulse"></div>
              <div className="w-22 h-8 bg-zinc-800 rounded-full animate-pulse"></div>
            </div>

            {/* Layouts Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl overflow-hidden animate-pulse">
                  {/* Image Skeleton */}
                  <div className="relative w-full aspect-video bg-zinc-800">
                    <div className="absolute top-4 left-4 w-12 h-6 bg-zinc-700 rounded-lg"></div>
                    <div className="absolute top-4 right-4 w-16 h-8 bg-zinc-700 rounded-lg"></div>
                  </div>

                  {/* Content Skeleton */}
                  <div className="p-6 space-y-4">
                    {/* Title Skeleton */}
                    <div className="w-3/4 h-5 bg-zinc-800 rounded"></div>

                    {/* Tag Skeleton */}
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-6 bg-zinc-800 rounded-full"></div>
                      <div className="w-20 h-4 bg-zinc-800 rounded"></div>
                    </div>

                    {/* Description Skeleton */}
                    <div className="space-y-2">
                      <div className="w-full h-3 bg-zinc-800 rounded"></div>
                      <div className="w-5/6 h-3 bg-zinc-800 rounded"></div>
                    </div>

                    {/* Source Button Skeleton */}
                    <div className="w-16 h-8 bg-zinc-800 rounded-lg"></div>

                    {/* Stats Skeleton */}
                    <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-zinc-800 rounded"></div>
                        <div className="w-8 h-3 bg-zinc-800 rounded"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-zinc-800 rounded"></div>
                        <div className="w-6 h-3 bg-zinc-800 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="bg-zinc-900/50 border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="w-32 h-8 bg-zinc-800 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="w-24 h-4 bg-zinc-800 rounded animate-pulse"></div>
                <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-20 h-6 bg-zinc-800 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="w-16 h-4 bg-zinc-800 rounded animate-pulse"></div>
                <div className="w-18 h-4 bg-zinc-800 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-6 bg-zinc-800 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse"></div>
                <div className="w-22 h-4 bg-zinc-800 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-24 h-6 bg-zinc-800 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="w-16 h-4 bg-zinc-800 rounded animate-pulse"></div>
                <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
