/**
 * POST /api/internal/v1/automations/attempts/start
 * Record beginning of execution attempt.
 * Required Action: automation.attempt.write
 */

import { NextResponse } from "next/server";
import { withAgentApi } from "@/lib/second-brain/auth/withAgentApi";
import { AutomationRepository } from "@/lib/second-brain/repositories/AutomationRepository";
import { type StartAttemptInput, startAttemptSchema } from "@/lib/second-brain/validation/schemas";

export const POST = withAgentApi<StartAttemptInput>({
  operation: "POST /api/internal/v1/automations/attempts/start",
  schema: startAttemptSchema,
  permission: {
    action: "automation.attempt.write",
    resourceType: "AUTOMATION_OPERATION",
    resourceKey: "attempts",
  },
  handler: async ({ body }) => {
    const attempt = await AutomationRepository.startAttempt({
      occurrenceId: body.occurrenceId,
      attemptNumber: body.attemptNumber,
      source: body.source,
    });

    return NextResponse.json({ attempt });
  },
});
