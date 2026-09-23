/**
 * GET /api/internal/v1/automations/jobs/[key]
 * Read detailed job configuration, execution policy, dependencies, and declared targets.
 * Required Action: automation.read
 */

import { type NextRequest, NextResponse } from "next/server";
import { authenticateAgent } from "@/lib/second-brain/auth/authenticate";
import { authorize } from "@/lib/second-brain/auth/authorize";
import { internalApiErrorResponse } from "@/lib/second-brain/http";
import { AutomationRepository } from "@/lib/second-brain/repositories/AutomationRepository";

export async function GET(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await params;
    const authHeader = request.headers.get("authorization") || request.headers.get("x-api-key");
    const authContext = await authenticateAgent(authHeader);

    const authResult = authorize({
      context: authContext,
      action: "automation.read",
      resourceType: "AUTOMATION_JOB",
      resourceKey: `job:${key}`,
      evalContext: {
        jobKey: key,
      },
    });

    if (!authResult.authorized) {
      return NextResponse.json(
        { error: "Forbidden", code: "FORBIDDEN", reason: authResult.reason },
        { status: 403 },
      );
    }

    const job = await AutomationRepository.getJobConfiguration(key);
    if (!job) {
      return NextResponse.json(
        { error: `Job '${key}' not found`, code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json({ job });
  } catch (error: unknown) {
    return internalApiErrorResponse(error, "GET /api/internal/v1/automations/jobs/[key]");
  }
}
