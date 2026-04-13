"use client";

import { useState } from "react";
import { X, Monitor, Smartphone, Mail, Calendar, User, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { getSanityImageUrl } from "@/lib/sanity-image";

export default function NewsletterPreview({ 
  title, 
  posts, 
  editorNote, 
  onClose,
  scheduledFor = null,
  recipientCount = 0
}) {
  const [viewMode, setViewMode] = useState("desktop"); // desktop or mobile
  const [activeTab, setActiveTab] = useState("preview"); // preview or code

  // Calculate total read time
  const totalReadTime = posts.reduce((acc, post) => acc + (post.readTime || 3), 0);

  // Generate plain text version for preview stats
  const plainTextLength = posts.reduce((acc, post) => 
    acc + (post.excerpt?.length || 0), 0
  ) + (editorNote?.length || 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#264653] flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#E9C46A]" />
              </div>
              <div>
                <h3 className="font-bold text-[#264653]">Newsletter Preview</h3>
                <p className="text-xs text-gray-500">{posts.length} articles • {recipientCount} recipients</p>
              </div>
            </div>
            
            {scheduledFor && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#E9C46A]/20 rounded-full text-xs font-semibold text-[#264653]">
                <Clock className="w-3 h-3" />
                Scheduled for {format(new Date(scheduledFor), "MMM d, h:mm a")}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("desktop")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === "desktop" 
                    ? "bg-white text-[#264653] shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setViewMode("mobile")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === "mobile" 
                    ? "bg-white text-[#264653] shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 px-6 py-3 bg-[#264653] text-white text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#E9C46A]" />
            <span className="opacity-80">Publishing:</span>
            <span className="font-semibold">
              {scheduledFor ? format(new Date(scheduledFor), "MMMM d, yyyy") : "Immediately"}
            </span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#E9C46A]" />
            <span className="opacity-80">Read time:</span>
            <span className="font-semibold">{totalReadTime} min</span>
          </div>
          <div className="h-4 w-px bg-white/20 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <User className="w-4 h-4 text-[#E9C46A]" />
            <span className="opacity-80">Recipients:</span>
            <span className="font-semibold">{recipientCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          <div className={`h-full overflow-y-auto p-8 transition-all duration-300 ${
            viewMode === "mobile" ? "flex justify-center" : ""
          }`}>
            
            <div className={`bg-white shadow-2xl transition-all duration-300 ${
              viewMode === "mobile" 
                ? "w-full max-w-93.75 rounded-4xl overflow-hidden border-8 border-gray-800" 
                : "w-full max-w-150 mx-auto rounded-2xl"
            }`}>
              
              {/* Email Header */}
              <div className={`bg-linear-to-br from-[#264653] to-[#1a3238] text-center ${
                viewMode === "mobile" ? "px-6 py-8" : "px-8 py-12"
              }`}>
                <h1 className={`font-black text-[#E9C46A] tracking-tight ${
                  viewMode === "mobile" ? "text-xl" : "text-3xl"
                }`}>
                  Shama Landscapes
                </h1>
                <div className={`bg-[#E9C46A] mx-auto mt-3 ${
                  viewMode === "mobile" ? "w-8 h-0.5" : "w-12 h-1"
                }`} />
                <p className={`text-white/80 mt-3 font-medium tracking-widest uppercase ${
                  viewMode === "mobile" ? "text-[10px]" : "text-xs"
                }`}>
                  Quarterly Journal
                </p>
              </div>

              {/* Email Title */}
              <div className={`text-center border-b border-gray-100 ${
                viewMode === "mobile" ? "px-5 py-6" : "px-8 py-10"
              }`}>
                <h2 className={`font-bold text-[#264653] leading-tight ${
                  viewMode === "mobile" ? "text-lg" : "text-2xl"
                }`}>
                  {title}
                </h2>
                <p className="text-gray-400 text-xs mt-2">
                  {format(new Date(), "MMMM yyyy")}
                </p>
              </div>

              {/* Editor's Note */}
              {editorNote && (
                <div className={`bg-shama-clay border-l-4 border-[#E9C46A] ${
                  viewMode === "mobile" ? "p-5 mx-4 my-4 rounded-lg" : "p-6 mx-6 my-6 rounded-xl"
                }`}>
                  <p className={`text-[#264653] italic leading-relaxed ${
                    viewMode === "mobile" ? "text-sm" : "text-base"
                  }`}>
                    "{editorNote}"
                  </p>
                  <p className="text-right text-xs font-semibold text-[#264653]/60 mt-3">
                    — The Shama Team
                  </p>
                </div>
              )}

              {/* Articles */}
              <div className={viewMode === "mobile" ? "px-4" : "px-8"}>
                {posts.map((post, index) => (
                  <article 
                    key={post._id} 
                    className={`border-b border-gray-100 last:border-0 ${
                      viewMode === "mobile" ? "py-5" : "py-8"
                    }`}
                  >
                    {/* Article Number Badge */}
                    <span className={`inline-block bg-[#E9C46A]/20 text-[#264653] font-bold rounded-full mb-3 ${
                      viewMode === "mobile" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1"
                    }`}>
                      ARTICLE {index + 1}
                    </span>

                    {/* Image */}
                    {post.mainImage && (
                      <div className={`overflow-hidden rounded-xl mb-4 bg-gray-100 ${
                        viewMode === "mobile" ? "aspect-video" : "aspect-2/1"
                      }`}>
                        <img
                          src={getSanityImageUrl(post.mainImage, { width: 600, height: 300, fit: 'crop' })}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Title */}
                    <h3 className={`font-bold text-[#264653] mb-2 leading-tight ${
                      viewMode === "mobile" ? "text-lg" : "text-xl"
                    }`}>
                      {post.title}
                    </h3>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      {post.publishedAt && (
                        <span>{format(parseISO(post.publishedAt), "MMM d, yyyy")}</span>
                      )}
                      {post.readTime && (
                        <>
                          <span>•</span>
                          <span>{post.readTime} min read</span>
                        </>
                      )}
                    </div>

                    {/* Excerpt */}
                    <p className={`text-gray-600 leading-relaxed mb-4 ${
                      viewMode === "mobile" ? "text-sm line-clamp-3" : "text-base"
                    }`}>
                      {post.excerpt}
                    </p>

                    {/* CTA */}
                    <a 
                      href={`/blog/${post.slug.current}`}
                      className={`inline-flex items-center font-semibold text-[#264653] border-b-2 border-[#E9C46A] hover:text-[#E9C46A] transition-colors ${
                        viewMode === "mobile" ? "text-sm" : "text-base"
                      }`}
                    >
                      Read full article
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </article>
                ))}
              </div>

              {/* Email Footer */}
              <div className={`bg-[#264653] text-center text-white ${
                viewMode === "mobile" ? "px-5 py-6 mt-6" : "px-8 py-10 mt-8"
              }`}>
                <p className={`font-bold ${viewMode === "mobile" ? "text-base" : "text-lg"}`}>
                  Shama Landscapes
                </p>
                <p className={`text-[#E9C46A] mt-1 ${viewMode === "mobile" ? "text-xs" : "text-sm"}`}>
                  journal@shamalandscapes.co.ke
                </p>
                
                <div className={`h-px bg-white/20 mx-auto my-4 ${
                  viewMode === "mobile" ? "w-16" : "w-24"
                }`} />
                
                <div className={`flex items-center justify-center gap-4 ${viewMode === "mobile" ? "text-[10px]" : "text-xs"} text-white/60`}>
                  <a href="#" className="hover:text-[#E9C46A] transition-colors">Unsubscribe</a>
                  <span>•</span>
                  <a href="#" className="hover:text-[#E9C46A] transition-colors">View in Browser</a>
                  <span>•</span>
                  <a href="#" className="hover:text-[#E9C46A] transition-colors">Update Preferences</a>
                </div>

                <p className={`text-white/40 mt-4 ${viewMode === "mobile" ? "text-[10px]" : "text-xs"}`}>
                  Nairobi, Kenya • Designing Nature, Inspiring Life
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Preview shows exactly how your email will appear
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Close Preview
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-[#264653] text-white rounded-lg font-medium hover:bg-[#1a3238] transition-colors"
            >
              <Mail className="w-4 h-4" />
              Send Test
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}