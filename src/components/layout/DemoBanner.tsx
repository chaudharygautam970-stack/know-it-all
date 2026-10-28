import React from "react";

export function DemoBanner() {
  return (
    <aside
      aria-label="Demonstration Notice"
      className="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-semibold flex items-center justify-between border-b border-amber-600/30"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center gap-2">
        <span className="inline-block px-1.5 py-0.5 bg-amber-950 text-amber-100 rounded text-[10px] tracking-wide uppercase font-bold">
          Demonstration Data
        </span>
        <span className="truncate">
          All records shown are simulated sample data for UI and workflow verification. Citations and URLs follow official formats.
        </span>
      </div>
    </aside>
  );
}
