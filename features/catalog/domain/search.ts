import type { DiscoveryQuery } from "./repository";
import { CATEGORY_TAXONOMY, GOAL_TAXONOMY } from "./taxonomy";
import type { CanonicalService } from "./types";

export type UnmetServiceDemand = {
  id?: string;
  query: string;
  inferredIntent?: string;
  categoryId?: string;
  requestedOutcome?: string;
  userType?: string;
  sessionId?: string;
  timestamp: string;
};

/**
 * Natural language concept mapper.
 * Translates conversational user phrases into structured DiscoveryQuery parameters.
 * Deterministic engine remains authoritative for catalog truth and eligibility.
 */
export function parseNaturalLanguageQuery(text: string): Partial<DiscoveryQuery> {
  const normalized = text.trim().toLowerCase();
  const result: Partial<DiscoveryQuery> = {
    searchQuery: text,
  };

  // 1. Goal mapping
  for (const goal of GOAL_TAXONOMY) {
    if (
      normalized.includes(goal.id) ||
      goal.aliases.some((a: string) => normalized.includes(a.toLowerCase()))
    ) {
      result.goalId = goal.id;
      break;
    }
  }

  // 2. Category mapping
  for (const category of CATEGORY_TAXONOMY) {
    if (
      normalized.includes(category.id) ||
      category.aliases.some((a: string) => normalized.includes(a.toLowerCase()))
    ) {
      result.categoryId = category.id;
      break;
    }
  }

  // 3. Location recognition
  if (
    normalized.includes("ontario") ||
    normalized.includes("toronto") ||
    normalized.includes("gta")
  ) {
    result.hardLocation = "Ontario";
  }

  // 4. Delivery format recognition
  if (
    normalized.includes("automation") ||
    normalized.includes("automatic") ||
    normalized.includes("tool")
  ) {
    result.preferredDeliveryType = "automation";
  } else if (normalized.includes("newsletter") || normalized.includes("digest")) {
    result.preferredDeliveryType = "ai";
  } else if (
    normalized.includes("consulting") ||
    normalized.includes("human") ||
    normalized.includes("review")
  ) {
    result.preferredDeliveryType = "human";
  }

  // 5. Cadence recognition
  if (normalized.includes("daily") || normalized.includes("morning")) {
    result.preferredCadence = "daily";
  } else if (normalized.includes("weekly")) {
    result.preferredCadence = "weekly";
  }

  return result;
}

/**
 * Multi-tier priority search rank.
 * Prioritizes: Exact Intent (1) > Service Name (2) > Problem Solved (3) > Outcome (4) > Keyword/Alias (5).
 */
export function calculateSearchRank(service: CanonicalService, rawQuery: string): number {
  if (!rawQuery.trim()) return 0;
  const q = rawQuery.trim().toLowerCase();

  // Tier 1: Exact intent match
  if (service.intentIds.some((intent: string) => intent.toLowerCase() === q)) {
    return 100;
  }

  // Tier 2: Service name match
  if (service.name.toLowerCase().includes(q)) {
    return 80;
  }

  // Tier 3: Problem solved match
  if (service.problemIds.some((p: string) => p.replace("-", " ").includes(q))) {
    return 60;
  }

  // Tier 4: Outcome match
  if (
    service.outcomeIds.some((o: string) => o.replace("-", " ").includes(q)) ||
    service.deliverableSummaries.some((d: string) => d.toLowerCase().includes(q))
  ) {
    return 40;
  }

  // Tier 5: Keyword & search aliases
  if (
    service.keywords.some((k: string) => k.toLowerCase().includes(q)) ||
    service.searchAliases.some((a: string) => a.toLowerCase().includes(q))
  ) {
    return 20;
  }

  return 0;
}
