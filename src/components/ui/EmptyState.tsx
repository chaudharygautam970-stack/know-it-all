import React from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  resetLabel?: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({
  title = "No matching records found",
  description = "No items matched your active search query or selected category filters.",
  onReset,
  resetLabel = "Reset Filters",
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 sm:p-12 text-center space-y-3 shadow-sm my-4">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mx-auto flex items-center justify-center">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            {resetLabel}
          </button>
        )}
        {actionHref && actionLabel && (
          <a
            href={actionHref}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            {actionLabel}
          </a>
        )}
      </div>
    </div>
  );
}
