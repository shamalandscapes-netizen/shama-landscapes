'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Share2, Linkedin, Twitter, Facebook, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { toPlainText } from '@portabletext/react'
import BlogCard from './BlogCard'

export default function PostSidebar({ post, relatedPosts = [] }) {
  const [copied, setCopied] = useState(false)

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = post.title || 'Shama Landscape Architects'

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Extract plain text bio if it's Portable Text
  let bioText = ''
  if (post.author?.bio) {
    if (typeof post.author.bio === 'string') {
      bioText = post.author.bio
    } else {
      try {
        bioText = toPlainText(post.author.bio)
      } catch {
        bioText = ''
      }
    }
  }

  const authorImageUrl = post.author?.image?.asset?.url || null

  return (
    <aside className="space-y-8">
      {/* Author Card */}
      {post.author && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-shama-black/40 mb-4">
            Written by
          </h3>
          <div className="flex items-center gap-4 mb-4">
            {authorImageUrl ? (
              <Image
                src={authorImageUrl}
                alt={post.author.name}
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-shama-green/10 flex items-center justify-center">
                <span className="text-shama-green font-bold text-lg">
                  {post.author.name?.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h4 className="font-bold text-shama-black">{post.author.name}</h4>
              <span className="text-xs text-shama-black/50">Landscape Architect</span>
            </div>
          </div>
          {bioText && (
            <p className="text-sm text-shama-black/60 leading-relaxed">{bioText}</p>
          )}
        </div>
      )}

      {/* Post Meta */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-shama-black/40 mb-4">
          Article Details
        </h3>
        <div className="space-y-3">
          {formattedDate && (
            <div className="flex items-center gap-3 text-sm text-shama-black/70">
              <Calendar size={16} className="text-shama-terra" />
              <span>{formattedDate}</span>
            </div>
          )}
          {post.readTime && (
            <div className="flex items-center gap-3 text-sm text-shama-black/70">
              <Clock size={16} className="text-shama-terra" />
              <span>{post.readTime} min read</span>
            </div>
          )}
          {post.categories?.length > 0 && (
            <div className="pt-3 border-t border-shama-black/5">
              <span className="text-xs font-bold uppercase tracking-wider text-shama-black/40 block mb-2">
                Categories
              </span>
              <div className="flex flex-wrap gap-2">
                {post.categories.map((cat) => (
                  <span
                    key={cat._id || cat.title}
                    className="text-xs font-semibold bg-shama-clay text-shama-black/70 px-3 py-1.5 rounded-full"
                  >
                    {cat.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-shama-black/40 mb-4">
          Share
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
                '_blank'
              )
            }
            className="w-10 h-10 rounded-xl bg-shama-black/5 flex items-center justify-center hover:bg-shama-black hover:text-white transition-all"
            aria-label="Share on Twitter"
          >
            <Twitter size={16} />
          </button>
          <button
            onClick={() =>
              window.open(
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                '_blank'
              )
            }
            className="w-10 h-10 rounded-xl bg-shama-black/5 flex items-center justify-center hover:bg-shama-black hover:text-white transition-all"
            aria-label="Share on LinkedIn"
          >
            <Linkedin size={16} />
          </button>
          <button
            onClick={() =>
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                '_blank'
              )
            }
            className="w-10 h-10 rounded-xl bg-shama-black/5 flex items-center justify-center hover:bg-shama-black hover:text-white transition-all"
            aria-label="Share on Facebook"
          >
            <Facebook size={16} />
          </button>
          <button
            onClick={handleCopyLink}
            className="w-10 h-10 rounded-xl bg-shama-black/5 flex items-center justify-center hover:bg-shama-green hover:text-white transition-all"
            aria-label="Copy link"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-shama-black/40 mb-4">
            Related Reading
          </h3>
          <div className="space-y-1">
            {relatedPosts.map((post) => (
              <BlogCard key={post._id} post={post} variant="horizontal" />
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-shama-terra rounded-2xl p-6 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <h3 className="text-lg font-bold mb-2 relative z-10">Inspired?</h3>
        <p className="text-sm text-white/80 mb-4 relative z-10">
          Let's bring that vision to your space.
        </p>
        <Link
          href="/contact"
          className="inline-block px-6 py-3 bg-white text-shama-terra text-sm font-bold rounded-xl hover:bg-shama-clay transition-colors relative z-10"
        >
          Start Your Project
        </Link>
      </div>
    </aside>
  )
}