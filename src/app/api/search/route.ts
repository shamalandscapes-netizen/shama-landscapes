// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sanityClient } from '@/sanity/lib/client'
import { allPostsForSearchQuery } from '@/sanity/lib/queries'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.toLowerCase() || ''

  if (!query) {
    return NextResponse.json({ posts: [], categories: [], tags: [], authors: [] })
  }

  const posts = await sanityClient.fetch(allPostsForSearchQuery)
  
  const filtered = {
    posts: posts.filter((p: any) => 
      p.title.toLowerCase().includes(query) ||
      p.excerpt.toLowerCase().includes(query) ||
      p.tags?.some((t: string) => t.toLowerCase().includes(query))
    ).slice(0, 5),
    categories: posts
      .flatMap((p: any) => p.categories)
      .filter((c: any) => c.title.toLowerCase().includes(query))
      .filter((v: any, i: any, a: any) => a.findIndex((t: any) => t._id === v._id) === i)
      .slice(0, 3),
    tags: [...new Set(posts.flatMap((p: any) => p.tags || []))]
      .filter((t: string) => t.toLowerCase().includes(query))
      .slice(0, 5),
    authors: posts
      .map((p: any) => p.author)
      .filter((a: any) => a.name.toLowerCase().includes(query))
      .filter((v: any, i: any, a: any) => a.findIndex((t: any) => t._id === v._id) === i)
      .slice(0, 3),
  }

  return NextResponse.json(filtered)
}