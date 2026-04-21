import { Metadata } from 'next'

export function generatePostMetadata(post: any): Metadata {
  // Safely get title with fallback
  const title = post.seo?.metaTitle || post.title || 'Untitled Post'
  
  // Safely get description with fallback - ensure it's never null/undefined
  let description = post.seo?.metaDescription || post.excerpt || ''
  if (!description || typeof description !== 'string') {
    description = 'Read this story from Shama Landscapes'
  }
  
  // Safely get canonical URL
  const canonical = post.seo?.canonicalUrl || 
    `https://shamalandscapes.co.ke/blog/${post.categories?.[0]?.slug?.current || 'uncategorized'}/${post.slug?.current || ''}`
  
  return {
    title: `${title} | Shama Landscapes Journal`,
    description: description.slice(0, 160),
    alternates: {
      canonical,
    },
    robots: post.seo?.noIndex ? { index: false } : undefined,
    openGraph: {
      title,
      description: description.slice(0, 160),
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: post.mainImage ? [{
        url: `https://shamalandscapes.co.ke/api/og?title=${encodeURIComponent(title)}&image=${encodeURIComponent(post.mainImage.asset?.url || '')}`,
        width: 1200,
        height: 630,
      }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description.slice(0, 160),
    },
  }
}

export function generateCategoryMetadata(category: any): Metadata {
  const title = category?.title || 'Category'
  let description = category?.description || `Explore ${title} stories from Shama Landscapes`
  if (!description || typeof description !== 'string') {
    description = `Explore ${title} stories from Shama Landscapes`
  }
  
  return {
    title: `${title} | Shama Landscapes Journal`,
    description: description.slice(0, 160),
    alternates: {
      canonical: `https://shamalandscapes.co.ke/blog/${category?.slug?.current || ''}`,
    },
    openGraph: {
      title: `${title} | Shama Landscapes Journal`,
      description: description.slice(0, 160),
      type: 'website',
    },
  }
}

export function generatePostJsonLd(post: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title || 'Untitled',
    description: post.excerpt || '',
    image: post.mainImage?.asset?.url,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    author: post.author?.name ? {
      '@type': 'Person',
      name: post.author.name,
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Shama Landscapes',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://shamalandscapes.co.ke/blog/${post.categories?.[0]?.slug?.current || 'uncategorized'}/${post.slug?.current || ''}`,
    },
    keywords: Array.isArray(post.tags) ? post.tags.join(', ') : '',
    articleSection: post.categories?.[0]?.title || 'Blog',
  }
}