import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { determineOpportunityStatus } from "../src/lib/design-system.ts";
import {
  validateNewsItem,
  validateOpportunity,
  validateCorrection,
} from "../src/lib/validation.ts";
import type { NewsItem, Opportunity, MaterialCorrection } from "../src/types/index.ts";

describe("Domain Rules & Verification Standards", () => {
  describe("determineOpportunityStatus", () => {
    const referenceDate = new Date("2026-10-28T00:00:00Z");

    it("should return 'unknown' if deadline is not explicit or null", () => {
      const status1 = determineOpportunityStatus(null, false, referenceDate);
      assert.strictEqual(status1, "unknown");

      const status2 = determineOpportunityStatus("2026-12-01T00:00:00Z", false, referenceDate);
      assert.strictEqual(status2, "unknown");
    });

    it("should return 'open' if deadline is more than 7 days ahead", () => {
      const futureDeadline = "2026-11-20T00:00:00Z";
      const status = determineOpportunityStatus(futureDeadline, true, referenceDate);
      assert.strictEqual(status, "open");
    });

    it("should return 'closing_soon' if deadline is within 7 days", () => {
      const closingSoonDeadline = "2026-11-02T00:00:00Z"; // 5 days away
      const status = determineOpportunityStatus(closingSoonDeadline, true, referenceDate);
      assert.strictEqual(status, "closing_soon");
    });

    it("should return 'closed' if deadline has already passed", () => {
      const pastDeadline = "2026-10-20T00:00:00Z";
      const status = determineOpportunityStatus(pastDeadline, true, referenceDate);
      assert.strictEqual(status, "closed");
    });
  });

  describe("validateNewsItem - Copyright & Attribution Enforcement", () => {
    it("should reject news items missing original source URL or attribution", () => {
      const invalidNews: Partial<NewsItem> = {
        title: "Major AI Breakthrough Announced",
        category: "ai-tech",
        publishedAt: "2026-10-28T10:00:00Z",
      };

      const result = validateNewsItem(invalidNews);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.errors.some((e) => e.includes("source URL")));
      assert.ok(result.errors.some((e) => e.includes("Source attribution")));
    });

    it("should accept valid, properly attributed news items", () => {
      const validNews: Partial<NewsItem> = {
        title: "Open Source AI Safety Benchmark Released",
        slug: "open-source-ai-safety-benchmark-released",
        url: "https://example-institute.org/reports/ai-safety-2026",
        category: "ai-tech",
        publishedAt: "2026-10-28T09:30:00Z",
        attribution: {
          sourceName: "AI Safety Institute",
          sourceUrl: "https://example-institute.org",
          retrievedAt: "2026-10-28T10:00:00Z",
        },
      };

      const result = validateNewsItem(validNews);
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.errors.length, 0);
    });
  });

  describe("validateOpportunity - Anti-Fabrication & Strict Sourcing", () => {
    it("should reject opportunities that invent funding when not explicitly stated", () => {
      const fabricatedOpportunity: Partial<Opportunity> = {
        title: "National STEM Scholarship",
        providerName: "Ministry of Science & Education",
        sourceUrl: "https://gov.example.org/stem",
        opportunityType: "scholarship",
        status: "open",
        isEligibilityExplicit: true,
        eligibilityCriteria: "Undergraduate STEM students",
        isFundingExplicit: false,
        fundingAmount: "$50,000", // VIOLATION: inventing amount when isFundingExplicit is false
        isDeadlineExplicit: false,
        deadline: null,
      };

      const result = validateOpportunity(fabricatedOpportunity);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.errors.some((e) => e.includes("Funding amount must be null")));
    });

    it("should accept opportunities with explicit unknown fields", () => {
      const honestOpportunity: Partial<Opportunity> = {
        title: "Government Innovation Fellowship",
        slug: "government-innovation-fellowship",
        providerName: "Department of Technology",
        sourceUrl: "https://tech.gov.example.org/fellowship",
        opportunityType: "grant",
        status: "unknown",
        isEligibilityExplicit: false,
        eligibilityCriteria: null,
        isFundingExplicit: false,
        fundingAmount: null,
        isDeadlineExplicit: false,
        deadline: null,
      };

      const result = validateOpportunity(honestOpportunity);
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.errors.length, 0);
    });
  });

  describe("validateCorrection - Audit Trail Integrity", () => {
    it("should enforce that every material correction has a recorded user and descriptive reason", () => {
      const emptyCorrection: Partial<MaterialCorrection> = {
        fieldChanged: "deadline",
        reason: "fix", // Too short
      };

      const result = validateCorrection(emptyCorrection);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.errors.some((e) => e.includes("recordedBy")));
      assert.ok(result.errors.some((e) => e.includes("at least 5 characters")));
    });
  });
});
