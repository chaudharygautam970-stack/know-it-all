import React, { useState } from "react";
import type { MaterialCorrection } from "../../types/index.ts";
import { formatDateTime } from "../../lib/design-system.ts";

interface CorrectionNoticeProps {
  corrections: MaterialCorrection[];
  className?: string;
}

export function CorrectionNotice({
  corrections,
  className = "",
}: CorrectionNoticeProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!corrections || corrections.length === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-md border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
          <span>Transparent Record: {corrections.length} Correction{corrections.length > 1 ? "s" : ""} on File</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-amber-800 underline hover:text-amber-950 dark:text-amber-300 dark:hover:text-amber-100 font-semibold focus:outline-none"
          aria-expanded={isOpen}
        >
          {isOpen ? "Hide Audit History" : "View Audit History"}
        </button>
      </div>

      {isOpen && (
        <ul className="mt-2.5 divide-y divide-amber-200/60 dark:divide-amber-800/40">
          {corrections.map((correction) => (
            <li key={correction.id} className="pt-2 pb-1.5 text-[11px] leading-relaxed">
              <div className="flex items-center justify-between text-amber-950 dark:text-amber-100 font-medium">
                <span>Field: <code>{correction.fieldChanged}</code></span>
                <span className="text-amber-700 dark:text-amber-400">{formatDateTime(correction.timestamp)}</span>
              </div>
              <div className="mt-1 text-slate-700 dark:text-slate-300">
                <span className="text-slate-500">Reason: </span>
                {correction.reason}
              </div>
              {correction.previousValue && (
                <div className="text-slate-500 mt-0.5 line-through">
                  Was: {correction.previousValue}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
