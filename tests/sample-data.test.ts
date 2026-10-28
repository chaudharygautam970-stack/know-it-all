import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  SAMPLE_NEWS_ITEMS,
  SAMPLE_TECH_ITEMS,
  SAMPLE_OPPORTUNITIES,
  IS_DEMO_DATA,
  getNewsBySlug,
  getOpportunityBySlug,
  searchAllRecords,
} from "../src/lib/sample-data.ts";
import {
  validateNewsItem,
  validateOpportunity,
  validateCorrection,
} from "../src/lib/validation.ts";

describe("Sample Demonstration Data Integrity", () => {
  it("should be explicitly marked as demonstration data", () => {
    assert.strictEqual(IS_DEMO_DATA, true);
  });

  it("should ensure all sample news items pass copyright & attribution validation", () => {
    assert.ok(SAMPLE_NEWS_ITEMS.length > 0);
    for (const item of SAMPLE_NEWS_ITEMS) {
      const result = validateNewsItem(item);
      assert.strictEqual(
        result.isValid,
        true,
        `News item '${item.id}' failed validation: ${result.errors.join(", ")}`
      );
      assert.ok(item.slug.length > 0);
      assert.ok(item.attribution.sourceUrl.startsWith("http"));
      assert.ok(item.url.startsWith("http"));

      for (const corr of item.correctionHistory) {
        const corrResult = validateCorrection(corr);
        assert.strictEqual(corrResult.isValid, true);
      }
    }
  });

  it("should ensure all sample technology items pass validation", () => {
    assert.ok(SAMPLE_TECH_ITEMS.length > 0);
    for (const item of SAMPLE_TECH_ITEMS) {
      const result = validateNewsItem(item);
      assert.strictEqual(
        result.isValid,
        true,
        `Tech item '${item.id}' failed validation: ${result.errors.join(", ")}`
      );
      assert.ok(item.slug.length > 0);
    }
  });

  it("should ensure all sample opportunities pass strict sourcing & anti-fabrication rules", () => {
    assert.ok(SAMPLE_OPPORTUNITIES.length > 0);
    for (const opp of SAMPLE_OPPORTUNITIES) {
      const result = validateOpportunity(opp);
      assert.strictEqual(
        result.isValid,
        true,
        `Opportunity '${opp.id}' failed validation: ${result.errors.join(", ")}`
      );
      assert.ok(opp.slug.length > 0);
      assert.ok(opp.sourceUrl.startsWith("http"));
      assert.ok(opp.region.length > 0);

      // Check explicit representation rule
      if (!opp.isEligibilityExplicit) {
        assert.strictEqual(opp.eligibilityCriteria, null);
      }
      if (!opp.isFundingExplicit) {
        assert.strictEqual(opp.fundingAmount, null);
      }
      if (!opp.isDeadlineExplicit) {
        assert.strictEqual(opp.deadline, null);
      }

      for (const corr of opp.correctionHistory) {
        const corrResult = validateCorrection(corr);
        assert.strictEqual(corrResult.isValid, true);
      }
    }
  });

  it("should correctly resolve records by slug for detail page navigation", () => {
    const opp = getOpportunityBySlug("doctoral-research-fellowship-safe-autonomous-systems");
    assert.ok(opp);
    assert.strictEqual(opp.id, "opp-001");

    const news = getNewsBySlug("national-clean-energy-transmission-grid-corridor");
    assert.ok(news);
    assert.strictEqual(news.id, "news-001");

    const missing = getOpportunityBySlug("non-existent-slug-xyz");
    assert.strictEqual(missing, undefined);
  });

  it("should perform cross-cutting search across all record types", () => {
    const quantumResults = searchAllRecords("quantum");
    assert.ok(quantumResults.technology.length > 0);

    const emptyResults = searchAllRecords("xyz123nonexistent");
    assert.strictEqual(emptyResults.news.length, 0);
    assert.strictEqual(emptyResults.technology.length, 0);
    assert.strictEqual(emptyResults.opportunities.length, 0);
  });
});
