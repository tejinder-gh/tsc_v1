/**
 * GET /api/internal/v1/automations/status
 * Read real-time Automation OS operational status, active claims, and queue backlogs.
 * Required Action: automation.status.read
 */

import { type NextRequest, NextResponse } from "next/server";
import { authenticateAgent } from "@/lib/second-brain/auth/authenticate";
import { authorize } from "@/lib/second-brain/auth/authorize";
import { internalApiErrorResponse } from "@/lib/second-brain/http";
import { AutomationRepository } from "@/lib/second-brain/repositories/AutomationRepository";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || request.headers.get("x-api-key");
    const authContext = await authenticateAgent(authHeader);

    const authResult = authorize({
      context: authContext,
      action: "automation.status.read",
      resourceType: "AUTOMATION_OPERATION",
      resourceKey: "status",
    });

    if (!authResult.authorized) {
      return NextResponse.json(
        { error: "Forbidden", code: "FORBIDDEN", reason: authResult.reason },
        { status: 403 },
      );
    }

    const status = await AutomationRepository.getRuntimeStatus();
    return NextResponse.json({ status });
  } catch (error: unknown) {
    return internalApiErrorResponse(error, "GET /api/internal/v1/automations/status");
  }
}
