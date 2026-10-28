import React from "react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-8 text-xs mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100">Intelligence Hub</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">
              v0.2.0-MVP
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Editorial intelligence discovery adhering to strict source attribution, non-rewritten headlines, and verified opportunity registries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <a href="/news" className="hover:text-slate-200 transition-colors">News</a>
          <span>•</span>
          <a href="/technology" className="hover:text-slate-200 transition-colors">AI & Tech</a>
          <span>•</span>
          <a href="/opportunities" className="hover:text-slate-200 transition-colors">Opportunities</a>
          <span>•</span>
          <a href="/search" className="hover:text-slate-200 transition-colors">Search</a>
          <span>•</span>
          <a href="/admin" className="text-slate-500 hover:text-slate-400 transition-colors">Staff Console</a>
          <span>•</span>
          <a
            href="https://github.com/chaudharygautam970-stack/know-it-all"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-indigo-400 font-semibold"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
