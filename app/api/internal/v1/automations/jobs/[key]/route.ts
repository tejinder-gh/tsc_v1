/**
 * GET /api/internal/v1/automations/jobs/[key]
 * Read detailed job configuration, execution policy, dependencies, and declared targets.
 * Required Action: automation.read
 */

import { NextResponse } from "next/server";
import { withAgentApi } from "@/lib/second-brain/auth/withAgentApi";
import { AutomationRepository } from "@/lib/second-brain/repositories/AutomationRepository";

export const GET = withAgentApi<undefined, { key: string }>({
  operation: "GET /api/internal/v1/automations/jobs/[key]",
  permission: {
    action: "automation.read",
    resourceType: "AUTOMATION_JOB",
    resourceKey: ({ params }) => `job:${params?.key}`,
    evalContext: ({ params }) => ({
      jobKey: params?.key,
    }),
  },
  handler: async ({ params }) => {
    const { key } = params;
    const job = await AutomationRepository.getJobConfiguration(key);
    if (!job) {
      return NextResponse.json(
        { error: `Job '${key}' not found`, code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json({ job });
  },
});
