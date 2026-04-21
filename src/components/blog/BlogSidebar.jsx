'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Mail, ArrowRight, Leaf } from 'lucide-react'
import BlogCard from './BlogCard'

export default function BlogSidebar({ categories = [], recentPosts = [], popularPosts = [] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <aside className="space-y-8">
      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-shama-black mb-4">
          Search
        </h3>
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-shama-black/30"
          />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-shama-clay/50 rounded-xl text-sm text-shama-black placeholder:text-shama-black/30 focus:outline-none focus:ring-2 focus:ring-shama-green/30 transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-shama-black mb-4">
            Categories
          </h3>
          <div className="space-y-2">
            <Link
              href="/blog"
              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-shama-clay/50 transition-colors group"
            >
              <span className="text-sm font-medium text-shama-black/70 group-hover:text-shama-green transition-colors">
                All Articles
              </span>
              <ArrowRight
                size={14}
                className="text-shama-black/20 group-hover:text-shama-green group-hover:translate-x-0.5 transition-all"
              />
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/blog?category=${encodeURIComponent(cat.title)}`}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-shama-clay/50 transition-colors group"
              >
                <span className="text-sm font-medium text-shama-black/70 group-hover:text-shama-green transition-colors">
                  {cat.title}
                </span>
                <ArrowRight
                  size={14}
                  className="text-shama-black/20 group-hover:text-shama-green group-hover:translate-x-0.5 transition-all"
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-shama-black mb-4">
            Recent Posts
          </h3>
          <div className="space-y-1">
            {recentPosts.map((post) => (
              <BlogCard key={post._id} post={post} variant="horizontal" />
            ))}
          </div>
        </div>
      )}

      {/* Popular Posts */}
      {popularPosts.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-shama-black mb-4">
            Most Read
          </h3>
          <div className="space-y-1">
            {popularPosts.map((post) => (
              <BlogCard key={post._id} post={post} variant="horizontal" />
            ))}
          </div>
        </div>
      )}

      {/* Newsletter */}
      <div className="bg-shama-green rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Leaf size={18} className="text-white/80" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Rooted by Shama
            </h3>
          </div>
          <p className="text-white/80 text-sm leading-relaxed mb-5">
            Get landscape insights, seasonal tips, and project stories delivered to your inbox.
          </p>

          {subscribed ? (
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold">You're subscribed!</p>
              <p className="text-xs text-white/70 mt-1">Welcome to the community.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-shama-green/50"
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-sm text-shama-black placeholder:text-shama-black/30 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-shama-terra text-white text-sm font-bold rounded-xl hover:bg-shama-terra/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-white/40 text-xs mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-shama-clay rounded-2xl p-6 text-center">
        <h3 className="text-lg font-bold text-shama-black mb-2">
          Have a Project?
        </h3>
        <p className="text-sm text-shama-black/60 mb-4">
          Let's discuss how we can transform your outdoor space.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-shama-black text-white text-sm font-bold rounded-xl hover:bg-shama-black/80 transition-colors"
        >
          Start a Conversation
          <ArrowRight size={16} />
        </Link>
      </div>
    </aside>
  )
}