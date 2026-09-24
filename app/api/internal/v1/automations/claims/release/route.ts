/**
 * POST /api/internal/v1/automations/claims/release
 * Release active lease claim on occurrence.
 * Required Action: automation.claim.release
 */

import { NextResponse } from "next/server";
import { withAgentApi } from "@/lib/second-brain/auth/withAgentApi";
import { AutomationRepository } from "@/lib/second-brain/repositories/AutomationRepository";
import { type ReleaseClaimInput, releaseClaimSchema } from "@/lib/second-brain/validation/schemas";

export const POST = withAgentApi<ReleaseClaimInput>({
  operation: "POST /api/internal/v1/automations/claims/release",
  schema: releaseClaimSchema,
  permission: {
    action: "automation.claim.release",
    resourceType: "AUTOMATION_OPERATION",
    resourceKey: "claims",
  },
  handler: async ({ body }) => {
    const released = await AutomationRepository.releaseClaim(body.claimId);
    if (!released) {
      return NextResponse.json(
        { error: "Claim not found or already released", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json({ claim: released });
  },
});
