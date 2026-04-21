export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-shama-clay">
      {/* Hero Skeleton */}
      <section className="bg-shama-black py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="h-4 w-32 bg-white/10 rounded mb-4 animate-pulse" />
          <div className="h-12 md:h-16 w-2/3 bg-white/10 rounded mb-4 animate-pulse" />
          <div className="h-6 w-1/2 bg-white/10 rounded animate-pulse" />
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="h-80 bg-white/50 rounded-2xl animate-pulse" />
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-56 bg-shama-black/5" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 w-20 bg-shama-black/5 rounded" />
                    <div className="h-6 w-full bg-shama-black/5 rounded" />
                    <div className="h-4 w-3/4 bg-shama-black/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-2xl p-6 h-32 animate-pulse" />
            <div className="bg-white rounded-2xl p-6 h-64 animate-pulse" />
          </div>
        </div>
      </section>
    </main>
  )
}