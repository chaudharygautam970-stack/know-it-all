import React from "react";
import { SAMPLE_OPPORTUNITIES } from "../../lib/sample-data.ts";
import { VerificationBadge } from "../../components/ui/Badge.tsx";

export default function AdminPage() {
  const opportunities = SAMPLE_OPPORTUNITIES;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded uppercase">
              Staff & Moderation
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Administrative & Verification Console
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit records, attach evidence URLs, verify claims, and record transparent public corrections.
          </p>
        </div>
      </div>

      {/* Guidelines reminder card */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 text-xs text-amber-900 dark:text-amber-200 space-y-2">
        <h2 className="font-bold flex items-center gap-1.5">
          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Verification Integrity Standards (Section 5 & 6)
        </h2>
        <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-800 dark:text-amber-300">
          <li><strong>Official Evidence Required:</strong> Moderators cannot mark a record as &quot;Verified&quot; without attaching an official government or university evidence URL.</li>
          <li><strong>Anti-Fabrication:</strong> Never fill in missing deadlines or funding numbers with approximations. Keep unknown fields explicit.</li>
          <li><strong>Transparent Audit Trail:</strong> Every material edit produces a permanent public correction log entry.</li>
        </ul>
      </div>

      {/* Verification Queue Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Catalog Verification Queue (Phase 1 Baseline)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Title / Record</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Provider</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Verification Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {opportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{opp.title}</div>
                    <div className="text-[10px] text-slate-400">ID: {opp.id}</div>
                  </td>
                  <td className="py-2.5 px-3 uppercase text-[10px] font-bold text-slate-500">
                    {opp.opportunityType}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    {opp.providerName}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                      {opp.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <VerificationBadge
                      status={opp.verification.status}
                      evidenceUrl={opp.verification.evidenceUrl}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
