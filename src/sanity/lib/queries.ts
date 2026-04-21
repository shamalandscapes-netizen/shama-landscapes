import { groq } from 'next-sanity'

/* ----------------------------------------
   ✅ CATEGORIES
---------------------------------------- */
export const categoriesQuery = groq`
  *[_type == "category"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    color,
    featured
  }
`

/* ----------------------------------------
   ✅ ALL POSTS (MAIN BLOG FEED)
---------------------------------------- */
export const allPostsQuery = groq`
  *[_type == "post" && (!defined(publishedAt) || publishedAt <= now())]
  | order(priority desc, publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage {
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      alt
    },
    publishedAt,
    readTime,
    "categories": categories[]-> {
      _id,
      title,
      slug,
      color
    },
    author-> {
      name,
      slug,
      image {
        asset-> {
          url
        }
      }
    },
    isCommunitySubmission
  }
`

/* ----------------------------------------
   ✅ FEATURED POSTS (HERO SECTION)
---------------------------------------- */
export const featuredPostsQuery = groq`
  *[_type == "post" && featured == true && (!defined(publishedAt) || publishedAt <= now())]
  | order(priority desc, publishedAt desc)[0...5] {
    _id,
    title,
    slug,
    excerpt,
    mainImage {
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      alt
    },
    publishedAt,
    readTime,
    "categories": categories[]-> {
      _id,
      title,
      slug,
      color
    },
    author-> {
      name,
      slug,
      image {
        asset-> {
          url
        }
      }
    },
    isCommunitySubmission
  }
`

/* ----------------------------------------
   ✅ POSTS BY CATEGORY
---------------------------------------- */
export const postsByCategoryQuery = groq`
  *[_type == "post"
    && (!defined(publishedAt) || publishedAt <= now())
    && $categoryId in categories[]._ref
  ]
  | order(priority desc, publishedAt desc)[$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    mainImage {
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      alt
    },
    publishedAt,
    readTime,
    "categories": categories[]-> {
      _id,
      title,
      slug,
      color
    },
    author-> {
      name,
      slug,
      image {
        asset-> {
          url
        }
      }
    },
    tags,
    isCommunitySubmission
  }
`

/* ----------------------------------------
   ✅ SINGLE POST (FIXED - THIS WAS MISSING)
---------------------------------------- */
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && (!defined(publishedAt) || publishedAt <= now())][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    mainImage {
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      alt
    },
    publishedAt,
    readTime,
    tags,
    isCommunitySubmission,

    "categories": categories[]-> {
      _id,
      title,
      slug,
      description,
      color
    },

    author-> {
      name,
      slug,
      bio,
      image {
        asset-> {
          url
        }
      }
    },

    seo,

    "relatedPosts": *[_type == "post"
      && _id != ^._id
      && (!defined(publishedAt) || publishedAt <= now())
    ]
    | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      excerpt,
      mainImage {
        asset-> {
          url,
          metadata {
            lqip
          }
        },
        alt
      },
      publishedAt,
      readTime
    }
  }
`