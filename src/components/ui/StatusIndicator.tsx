import React from "react";
import type { OpportunityStatus } from "../../types/index.ts";
import { STATUS_CONFIGS } from "../../lib/design-system.ts";

interface StatusIndicatorProps {
  status: OpportunityStatus;
  className?: string;
  showDot?: boolean;
}

export function StatusIndicator({
  status,
  className = "",
  showDot = true,
}: StatusIndicatorProps) {
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.unknown;

  return (
    <span
      role="status"
      aria-label={config.ariaLabel}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className} ${className}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}
          aria-hidden="true"
        />
      )}
      <span>{config.label}</span>
    </span>
  );
}
