/**
 * POST /api/internal/v1/automations/attempts/start
 * Record beginning of execution attempt.
 * Required Action: automation.attempt.write
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
      action: "automation.attempt.write",
      resourceType: "AUTOMATION_OPERATION",
      resourceKey: "attempts",
    });

    if (!authResult.authorized) {
      return NextResponse.json(
        { error: "Forbidden", code: "FORBIDDEN", reason: authResult.reason },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { occurrenceId, attemptNumber, source } = body;

    if (!occurrenceId || attemptNumber === undefined) {
      return NextResponse.json(
        {
          error: "Missing required parameters: occurrenceId and attemptNumber",
          code: "BAD_REQUEST",
        },
        { status: 400 },
      );
    }

    const attempt = await AutomationRepository.startAttempt({
      occurrenceId,
      attemptNumber,
      source,
    });

    return NextResponse.json({ attempt });
  } catch (err: any) {
    if (err instanceof AuthenticationError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.statusCode });
    }
    console.error("Error in POST /api/internal/v1/automations/attempts/start", err);
    return NextResponse.json(
      { error: "Internal server error", message: err?.message },
      { status: 500 },
    );
  }
}
