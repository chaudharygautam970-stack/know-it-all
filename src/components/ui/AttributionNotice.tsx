import React from "react";
import type { SourceAttribution } from "../../types/index.ts";
import { formatDateTime } from "../../lib/design-system.ts";

interface AttributionNoticeProps {
  attribution: SourceAttribution;
  publishedAt?: string;
  isLicensed?: boolean;
  licensingNotes?: string | null;
  className?: string;
}

export function AttributionNotice({
  attribution,
  publishedAt,
  isLicensed,
  licensingNotes,
  className = "",
}: AttributionNoticeProps) {
  return (
    <div
      className={`text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 mt-3 flex flex-col gap-1.5 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Source:
          </span>
          <a
            href={attribution.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium inline-flex items-center gap-0.5"
          >
            {attribution.sourceName}
            <svg
              className="w-3 h-3 inline-block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

          {attribution.publisher && attribution.publisher !== attribution.sourceName && (
            <span className="text-slate-500">
              (Publisher: {attribution.publisher})
            </span>
          )}
        </div>

        {publishedAt && (
          <span className="text-slate-500 text-[11px]">
            Published: {formatDateTime(publishedAt)}
          </span>
        )}
      </div>

      {attribution.isSyndicated && attribution.originalReportingUrl && (
        <div className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded">
          <span>Syndicated / wire content. </span>
          <a
            href={attribution.originalReportingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
          >
            View original reporting
          </a>
        </div>
      )}

      {isLicensed && licensingNotes && (
        <div className="text-[11px] text-slate-500 italic">
          License note: {licensingNotes}
        </div>
      )}
    </div>
  );
}
