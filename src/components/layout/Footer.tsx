import React from "react";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            Intelligence Hub — Opportunity & Intelligence Discovery
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Strict source attribution, non-rewritten news reporting, and explicit unknown field disclosures.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span>Phase 1: Project Foundation</span>
          <span>•</span>
          <span>Next.js + TypeScript</span>
          <span>•</span>
          <a
            href="https://github.com/chaudharygautam970-stack/know-it-all"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-indigo-600 dark:text-indigo-400 font-medium"
          >
            GitHub Repository
          </a>
        </div>
      </div>
    </footer>
  );
}
