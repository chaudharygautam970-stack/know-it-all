import React, { useState, useEffect } from "react";
import { getSavedItemIds } from "../ui/BookmarkButton.tsx";

interface NavbarProps {
  currentPath?: string;
}

export function Navbar({ currentPath = "/" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setSavedCount(getSavedItemIds().length);
    };

    updateCount();
    window.addEventListener("intelligence_hub_storage_updated", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("intelligence_hub_storage_updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  const primaryNavLinks = [
    { label: "Overview", href: "/" },
    { label: "News", href: "/news" },
    { label: "AI & Technology", href: "/technology" },
    { label: "Opportunities", href: "/opportunities" },
    { label: "Saved Items", href: "/saved", badge: savedCount },
    { label: "Search", href: "/search" },
  ];

  return (
    <header className="bg-slate-950 text-slate-100 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <a href="/" className="flex items-center gap-3 group focus:outline-none shrink-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow group-hover:bg-indigo-500 transition-colors">
            IH
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight leading-tight block">
              Intelligence Hub
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase hidden sm:block">
              Discovery & Verification
            </span>
          </div>
        </a>

        {/* Global Search Control */}
        <div className="flex-1 max-w-xs md:max-w-sm mx-2">
          <form action="/search" method="GET" className="relative">
            <input
              type="text"
              name="q"
              placeholder="Search intelligence & opportunities..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-100 placeholder-slate-400 transition-all"
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

        {/* Desktop Primary Navigation */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium">
          {primaryNavLinks.map((link) => {
            const isActive =
              currentPath === link.href ||
              (link.href === "/technology" && currentPath === "/ai-tech");
            return (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white font-bold border border-slate-700"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
              >
                {link.label}
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-indigo-500 text-white rounded-full text-[10px] font-bold">
                    {link.badge}
                  </span>
                )}
              </a>
            );
          })}

          <div className="h-4 w-px bg-slate-800 mx-2" aria-hidden="true" />

          {/* User Account Placeholder */}
          <div className="flex items-center gap-2 pl-1">
            <div
              className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-300 font-semibold"
              title="Researcher Profile"
              aria-label="User Profile"
            >
              RP
            </div>
            <a
              href="/login"
              className="text-slate-400 hover:text-slate-200 text-xs font-medium hidden xl:inline-block"
            >
              Sign In
            </a>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-300 hover:text-white rounded-md focus:outline-none"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Responsive Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-1 text-xs font-medium">
          {primaryNavLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center justify-between py-2.5 px-3 rounded text-slate-200 hover:bg-slate-900"
            >
              <span>{link.label}</span>
              {link.badge !== undefined && link.badge > 0 && (
                <span className="px-1.5 py-0.2 bg-indigo-500 text-white rounded-full text-[10px] font-bold">
                  {link.badge}
                </span>
              )}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-800">
            <a
              href="/login"
              className="block py-2 px-3 rounded text-indigo-400 hover:bg-slate-900 font-semibold"
            >
              Researcher Account / Sign In
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
