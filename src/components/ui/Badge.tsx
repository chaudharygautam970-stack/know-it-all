import React from "react";
import type { VerificationStatus } from "../../types/index.ts";
import { VERIFICATION_CONFIGS } from "../../lib/design-system.ts";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "neutral" | "primary" | "success" | "warning" | "danger" | "outline";
  className?: string;
}

export function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  const variantStyles = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    primary: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    warning: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    danger: "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
    outline: "bg-transparent text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-600",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

interface VerificationBadgeProps {
  status: VerificationStatus;
  evidenceUrl?: string | null;
  className?: string;
}

export function VerificationBadge({
  status,
  evidenceUrl,
  className = "",
}: VerificationBadgeProps) {
  const config = VERIFICATION_CONFIGS[status] || VERIFICATION_CONFIGS.unverified;

  const content = (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${config.className} ${className}`}
    >
      {status === "verified" ? "✓ " : status === "disputed" ? "⚠ " : "ℹ "}
      {config.label}
    </span>
  );

  if (evidenceUrl) {
    return (
      <a
        href={evidenceUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="View official verification source evidence"
        className="hover:opacity-80 transition-opacity"
      >
        {content}
      </a>
    );
  }

  return content;
}
