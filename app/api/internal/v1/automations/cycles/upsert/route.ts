/**
 * POST /api/internal/v1/automations/cycles/upsert
 * Upsert runner cycle telemetry and cycle job links.
 * Required Action: automation.cycle.write
 */

import { NextResponse } from "next/server";
import { withAgentApi } from "@/lib/second-brain/auth/withAgentApi";
import { AutomationRepository } from "@/lib/second-brain/repositories/AutomationRepository";
import { type UpsertCycleInput, upsertCycleSchema } from "@/lib/second-brain/validation/schemas";

export const POST = withAgentApi<UpsertCycleInput>({
  operation: "POST /api/internal/v1/automations/cycles/upsert",
  schema: upsertCycleSchema,
  permission: {
    action: "automation.cycle.write",
    resourceType: "AUTOMATION_OPERATION",
    resourceKey: "cycles",
  },
  handler: async ({ body }) => {
    // Pass strictly validated typed properties into the repository
    const cycle = await AutomationRepository.upsertRunnerCycle(body);
    return NextResponse.json({ cycle });
  },
});
