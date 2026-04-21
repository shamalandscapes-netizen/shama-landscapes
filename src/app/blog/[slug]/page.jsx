import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { sanityClient } from '@/sanity/lib/client'
import { postBySlugQuery, featuredPostsQuery } from '@/sanity/lib/queries'
import PortableTextRenderer from '@/components/blog/PortableTextRenderer'
import PostSidebar from '@/components/blog/PostSidebar'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = await params

  const post = await sanityClient
    .fetch(postBySlugQuery, { slug })
    .catch(() => null)

  if (!post) {
    return {
      title: 'Article Not Found | Shama Landscape Architects',
    }
  }

  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).url()
    : null

  return {
    title: `${post.seo?.metaTitle || post.title} | Shama Landscape Architects`,
    description:
      post.seo?.metaDescription ||
      post.excerpt ||
      'Landscape architecture insights from Shama.',
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  }
}

export async function generateStaticParams() {
  const posts = await sanityClient.fetch(featuredPostsQuery).catch(() => [])

  return posts.map((post) => ({
    slug: post.slug?.current,
  }))
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params

  let post = null
  let allPosts = []

  try {
    post = await sanityClient.fetch(postBySlugQuery, { slug })

    if (!post) return notFound()

    allPosts = await sanityClient.fetch(featuredPostsQuery)
  } catch (err) {
    console.error('Error fetching post:', err)
    return notFound()
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const currentIndex = allPosts.findIndex(
    (p) => p.slug?.current === slug
  )

  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost =
    currentIndex < allPosts.length - 1
      ? allPosts[currentIndex + 1]
      : null

  const relatedPosts = post.relatedPosts || []

  // FIXED IMAGE HANDLING (Sanity-safe)
  const heroImage =
    post.mainImage ? urlFor(post.mainImage).width(2000).url() : null

  return (
    <main className="min-h-screen bg-shama-clay">
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] min-h-100 overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={post.mainImage?.alt || post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-shama-green/20" />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-shama-black/80 via-shama-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 pb-12 md:pb-16">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/70 text-sm font-medium mb-6 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Journal
            </Link>

            {post.categories?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((cat) => (
                  <span
                    key={cat._id || cat.title}
                    className="text-xs font-bold uppercase tracking-wider text-shama-terra bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full"
                  >
                    {cat.title}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-4xl">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 mt-6 text-white/60 text-sm">
              {post.author?.name && (
                <div className="flex items-center gap-3">
                  {post.author.image?.asset && (
                    <Image
                      src={urlFor(post.author.image).width(80).url()}
                      alt={post.author.name}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                  )}
                  <span className="font-medium text-white/80">
                    {post.author.name}
                  </span>
                </div>
              )}

              {formattedDate && <span>{formattedDate}</span>}
              {post.readTime && <span>{post.readTime} min read</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <article className="lg:col-span-8">
            {post.excerpt && (
              <p className="text-xl md:text-2xl text-shama-black/80 font-medium leading-relaxed mb-10 pb-10 border-b border-shama-black/10">
                {post.excerpt}
              </p>
            )}

            <div className="prose-custom">
              <PortableTextRenderer value={post.body} />
            </div>

            {post.seo?.ctaText && (
              <div className="mt-12 p-8 bg-shama-green/5 border border-shama-green/10 rounded-2xl">
                <h3 className="text-xl font-bold text-shama-black mb-3">
                  {post.seo.ctaText}
                </h3>
                <Link
                  href={post.seo.ctaLink || '/contact'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-shama-green text-white font-bold rounded-xl hover:bg-shama-green/90 transition-colors"
                >
                  Get in Touch
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}

            {/* Prev/Next */}
            <div className="mt-16 pt-10 border-t border-shama-black/10">
              <div className="grid md:grid-cols-2 gap-6">
                {prevPost && (
                  <Link
                    href={`/blog/${prevPost.slug.current}`}
                    className="group p-6 rounded-2xl bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-shama-black/40 mb-2 block">
                      Previous
                    </span>
                    <h4 className="text-lg font-bold text-shama-black group-hover:text-shama-green transition-colors line-clamp-2">
                      {prevPost.title}
                    </h4>
                  </Link>
                )}

                {nextPost && (
                  <Link
                    href={`/blog/${nextPost.slug.current}`}
                    className="group p-6 rounded-2xl bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-shama-black/40 mb-2 block text-right">
                      Next
                    </span>
                    <h4 className="text-lg font-bold text-shama-black group-hover:text-shama-green transition-colors line-clamp-2 text-right">
                      {nextPost.title}
                    </h4>
                  </Link>
                )}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <PostSidebar post={post} relatedPosts={relatedPosts} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}