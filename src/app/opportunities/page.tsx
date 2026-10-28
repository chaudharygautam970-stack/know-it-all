import React from "react";
import { SAMPLE_OPPORTUNITIES } from "../../lib/sample-data.ts";
import { StatusIndicator } from "../../components/ui/StatusIndicator.tsx";
import { VerificationBadge } from "../../components/ui/Badge.tsx";
import { CorrectionNotice } from "../../components/ui/CorrectionNotice.tsx";
import { OPPORTUNITY_TYPE_LABELS, PROVIDER_TYPE_LABELS } from "../../lib/design-system.ts";

export default function OpportunitiesPage() {
  const opportunities = SAMPLE_OPPORTUNITIES;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Opportunity Discovery Catalog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified scholarships, fellowships, paid internships, grants, and government schemes.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Cataloged: <span className="font-bold text-slate-900 dark:text-slate-100">{opportunities.length}</span> opportunities
        </div>
      </div>

      {/* Filter Controls Bar Placeholder */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300 mr-1">Opportunity Type:</span>
          <span className="px-2.5 py-1 rounded-full border text-xs font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
            All Types
          </span>
          <span className="px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
            Scholarships
          </span>
          <span className="px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
            Internships
          </span>
          <span className="px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
            Grants
          </span>
          <span className="px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
            Govt Schemes
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="font-semibold text-slate-700 dark:text-slate-300 mr-1">Status:</span>
          <span className="px-2.5 py-1 rounded-full border text-xs font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
            All Statuses
          </span>
          <span className="px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
            Open
          </span>
          <span className="px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
            Closing Soon (&le;7d)
          </span>
          <span className="px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
            Closed
          </span>
          <span className="px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
            Deadline Unspecified
          </span>
        </div>
      </div>

      {/* Opportunity Cards List */}
      <div className="space-y-4">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {OPPORTUNITY_TYPE_LABELS[opp.opportunityType]}
                  </span>
                  <StatusIndicator status={opp.status} />
                  <VerificationBadge
                    status={opp.verification.status}
                    evidenceUrl={opp.verification.evidenceUrl}
                  />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {opp.title}
                </h2>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Provider: <span className="font-semibold text-slate-900 dark:text-slate-200">{opp.providerName}</span> ({PROVIDER_TYPE_LABELS[opp.providerType]})
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {opp.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-700 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Funding / Stipend</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {opp.isFundingExplicit && opp.fundingAmount ? opp.fundingAmount : "Not explicitly stated"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Application Deadline</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {opp.isDeadlineExplicit && opp.deadline ? new Date(opp.deadline).toUTCString() : "Deadline Unspecified"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Eligibility</span>
                <span className="text-slate-700 dark:text-slate-300 block truncate" title={opp.eligibilityCriteria || "See portal"}>
                  {opp.isEligibilityExplicit && opp.eligibilityCriteria ? opp.eligibilityCriteria : "Refer to primary provider"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {opp.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>

            <CorrectionNotice corrections={opp.correctionHistory} />

            <div className="text-xs border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-slate-400 text-[11px]">
                Last verified: {opp.verification.lastVerifiedAt ? new Date(opp.verification.lastVerifiedAt).toUTCString() : "Pending"}
              </span>
              <a
                href={opp.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
              >
                Apply on Official Site &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
