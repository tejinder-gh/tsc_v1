/**
 * Strict Zod validation schemas for Second Brain internal APIs.
 * Prevents unvalidated raw body pass-through to repositories and guards against prototype poisoning/unexpected fields.
 */

import { z } from "zod";

export const contextSearchSchema = z
  .object({
    domain: z.string().min(1, "domain is required").max(100),
    subdomain: z.string().min(1).max(100).optional(),
    keywords: z.array(z.string().max(100)).max(20).optional().default([]),
    limit: z.number().int().min(1).max(20).optional().default(2),
  })
  .strict();

export type ContextSearchInput = z.infer<typeof contextSearchSchema>;

export const ensureOccurrenceSchema = z
  .object({
    jobId: z.string().min(1, "jobId is required").max(100),
    occurrenceKey: z.string().min(1, "occurrenceKey is required").max(200),
    queueState: z
      .enum(["queued", "running", "retrying", "completed", "failed", "deferred"])
      .optional()
      .default("queued"),
  })
  .strict();

export type EnsureOccurrenceInput = z.infer<typeof ensureOccurrenceSchema>;

export const acquireClaimSchema = z
  .object({
    occurrenceId: z.string().min(1, "occurrenceId is required").max(100),
    claimedBy: z.string().min(1, "claimedBy is required").max(200),
    leaseDurationSeconds: z.number().int().min(1).max(86400).optional().default(300),
  })
  .strict();

export type AcquireClaimInput = z.infer<typeof acquireClaimSchema>;

export const releaseClaimSchema = z
  .object({
    claimId: z.string().min(1, "claimId is required").max(100),
  })
  .strict();

export type ReleaseClaimInput = z.infer<typeof releaseClaimSchema>;

export const startAttemptSchema = z
  .object({
    occurrenceId: z.string().min(1, "occurrenceId is required").max(100),
    attemptNumber: z.number().int().min(1, "attemptNumber must be at least 1"),
    source: z.string().max(100).optional().default("runner"),
  })
  .strict();

export type StartAttemptInput = z.infer<typeof startAttemptSchema>;

export const finishAttemptSchema = z
  .object({
    attemptId: z.string().min(1, "attemptId is required").max(100),
    status: z.enum(["succeeded", "failed", "deferred"]),
    error: z.string().max(4000).nullable().optional(),
    schedulerDisposition: z.string().max(100).nullable().optional(),
    schedulerReason: z.string().max(2000).nullable().optional(),
  })
  .strict();

export type FinishAttemptInput = z.infer<typeof finishAttemptSchema>;

export const upsertCycleSchema = z
  .object({
    automationCycleKey: z.string().min(1, "automationCycleKey is required").max(200),
    legacyRunId: z.string().min(1, "legacyRunId is required").max(200),
    runTitle: z.string().max(255).optional(),
    automationName: z.string().max(255).optional(),
    automationId: z.string().max(100).optional(),
    runDate: z.string().max(100).optional(),
    slot: z.string().max(100).optional(),
    status: z.string().max(50).optional().default("completed"),
    jobsEvaluated: z.number().int().min(0).optional().default(0),
    dueCount: z.number().int().min(0).optional().default(0),
    executedCount: z.number().int().min(0).optional().default(0),
    deferredCount: z.number().int().min(0).optional().default(0),
    failedCount: z.number().int().min(0).optional().default(0),
    updatedTargetResources: z.array(z.string().max(255)).max(100).optional().default([]),
  })
  .strict();

export type UpsertCycleInput = z.infer<typeof upsertCycleSchema>;
