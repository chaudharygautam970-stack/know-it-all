import React, { useState, useEffect, useMemo } from "react";
import { searchAllRecords } from "../../lib/sample-data.ts";
import { NewsCard } from "../../components/ui/NewsCard.tsx";
import { OpportunityCard } from "../../components/ui/OpportunityCard.tsx";
import { EmptyState } from "../../components/ui/EmptyState.tsx";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "news" | "technology" | "opportunities">("all");

  // Read URL query parameter on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get("q") || "";
      if (q) setQuery(q);
      const tab = urlParams.get("tab") as any;
      if (tab && ["all", "news", "technology", "opportunities"].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, []);

  const results = useMemo(() => {
    return searchAllRecords(query, activeTab);
  }, [query, activeTab]);

  const totalResultsCount =
    results.news.length + results.technology.length + results.opportunities.length;

  const handleClear = () => {
    setQuery("");
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", "/search");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Global Intelligence Search
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Unified query engine searching across national news, AI breakthroughs, scholarships, and government schemes.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, agencies, grant programs, research domains..."
            className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
          />
          <svg
            className="w-5 h-5 text-slate-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-sm font-bold"
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs font-semibold border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "all"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            All Results ({totalResultsCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("opportunities")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "opportunities"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            Opportunities ({results.opportunities.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("technology")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "technology"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            Technology ({results.technology.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("news")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "news"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            General News ({results.news.length})
          </button>
        </div>
      </div>

      {/* Results View */}
      {totalResultsCount === 0 ? (
        <EmptyState
          title="No search results matched"
          description={
            query
              ? `No records found matching "${query}". Try alternative keywords or clear filters.`
              : "Enter a query or select a domain category above to start searching."
          }
          onReset={query ? handleClear : undefined}
          resetLabel="Clear Search"
        />
      ) : (
        <div className="space-y-6">
          {/* Opportunities Section */}
          {results.opportunities.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
                Matching Opportunities ({results.opportunities.length})
              </h2>
              <div className="space-y-4">
                {results.opportunities.map((opp) => (
                  <OpportunityCard key={opp.id} item={opp} />
                ))}
              </div>
            </div>
          )}

          {/* Technology Section */}
          {results.technology.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-purple-600 border-b pb-1">
                AI & Technology Developments ({results.technology.length})
              </h2>
              <div className="space-y-4">
                {results.technology.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* General News Section */}
          {results.news.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600 border-b pb-1">
                General & Policy News ({results.news.length})
              </h2>
              <div className="space-y-4">
                {results.news.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
