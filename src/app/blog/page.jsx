import { sanityClient } from '@/sanity/lib/client'
import {
  featuredPostsQuery,
  categoriesQuery,
  postsByCategoryQuery,
  allPostsQuery, // ✅ FIX: added
} from '@/sanity/lib/queries'
import BlogCard from '@/components/blog/BlogCard'
import BlogSidebar from '@/components/blog/BlogSidebar'
import SearchBox from '@/components/search/SearchBox'

<SearchBox />

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
      <section className="relative py-20 overflow-hidden text-white bg-shama-black md:py-28">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 px-6 mx-auto max-w-7xl md:px-12">
          <div className="max-w-3xl">
            <span className="inline-block mb-4 text-sm font-bold tracking-widest uppercase text-shama-terra">
              Rooted by Shama
            </span>
            <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl">
              Journal
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed md:text-xl text-white/70">
              Landscape insights, project stories, and design thinking from East Africa's leading
              architecture-led landscape practice.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-16 mx-auto max-w-7xl md:px-12 md:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          
          {/* Main Content */}
          <div className="lg:col-span-8">

            {/* Category Filter Indicator */}
            {categoryFilter && (
              <div className="flex items-center gap-3 mb-8">
                <span className="text-sm text-shama-black/50">Filtering by:</span>
                <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-full bg-shama-green">
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
              <div className="grid gap-8 md:grid-cols-2">
                {allPosts.map((post) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-lg text-shama-black/50">No articles found.</p>

                {categoryFilter && (
                  <a
                    href="/blog"
                    className="inline-block mt-4 font-semibold text-shama-green hover:underline"
                  >
                    View all articles
                  </a>
                )}
              </div>
            )}

            {/* Load More placeholder */}
            {allPosts.length > 10 && (
              <div className="mt-12 text-center">
                <button className="px-8 py-3 font-bold transition-all duration-300 border-2 border-shama-black text-shama-black rounded-xl hover:bg-shama-black hover:text-white">
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
      <section className="py-20 text-white bg-shama-black">
        <div className="max-w-4xl px-6 mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Have a story to share?
          </h2>
          <p className="max-w-xl mx-auto mb-8 text-lg text-white/60">
            We're always looking for community voices. Submit your landscape story to Rooted by Shama.
          </p>
          <a
            href="/blog/submit"
            className="inline-flex items-center gap-2 px-8 py-4 font-bold text-white transition-colors bg-shama-green rounded-xl hover:bg-shama-green/90"
          >
            Submit Your Story
          </a>
        </div>
      </section>
    </main>
  )
}