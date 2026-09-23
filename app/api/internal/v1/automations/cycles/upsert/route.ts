/**
 * POST /api/internal/v1/automations/cycles/upsert
 * Upsert runner cycle telemetry and cycle job links.
 * Required Action: automation.cycle.write
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
      action: "automation.cycle.write",
      resourceType: "AUTOMATION_OPERATION",
      resourceKey: "cycles",
    });

    if (!authResult.authorized) {
      return NextResponse.json(
        { error: "Forbidden", code: "FORBIDDEN", reason: authResult.reason },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { automationCycleKey, legacyRunId } = body;

    if (!automationCycleKey || !legacyRunId) {
      return NextResponse.json(
        {
          error: "Missing required parameters: automationCycleKey and legacyRunId",
          code: "BAD_REQUEST",
        },
        { status: 400 },
      );
    }

    const cycle = await AutomationRepository.upsertRunnerCycle(body);
    return NextResponse.json({ cycle });
  } catch (error: unknown) {
    return internalApiErrorResponse(error, "POST /api/internal/v1/automations/cycles/upsert");
  }
}
