'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

function highlight(text, query) {
  if (!text) return ''
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
}

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) {
      setResults(null)
      return
    }

    const delay = setTimeout(async () => {
      setLoading(true)

      try {
        const res = await fetch(`/api/search?q=${query}`)
        const data = await res.json()
        setResults(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }, 300) // debounce

    return () => clearTimeout(delay)
  }, [query])

  return (
    <div className="relative w-full max-w-xl">
      <input
        type="text"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-3 border rounded-xl focus:outline-none"
      />

      {query && (
        <div className="absolute left-0 right-0 z-50 p-4 mt-2 bg-white shadow-xl top-full rounded-xl">
          {loading && <p className="text-sm">Searching...</p>}

          {results?.posts?.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold">Posts</p>
              {results.posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="block py-2 rounded hover:bg-gray-50"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: highlight(post.title, query),
                    }}
                    className="font-semibold"
                  />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: highlight(post.excerpt, query),
                    }}
                    className="text-sm text-gray-500 line-clamp-2"
                  />
                </Link>
              ))}
            </div>
          )}

          {results?.tags?.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-bold">Tags</p>
              <div className="flex flex-wrap gap-2">
                {results.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-sm bg-gray-100 rounded"
                    dangerouslySetInnerHTML={{
                      __html: highlight(tag, query),
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {!loading &&
            results &&
            results.posts.length === 0 &&
            results.tags.length === 0 && (
              <p className="text-sm text-gray-500">No results found</p>
            )}
        </div>
      )}
    </div>
  )
}