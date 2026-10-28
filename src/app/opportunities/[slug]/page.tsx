import React from "react";
import { getOpportunityBySlug } from "../../../lib/sample-data.ts";
import { StatusIndicator } from "../../../components/ui/StatusIndicator.tsx";
import { VerificationBadge } from "../../../components/ui/Badge.tsx";
import { BookmarkButton } from "../../../components/ui/BookmarkButton.tsx";
import { CorrectionNotice } from "../../../components/ui/CorrectionNotice.tsx";
import { EmptyState } from "../../../components/ui/EmptyState.tsx";
import {
  OPPORTUNITY_TYPE_LABELS,
  PROVIDER_TYPE_LABELS,
  formatDateTime,
} from "../../../lib/design-system.ts";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const item = getOpportunityBySlug(slug);

  if (!item) {
    return (
      <EmptyState
        title="Opportunity Record Not Found"
        description={`No scholarship, internship, scheme, or grant program was found with the slug "${slug}".`}
        actionHref="/opportunities"
        actionLabel="&larr; Return to Opportunities Catalog"
      />
    );
  }

  const typeLabel = OPPORTUNITY_TYPE_LABELS[item.opportunityType] || item.opportunityType;
  const providerLabel = PROVIDER_TYPE_LABELS[item.providerType] || item.providerType;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <a href="/" className="hover:underline">Home</a>
        <span>/</span>
        <a href="/opportunities" className="hover:underline">Opportunities</a>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">{item.title}</span>
      </div>

      {/* Main Opportunity Specification Card */}
      <article className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                {typeLabel}
              </span>
              <StatusIndicator status={item.status} />
              <VerificationBadge
                status={item.verification.status}
                evidenceUrl={item.verification.evidenceUrl}
              />
              <span className="text-xs text-slate-500">📍 {item.region}</span>
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

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
            {item.title}
          </h1>

          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Issuing Entity:{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-200">{item.providerName}</span>{" "}
            <span className="text-slate-400">({providerLabel})</span>
          </div>
        </div>

        {/* Structured Spec Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
              Funding / Grant Value
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {item.isFundingExplicit && item.fundingAmount ? item.fundingAmount : "Not explicitly stated by provider"}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
              Application Deadline
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {item.isDeadlineExplicit && item.deadline ? formatDateTime(item.deadline) : "Deadline not provided"}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
              Verification State
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 capitalize">
              {item.verification.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Program Description
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Eligibility Section */}
        <div className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Eligibility Criteria
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {item.isEligibilityExplicit && item.eligibilityCriteria
              ? item.eligibilityCriteria
              : "Eligibility criteria are not globally summarized in provider publications. Please consult the issuing institution directly."}
          </p>
        </div>

        {/* Verification Audit Details */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Source Verification Record
          </div>
          <p className="text-[11px] leading-relaxed">
            Last verified: <strong>{formatDateTime(item.verification.lastVerifiedAt)}</strong> by {item.verification.verifiedBy || "Automated Feed"}.
            {item.verification.notes && ` Note: ${item.verification.notes}`}
          </p>
          {item.verification.evidenceUrl && (
            <div className="pt-1">
              <a
                href={item.verification.evidenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 underline font-medium"
              >
                Inspect Official Verification Evidence Document &rarr;
              </a>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Tags:</span>
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        <CorrectionNotice corrections={item.correctionHistory} />

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            Official Source: <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">{item.providerName}</a>
          </span>
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Apply on Official Portal
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </article>

      <div className="flex items-center justify-between text-xs pt-2">
        <a href="/opportunities" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
          &larr; Return to Opportunities Directory
        </a>
      </div>
    </div>
  );
}
