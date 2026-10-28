import React from "react";
import { SAMPLE_NEWS_ITEMS, SAMPLE_OPPORTUNITIES } from "../lib/sample-data.ts";
import { StatusIndicator } from "../components/ui/StatusIndicator.tsx";
import { VerificationBadge } from "../components/ui/Badge.tsx";
import { AttributionNotice } from "../components/ui/AttributionNotice.tsx";
import { CorrectionNotice } from "../components/ui/CorrectionNotice.tsx";

export default function HomePage() {
  const opportunities = SAMPLE_OPPORTUNITIES;
  const news = SAMPLE_NEWS_ITEMS;

  const closingSoonCount = opportunities.filter((o) => o.status === "closing_soon").length;
  const verifiedCount = opportunities.filter((o) => o.verification.status === "verified").length;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Intelligence & Opportunity Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified scholarships, research grants, technology developments, and official schemes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
            Phase 1 Foundation Active
          </span>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Opportunities
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{opportunities.length}</span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded font-medium">
              Cataloged
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
            Closing Soon
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{closingSoonCount}</span>
            <span className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded font-medium">
              &le; 7 Days
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
            Verified Sources
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{verifiedCount}</span>
            <span className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded font-medium">
              100% Attributed
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            News Indexed
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{news.length}</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-medium">
              AI & General
            </span>
          </div>
        </div>
      </div>

      {/* Urgent Closing Soon Alert Box */}
      <section aria-labelledby="urgent-heading" className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 id="urgent-heading" className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              Urgent Deadlines — Closing Within 7 Days
            </h2>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
              Strict opportunity verification active. Deadlines are verified against primary provider documents.
            </p>
            <div className="mt-3 space-y-2">
              {opportunities
                .filter((o) => o.status === "closing_soon")
                .map((opp) => (
                  <div
                    key={opp.id}
                    className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-amber-200 dark:border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{opp.title}</div>
                      <div className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                        Deadline: {opp.deadline ? new Date(opp.deadline).toUTCString() : "Unspecified"} • Provider: {opp.providerName}
                      </div>
                    </div>
                    <a
                      href={opp.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold text-center transition-colors shrink-0"
                    >
                      Official Source &rarr;
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Intelligence Feed Preview */}
        <section aria-labelledby="latest-intel-heading" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 id="latest-intel-heading" className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Latest Attributed Intelligence
            </h2>
            <a href="/news" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View All News &rarr;
            </a>
          </div>

          <div className="space-y-4">
            {news.slice(0, 3).map((item) => (
              <article key={item.id} className="border-b border-slate-100 dark:border-slate-800 last:border-none pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {item.category === "ai-tech" ? "AI & Technology" : "General News"}
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">
                    {item.title}
                  </a>
                </h3>
                <CorrectionNotice corrections={item.correctionHistory} className="my-2" />
                <AttributionNotice
                  attribution={item.attribution}
                  publishedAt={item.publishedAt}
                  isLicensed={item.isLicensed}
                  licensingNotes={item.licensingNotes}
                />
              </article>
            ))}
          </div>
        </section>

        {/* Featured Opportunities Preview */}
        <section aria-labelledby="featured-opp-heading" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 id="featured-opp-heading" className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Featured Opportunities
            </h2>
            <a href="/opportunities" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Browse Catalog &rarr;
            </a>
          </div>

          <div className="space-y-4">
            {opportunities.slice(0, 3).map((opp) => (
              <div key={opp.id} className="border-b border-slate-100 dark:border-slate-800 last:border-none pb-3 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase">
                    {opp.opportunityType}
                  </span>
                  <StatusIndicator status={opp.status} />
                  <VerificationBadge status={opp.verification.status} evidenceUrl={opp.verification.evidenceUrl} />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">{opp.title}</h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">{opp.description}</p>
                <div className="text-[11px] text-slate-500 flex justify-between items-center">
                  <span>Funding: <strong>{opp.fundingAmount || "Not explicitly stated"}</strong></span>
                  <a
                    href={opp.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    View Official Site &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
