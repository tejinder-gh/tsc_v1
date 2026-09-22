import type { RecommendationReason } from "./scoring";

/**
 * Formats internal structured recommendation reason codes into customer-facing copy.
 * Keeps scoring semantics strictly separated from presentation text.
 */
export function formatRecommendationReason(reason: RecommendationReason): string {
  switch (reason.code) {
    case "INTENT_EXACT":
      return `Direct match for your intent: ${reason.value ?? "selected task"}`;
    case "INTENT_ALIAS":
      return `Matches your search for ${reason.value ?? "this category"}`;
    case "INTENT_CATEGORY":
      return "Strong alignment with your chosen category";
    case "PROBLEM_EXACT":
      return `Designed specifically to solve: ${reason.value ?? "this challenge"}`;
    case "PROBLEM_RELATED":
      return `Directly addresses needs in ${reason.value ?? "your selected area"}`;
    case "OUTCOME_EXACT":
      return "Directly produces your desired research deliverable";
    case "OUTCOME_RELATED":
      return "Deliverables closely align with your target outcome";
    case "AUDIENCE_MATCH":
      return `Tailored for ${reason.value ?? "your role and business stage"}`;
    case "INDUSTRY_MATCH":
      return `Engineered specifically for the ${reason.value ?? "relevant"} industry`;
    case "DELIVERY_MATCH":
      return `Matches your preferred ${reason.value ?? "delivery"} format`;
    case "DELIVERY_HYBRID_AFFINITY":
      return "Features AI speed combined with human review verification";
    case "CADENCE_MATCH":
      return `Delivered on your preferred ${reason.value ?? "briefing"} rhythm`;
    case "BUDGET_ALIGNED":
      return "Within your preferred investment range";
    case "GEO_MATCH":
      return `Full coverage in ${reason.value ?? "your selected region"}`;
    case "GEO_GLOBAL":
      return "Operates with global reach and jurisdiction coverage";
    case "FEATURED_CURATION":
      return "Curated as a high-impact core offering";
    default:
      return "Recommended based on your requirements";
  }
}

export function formatRecommendationReasons(reasons: RecommendationReason[]): string[] {
  return reasons.map(formatRecommendationReason);
}
