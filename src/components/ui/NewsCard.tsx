import React from "react";
import type { NewsItem } from "../../types/index.ts";
import { formatRelativeTime, NEWS_CATEGORY_LABELS } from "../../lib/design-system.ts";
import { BookmarkButton } from "./BookmarkButton.tsx";
import { AttributionNotice } from "./AttributionNotice.tsx";
import { CorrectionNotice } from "./CorrectionNotice.tsx";

interface NewsCardProps {
  item: NewsItem;
  className?: string;
  showAttributionNotice?: boolean;
}

export function NewsCard({ item, className = "", showAttributionNotice = true }: NewsCardProps) {
  const categoryLabel = NEWS_CATEGORY_LABELS[item.category] || item.category;

  return (
    <article
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {categoryLabel}
            </span>
            <span className="text-[11px] text-slate-400">
              {formatRelativeTime(item.publishedAt)}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
            <a
              href={`/news/${item.slug}`}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {item.title}
            </a>
          </h3>
        </div>

        <BookmarkButton
          id={item.id}
          itemType="news"
          slug={item.slug}
          title={item.title}
          sourceName={item.attribution.sourceName}
          categoryOrType={categoryLabel}
          compact
        />
      </div>

      {item.excerpt && (
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {item.excerpt}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 rounded text-[10px] font-medium border border-slate-100 dark:border-slate-800"
          >
            #{tag}
          </span>
        ))}
      </div>

      <CorrectionNotice corrections={item.correctionHistory} />

      {showAttributionNotice && (
        <AttributionNotice
          attribution={item.attribution}
          publishedAt={item.publishedAt}
          isLicensed={item.isLicensed}
          licensingNotes={item.licensingNotes}
        />
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <a
          href={`/news/${item.slug}`}
          className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold inline-flex items-center gap-1"
        >
          Read Record Detail &rarr;
        </a>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-[11px] inline-flex items-center gap-1"
        >
          Original Publisher
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </article>
  );
}
