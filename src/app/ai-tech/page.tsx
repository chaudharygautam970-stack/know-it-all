import React from "react";
import { SAMPLE_NEWS_ITEMS } from "../../lib/sample-data.ts";
import { AttributionNotice } from "../../components/ui/AttributionNotice.tsx";
import { CorrectionNotice } from "../../components/ui/CorrectionNotice.tsx";

export default function AiTechPage() {
  const aiTechNews = SAMPLE_NEWS_ITEMS.filter((n) => n.category === "ai-tech");

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          AI & Technology Intelligence
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Autonomous systems research, safety standards, quantum computing benchmarks, and algorithmic evaluation tools.
        </p>
      </div>

      <div className="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-lg text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between border border-slate-200 dark:border-slate-700">
        <span>Attribution Policy: All technical disclosures cite publisher licensing and wire syndication transparently.</span>
        <span className="font-semibold text-purple-600 dark:text-purple-400">Phase 1 Route</span>
      </div>

      <div className="space-y-4">
        {aiTechNews.map((item) => (
          <article
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3"
          >
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 uppercase">
                AI & Technology
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {item.title}
                </a>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>

            <CorrectionNotice corrections={item.correctionHistory} />
            <AttributionNotice
              attribution={item.attribution}
              publishedAt={item.publishedAt}
              isLicensed={item.isLicensed}
              licensingNotes={item.licensingNotes}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
