export default function PostLoading() {
  return (
    <main className="min-h-screen bg-shama-clay">
      {/* Hero Skeleton */}
      <section className="h-[50vh] md:h-[60vh] bg-shama-black/20 animate-pulse" />

      {/* Content Skeleton */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-8 w-3/4 bg-shama-black/5 rounded animate-pulse" />
            <div className="h-4 w-full bg-shama-black/5 rounded animate-pulse" />
            <div className="h-4 w-full bg-shama-black/5 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-shama-black/5 rounded animate-pulse" />
            <div className="h-64 w-full bg-shama-black/5 rounded-2xl animate-pulse mt-8" />
            <div className="h-4 w-full bg-shama-black/5 rounded animate-pulse" />
            <div className="h-4 w-full bg-shama-black/5 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-shama-black/5 rounded animate-pulse" />
          </div>
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 h-48 animate-pulse" />
          </div>
        </div>
      </section>
    </main>
  )
}