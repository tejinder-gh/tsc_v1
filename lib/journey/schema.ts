import { z } from "zod";
import type {
  ContextFocus,
  ContextSituation,
  JourneyContext,
  JourneyStage,
  PrimaryIntent,
} from "./types";

export const journeyStageSchema = z.enum([
  "new",
  "intent-selected",
  "context",
  "opportunity",
  "solution",
  "plan",
]) satisfies z.ZodType<JourneyStage>;

export const primaryIntentSchema = z.enum([
  "save-time",
  "grow",
  "build",
  "learn",
]) satisfies z.ZodType<PrimaryIntent>;

export const contextFocusSchema = z.enum([
  "customer-communication",
  "admin-data-entry",
  "scheduling-coordination",
  "reporting-analysis",
  "internal-workflows",
  "find-more-leads",
  "respond-faster",
  "follow-up",
  "convert-more",
  "retain-customers",
  "customer-experience",
  "internal-tool",
  "automation-integration",
  "ai-product",
  "existing-product",
  "ai-automation",
  "software-product",
  "growth-marketing",
  "operations-systems",
]) satisfies z.ZodType<ContextFocus>;

export const contextSituationSchema = z.enum([
  "mostly-manual",
  "fragmented-tools",
  "works-but-slow",
  "frequent-errors",
  "not-enough-demand",
  "leads-go-cold",
  "slow-response",
  "low-conversion",
  "weak-retention",
  "idea",
  "prototype",
  "existing-system",
  "scaling",
  "quick-answer",
  "practical-guide",
  "templates-tools",
  "ongoing-briefings",
]) satisfies z.ZodType<ContextSituation>;

export const journeyContextSchema: z.ZodType<JourneyContext> = z.object({
  version: z.literal(1),
  stage: journeyStageSchema,
  intent: primaryIntentSchema.optional(),
  freeformProblem: z.string().optional(),
  contextFocus: contextFocusSchema.optional(),
  contextSituation: contextSituationSchema.optional(),
  industry: z.string().optional(),
  businessType: z.string().optional(),
  problems: z.array(z.string()),
  selectedSolutions: z.array(z.string()),
  viewedSolutions: z.array(z.string()),
  savedResources: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * Safely validates unknown persisted data. Returns parsed JourneyContext or null if invalid/corrupt.
 */
export function validateJourneyContext(data: unknown): JourneyContext | null {
  const result = journeyContextSchema.safeParse(data);
  if (!result.success) {
    return null;
  }
  return result.data;
}
