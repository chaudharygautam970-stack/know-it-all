import React, { useState, useMemo } from "react";
import { SAMPLE_OPPORTUNITIES_DATA } from "../../lib/data/opportunities.ts";
import { OpportunityCard } from "../../components/ui/OpportunityCard.tsx";
import { EmptyState } from "../../components/ui/EmptyState.tsx";

const TYPE_OPTIONS = [
  { id: "all", label: "All Opportunities" },
  { id: "scholarship", label: "Scholarships" },
  { id: "internship", label: "Internships" },
  { id: "grant", label: "Grants" },
  { id: "scheme", label: "Govt Schemes" },
  { id: "fellowship", label: "Fellowships" },
];

const STATUS_OPTIONS = [
  { id: "all", label: "All Statuses" },
  { id: "open", label: "Open" },
  { id: "closing_soon", label: "Closing Soon (≤7d)" },
  { id: "closed", label: "Closed" },
  { id: "unknown", label: "Deadline Not Provided" },
];

export default function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [activeRegion, setActiveRegion] = useState("all");
  const [sortBy, setSortBy] = useState<"deadline_soonest" | "latest" | "title">("deadline_soonest");

  // Extract distinct regions
  const regions = useMemo(() => {
    const list = Array.from(new Set(SAMPLE_OPPORTUNITIES_DATA.map((o) => o.region)));
    return ["all", ...list];
  }, []);

  const filteredOpportunities = useMemo(() => {
    let result = [...SAMPLE_OPPORTUNITIES_DATA];

    if (activeType !== "all") {
      result = result.filter((o) => o.opportunityType === activeType);
    }

    if (activeStatus !== "all") {
      result = result.filter((o) => o.status === activeStatus);
    }

    if (activeRegion !== "all") {
      result = result.filter((o) => o.region === activeRegion);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q) ||
          o.providerName.toLowerCase().includes(q) ||
          o.region.toLowerCase().includes(q) ||
          o.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "deadline_soonest") {
        // Items with deadlines come first sorted ascending, null deadlines at the end
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      // latest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [searchQuery, activeType, activeStatus, activeRegion, sortBy]);

  const handleReset = () => {
    setSearchQuery("");
    setActiveType("all");
    setActiveStatus("all");
    setActiveRegion("all");
    setSortBy("deadline_soonest");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Opportunity Discovery Catalog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Searchable registry of verified scholarships, paid internships, capital grants, and government assistance schemes.
          </p>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing <strong>{filteredOpportunities.length}</strong> of {SAMPLE_OPPORTUNITIES_DATA.length} opportunities
        </div>
      </div>

      {/* Filter Surface */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, provider, field, or tag..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-2.5 top-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                &times;
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end text-xs">
            {/* Region Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">Region:</span>
              <select
                value={activeRegion}
                onChange={(e) => setActiveRegion(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Regions</option>
                {regions
                  .filter((r) => r !== "all")
                  .map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="deadline_soonest">Deadline Soonest</option>
                <option value="latest">Recently Added</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Opportunity Type Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-semibold text-slate-500 mr-1">Type:</span>
          {TYPE_OPTIONS.map((opt) => {
            const isActive = activeType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setActiveType(opt.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="font-semibold text-slate-500 mr-1">Status:</span>
          {STATUS_OPTIONS.map((st) => {
            const isActive = activeStatus === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setActiveStatus(st.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Opportunity Cards Feed */}
      {filteredOpportunities.length === 0 ? (
        <EmptyState
          title="No opportunities found"
          description={`No opportunities matched your query "${searchQuery}" under the selected filters.`}
          onReset={handleReset}
        />
      ) : (
        <div className="space-y-4">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} item={opp} />
          ))}
        </div>
      )}
    </div>
  );
}
