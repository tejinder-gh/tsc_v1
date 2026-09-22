import { z } from "zod";
import type { JourneyContext, JourneyStage, PrimaryIntent } from "./types";

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

export const journeyContextSchema: z.ZodType<JourneyContext> = z.object({
  version: z.literal(1),
  stage: journeyStageSchema,
  intent: primaryIntentSchema.optional(),
  freeformProblem: z.string().optional(),
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
