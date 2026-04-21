import Link from 'next/link'
import { ArrowLeft, FileSearch } from 'lucide-react'

export default function BlogNotFound() {
  return (
    <main className="min-h-screen bg-shama-clay flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-shama-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileSearch size={36} className="text-shama-green" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-shama-black mb-4">
          Article Not Found
        </h1>
        <p className="text-shama-black/60 text-lg mb-8 leading-relaxed">
          The article you're looking for doesn't exist or may have been moved. Explore our latest
          insights instead.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-8 py-4 bg-shama-green text-white font-bold rounded-xl hover:bg-shama-green/90 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Journal
        </Link>
      </div>
    </main>
  )
}