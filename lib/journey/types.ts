/**
 * What: Core types and canonical models for the visitor intent router and journey state.
 * Why: Supports the progressive disclosure architecture (Ticket 001). Moves visitors from
 *      visitor problem -> contextual understanding -> opportunity -> demonstration -> plan.
 * How: Strict TypeScript unions, immutable intent mappings, and versioned journey context.
 */

export type JourneyStage =
  | "new"
  | "intent-selected"
  | "context"
  | "opportunity"
  | "solution"
  | "plan";

export type PrimaryIntent = "save-time" | "grow" | "build" | "learn";

export type ContextFocus =
  // save-time
  | "customer-communication"
  | "admin-data-entry"
  | "scheduling-coordination"
  | "reporting-analysis"
  | "internal-workflows"

  // grow
  | "find-more-leads"
  | "respond-faster"
  | "follow-up"
  | "convert-more"
  | "retain-customers"

  // build
  | "customer-experience"
  | "internal-tool"
  | "automation-integration"
  | "ai-product"
  | "existing-product"

  // learn
  | "ai-automation"
  | "software-product"
  | "growth-marketing"
  | "operations-systems";

export type ContextSituation =
  // save-time
  | "mostly-manual"
  | "fragmented-tools"
  | "works-but-slow"
  | "frequent-errors"

  // grow
  | "not-enough-demand"
  | "leads-go-cold"
  | "slow-response"
  | "low-conversion"
  | "weak-retention"

  // build
  | "idea"
  | "prototype"
  | "existing-system"
  | "scaling"

  // learn
  | "quick-answer"
  | "practical-guide"
  | "templates-tools"
  | "ongoing-briefings";

export interface JourneyContext {
  version: 1;
  stage: JourneyStage;
  intent?: PrimaryIntent;
  freeformProblem?: string;
  contextFocus?: ContextFocus;
  contextSituation?: ContextSituation;
  industry?: string;
  businessType?: string;
  problems: string[];
  selectedSolutions: string[];
  viewedSolutions: string[];
  savedResources: string[];
  createdAt: string;
  updatedAt: string;
}

export const INTENT_LABELS: Record<PrimaryIntent, string> = {
  "save-time": "Save me time",
  grow: "Get more customers",
  build: "Build something",
  learn: "Help me learn",
} as const;

export const CANONICAL_INTENTS: readonly PrimaryIntent[] = [
  "save-time",
  "grow",
  "build",
  "learn",
] as const;

export const INITIAL_JOURNEY_CONTEXT: Readonly<JourneyContext> = {
  version: 1,
  stage: "new",
  problems: [],
  selectedSolutions: [],
  viewedSolutions: [],
  savedResources: [],
  createdAt: "",
  updatedAt: "",
};
