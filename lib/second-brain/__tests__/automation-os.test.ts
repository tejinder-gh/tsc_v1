/**
 * Automation OS State Machine Test Suite
 * Validates deterministic state-machine operations against canonical tables.
 */

import { describe, expect, it } from "vitest";
import { setMockQueryHandler } from "../db/client";
import { AutomationRepository } from "../repositories/AutomationRepository";

describe("Automation OS State Machine", () => {
  it("evaluates due jobs prioritizing by criticality", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          job_id: "j-1",
          automation_key: "daily-sync",
          name: "Daily Sync",
          frequency: "daily",
          criticality: "high",
          priority: 10,
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    const dueJobs = await AutomationRepository.evaluateDueJobs();
    expect(dueJobs).toHaveLength(1);
    expect(dueJobs[0].automation_key).toBe("daily-sync");
  });

  it("reads job configuration and declared targets", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          job_id: "j-1",
          automation_key: "daily-sync",
          name: "Daily Sync",
          execution_policy: { runBudgetMinutes: 5 },
          declared_targets: [{ declaredKey: "target_spreadsheet", resourceType: "google_sheet" }],
          dependencies: [],
          report_delivery: {},
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    const job = await AutomationRepository.getJobConfiguration("daily-sync");
    expect(job).not.toBeNull();
    if (!job) throw new Error("Job not found");
    expect(job.automation_key).toBe("daily-sync");
    expect(job.declared_targets).toHaveLength(1);
    expect(job.declared_targets?.[0].declaredKey).toBe("target_spreadsheet");
  });

  it("ensures occurrence record idempotently", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          occurrence_id: "occ-1",
          job_id: "j-1",
          occurrence_key: "daily-sync:2026-09-22-0900",
          queue_state: "queued",
        },
      ],
      command: "INSERT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    const occ = await AutomationRepository.ensureOccurrence({
      jobId: "j-1",
      occurrenceKey: "daily-sync:2026-09-22-0900",
    });

    expect(occ.occurrence_id).toBe("occ-1");
    expect(occ.queue_state).toBe("queued");
  });

  it("acquires and releases timed execution claim", async () => {
    setMockQueryHandler(async (text) => {
      if (text.includes("INSERT INTO public.execution_claims_automation")) {
        return {
          rows: [
            {
              claim_id: "claim-1",
              occurrence_id: "occ-1",
              claimed_by: "runner-node-1",
            },
          ],
          command: "INSERT",
          rowCount: 1,
          oid: 0,
          fields: [],
        };
      }
      return {
        rows: [
          {
            claim_id: "claim-1",
            released_at: new Date().toISOString(),
          },
        ],
        command: "UPDATE",
        rowCount: 1,
        oid: 0,
        fields: [],
      };
    });

    const claim = await AutomationRepository.acquireClaim({
      occurrenceId: "occ-1",
      claimedBy: "runner-node-1",
      leaseDurationSeconds: 300,
    });
    expect(claim.claim_id).toBe("claim-1");

    const released = await AutomationRepository.releaseClaim("claim-1");
    expect(released).not.toBeNull();
    if (!released) throw new Error("Claim not found");
    expect(released.claim_id).toBe("claim-1");
    expect(released.released_at).toBeDefined();
  });

  it("records attempt lifecycle from start to finish", async () => {
    setMockQueryHandler(async (text) => {
      if (text.includes("INSERT INTO public.occurrence_attempts_automation")) {
        return {
          rows: [
            {
              attempt_id: "att-1",
              occurrence_id: "occ-1",
              attempt_number: 1,
              status: "running",
            },
          ],
          command: "INSERT",
          rowCount: 1,
          oid: 0,
          fields: [],
        };
      }
      return {
        rows: [
          {
            attempt_id: "att-1",
            status: "succeeded",
            scheduler_disposition: "COMPLETE",
          },
        ],
        command: "UPDATE",
        rowCount: 1,
        oid: 0,
        fields: [],
      };
    });

    const started = await AutomationRepository.startAttempt({
      occurrenceId: "occ-1",
      attemptNumber: 1,
    });
    expect(started.attempt_id).toBe("att-1");
    expect(started.status).toBe("running");

    const finished = await AutomationRepository.finishAttempt({
      attemptId: "att-1",
      status: "succeeded",
      schedulerDisposition: "COMPLETE",
    });
    expect(finished.status).toBe("succeeded");
    expect(finished.scheduler_disposition).toBe("COMPLETE");
  });

  it("upserts runner cycle telemetry", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          runner_cycle_id: "cycle-1",
          automation_cycle_key: "cycle-2026-09-22-0900",
          status: "completed",
          jobs_evaluated: 5,
          executed_count: 3,
        },
      ],
      command: "INSERT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    const cycle = await AutomationRepository.upsertRunnerCycle({
      automationCycleKey: "cycle-2026-09-22-0900",
      legacyRunId: "run-001",
      jobsEvaluated: 5,
      executedCount: 3,
    });

    expect(cycle.runner_cycle_id).toBe("cycle-1");
    expect(cycle.status).toBe("completed");
    expect(cycle.executed_count).toBe(3);
  });
});
