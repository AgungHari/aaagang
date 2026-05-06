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
      <section className="pt-32 pb-20 px-6 md:px-16 lg:px-24 xl:px-32 animate-fade-inY">
        <div className="max-w-4xl mx-auto">
          {/* Back Button Skeleton */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-5 h-5 bg-zinc-800 rounded animate-pulse"></div>
            <div className="w-32 h-4 bg-zinc-800 rounded animate-pulse"></div>
          </div>

          {/* Layout Detail Card Skeleton */}
          <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl overflow-hidden mb-12">
            {/* Image Skeleton */}
            <div className="relative w-full aspect-video bg-zinc-800 animate-pulse">
              <div className="absolute top-4 left-4 w-16 h-8 bg-zinc-700 rounded-lg animate-pulse"></div>
            </div>

            <div className="p-8">
              {/* Meta Info Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-white/10">
                <div className="space-y-2">
                  <div className="w-24 h-3 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="w-16 h-8 bg-zinc-800 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-20 h-3 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="w-24 h-8 bg-zinc-800 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-16 h-3 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="w-20 h-6 bg-zinc-800 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Title Skeleton */}
              <div className="w-3/4 h-12 bg-zinc-800 rounded mb-8 animate-pulse"></div>

              {/* Content Skeleton */}
              <div className="space-y-8">
                {/* Description Skeleton */}
                <div className="space-y-3">
                  <div className="w-full h-4 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="w-5/6 h-4 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="w-4/5 h-4 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="w-3/4 h-4 bg-zinc-800 rounded animate-pulse"></div>
                </div>

                {/* Copy Link Skeleton */}
                <div className="space-y-4">
                  <div className="w-32 h-6 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="w-full h-12 bg-zinc-800 rounded-lg animate-pulse"></div>
                </div>

                {/* Source Skeleton */}
                <div className="space-y-4">
                  <div className="w-20 h-6 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="w-40 h-10 bg-zinc-800 rounded-lg animate-pulse"></div>
                </div>

                {/* Stats Skeleton */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse"></div>
                    <div className="w-12 h-4 bg-zinc-800 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse"></div>
                    <div className="w-8 h-4 bg-zinc-800 rounded animate-pulse"></div>
                  </div>
                  <div className="w-20 h-8 bg-zinc-800 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Layouts Skeleton */}
          <div className="space-y-6">
            <div className="w-48 h-8 bg-zinc-800 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden">
                  {/* Image Skeleton */}
                  <div className="w-full aspect-video bg-zinc-800 animate-pulse"></div>
                  {/* Content Skeleton */}
                  <div className="p-4 space-y-3">
                    <div className="w-3/4 h-5 bg-zinc-800 rounded animate-pulse"></div>
                    <div className="w-1/2 h-4 bg-zinc-800 rounded animate-pulse"></div>
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
