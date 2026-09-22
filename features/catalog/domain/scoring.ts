import type { DiscoveryQuery } from "./repository";
import { AUDIENCE_TAXONOMY, GOAL_TAXONOMY, type TaxonomyItem } from "./taxonomy";
import type { CanonicalService } from "./types";

export type RecommendationReasonCode =
  | "INTENT_EXACT"
  | "INTENT_ALIAS"
  | "INTENT_CATEGORY"
  | "PROBLEM_EXACT"
  | "PROBLEM_RELATED"
  | "OUTCOME_EXACT"
  | "OUTCOME_RELATED"
  | "AUDIENCE_MATCH"
  | "INDUSTRY_MATCH"
  | "DELIVERY_MATCH"
  | "DELIVERY_HYBRID_AFFINITY"
  | "CADENCE_MATCH"
  | "BUDGET_ALIGNED"
  | "GEO_MATCH"
  | "GEO_GLOBAL"
  | "FEATURED_CURATION";

export type RecommendationReason = {
  code: RecommendationReasonCode;
  dimension: string;
  value?: string;
  weight: number;
};

export type ScoredServiceResult = {
  serviceId: string;
  service: CanonicalService;
  score: number;
  reasonCodes: RecommendationReason[];
};

export function scoreService(
  service: CanonicalService,
  query: DiscoveryQuery,
  planPriceCents = 0,
): ScoredServiceResult {
  const reasons: RecommendationReason[] = [];

  // ==========================================
  // 1. Intent Match (Weight: 0.30)
  // ==========================================
  let intentScore = 0.5; // neutral default
  if (query.intentId || query.searchQuery) {
    const rawQuery = (query.intentId || query.searchQuery || "").trim().toLowerCase();
    const exactIntent = service.intentIds.some((i: string) => i.toLowerCase() === rawQuery);
    const aliasMatch =
      service.searchAliases.some(
        (a: string) => a.toLowerCase().includes(rawQuery) || rawQuery.includes(a.toLowerCase()),
      ) || service.keywords.some((k: string) => k.toLowerCase() === rawQuery);
    const categoryMatch = service.categoryId.toLowerCase() === query.categoryId?.toLowerCase();

    if (exactIntent) {
      intentScore = 1.0;
      reasons.push({ code: "INTENT_EXACT", dimension: "intent", value: rawQuery, weight: 0.3 });
    } else if (aliasMatch) {
      intentScore = 0.8;
      reasons.push({ code: "INTENT_ALIAS", dimension: "intent", value: rawQuery, weight: 0.24 });
    } else if (categoryMatch) {
      intentScore = 0.5;
      reasons.push({
        code: "INTENT_CATEGORY",
        dimension: "intent",
        value: service.categoryId,
        weight: 0.15,
      });
    } else {
      intentScore = 0.1;
    }
  }

  // ==========================================
  // 2. Problem Match (Weight: 0.20)
  // ==========================================
  let problemScore = 0.5;
  if (query.goalId) {
    // Check goal taxonomy alignment
    const goalItem = GOAL_TAXONOMY.find((g: TaxonomyItem) => g.id === query.goalId);
    if (service.goalIds.includes(query.goalId)) {
      problemScore = 1.0;
      reasons.push({
        code: "PROBLEM_EXACT",
        dimension: "problem",
        value: goalItem?.label ?? query.goalId,
        weight: 0.2,
      });
    } else if (
      goalItem?.aliases.some((alias: string) =>
        service.keywords.some((kw: string) => kw.toLowerCase().includes(alias.toLowerCase())),
      )
    ) {
      problemScore = 0.7;
      reasons.push({
        code: "PROBLEM_RELATED",
        dimension: "problem",
        value: goalItem?.label,
        weight: 0.14,
      });
    } else {
      problemScore = 0.15;
    }
  }

  // ==========================================
  // 3. Outcome Match (Weight: 0.15)
  // ==========================================
  let outcomeScore = 0.5;
  if (query.searchQuery) {
    const q = query.searchQuery.toLowerCase();
    const hasOutcome = service.outcomeIds.some(
      (out: string) => out.includes(q) || q.includes(out.replace("-", " ")),
    );
    if (hasOutcome) {
      outcomeScore = 1.0;
      reasons.push({ code: "OUTCOME_EXACT", dimension: "outcome", weight: 0.15 });
    } else if (service.deliverableSummaries.some((d: string) => d.toLowerCase().includes(q))) {
      outcomeScore = 0.75;
      reasons.push({ code: "OUTCOME_RELATED", dimension: "outcome", weight: 0.11 });
    } else {
      outcomeScore = 0.3;
    }
  }

  // ==========================================
  // 4. Audience Match (Weight: 0.10)
  // ==========================================
  let audienceScore = 0.5;
  if (query.audienceId) {
    if (service.audienceIds.includes(query.audienceId)) {
      audienceScore = 1.0;
      const aud = AUDIENCE_TAXONOMY.find((a: TaxonomyItem) => a.id === query.audienceId);
      reasons.push({
        code: "AUDIENCE_MATCH",
        dimension: "audience",
        value: aud?.label ?? query.audienceId,
        weight: 0.1,
      });
    } else if (service.audienceIds.length === 0 || service.audienceIds.includes("all")) {
      audienceScore = 0.7;
    } else {
      audienceScore = 0.1;
    }
  }

  // ==========================================
  // 5. Industry Match (Weight: 0.05)
  // ==========================================
  let industryScore = 0.5;
  if (query.industryId) {
    if (service.industryIds?.includes(query.industryId)) {
      industryScore = 1.0;
      reasons.push({
        code: "INDUSTRY_MATCH",
        dimension: "industry",
        value: query.industryId,
        weight: 0.05,
      });
    } else if (
      !service.industryIds ||
      service.industryIds.length === 0 ||
      service.industryIds.includes("all")
    ) {
      industryScore = 0.85;
    } else {
      industryScore = 0.1;
    }
  }

  // ==========================================
  // 6. Delivery Preference Match (Weight: 0.05)
  // ==========================================
  let deliveryScore = 0.5;
  if (query.preferredDeliveryType) {
    if (service.deliveryType === query.preferredDeliveryType) {
      deliveryScore = 1.0;
      reasons.push({
        code: "DELIVERY_MATCH",
        dimension: "delivery",
        value: service.deliveryType,
        weight: 0.05,
      });
    } else if (query.preferredDeliveryType === "ai" && service.deliveryType === "hybrid") {
      deliveryScore = 0.75;
      reasons.push({ code: "DELIVERY_HYBRID_AFFINITY", dimension: "delivery", weight: 0.035 });
    } else {
      deliveryScore = 0.2;
    }
  }

  // ==========================================
  // 7. Cadence Match (Weight: 0.05)
  // ==========================================
  let cadenceScore = 0.5;
  if (query.preferredCadence) {
    if (service.cadence === query.preferredCadence) {
      cadenceScore = 1.0;
      reasons.push({
        code: "CADENCE_MATCH",
        dimension: "cadence",
        value: service.cadence,
        weight: 0.05,
      });
    } else {
      cadenceScore = 0.25;
    }
  }

  // ==========================================
  // 8. Budget Preference Match (Weight: 0.05)
  // (Soft preference; hard ceiling is handled in eligibility)
  // ==========================================
  let budgetScore = 0.5;
  if (query.approximateBudget !== undefined && query.approximateBudget > 0) {
    if (planPriceCents <= query.approximateBudget) {
      budgetScore = 1.0;
      reasons.push({ code: "BUDGET_ALIGNED", dimension: "budget", weight: 0.05 });
    } else if (planPriceCents <= query.approximateBudget * 1.3) {
      budgetScore = 0.6;
    } else {
      budgetScore = 0.2;
    }
  }

  // ==========================================
  // 9. Geography Match (Weight: 0.03)
  // ==========================================
  let geoScore = 0.5;
  if (query.hardLocation) {
    const loc = query.hardLocation.toLowerCase();
    const localMatch = service.supportedLocations.some(
      (s: string) => s.toLowerCase().includes(loc) || loc.includes(s.toLowerCase()),
    );
    if (localMatch) {
      geoScore = 1.0;
      reasons.push({
        code: "GEO_MATCH",
        dimension: "geography",
        value: query.hardLocation,
        weight: 0.03,
      });
    } else if (service.geographicScope === "global") {
      geoScore = 0.85;
      reasons.push({ code: "GEO_GLOBAL", dimension: "geography", weight: 0.025 });
    } else {
      geoScore = 0.2;
    }
  }

  // ==========================================
  // 10. Maturity & Curation (Weight: 0.02)
  // ==========================================
  const maturityWeights: Record<string, number> = {
    mature: 1.0,
    proven: 0.9,
    beta: 0.6,
    experimental: 0.3,
  };
  const maturityScore = maturityWeights[service.maturity] ?? 0.5;

  if (service.featured) {
    reasons.push({ code: "FEATURED_CURATION", dimension: "curation", weight: 0.02 });
  }

  // Multi-dimensional weighted composite score [0, 1]
  const compositeScore =
    intentScore * 0.3 +
    problemScore * 0.2 +
    outcomeScore * 0.15 +
    audienceScore * 0.1 +
    industryScore * 0.05 +
    deliveryScore * 0.05 +
    cadenceScore * 0.05 +
    budgetScore * 0.05 +
    geoScore * 0.03 +
    maturityScore * 0.02;

  return {
    serviceId: service.id,
    service,
    score: Number(compositeScore.toFixed(4)),
    reasonCodes: reasons,
  };
}
