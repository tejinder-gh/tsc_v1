/**
 * POST /api/internal/v1/automations/claims/acquire
 * Acquire lease claim on occurrence.
 * Required Action: automation.claim.acquire
 */

import { type NextRequest, NextResponse } from "next/server";
import { authenticateAgent } from "@/lib/second-brain/auth/authenticate";
import { authorize } from "@/lib/second-brain/auth/authorize";
import { internalApiErrorResponse } from "@/lib/second-brain/http";
import { AutomationRepository } from "@/lib/second-brain/repositories/AutomationRepository";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || request.headers.get("x-api-key");
    const authContext = await authenticateAgent(authHeader);

    const authResult = authorize({
      context: authContext,
      action: "automation.claim.acquire",
      resourceType: "AUTOMATION_OPERATION",
      resourceKey: "claims",
    });

    if (!authResult.authorized) {
      return NextResponse.json(
        { error: "Forbidden", code: "FORBIDDEN", reason: authResult.reason },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { occurrenceId, claimedBy, leaseDurationSeconds } = body;

    if (!occurrenceId || !claimedBy) {
      return NextResponse.json(
        { error: "Missing required parameters: occurrenceId and claimedBy", code: "BAD_REQUEST" },
        { status: 400 },
      );
    }

    const claim = await AutomationRepository.acquireClaim({
      occurrenceId,
      claimedBy,
      leaseDurationSeconds,
    });

    return NextResponse.json({ claim });
  } catch (error: unknown) {
    return internalApiErrorResponse(error, "POST /api/internal/v1/automations/claims/acquire");
  }
}
