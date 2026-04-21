import { NextRequest, NextResponse } from 'next/server'
import { sanityClient } from '@/sanity/lib/client'
import { allPostsQuery } from '@/sanity/lib/queries'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.toLowerCase() || ''

  if (!query) {
    return NextResponse.json({
      posts: [],
      categories: [],
      tags: [],
      authors: [],
    })
  }

  const posts = await sanityClient.fetch(allPostsQuery)

  // 🔥 Ranking logic (title > tags > excerpt)
  const scoredPosts = posts.map((p: any) => {
    let score = 0

    if (p.title?.toLowerCase().includes(query)) score += 3
    if (p.tags?.some((t: string) => t?.toLowerCase().includes(query))) score += 2
    if (p.excerpt?.toLowerCase().includes(query)) score += 1

    return { ...p, score }
  })

  // ✅ Fix: explicitly type tags BEFORE Set
  const allTags = posts.flatMap((p: any) => p.tags || []) as string[]

  const filtered = {
    posts: scoredPosts
      .filter((p: any) => p.score > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 6),

    categories: posts
      .flatMap((p: any) => p.categories || [])
      .filter((c: any) => c?.title?.toLowerCase().includes(query))
      .filter(
        (v: any, i: number, a: any) =>
          a.findIndex((t: any) => t._id === v._id) === i
      )
      .slice(0, 4),

    tags: [...new Set(allTags)]
      .filter((t: string) => t.toLowerCase().includes(query))
      .slice(0, 6),

    authors: posts
      .map((p: any) => p.author)
      .filter((a: any) => a?.name?.toLowerCase().includes(query))
      .filter(
        (v: any, i: number, a: any) =>
          v?._id && a.findIndex((t: any) => t._id === v._id) === i
      )
      .slice(0, 4),
  }

  return NextResponse.json(filtered)
}