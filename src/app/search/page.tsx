import React from "react";
import { SAMPLE_OPPORTUNITIES, SAMPLE_NEWS_ITEMS } from "../../lib/sample-data.ts";

export default function SearchPage() {
  const totalCount = SAMPLE_OPPORTUNITIES.length + SAMPLE_NEWS_ITEMS.length;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Global Intelligence Search & Discovery
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Query cross-referenced databases of verified news, research opportunities, grants, and scholarships.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="relative">
          <input
            type="search"
            placeholder="Search keywords, provider names, research domains, or grant programs..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            defaultValue=""
          />
          <svg
            className="w-5 h-5 text-slate-400 absolute left-3 top-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Quick Filters:</span>
          <button className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200">
            Quantum Computing
          </button>
          <button className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200">
            PhD Fellowships
          </button>
          <button className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200">
            Clean Energy Grants
          </button>
          <button className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200">
            Govt Schemes
          </button>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center space-y-2">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Indexing Status: {totalCount} Initial Records Available
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Phase 1 establishes the search routing and filter state schema. Live server search is available on the local runtime engine.
        </p>
      </div>
    </div>
  );
}
