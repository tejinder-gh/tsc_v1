/**
 * POST /api/internal/v1/automations/occurrences/ensure
 * Idempotently ensure occurrence record exists.
 * Required Action: automation.occurrence.write
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
      action: "automation.occurrence.write",
      resourceType: "AUTOMATION_OPERATION",
      resourceKey: "occurrences",
    });

    if (!authResult.authorized) {
      return NextResponse.json(
        { error: "Forbidden", code: "FORBIDDEN", reason: authResult.reason },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { jobId, occurrenceKey, queueState } = body;

    if (!jobId || !occurrenceKey) {
      return NextResponse.json(
        { error: "Missing required parameters: jobId and occurrenceKey", code: "BAD_REQUEST" },
        { status: 400 },
      );
    }

    const occurrence = await AutomationRepository.ensureOccurrence({
      jobId,
      occurrenceKey,
      queueState,
    });

    return NextResponse.json({ occurrence });
  } catch (err: any) {
    if (err instanceof AuthenticationError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.statusCode });
    }
    console.error("Error in POST /api/internal/v1/automations/occurrences/ensure", err);
    return NextResponse.json(
      { error: "Internal server error", message: err?.message },
      { status: 500 },
    );
  }
}
