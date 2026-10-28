import React, { useState, useMemo } from "react";
import { SAMPLE_NEWS_DATA } from "../../lib/data/news.ts";
import { NewsCard } from "../../components/ui/NewsCard.tsx";
import { EmptyState } from "../../components/ui/EmptyState.tsx";

const CATEGORIES = [
  { id: "all", label: "All News" },
  { id: "india", label: "India" },
  { id: "world", label: "World" },
  { id: "business", label: "Business" },
  { id: "science", label: "Science" },
  { id: "politics", label: "Public Policy" },
  { id: "environment", label: "Environment" },
];

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const filteredNews = useMemo(() => {
    let result = [...SAMPLE_NEWS_DATA];

    if (activeCategory !== "all") {
      result = result.filter((item) => item.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.excerpt && item.excerpt.toLowerCase().includes(q)) ||
          item.attribution.sourceName.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [searchQuery, activeCategory, sortBy]);

  const handleReset = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setSortBy("newest");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            National & International News Feed
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Source-attributed headlines, public infrastructure accords, workforce allocations, and scientific findings.
          </p>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing <strong>{filteredNews.length}</strong> of {SAMPLE_NEWS_DATA.length} records
        </div>
      </div>

      {/* Control Bar: Search, Category Filters & Sort */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Keyword Search */}
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news by headline, agency, or tag..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-2.5 top-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                &times;
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
            <span className="font-semibold text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="newest">Latest Published</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-semibold text-slate-500 mr-1">Categories:</span>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* News Records Grid */}
      {filteredNews.length === 0 ? (
        <EmptyState
          title="No news articles found"
          description={`No news records match "${searchQuery}" in ${
            activeCategory === "all" ? "any category" : activeCategory
          }.`}
          onReset={handleReset}
        />
      ) : (
        <div className="space-y-4">
          {filteredNews.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
