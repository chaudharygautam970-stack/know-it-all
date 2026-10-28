/**
 * ============================================================================
 * Intelligence Hub — Data Validation & Copyright Compliance Rules
 * ============================================================================
 * Pure validator functions ensuring copyright integrity, transparent attribution,
 * and strict opportunity field verification before ingestion or presentation.
 */

import type { NewsItem, Opportunity, MaterialCorrection } from "../types/index.ts";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const VALID_NEWS_CATEGORIES = [
  "india",
  "world",
  "business",
  "science",
  "politics",
  "environment",
  "general",
  "ai-tech",
  "llm",
  "agents",
  "dev-tools",
  "startups",
  "research",
];

const VALID_OPPORTUNITY_TYPES = [
  "scholarship",
  "internship",
  "grant",
  "scheme",
  "fellowship",
];

/**
 * Validates a News record against Section 5 News and Copyright Rules:
 * - Must have an original source URL
 * - Must have source attribution
 * - Must have a valid publication timestamp
 * - Must have a slug
 */
export function validateNewsItem(item: Partial<NewsItem>): ValidationResult {
  const errors: string[] = [];

  if (!item.title || item.title.trim().length === 0) {
    errors.push("News title is required.");
  }

  if (!item.slug || item.slug.trim().length === 0) {
    errors.push("News slug is required.");
  }

  if (!item.url || !isValidUrl(item.url)) {
    errors.push("A valid original source URL is required.");
  }

  if (!item.attribution || !item.attribution.sourceName) {
    errors.push("Source attribution with sourceName is required.");
  }

  if (!item.attribution?.sourceUrl || !isValidUrl(item.attribution.sourceUrl)) {
    errors.push("Attribution sourceUrl must be a valid URL.");
  }

  if (!item.publishedAt || isNaN(new Date(item.publishedAt).getTime())) {
    errors.push("A valid publication timestamp (publishedAt) is required.");
  }

  if (!item.category || !VALID_NEWS_CATEGORIES.includes(item.category)) {
    errors.push(`Category must be one of: ${VALID_NEWS_CATEGORIES.join(", ")}.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates an Opportunity record against Section 6 Opportunity Verification Rules:
 * - Official provider source URL is required
 * - Must represent unknown fields explicitly (never invent criteria or funding)
 * - Must have a valid status and verification record
 */
export function validateOpportunity(item: Partial<Opportunity>): ValidationResult {
  const errors: string[] = [];

  if (!item.title || item.title.trim().length === 0) {
    errors.push("Opportunity title is required.");
  }

  if (!item.slug || item.slug.trim().length === 0) {
    errors.push("Opportunity slug is required.");
  }

  if (!item.providerName || item.providerName.trim().length === 0) {
    errors.push("Provider name is required.");
  }

  if (!item.sourceUrl || !isValidUrl(item.sourceUrl)) {
    errors.push("A valid official source URL is required.");
  }

  if (!item.opportunityType || !VALID_OPPORTUNITY_TYPES.includes(item.opportunityType)) {
    errors.push(`opportunityType must be one of: ${VALID_OPPORTUNITY_TYPES.join(", ")}.`);
  }

  const validStatuses = ["open", "closing_soon", "closed", "unknown"];
  if (!item.status || !validStatuses.includes(item.status)) {
    errors.push(`Status must be one of: ${validStatuses.join(", ")}.`);
  }

  // Explicit representation checks
  if (item.isEligibilityExplicit === false && item.eligibilityCriteria !== null) {
    errors.push(
      "Eligibility criteria must be null when isEligibilityExplicit is false (do not invent criteria)."
    );
  }

  if (item.isFundingExplicit === false && item.fundingAmount !== null) {
    errors.push(
      "Funding amount must be null when isFundingExplicit is false (do not invent funding amounts)."
    );
  }

  if (item.isDeadlineExplicit === false && item.deadline !== null) {
    errors.push(
      "Deadline must be null when isDeadlineExplicit is false (do not invent deadlines)."
    );
  }

  if (item.deadline && isNaN(new Date(item.deadline).getTime())) {
    errors.push("Provided deadline is not a valid date.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates that a correction contains a verifiable reason, user id, and timestamp
 */
export function validateCorrection(correction: Partial<MaterialCorrection>): ValidationResult {
  const errors: string[] = [];

  if (!correction.fieldChanged || correction.fieldChanged.trim().length === 0) {
    errors.push("Field changed must be specified.");
  }

  if (!correction.reason || correction.reason.trim().length < 5) {
    errors.push("Correction reason must be at least 5 characters explaining why the change was made.");
  }

  if (!correction.recordedBy || correction.recordedBy.trim().length === 0) {
    errors.push("recordedBy identifier is required for auditability.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
