import React from "react";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">
          IH
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Sign In to Intelligence Hub
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Synchronize bookmarked opportunities, research alerts, and moderation actions.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Placeholder form structure */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              disabled
              placeholder="user@example.edu"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 cursor-not-allowed text-xs"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              disabled
              placeholder="••••••••••••"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 cursor-not-allowed text-xs"
            />
          </div>
          <button
            type="button"
            disabled
            className="w-full py-2.5 bg-slate-300 dark:bg-slate-800 text-slate-500 rounded-lg font-semibold text-xs cursor-not-allowed"
          >
            Sign In (Locked in Phase 1)
          </button>
        </div>

        {/* Informative Architectural Notice */}
        <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/40 rounded-lg p-3 text-xs text-indigo-900 dark:text-indigo-200 space-y-1.5">
          <div className="font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" aria-hidden="true" />
            Phase 3 Architectural Roadmap
          </div>
          <p className="text-[11px] leading-relaxed text-indigo-800 dark:text-indigo-300">
            Per Phase 1 security requirements, live authentication is scheduled for <strong>Phase 3</strong>. It will utilize Supabase Auth with server-side session cookies, email magic links, and Row Level Security policies.
          </p>
        </div>
      </div>

      <div className="text-center">
        <a href="/" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          &larr; Return to Dashboard
        </a>
      </div>
    </div>
  );
}
