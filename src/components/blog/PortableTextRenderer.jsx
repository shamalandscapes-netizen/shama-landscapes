'use client'

import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

const components = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null

      const imageUrl = urlFor(value)
        .width(1400)
        .auto('format')
        .fit('max')
        .url()

      // ✅ IMAGE LAYOUT SYSTEM (from Sanity field)
      const layout = value.layout || 'normal' 
      // options: full | wide | normal | small

      const layoutStyles = {
        full: 'w-full',
        wide: 'w-full md:w-[120%] md:-ml-[10%]',
        normal: 'w-full',
        small: 'w-full md:w-2/3 mx-auto',
      }

      const heightStyles = {
        full: 'h-[420px] md:h-[600px]',
        wide: 'h-[380px] md:h-[520px]',
        normal: 'h-64 md:h-96',
        small: 'h-60 md:h-80',
      }

      return (
        <figure className={`my-10 ${layoutStyles[layout]}`}>
          <div
            className={`relative rounded-2xl overflow-hidden ${heightStyles[layout]}`}
          >
            <Image
              src={imageUrl}
              alt={value.alt || 'Blog image'}
              fill
              className="object-cover hover:scale-[1.02] transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 1100px"
            />
          </div>

          {value.caption && (
            <figcaption className="text-center text-sm text-shama-black/50 mt-3">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },

  marks: {
    link: ({ children, value }) => {
      const rel = !value?.href?.startsWith('/') ? 'noreferrer noopener' : undefined
      const target = !value?.href?.startsWith('/') ? '_blank' : undefined

      return (
        <Link
          href={value.href}
          rel={rel}
          target={target}
          className="text-shama-green font-semibold underline underline-offset-2 hover:text-shama-terra transition-colors"
        >
          {children}
        </Link>
      )
    },

    strong: ({ children }) => (
      <strong className="font-bold text-shama-black">{children}</strong>
    ),

    em: ({ children }) => (
      <em className="italic text-shama-black/80">{children}</em>
    ),
  },

  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl md:text-4xl font-bold text-shama-black mt-12 mb-6 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-bold text-shama-black mt-10 mb-5 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-bold text-shama-black mt-8 mb-4 leading-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-bold text-shama-black mt-6 mb-3">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-shama-black/70 leading-relaxed mb-5 text-base md:text-lg">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-shama-green pl-6 my-8 py-2 bg-shama-green/5 rounded-r-xl">
        <p className="text-lg md:text-xl font-medium text-shama-black/80 italic leading-relaxed">
          {children}
        </p>
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-6 text-shama-black/70 text-base md:text-lg ml-2">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 text-shama-black/70 text-base md:text-lg ml-2">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
}

export default function PortableTextRenderer({ value }) {
  if (!value) return null
  return <PortableText value={value} components={components} />
}