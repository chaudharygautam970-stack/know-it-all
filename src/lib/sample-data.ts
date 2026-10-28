/**
 * ============================================================================
 * Intelligence Hub — Centralized Demonstration & Sample Dataset
 * ============================================================================
 * Aggregates all verified sample records for News, Technology, and Opportunities.
 * Exposes strict lookup and search helper utilities for UI detail pages.
 */

import type { NewsItem, Opportunity } from "../types/index.ts";
import { SAMPLE_NEWS_DATA } from "./data/news.ts";
import { SAMPLE_TECH_DATA } from "./data/technology.ts";
import { SAMPLE_OPPORTUNITIES_DATA } from "./data/opportunities.ts";

export const IS_DEMO_DATA = true;
export const DEMO_DATA_DISCLAIMER =
  "DEMONSTRATION DATA MODE: All records below are simulated sample data for testing and demonstration purposes. Sourcing standards and attribution links reflect real specifications.";

export const SAMPLE_NEWS_ITEMS: NewsItem[] = SAMPLE_NEWS_DATA;
export const SAMPLE_TECH_ITEMS: NewsItem[] = SAMPLE_TECH_DATA;
export const SAMPLE_OPPORTUNITIES: Opportunity[] = SAMPLE_OPPORTUNITIES_DATA;

export const ALL_SAMPLE_NEWS: NewsItem[] = [
  ...SAMPLE_NEWS_DATA,
  ...SAMPLE_TECH_DATA,
];

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return ALL_SAMPLE_NEWS.find((item) => item.slug === slug);
}

export function getTechBySlug(slug: string): NewsItem | undefined {
  return SAMPLE_TECH_DATA.find((item) => item.slug === slug);
}

export function getOpportunityBySlug(slug: string): Opportunity | undefined {
  return SAMPLE_OPPORTUNITIES_DATA.find((item) => item.slug === slug);
}

export function getUrgentOpportunities(): Opportunity[] {
  return SAMPLE_OPPORTUNITIES_DATA.filter((opp) => opp.status === "closing_soon");
}

export function searchAllRecords(
  query: string,
  typeFilter: "all" | "news" | "technology" | "opportunities" = "all"
): {
  news: NewsItem[];
  technology: NewsItem[];
  opportunities: Opportunity[];
} {
  const q = (query || "").toLowerCase().trim();

  let newsResults: NewsItem[] = [];
  let techResults: NewsItem[] = [];
  let oppResults: Opportunity[] = [];

  if (typeFilter === "all" || typeFilter === "news") {
    newsResults = SAMPLE_NEWS_DATA.filter(
      (n) =>
        !q ||
        n.title.toLowerCase().includes(q) ||
        (n.excerpt && n.excerpt.toLowerCase().includes(q)) ||
        n.attribution.sourceName.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (typeFilter === "all" || typeFilter === "technology") {
    techResults = SAMPLE_TECH_DATA.filter(
      (t) =>
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.excerpt && t.excerpt.toLowerCase().includes(q)) ||
        t.attribution.sourceName.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  if (typeFilter === "all" || typeFilter === "opportunities") {
    oppResults = SAMPLE_OPPORTUNITIES_DATA.filter(
      (o) =>
        !q ||
        o.title.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.providerName.toLowerCase().includes(q) ||
        o.region.toLowerCase().includes(q) ||
        o.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  return {
    news: newsResults,
    technology: techResults,
    opportunities: oppResults,
  };
}
