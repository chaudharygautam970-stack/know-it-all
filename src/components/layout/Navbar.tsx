import React, { useState } from "react";

interface NavbarProps {
  currentPath?: string;
  savedCount?: number;
}

export function Navbar({ currentPath = "/", savedCount = 0 }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Dashboard", href: "/" },
    { label: "General News", href: "/news" },
    { label: "AI & Tech", href: "/ai-tech" },
    { label: "Opportunities", href: "/opportunities" },
    { label: "Search", href: "/search" },
    { label: "Saved", href: "/saved", badge: savedCount },
  ];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-indigo-700 transition-colors">
            IH
          </div>
          <div>
            <span className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight block">
              Intelligence Hub
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Verified Intelligence & Opportunity Discovery
            </span>
          </div>
        </a>

        {/* Search Bar */}
        <div className="flex-1 max-w-xs md:max-w-md mx-2">
          <form action="/search" method="GET" className="relative">
            <input
              type="text"
              name="q"
              placeholder="Search news, grants, schemes..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-slate-100"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-2.5 top-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium">
          {navLinks.map((link) => {
            const isActive = currentPath === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] font-bold">
                    {link.badge}
                  </span>
                )}
              </a>
            );
          })}

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2" aria-hidden="true" />

          <a
            href="/admin"
            className="px-3 py-2 rounded-md text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors font-semibold"
          >
            Admin
          </a>

          <a
            href="/login"
            className="ml-1 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors"
          >
            Sign In
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-md"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1 text-xs font-medium">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2 px-3 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/admin"
            className="block py-2 px-3 rounded text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
          >
            Admin Console
          </a>
          <a
            href="/login"
            className="block py-2 px-3 rounded font-bold text-indigo-600 dark:text-indigo-400"
          >
            Sign In (Phase 3 Supabase Auth)
          </a>
        </div>
      )}
    </header>
  );
}
