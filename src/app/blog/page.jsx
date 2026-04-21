import { sanityClient } from '@/sanity/lib/client'
import {
  featuredPostsQuery,
  categoriesQuery,
  postsByCategoryQuery,
  allPostsQuery, // ✅ FIX: added
} from '@/sanity/lib/queries'
import BlogCard from '@/components/blog/BlogCard'
import BlogSidebar from '@/components/blog/BlogSidebar'

export const metadata = {
  title: 'Journal | Shama Landscape Architects',
  description:
    'Insights, stories, and expertise from Shama Landscape Architects. Explore landscape design, sustainability, and East African ecology.',
  openGraph: {
    title: 'Journal | Shama Landscape Architects',
    description: 'Landscape insights, project stories, and design thinking from Nairobi.',
    type: 'website',
  },
}

export const revalidate = 60

export default async function BlogPage({ searchParams }) {
  const categoryFilter = searchParams?.category

  let allPosts = []
  let featuredPosts = []
  let categories = []

  try {
    // Fetch featured posts and categories in parallel
    ;[featuredPosts, categories] = await Promise.all([
      sanityClient.fetch(featuredPostsQuery),
      sanityClient.fetch(categoriesQuery),
    ])

    // If filtering by category
    if (categoryFilter) {
      const category = categories.find(
        (c) =>
          c.title === categoryFilter ||
          c.slug?.current === categoryFilter
      )

      if (category) {
        allPosts = await sanityClient.fetch(postsByCategoryQuery, {
          categoryId: category._id,
          start: 0,
          end: 50,
        })
      } else {
        // fallback if category not found
        allPosts = await sanityClient.fetch(allPostsQuery)
      }
    } else {
      // ✅ FIX: always fetch all posts for blog grid
      allPosts = await sanityClient.fetch(allPostsQuery)
    }
  } catch (err) {
    console.error('Sanity fetch error:', err)
  }

  // Sidebar data
  const recentPosts = allPosts.slice(0, 4)
  const popularPosts = featuredPosts.slice(0, 3)

  return (
    <main className="min-h-screen bg-shama-clay">
      {/* Hero Section */}
      <section className="relative bg-shama-black text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-shama-terra text-sm font-bold uppercase tracking-widest mb-4">
              Rooted by Shama
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              Journal
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl">
              Landscape insights, project stories, and design thinking from East Africa's leading
              architecture-led landscape practice.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Main Content */}
          <div className="lg:col-span-8">

            {/* Category Filter Indicator */}
            {categoryFilter && (
              <div className="mb-8 flex items-center gap-3">
                <span className="text-sm text-shama-black/50">Filtering by:</span>
                <span className="inline-flex items-center gap-2 bg-shama-green text-white text-sm font-semibold px-4 py-2 rounded-full">
                  {categoryFilter}
                  <a
                    href="/blog"
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    ×
                  </a>
                </span>
              </div>
            )}

            {/* Featured Post */}
            {!categoryFilter && featuredPosts.length > 0 && (
              <div className="mb-12">
                <BlogCard post={featuredPosts[0]} variant="featured" />
              </div>
            )}

            {/* Posts Grid */}
            {allPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {allPosts.map((post) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-shama-black/50 text-lg">No articles found.</p>

                {categoryFilter && (
                  <a
                    href="/blog"
                    className="inline-block mt-4 text-shama-green font-semibold hover:underline"
                  >
                    View all articles
                  </a>
                )}
              </div>
            )}

            {/* Load More placeholder */}
            {allPosts.length > 10 && (
              <div className="mt-12 text-center">
                <button className="px-8 py-3 border-2 border-shama-black text-shama-black font-bold rounded-xl hover:bg-shama-black hover:text-white transition-all duration-300">
                  Load More Articles
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <BlogSidebar
                categories={categories}
                recentPosts={recentPosts}
                popularPosts={popularPosts}
              />
            </div>
          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-shama-black text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Have a story to share?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            We're always looking for community voices. Submit your landscape story to Rooted by Shama.
          </p>
          <a
            href="/blog/submit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-shama-green text-white font-bold rounded-xl hover:bg-shama-green/90 transition-colors"
          >
            Submit Your Story
          </a>
        </div>
      </section>
    </main>
  )
}