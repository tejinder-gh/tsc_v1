/**
 * POST /api/internal/v1/automations/claims/acquire
 * Acquire lease claim on occurrence.
 * Required Action: automation.claim.acquire
 */

import { NextResponse } from "next/server";
import { withAgentApi } from "@/lib/second-brain/auth/withAgentApi";
import { AutomationRepository } from "@/lib/second-brain/repositories/AutomationRepository";
import { type AcquireClaimInput, acquireClaimSchema } from "@/lib/second-brain/validation/schemas";

export const POST = withAgentApi<AcquireClaimInput>({
  operation: "POST /api/internal/v1/automations/claims/acquire",
  schema: acquireClaimSchema,
  permission: {
    action: "automation.claim.acquire",
    resourceType: "AUTOMATION_OPERATION",
    resourceKey: "claims",
  },
  handler: async ({ body }) => {
    const claim = await AutomationRepository.acquireClaim({
      occurrenceId: body.occurrenceId,
      claimedBy: body.claimedBy,
      leaseDurationSeconds: body.leaseDurationSeconds,
    });

    return NextResponse.json({ claim });
  },
});
