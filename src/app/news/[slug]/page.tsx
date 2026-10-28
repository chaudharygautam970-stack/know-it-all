import React from "react";
import { getNewsBySlug, ALL_SAMPLE_NEWS } from "../../../lib/sample-data.ts";
import { AttributionNotice } from "../../../components/ui/AttributionNotice.tsx";
import { CorrectionNotice } from "../../../components/ui/CorrectionNotice.tsx";
import { BookmarkButton } from "../../../components/ui/BookmarkButton.tsx";
import { EmptyState } from "../../../components/ui/EmptyState.tsx";
import { formatDateTime, NEWS_CATEGORY_LABELS } from "../../../lib/design-system.ts";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const item = getNewsBySlug(slug);

  if (!item) {
    return (
      <EmptyState
        title="Article Record Not Found"
        description={`No news or technology intelligence dispatch was found with the identifier "${slug}".`}
        actionHref="/news"
        actionLabel="&larr; Back to News Directory"
      />
    );
  }

  const categoryLabel = NEWS_CATEGORY_LABELS[item.category] || item.category;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <a href="/" className="hover:underline">Home</a>
        <span>/</span>
        <a href="/news" className="hover:underline">News</a>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">{item.title}</span>
      </div>

      {/* Main Editorial Card */}
      <article className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                {categoryLabel}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Published {formatDateTime(item.publishedAt)}
              </span>
            </div>

            <BookmarkButton
              id={item.id}
              itemType="news"
              slug={item.slug}
              title={item.title}
              sourceName={item.attribution.sourceName}
              categoryOrType={categoryLabel}
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
            {item.title}
          </h1>

          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Reporting Source:{" "}
            <a
              href={item.attribution.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 underline font-semibold"
            >
              {item.attribution.sourceName}
            </a>
            {item.attribution.publisher && item.attribution.publisher !== item.attribution.sourceName && (
              <span className="text-slate-500"> (Publisher: {item.attribution.publisher})</span>
            )}
          </div>
        </div>

        {/* Excerpt Section */}
        {item.excerpt && (
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg border-l-4 border-indigo-600 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
              Authorized Briefing Summary
            </span>
            {item.excerpt}
          </div>
        )}

        {/* Editorial Notice Section */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Copyright & Source Attribution Notice
          </div>
          <p className="leading-relaxed">
            In compliance with Intelligence Hub publication ethics (Section 5), third-party articles are never automatically rewritten or reproduced in full without documented licensing authorization. Please access the complete investigative reporting directly at the original publisher.
          </p>
          <div className="pt-1">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Read Full Article at {item.attribution.sourceName}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Filed Under:</span>
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Transparent Correction Audit History */}
        <CorrectionNotice corrections={item.correctionHistory} />

        {/* Source Attribution Component */}
        <AttributionNotice
          attribution={item.attribution}
          publishedAt={item.publishedAt}
          isLicensed={item.isLicensed}
          licensingNotes={item.licensingNotes}
        />
      </article>

      <div className="flex items-center justify-between text-xs pt-2">
        <a href="/news" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
          &larr; Return to News Feed
        </a>
        <a href="/search" className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300">
          Search Related Dispatches &rarr;
        </a>
      </div>
    </div>
  );
}
