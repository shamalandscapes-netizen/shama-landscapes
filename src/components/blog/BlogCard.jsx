'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowUpRight } from 'lucide-react'

export default function BlogCard({ post, variant = 'default' }) {
  const {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    categories,
    author,
    readTime,
    featured,
  } = post

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  // Get image URL from Sanity image object
  const imageUrl = mainImage?.asset?.url || null
  const authorImageUrl = author?.image?.asset?.url || null

  // Featured variant — large hero card
  if (variant === 'featured') {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500">
        <Link href={`/blog/${slug.current}`} className="block">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-72 md:h-105 overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={mainImage?.alt || title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-shama-clay flex items-center justify-center">
                  <span className="text-shama-terra text-sm font-medium">Shama Landscapes</span>
                </div>
              )}
              {featured && (
                <span className="absolute top-4 left-4 bg-shama-green text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Featured
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              {categories?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((cat) => (
                    <span
                      key={cat._id || cat.title}
                      className="text-xs font-semibold uppercase tracking-wider text-shama-terra"
                    >
                      {cat.title}
                    </span>
                  ))}
                </div>
              )}

              <h2 className="text-2xl md:text-3xl font-bold text-shama-black leading-tight mb-4 group-hover:text-shama-green transition-colors duration-300">
                {title}
              </h2>

              <p className="text-shama-black/70 text-base leading-relaxed mb-6 line-clamp-3">
                {excerpt}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4 text-sm text-shama-black/50">
                  {formattedDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {formattedDate}
                    </span>
                  )}
                  {readTime && (
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {readTime} min read
                    </span>
                  )}
                </div>

                <span className="flex items-center gap-1 text-shama-green font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                  Read Article
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  // Horizontal card — for sidebar/lists
  if (variant === 'horizontal') {
    return (
      <article className="group flex gap-4 p-3 rounded-xl hover:bg-white/60 transition-all duration-300">
        <Link href={`/blog/${slug.current}`} className="flex gap-4 w-full">
          <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={mainImage?.alt || title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="96px"
              />
            ) : (
              <div className="w-full h-full bg-shama-clay" />
            )}
          </div>

          <div className="flex flex-col justify-center min-w-0">
            {categories?.[0] && (
              <span className="text-xs font-semibold uppercase tracking-wider text-shama-terra mb-1">
                {categories[0].title}
              </span>
            )}
            <h3 className="text-sm font-bold text-shama-black leading-snug group-hover:text-shama-green transition-colors duration-300 line-clamp-2">
              {title}
            </h3>
            {formattedDate && (
              <span className="text-xs text-shama-black/40 mt-1.5 flex items-center gap-1">
                <Calendar size={12} />
                {formattedDate}
              </span>
            )}
          </div>
        </Link>
      </article>
    )
  }

  // Compact card — minimal
  if (variant === 'compact') {
    return (
      <article className="group">
        <Link href={`/blog/${slug.current}`} className="block">
          <div className="relative h-48 rounded-xl overflow-hidden mb-4">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={mainImage?.alt || title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-shama-clay flex items-center justify-center">
                <span className="text-shama-terra text-xs font-medium">Shama</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-shama-black leading-snug group-hover:text-shama-green transition-colors duration-300 line-clamp-2">
            {title}
          </h3>

          {formattedDate && (
            <span className="text-xs text-shama-black/40 mt-2 flex items-center gap-1">
              <Calendar size={12} />
              {formattedDate}
            </span>
          )}
        </Link>
      </article>
    )
  }

  // Default card — standard grid
  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
      <Link href={`/blog/${slug.current}`} className="block">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={mainImage?.alt || title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-shama-clay flex items-center justify-center">
              <span className="text-shama-terra text-sm font-medium">Shama Landscapes</span>
            </div>
          )}

          {featured && (
            <span className="absolute top-4 left-4 bg-shama-green text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((cat) => (
                <span
                  key={cat._id || cat.title}
                  className="text-xs font-semibold uppercase tracking-wider text-shama-terra"
                >
                  {cat.title}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-xl font-bold text-shama-black leading-snug mb-3 group-hover:text-shama-green transition-colors duration-300 line-clamp-2">
            {title}
          </h3>

          <p className="text-shama-black/60 text-sm leading-relaxed mb-4 line-clamp-2">
            {excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-shama-black/5">
            <div className="flex items-center gap-3">
              {authorImageUrl && (
                <Image
                  src={authorImageUrl}
                  alt={author.name}
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                />
              )}
              <span className="text-xs font-medium text-shama-black/70">
                {author?.name || 'Shama Team'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-shama-black/40">
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formattedDate}
                </span>
              )}
              {readTime && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {readTime}m
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}