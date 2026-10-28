import React from "react";
import {
  SAMPLE_NEWS_ITEMS,
  SAMPLE_TECH_ITEMS,
  SAMPLE_OPPORTUNITIES,
  getUrgentOpportunities,
} from "../lib/sample-data.ts";
import { NewsCard } from "../components/ui/NewsCard.tsx";
import { OpportunityCard } from "../components/ui/OpportunityCard.tsx";
import { StatusIndicator } from "../components/ui/StatusIndicator.tsx";
import { VerificationBadge } from "../components/ui/Badge.tsx";
import { formatRelativeTime, formatDateTime } from "../lib/design-system.ts";

export default function HomePage() {
  const urgentOpportunities = getUrgentOpportunities();
  const featuredTech = SAMPLE_TECH_ITEMS.slice(0, 2);
  const latestNews = SAMPLE_NEWS_ITEMS.slice(0, 4);
  const featuredOpportunities = SAMPLE_OPPORTUNITIES.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* A. Dashboard Header */}
      <section aria-labelledby="dashboard-overview-heading" className="space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Editorial Intelligence Platform
              </span>
              <h1 id="dashboard-overview-heading" className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                Global Intelligence & Opportunity Radar
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl mt-1 leading-relaxed">
                Centralized discovery for verified scholarships, research fellowships, technological breakthroughs, and official policy announcements.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                Live Demo Active
              </span>
            </div>
          </div>
        </div>

        {/* Search Input & Quick Category Shortcuts */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <form action="/search" method="GET" className="relative">
            <input
              type="text"
              name="q"
              placeholder="Search across all news, AI developments, grants, and scholarships..."
              className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
            <svg
              className="w-5 h-5 text-slate-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 dark:text-slate-300 mr-1">Quick Discovery:</span>
            <a href="/opportunities?type=scholarship" className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
              Scholarships
            </a>
            <a href="/opportunities?type=grant" className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
              Research Grants
            </a>
            <a href="/technology?category=llm" className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
              Large Language Models
            </a>
            <a href="/technology?category=agents" className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
              AI Agents
            </a>
            <a href="/opportunities?type=scheme" className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
              Government Schemes
            </a>
          </div>
        </div>
      </section>

      {/* F. Deadline Awareness (Time-Sensitive Opportunities) */}
      <section aria-labelledby="urgent-deadlines-heading" className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 id="urgent-deadlines-heading" className="text-sm font-bold text-amber-950 dark:text-amber-100">
                Deadline Awareness & Urgent Applications
              </h2>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                Opportunities with verified deadlines closing within the next 7 calendar days.
              </p>
            </div>
          </div>
          <a
            href="/opportunities?status=closing_soon"
            className="text-xs font-semibold text-amber-900 dark:text-amber-200 underline hover:no-underline"
          >
            View Closing Soon &rarr;
          </a>
        </div>

        {urgentOpportunities.length === 0 ? (
          <div className="p-4 bg-white dark:bg-slate-900 rounded-lg text-xs text-slate-500 text-center">
            No opportunities in the current dataset are closing within 7 days.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {urgentOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-amber-200/80 dark:border-amber-900/40 flex flex-col justify-between gap-2 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-bold uppercase text-amber-800 dark:text-amber-400">
                      {opp.opportunityType}
                    </span>
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">
                      Closing: {formatDateTime(opp.deadline)}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                    <a href={`/opportunities/${opp.slug}`} className="hover:text-indigo-600">
                      {opp.title}
                    </a>
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Provider: {opp.providerName} • 📍 {opp.region}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {opp.fundingAmount || "Discretionary funding"}
                  </span>
                  <a
                    href={`/opportunities/${opp.slug}`}
                    className="font-bold text-amber-900 dark:text-amber-300 hover:underline"
                  >
                    View Details &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* B. Featured Developments */}
      <section aria-labelledby="featured-heading" className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div>
            <h2 id="featured-heading" className="text-base font-bold text-slate-900 dark:text-slate-100">
              Featured Intelligence & Technology Highlights
            </h2>
            <p className="text-xs text-slate-500">
              Priority research disclosures, benchmark standards, and strategic announcements.
            </p>
          </div>
          <a href="/technology" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            View All Tech &rarr;
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredTech.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Split Grid: C. Latest News & D. AI Technology Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* C. Latest News */}
        <section aria-labelledby="latest-news-heading" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div>
              <h2 id="latest-news-heading" className="text-base font-bold text-slate-900 dark:text-slate-100">
                Latest General & Policy News
              </h2>
              <p className="text-xs text-slate-500">Sourced reports, workforce funds, and economic pacts.</p>
            </div>
            <a href="/news" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              View All News &rarr;
            </a>
          </div>

          <div className="space-y-3">
            {latestNews.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold uppercase text-blue-600 dark:text-blue-400">
                    {item.category}
                  </span>
                  <span>{formatRelativeTime(item.publishedAt)}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  <a href={`/news/${item.slug}`} className="hover:text-indigo-600">
                    {item.title}
                  </a>
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                  {item.excerpt}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                  <span>Source: <strong>{item.attribution.sourceName}</strong></span>
                  <a href={`/news/${item.slug}`} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    Read &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* D. AI & Technology Radar */}
        <section aria-labelledby="ai-radar-heading" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div>
              <h2 id="ai-radar-heading" className="text-base font-bold text-slate-900 dark:text-slate-100">
                AI & Technology Radar
              </h2>
              <p className="text-xs text-slate-500">LLMs, agent compiler tools, photonics, and vector indices.</p>
            </div>
            <a href="/technology" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Radar Index &rarr;
            </a>
          </div>

          <div className="space-y-3">
            {SAMPLE_TECH_ITEMS.slice(2, 6).map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold uppercase text-purple-600 dark:text-purple-400">
                    {item.category}
                  </span>
                  <span>{formatRelativeTime(item.publishedAt)}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  <a href={`/news/${item.slug}`} className="hover:text-indigo-600">
                    {item.title}
                  </a>
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                  {item.excerpt}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                  <span>Source: <strong>{item.attribution.sourceName}</strong></span>
                  <a href={`/news/${item.slug}`} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    View Details &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* E. Opportunity Discovery Feed */}
      <section aria-labelledby="featured-opps-heading" className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div>
            <h2 id="featured-opps-heading" className="text-base font-bold text-slate-900 dark:text-slate-100">
              Verified Opportunity Registry
            </h2>
            <p className="text-xs text-slate-500">
              Doctoral fellowships, seed grants, and government schemes with transparent verification.
            </p>
          </div>
          <a href="/opportunities" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            View All Opportunities &rarr;
          </a>
        </div>

        <div className="space-y-4">
          {featuredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} item={opp} />
          ))}
        </div>
      </section>
    </div>
  );
}
