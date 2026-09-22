/**
 * POST /api/internal/v1/automations/claims/release
 * Release active lease claim on occurrence.
 * Required Action: automation.claim.release
 */

import { type NextRequest, NextResponse } from "next/server";
import { AuthenticationError, authenticateAgent } from "@/lib/second-brain/auth/authenticate";
import { authorize } from "@/lib/second-brain/auth/authorize";
import { AutomationRepository } from "@/lib/second-brain/repositories/AutomationRepository";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || request.headers.get("x-api-key");
    const authContext = await authenticateAgent(authHeader);

    const authResult = authorize({
      context: authContext,
      action: "automation.claim.release",
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
    const { claimId } = body;

    if (!claimId) {
      return NextResponse.json(
        { error: "Missing required parameter: claimId", code: "BAD_REQUEST" },
        { status: 400 },
      );
    }

    const released = await AutomationRepository.releaseClaim(claimId);
    if (!released) {
      return NextResponse.json(
        { error: "Claim not found or already released", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json({ claim: released });
  } catch (err: any) {
    if (err instanceof AuthenticationError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.statusCode });
    }
    console.error("Error in POST /api/internal/v1/automations/claims/release", err);
    return NextResponse.json(
      { error: "Internal server error", message: err?.message },
      { status: 500 },
    );
  }
}
