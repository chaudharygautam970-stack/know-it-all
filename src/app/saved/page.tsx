import React from "react";

export default function SavedPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Saved Intelligence & Opportunities
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Access your personal bookmarked grants, articles, and research stipends with custom notes.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-3 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center text-xl font-bold">
          ★
        </div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Saved Items Workspace
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          In Phase 1 & 2, bookmarks and personal notes are stored locally in browser session storage. In Phase 3, this syncs securely with Supabase PostgreSQL under Row Level Security (RLS).
        </p>
        <div className="pt-2">
          <a
            href="/opportunities"
            className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Explore Opportunities & Save
          </a>
        </div>
      </div>
    </div>
  );
}
