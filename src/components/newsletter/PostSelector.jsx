"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Calendar, 
  CheckSquare, 
  Square, 
  LayoutGrid, 
  List, 
  X,
  Clock,
  User,
  Tag
} from "lucide-react";
import { format, parseISO, isWithinInterval } from "date-fns";
import { getSanityImageUrl } from "@/lib/sanity-image";

export default function PostSelector({ 
  posts, 
  selectedPosts, 
  onTogglePost, 
  onSelectAll, 
  onSelectNone,
  selectedQuarter 
}) {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // all, quarter, custom
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique categories from posts
  const categories = useMemo(() => {
    const cats = new Set();
    posts.forEach(post => {
      post.categories?.forEach(cat => cats.add(JSON.stringify({ title: cat.title, slug: cat.slug.current })));
    });
    return Array.from(cats).map(c => JSON.parse(c));
  }, [posts]);

  // Filter posts based on search and filters
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          post.title?.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.author?.name?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (categoryFilter !== "all") {
        const hasCategory = post.categories?.some(cat => cat.slug.current === categoryFilter);
        if (!hasCategory) return false;
      }

      // Date filter
      if (dateFilter === "quarter" && selectedQuarter) {
        const postDate = post.publishedAt ? parseISO(post.publishedAt) : null;
        if (!postDate) return false;
        const inQuarter = isWithinInterval(postDate, {
          start: selectedQuarter.start,
          end: selectedQuarter.end
        });
        if (!inQuarter) return false;
      }

      if (dateFilter === "custom" && customDateRange.start && customDateRange.end) {
        const postDate = post.publishedAt ? parseISO(post.publishedAt) : null;
        if (!postDate) return false;
        const inRange = isWithinInterval(postDate, {
          start: new Date(customDateRange.start),
          end: new Date(customDateRange.end)
        });
        if (!inRange) return false;
      }

      return true;
    });
  }, [posts, searchQuery, categoryFilter, dateFilter, customDateRange, selectedQuarter]);

  // Stats
  const selectedCount = selectedPosts.length;
  const filteredSelectedCount = filteredPosts.filter(p => selectedPosts.includes(p._id)).length;

  // Toggle all visible posts
  const toggleAllVisible = () => {
    const visibleIds = filteredPosts.map(p => p._id);
    const allSelected = visibleIds.every(id => selectedPosts.includes(id));
    
    if (allSelected) {
      // Deselect all visible
      onSelectNone(visibleIds);
    } else {
      // Select all visible
      onSelectAll(visibleIds);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Title & Count */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#264653] flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-[#E9C46A]" />
            </div>
            <div>
              <h3 className="font-bold text-[#264653] text-lg">Select Posts</h3>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-[#E9C46A]">{selectedCount}</span> of {posts.length} posts selected
              </p>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#264653] focus:ring-2 focus:ring-[#264653]/10 outline-none transition-all text-sm"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all ${
                showFilters 
                  ? "border-[#264653] bg-[#264653] text-white" 
                  : "border-gray-200 hover:border-[#264653]/30 text-gray-600"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {(categoryFilter !== "all" || dateFilter !== "all") && (
                <span className="w-2 h-2 rounded-full bg-[#E9C46A]" />
              )}
            </button>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid" ? "bg-white text-[#264653] shadow-sm" : "text-gray-400"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list" ? "bg-white text-[#264653] shadow-sm" : "text-gray-400"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-2">
            
            {/* Category Filter */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                <Tag className="w-3 h-3" />
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#264653] outline-none text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.slug} value={cat.slug}>{cat.title}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                <Calendar className="w-3 h-3" />
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#264653] outline-none text-sm"
              >
                <option value="all">All Time</option>
                <option value="quarter">Selected Quarter ({selectedQuarter?.label})</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Quick Actions */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                <CheckSquare className="w-3 h-3" />
                Bulk Actions
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => onSelectAll(filteredPosts.map(p => p._id))}
                  className="flex-1 px-3 py-2 text-sm font-medium text-[#264653] bg-[#E9C46A]/10 hover:bg-[#E9C46A]/20 rounded-lg transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={() => onSelectNone(filteredPosts.map(p => p._id))}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Deselect All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Date Range */}
        {dateFilter === "custom" && (
          <div className="mt-4 flex items-center gap-3 animate-in fade-in">
            <input
              type="date"
              value={customDateRange.start}
              onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-gray-200 focus:border-[#264653] outline-none text-sm"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={customDateRange.end}
              onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-gray-200 focus:border-[#264653] outline-none text-sm"
            />
          </div>
        )}
      </div>

      {/* Select All Bar */}
      {filteredPosts.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <button
            onClick={toggleAllVisible}
            className="flex items-center gap-2 text-sm font-medium text-[#264653] hover:text-[#1a3238] transition-colors"
          >
            {filteredSelectedCount === filteredPosts.length ? (
              <>
                <CheckSquare className="w-4 h-4 text-[#E9C46A]" />
                <span>Deselect all {filteredPosts.length} visible</span>
              </>
            ) : (
              <>
                <Square className="w-4 h-4" />
                <span>Select all {filteredPosts.length} visible</span>
              </>
            )}
          </button>
          <span className="text-xs text-gray-500">
            {filteredSelectedCount} of {filteredPosts.length} visible selected
          </span>
        </div>
      )}

      {/* Posts Grid/List */}
      <div className={`p-6 ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}`}>
        {filteredPosts.map((post) => {
          const isSelected = selectedPosts.includes(post._id);
          const postDate = post.publishedAt ? parseISO(post.publishedAt) : null;
          const inSelectedQuarter = selectedQuarter && postDate && isWithinInterval(postDate, {
            start: selectedQuarter.start,
            end: selectedQuarter.end
          });

          return (
            <div
              key={post._id}
              onClick={() => onTogglePost(post._id)}
              className={`group relative cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? "border-[#264653] bg-[#264653]/5 shadow-md"
                  : "border-gray-200 hover:border-[#264653]/30 hover:shadow-sm bg-white"
              } ${viewMode === "list" ? "flex items-center gap-4 p-4" : "p-4"}`}
            >
              {/* Selection Indicator */}
              <div className={`absolute ${viewMode === "grid" ? "top-4 right-4" : "right-4 top-1/2 -translate-y-1/2"} z-10`}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected ? "border-[#264653] bg-[#264653]" : "border-gray-300 bg-white group-hover:border-[#264653]"
                }`}>
                  {isSelected && <CheckSquare className="w-4 h-4 text-white" />}
                </div>
              </div>

              {/* Image */}
              {post.mainImage && (
                <div className={`shrink-0 overflow-hidden rounded-lg bg-gray-100 ${
                  viewMode === "grid" ? "w-full h-32 mb-4" : "w-20 h-20"
                }`}>
                  <img
                    src={getSanityImageUrl(post.mainImage, { width: 400, height: 300, fit: 'crop' })}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 pr-8">
                  <div>
                    {inSelectedQuarter && (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-[#E9C46A]/20 text-[#264653] text-[10px] font-bold uppercase tracking-wider mb-2">
                        In Quarter
                      </span>
                    )}
                    <h4 className={`font-bold text-[#264653] line-clamp-2 group-hover:text-[#1a3238] transition-colors ${
                      viewMode === "grid" ? "text-base" : "text-sm"
                    }`}>
                      {post.title}
                    </h4>
                  </div>
                </div>

                <p className={`text-gray-500 mt-1 line-clamp-2 ${viewMode === "grid" ? "text-sm" : "text-xs"}`}>
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  {postDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(postDate, "MMM d, yyyy")}
                    </span>
                  )}
                  {post.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime} min
                    </span>
                  )}
                  {post.author?.name && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author.name}
                    </span>
                  )}
                </div>

                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {post.categories.slice(0, 3).map(cat => (
                      <span 
                        key={cat.slug.current}
                        className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium"
                      >
                        {cat.title}
                      </span>
                    ))}
                    {post.categories.length > 3 && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium">
                        +{post.categories.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="font-bold text-gray-600 mb-2">No posts found</h4>
          <p className="text-sm text-gray-500 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
              setDateFilter("all");
            }}
            className="text-[#264653] font-semibold text-sm hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Bottom Bar */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing <span className="font-bold text-[#264653]">{filteredPosts.length}</span> of {posts.length} posts
        </div>
        <div className="text-sm font-medium text-[#264653]">
          {selectedCount} posts selected
        </div>
      </div>
    </div>
  );
}