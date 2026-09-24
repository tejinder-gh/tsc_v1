/**
 * GET /api/internal/v1/automations/status
 * Read real-time Automation OS operational status, active claims, and queue backlogs.
 * Required Action: automation.status.read
 */

import { NextResponse } from "next/server";
import { withAgentApi } from "@/lib/second-brain/auth/withAgentApi";
import { AutomationRepository } from "@/lib/second-brain/repositories/AutomationRepository";

export const GET = withAgentApi({
  operation: "GET /api/internal/v1/automations/status",
  permission: {
    action: "automation.status.read",
    resourceType: "AUTOMATION_OPERATION",
    resourceKey: "status",
  },
  handler: async () => {
    const status = await AutomationRepository.getRuntimeStatus();
    return NextResponse.json({ status });
  },
});
