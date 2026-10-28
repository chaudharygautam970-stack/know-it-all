import React from "react";
import type { Opportunity } from "../../types/index.ts";
import {
  OPPORTUNITY_TYPE_LABELS,
  PROVIDER_TYPE_LABELS,
  formatDateTime,
} from "../../lib/design-system.ts";
import { StatusIndicator } from "./StatusIndicator.tsx";
import { VerificationBadge } from "./Badge.tsx";
import { BookmarkButton } from "./BookmarkButton.tsx";
import { CorrectionNotice } from "./CorrectionNotice.tsx";

interface OpportunityCardProps {
  item: Opportunity;
  className?: string;
}

export function OpportunityCard({ item, className = "" }: OpportunityCardProps) {
  const typeLabel = OPPORTUNITY_TYPE_LABELS[item.opportunityType] || item.opportunityType;
  const providerLabel = PROVIDER_TYPE_LABELS[item.providerType] || item.providerType;

  const fundingText =
    item.isFundingExplicit && item.fundingAmount
      ? item.fundingAmount
      : "Not explicitly stated";

  const deadlineText =
    item.isDeadlineExplicit && item.deadline
      ? formatDateTime(item.deadline)
      : "Deadline not provided";

  const eligibilityText =
    item.isEligibilityExplicit && item.eligibilityCriteria
      ? item.eligibilityCriteria
      : "Refer to issuing organization portal";

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4 ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
              {typeLabel}
            </span>
            <StatusIndicator status={item.status} />
            <VerificationBadge
              status={item.verification.status}
              evidenceUrl={item.verification.evidenceUrl}
            />
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              📍 {item.region}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
            <a
              href={`/opportunities/${item.slug}`}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {item.title}
            </a>
          </h3>

          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Organization:{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-200">
              {item.providerName}
            </span>{" "}
            <span className="text-slate-400">({providerLabel})</span>
          </div>
        </div>

        <BookmarkButton
          id={item.id}
          itemType="opportunity"
          slug={item.slug}
          title={item.title}
          sourceName={item.providerName}
          categoryOrType={typeLabel}
        />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        {item.description}
      </p>

      {/* Structured Info Surface */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-700 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Funding / Grant
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
            {fundingText}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Application Deadline
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
            {deadlineText}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Eligibility
          </span>
          <span
            className="text-slate-700 dark:text-slate-300 block truncate"
            title={item.eligibilityCriteria || "See portal"}
          >
            {eligibilityText}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>

      <CorrectionNotice corrections={item.correctionHistory} />

      <div className="text-xs border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-wrap items-center justify-between gap-2">
        <a
          href={`/opportunities/${item.slug}`}
          className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
        >
          View Full Specification &rarr;
        </a>
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors"
        >
          Official Portal
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
