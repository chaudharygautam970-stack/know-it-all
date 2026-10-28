/**
 * ============================================================================
 * Intelligence Hub — Design System Utilities & Helpers
 * ============================================================================
 * Pure functions for UI badges, visual statuses, formatters, and accessible styles.
 */

import type {
  OpportunityStatus,
  VerificationStatus,
  OpportunityType,
  ProviderType,
  NewsCategory,
} from "../types/index.ts";

// ----------------------------------------------------------------------------
// Opportunity Status Badges & Dynamic Calculation
// ----------------------------------------------------------------------------

export interface StatusBadgeConfig {
  label: string;
  className: string;
  dotColor: string;
  ariaLabel: string;
}

export const STATUS_CONFIGS: Record<OpportunityStatus, StatusBadgeConfig> = {
  open: {
    label: "Open",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    dotColor: "bg-emerald-500",
    ariaLabel: "Status: Currently open for applications",
  },
  closing_soon: {
    label: "Closing Soon",
    className: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    dotColor: "bg-amber-500",
    ariaLabel: "Status: Closing within 7 days",
  },
  closed: {
    label: "Closed",
    className: "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
    dotColor: "bg-rose-500",
    ariaLabel: "Status: Deadline has passed",
  },
  unknown: {
    label: "Deadline Not Provided",
    className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    dotColor: "bg-slate-400",
    ariaLabel: "Status: Deadline not explicitly stated by provider",
  },
};

/**
 * Accurately determines the current status of an opportunity based on its
 * deadline and explicit declaration rules. Never assumes an unstated deadline.
 */
export function determineOpportunityStatus(
  deadline: string | null,
  isDeadlineExplicit: boolean,
  referenceDate: Date = new Date("2026-10-28T00:00:00Z")
): OpportunityStatus {
  if (!isDeadlineExplicit || !deadline) {
    return "unknown";
  }

  const parsedDeadline = new Date(deadline);
  if (isNaN(parsedDeadline.getTime())) {
    return "unknown";
  }

  const timeDiffMs = parsedDeadline.getTime() - referenceDate.getTime();
  const daysRemaining = timeDiffMs / (1000 * 60 * 60 * 24);

  if (daysRemaining < 0) {
    return "closed";
  } else if (daysRemaining <= 7) {
    return "closing_soon";
  } else {
    return "open";
  }
}

// ----------------------------------------------------------------------------
// Verification Status Badges
// ----------------------------------------------------------------------------

export interface VerificationBadgeConfig {
  label: string;
  className: string;
  iconName: "check-circle" | "help-circle" | "alert-triangle" | "clock";
}

export const VERIFICATION_CONFIGS: Record<VerificationStatus, VerificationBadgeConfig> = {
  verified: {
    label: "Verified Source",
    className: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300",
    iconName: "check-circle",
  },
  unverified: {
    label: "Unverified",
    className: "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400",
    iconName: "help-circle",
  },
  disputed: {
    label: "Disputed Record",
    className: "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300",
    iconName: "alert-triangle",
  },
  under_review: {
    label: "Under Review",
    className: "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300",
    iconName: "clock",
  },
};

// ----------------------------------------------------------------------------
// Category & Provider Formatting
// ----------------------------------------------------------------------------

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  scholarship: "Scholarship",
  internship: "Internship",
  grant: "Grant",
  scheme: "Government Scheme",
  fellowship: "Research Fellowship",
};

export const PROVIDER_TYPE_LABELS: Record<ProviderType, string> = {
  government: "Government Official",
  university: "Accredited University",
  employer: "Verified Employer",
  grant_provider: "Philanthropic / Foundation",
  unknown: "Third-party / Aggregator",
};

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  india: "India Affairs",
  world: "World Affairs",
  business: "Business & Economy",
  science: "Science & Discovery",
  politics: "Public Policy",
  environment: "Environment & Climate",
  general: "General News",
  "ai-tech": "AI & Technology",
  llm: "Large Language Models",
  agents: "AI Agents",
  "dev-tools": "Developer Tools",
  startups: "Technology Startups",
  research: "Research Papers",
};

// ----------------------------------------------------------------------------
// Date & Text Display Helpers
// ----------------------------------------------------------------------------

export function formatDateTime(isoString: string | null): string {
  if (!isoString) return "Not provided";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date) + " UTC";
}

export function formatRelativeTime(isoString: string | null, now: Date = new Date("2026-10-28T00:00:00Z")): string {
  if (!isoString) return "Unknown date";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Unknown date";

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;

  return formatDateTime(isoString);
}
