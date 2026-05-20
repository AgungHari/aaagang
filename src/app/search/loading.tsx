export default function SearchLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-poppins selection:bg-amber-500 selection:text-black">
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded-full bg-zinc-800/70" />
          <div className="h-20 rounded-3xl bg-zinc-900/70 border border-zinc-800/50" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-40 rounded-3xl bg-zinc-900/70 border border-zinc-800/50" />
            <div className="h-40 rounded-3xl bg-zinc-900/70 border border-zinc-800/50" />
          </div>
        </div>
      </section>
    </main>
  );
}
