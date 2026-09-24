/**
 * POST /api/internal/v1/automations/occurrences/ensure
 * Idempotently ensure occurrence record exists.
 * Required Action: automation.occurrence.write
 */

import { NextResponse } from "next/server";
import { withAgentApi } from "@/lib/second-brain/auth/withAgentApi";
import { AutomationRepository } from "@/lib/second-brain/repositories/AutomationRepository";
import {
  type EnsureOccurrenceInput,
  ensureOccurrenceSchema,
} from "@/lib/second-brain/validation/schemas";

export const POST = withAgentApi<EnsureOccurrenceInput>({
  operation: "POST /api/internal/v1/automations/occurrences/ensure",
  schema: ensureOccurrenceSchema,
  permission: {
    action: "automation.occurrence.write",
    resourceType: "AUTOMATION_OPERATION",
    resourceKey: "occurrences",
  },
  handler: async ({ body }) => {
    const occurrence = await AutomationRepository.ensureOccurrence({
      jobId: body.jobId,
      occurrenceKey: body.occurrenceKey,
      queueState: body.queueState,
    });

    return NextResponse.json({ occurrence });
  },
});
