import { formatRecommendationReason } from "../domain/recommendations";
import { scoreService } from "../domain/scoring";
import { parseNaturalLanguageQuery } from "../domain/search";
import type { Offering, OfferingKind } from "../domain/types";
import { getAllAutomationOfferings } from "./adapters/automation-services.adapter";
import { getAllDigitalServiceOfferings } from "./adapters/digital-services.adapter";
import { getAllNewsletterOfferings } from "./adapters/newsletter-offerings.adapter";
import { getAllSourceServiceOfferings } from "./adapters/source-services.adapter";
import { CANONICAL_SERVICES } from "./source-services";

export type OfferingFilterCriteria = {
  kind?: OfferingKind | "all";
  category?: string;
  industry?: string;
  goal?: string;
  deliveryModel?: string;
  pricingModel?: string;
  search?: string;
  status?: string;
  visibility?: string;
};

// Build the deduplicated canonical registry once
function buildRegistry(): Offering[] {
  const automations = getAllAutomationOfferings();
  const digitalServices = getAllDigitalServiceOfferings();
  const newsletters = getAllNewsletterOfferings();
  const sourceServices = getAllSourceServiceOfferings();

  // Source services that are newsletters or recurring publications already represented
  // in canonical newsletters (e.g. tech-founder-briefing, ontario-opportunity-monitor)
  // are deduplicated, while on-demand document synthesis services (e.g. tender-document-analysis)
  // are preserved as distinct service offerings.
  const newsletterSlugs = new Set(newsletters.map((n) => n.slug));
  const filteredSourceServices = sourceServices.filter((s) => !newsletterSlugs.has(s.slug));

  return [...automations, ...digitalServices, ...newsletters, ...filteredSourceServices];
}

const REGISTRY: readonly Offering[] = buildRegistry();

export function getAllOfferings(): readonly Offering[] {
  return REGISTRY;
}

export function getOfferingBySlug(slug: string): Offering | undefined {
  return REGISTRY.find((o) => o.slug === slug || o.id === slug);
}

export function getOfferingsByKind(kind: OfferingKind): Offering[] {
  return REGISTRY.filter((o) => o.kind === kind);
}

export function filterOfferings(criteria: OfferingFilterCriteria): Offering[] {
  let results = [...REGISTRY];

  if (criteria.visibility && criteria.visibility !== "all") {
    results = results.filter((o) => o.visibility === criteria.visibility);
  } else {
    // Default to public offerings
    results = results.filter((o) => o.visibility === "public");
  }

  if (criteria.kind && criteria.kind !== "all") {
    results = results.filter((o) => o.kind === criteria.kind);
  }

  if (criteria.category && criteria.category !== "all") {
    results = results.filter((o) =>
      o.categories.some((c) => c.toLowerCase() === criteria.category?.toLowerCase()),
    );
  }

  if (criteria.industry && criteria.industry !== "all") {
    results = results.filter(
      (o) =>
        o.industries.includes("all") ||
        o.industries.some((i) => i.toLowerCase() === criteria.industry?.toLowerCase()),
    );
  }

  if (criteria.deliveryModel && criteria.deliveryModel !== "all") {
    results = results.filter((o) => o.deliveryModel === criteria.deliveryModel);
  }

  if (criteria.goal && criteria.goal !== "all") {
    results = results.filter((o) =>
      o.goals.some((g) => g.toLowerCase() === criteria.goal?.toLowerCase()),
    );
  }

  if (criteria.search?.trim()) {
    const q = criteria.search.trim().toLowerCase();
    results = results.filter((o) => {
      return (
        o.title.toLowerCase().includes(q) ||
        o.tagline.toLowerCase().includes(q) ||
        o.shortDescription.toLowerCase().includes(q) ||
        o.tags.some((t) => t.toLowerCase().includes(q)) ||
        o.goals.some((g) => g.toLowerCase().includes(q))
      );
    });
  }

  return results;
}

export function searchOfferings(rawQuery: string): Offering[] {
  if (!rawQuery.trim()) return [...REGISTRY];
  const parsed = parseNaturalLanguageQuery(rawQuery);

  return filterOfferings({
    search: rawQuery,
    goal: parsed.goalId,
    category: parsed.categoryId,
    deliveryModel: parsed.preferredDeliveryType,
  });
}

export function getRecommendedOfferings(criteria: {
  goalId?: string;
  industryId?: string;
  audienceId?: string;
  searchQuery?: string;
  limit?: number;
}): { offering: Offering; score: number; reasonText?: string }[] {
  const scored = REGISTRY.map((offering) => {
    let score = 0.2;
    let reasonText = "";

    // Exact goal match
    if (criteria.goalId && offering.goals.includes(criteria.goalId)) {
      score += 0.35;
      reasonText = "Directly addresses your primary goal";
    }

    // Industry match
    if (criteria.industryId) {
      if (offering.industries.includes(criteria.industryId)) {
        score += 0.25;
        reasonText = reasonText
          ? `${reasonText} · Tailored to your industry`
          : "Tailored to your industry";
      } else if (offering.industries.includes("all")) {
        score += 0.15;
      }
    }

    // Search query match
    if (criteria.searchQuery) {
      const q = criteria.searchQuery.toLowerCase();
      if (offering.title.toLowerCase().includes(q)) {
        score += 0.3;
      } else if (offering.tags.some((t) => t.toLowerCase().includes(q))) {
        score += 0.2;
      }
    }

    // Featured boost
    if (offering.featured) {
      score += 0.1;
    }

    // Also check if there is an exact source canonical service match
    const canonicalMatch = CANONICAL_SERVICES.find((s) => s.slug === offering.slug);
    if (canonicalMatch && criteria.goalId) {
      const res = scoreService(canonicalMatch, {
        goalId: criteria.goalId,
        industryId: criteria.industryId,
        audienceId: criteria.audienceId,
        searchQuery: criteria.searchQuery,
      });
      if (res.score > score) {
        score = res.score;
        if (res.reasonCodes.length > 0) {
          reasonText = formatRecommendationReason(res.reasonCodes[0]);
        }
      }
    }

    return {
      offering,
      score: Math.min(1.0, Number(score.toFixed(3))),
      reasonText:
        reasonText || (offering.featured ? "Recommended for fast time-to-value" : undefined),
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, criteria.limit ?? 10);
}
