/**
 * GET /api/internal/v1/automations/due-jobs
 * Evaluates due jobs across schedules.
 * Required Action: automation.evaluate
 */

import { NextResponse } from "next/server";
import { withAgentApi } from "@/lib/second-brain/auth/withAgentApi";
import { AutomationRepository } from "@/lib/second-brain/repositories/AutomationRepository";

export const GET = withAgentApi({
  operation: "GET /api/internal/v1/automations/due-jobs",
  permission: {
    action: "automation.evaluate",
    resourceType: "AUTOMATION_JOB",
    resourceKey: "*",
  },
  handler: async () => {
    const dueJobs = await AutomationRepository.evaluateDueJobs();
    return NextResponse.json({
      count: dueJobs.length,
      dueJobs,
    });
  },
});
