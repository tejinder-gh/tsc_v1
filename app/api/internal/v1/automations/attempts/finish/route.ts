/**
 * POST /api/internal/v1/automations/attempts/finish
 * Record attempt finish with status and scheduler disposition.
 * Required Action: automation.attempt.write
 */

import { NextResponse } from "next/server";
import { withAgentApi } from "@/lib/second-brain/auth/withAgentApi";
import { AutomationRepository } from "@/lib/second-brain/repositories/AutomationRepository";
import {
  type FinishAttemptInput,
  finishAttemptSchema,
} from "@/lib/second-brain/validation/schemas";

export const POST = withAgentApi<FinishAttemptInput>({
  operation: "POST /api/internal/v1/automations/attempts/finish",
  schema: finishAttemptSchema,
  permission: {
    action: "automation.attempt.write",
    resourceType: "AUTOMATION_OPERATION",
    resourceKey: "attempts",
  },
  handler: async ({ body }) => {
    const attempt = await AutomationRepository.finishAttempt({
      attemptId: body.attemptId,
      status: body.status,
      error: body.error,
      schedulerDisposition: body.schedulerDisposition,
      schedulerReason: body.schedulerReason,
    });

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found", code: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ attempt });
  },
});
