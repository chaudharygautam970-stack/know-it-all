/**
 * ============================================================================
 * Intelligence Hub — Core Domain Type Definitions
 * ============================================================================
 * Strongly typed models enforcing data integrity, transparent attribution,
 * explicit missing fields, and verification audit trails.
 */

// ----------------------------------------------------------------------------
// General Enums & Value Unions
// ----------------------------------------------------------------------------

export type NewsCategory = "general" | "ai-tech";

export type OpportunityType =
  | "scholarship"
  | "internship"
  | "grant"
  | "scheme";

export type ProviderType =
  | "government"
  | "university"
  | "employer"
  | "grant_provider"
  | "unknown";

export type OpportunityStatus =
  | "open"
  | "closing_soon"
  | "closed"
  | "unknown";

export type VerificationStatus =
  | "verified"
  | "unverified"
  | "disputed"
  | "under_review";

export type UserRole = "user" | "moderator" | "admin";

// ----------------------------------------------------------------------------
// Source & Verification Audit Models
// ----------------------------------------------------------------------------

export interface SourceAttribution {
  sourceName: string;
  sourceUrl: string;
  publisher?: string | null;
  licenseOrTerms?: string | null;
  isSyndicated?: boolean;
  originalReportingUrl?: string | null;
  retrievedAt: string; // ISO 8601
}

export interface VerificationRecord {
  status: VerificationStatus;
  lastVerifiedAt: string | null; // ISO 8601 or null if never verified
  verifiedBy?: string | null; // Admin/Moderator ID or system verifier
  evidenceUrl?: string | null; // Direct link to official confirmation source
  notes?: string | null;
}

export interface MaterialCorrection {
  id: string;
  timestamp: string; // ISO 8601
  fieldChanged: string;
  previousValue: string | null;
  newValue: string | null;
  reason: string;
  recordedBy: string;
}

// ----------------------------------------------------------------------------
// Domain Entities: News & Opportunities
// ----------------------------------------------------------------------------

export interface NewsItem {
  id: string;
  title: string;
  url: string; // Original URL
  category: NewsCategory;
  attribution: SourceAttribution;
  publishedAt: string; // Real publication timestamp (never fabricated)
  discoveredAt: string; // When our platform indexed it
  isLicensed: boolean;
  licensingNotes?: string | null;
  correctionHistory: MaterialCorrection[];
  tags: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  opportunityType: OpportunityType;
  providerName: string;
  providerType: ProviderType;
  sourceUrl: string; // Direct link to official provider page

  // Explicit unknown or null fields (never invented)
  description: string;
  eligibilityCriteria: string | null;
  isEligibilityExplicit: boolean; // True if provider explicitly gave criteria, false if unknown

  fundingAmount: string | null;
  isFundingExplicit: boolean; // True if stated, false if unknown/discretionary

  deadline: string | null; // ISO 8601 string or null if ongoing/unspecified
  isDeadlineExplicit: boolean;

  status: OpportunityStatus;
  verification: VerificationRecord;
  correctionHistory: MaterialCorrection[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------------
// User & Saved Items Models
// ----------------------------------------------------------------------------

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface SavedItem {
  id: string;
  userId: string;
  itemType: "news" | "opportunity";
  itemId: string;
  savedAt: string;
  userNotes?: string | null;
  // Snapshot data for quick offline/saved rendering
  titleSnapshot: string;
  sourceUrlSnapshot: string;
  categoryOrTypeSnapshot: string;
}

// ----------------------------------------------------------------------------
// Search & Filter State
// ----------------------------------------------------------------------------

export interface FilterState {
  query: string;
  section: "all" | "news" | "ai-tech" | "opportunities" | "saved";
  opportunityTypes: OpportunityType[];
  providerTypes: ProviderType[];
  opportunityStatuses: OpportunityStatus[];
  verificationStatuses: VerificationStatus[];
  sortBy: "latest" | "deadline_soonest" | "title";
}

// ----------------------------------------------------------------------------
// Verification / Administrative Action DTOs
// ----------------------------------------------------------------------------

export interface VerifyOpportunityInput {
  opportunityId: string;
  status: VerificationStatus;
  evidenceUrl: string;
  notes?: string;
  adminId: string;
}

export interface RecordCorrectionInput {
  entityType: "news" | "opportunity";
  entityId: string;
  fieldChanged: string;
  previousValue: string | null;
  newValue: string | null;
  reason: string;
  recordedBy: string;
}
