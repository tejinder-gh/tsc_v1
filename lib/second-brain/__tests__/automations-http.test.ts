/**
 * Route-level HTTP Contract Tests for Automation OS Endpoints.
 *
 * Verifies the full HTTP pipeline across all 9 endpoints:
 * 1. Authentication (missing/invalid credentials -> 401)
 * 2. Authorization (unauthorized principal -> 403)
 * 3. Input Validation (strict schemas, 400 on malformed/unexpected fields)
 * 4. Success contracts & payload boundaries
 * 5. Error shielding (500 internal failures never leak SQL or stack traces)
 * 6. Mutation lifecycles (occurrences, claims, attempts, cycles)
 */

import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as postFinishAttempt } from "../../../app/api/internal/v1/automations/attempts/finish/route";
import { POST as postStartAttempt } from "../../../app/api/internal/v1/automations/attempts/start/route";
import { POST as postAcquireClaim } from "../../../app/api/internal/v1/automations/claims/acquire/route";
import { POST as postReleaseClaim } from "../../../app/api/internal/v1/automations/claims/release/route";
import { POST as postUpsertCycle } from "../../../app/api/internal/v1/automations/cycles/upsert/route";
import { GET as getDueJobs } from "../../../app/api/internal/v1/automations/due-jobs/route";
import { GET as getJobConfig } from "../../../app/api/internal/v1/automations/jobs/[key]/route";
import { POST as postEnsureOccurrence } from "../../../app/api/internal/v1/automations/occurrences/ensure/route";
import { GET as getStatus } from "../../../app/api/internal/v1/automations/status/route";
import { setMockQueryHandler } from "../db/client";

function mockAuth(actions: string[], effects: ("ALLOW" | "DENY")[] = ["ALLOW"]) {
  setMockQueryHandler(async (text: string, values?: unknown[]) => {
    // If it's the authentication query
    if (text.includes("second_brain_security.authenticate_agent")) {
      const grants = actions.map((action, idx) => ({
        grantId: `g-${idx}`,
        effect: effects[idx] || "ALLOW",
        action,
        resourceType: action.startsWith("automation.") ? "*" : "SECOND_BRAIN_DOMAIN",
        resourceKey: "*",
        constraints: null,
        expiresAt: null,
      }));

      const scopes = actions.map((action, idx) => ({
        scopeId: `s-${idx}`,
        effect: effects[idx] || "ALLOW",
        action,
        resourceType: action.startsWith("automation.") ? "*" : "SECOND_BRAIN_DOMAIN",
        resourceKey: "*",
        constraints: null,
        expiresAt: null,
      }));

      return {
        rows: [
          {
            auth_result: {
              authenticated: true,
              principal: {
                id: "p-runner",
                key: "runner-node-1",
                displayName: "Runner Node 1",
                principalType: "agent",
              },
              credential: {
                id: "c-runner-1",
                keyId: "sb_live_runner_1",
                description: "Runner automation credential",
                lastRotatedAt: null,
                expiresAt: null,
              },
              principalGrants: grants,
              credentialScopes: scopes,
            },
          },
        ],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      };
    }

    // Default repository mock responses
    if (text.includes("public.execution_claims_automation") && text.includes("SELECT")) {
      return {
        rows: [{ active_claims_count: 0, queued_occurrences_count: 0, recent_cycles: [] }],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      };
    }

    if (text.includes("public.jobs_automation") && text.includes("schedules_automation")) {
      return {
        rows: [
          {
            job_id: "00000000-0000-0000-0000-000000000001",
            automation_key: "daily-sync",
            name: "Daily Sync",
            frequency: "daily",
          },
        ],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      };
    }

    if (text.includes("public.jobs_automation") && text.includes("ep.job_id")) {
      if (values?.[0] === "unknown-job") {
        return { rows: [], command: "SELECT", rowCount: 0, oid: 0, fields: [] };
      }
      return {
        rows: [
          {
            job_id: "00000000-0000-0000-0000-000000000001",
            automation_key: "daily-sync",
            name: "Daily Sync",
            execution_policy: { runBudgetMinutes: 5 },
            declared_targets: [],
            dependencies: [],
            report_delivery: {},
          },
        ],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      };
    }

    if (text.includes("INSERT INTO public.occurrences_automation")) {
      return {
        rows: [
          {
            occurrence_id: "occ-123",
            job_id: values?.[0],
            occurrence_key: values?.[1],
            queue_state: values?.[2],
          },
        ],
        command: "INSERT",
        rowCount: 1,
        oid: 0,
        fields: [],
      };
    }

    if (text.includes("INSERT INTO public.execution_claims_automation")) {
      return {
        rows: [
          {
            claim_id: "claim-123",
            occurrence_id: values?.[0],
            claimed_by: values?.[1],
            lease_until: new Date(Date.now() + 300000).toISOString(),
          },
        ],
        command: "INSERT",
        rowCount: 1,
        oid: 0,
        fields: [],
      };
    }

    if (text.includes("UPDATE public.execution_claims_automation")) {
      if (values?.[0] === "non-existent-claim") {
        return { rows: [], command: "UPDATE", rowCount: 0, oid: 0, fields: [] };
      }
      return {
        rows: [
          {
            claim_id: values?.[0],
            released_at: new Date().toISOString(),
          },
        ],
        command: "UPDATE",
        rowCount: 1,
        oid: 0,
        fields: [],
      };
    }

    if (text.includes("INSERT INTO public.occurrence_attempts_automation")) {
      return {
        rows: [
          {
            attempt_id: "att-123",
            occurrence_id: values?.[0],
            attempt_number: values?.[1],
            source: values?.[2],
            status: "running",
          },
        ],
        command: "INSERT",
        rowCount: 1,
        oid: 0,
        fields: [],
      };
    }

    if (text.includes("UPDATE public.occurrence_attempts_automation")) {
      if (values?.[0] === "non-existent-attempt") {
        return { rows: [], command: "UPDATE", rowCount: 0, oid: 0, fields: [] };
      }
      return {
        rows: [
          {
            attempt_id: values?.[0],
            status: values?.[1],
            error: values?.[2],
            scheduler_disposition: values?.[3],
            scheduler_reason: values?.[4],
          },
        ],
        command: "UPDATE",
        rowCount: 1,
        oid: 0,
        fields: [],
      };
    }

    if (text.includes("INSERT INTO public.runner_cycles_automation")) {
      return {
        rows: [
          {
            automation_cycle_key: values?.[0],
            legacy_run_id: values?.[1],
            status: values?.[7],
          },
        ],
        command: "INSERT",
        rowCount: 1,
        oid: 0,
        fields: [],
      };
    }

    return { rows: [], command: "SELECT", rowCount: 0, oid: 0, fields: [] };
  });
}

function req(url: string, method: string, options?: { auth?: string; body?: unknown }) {
  const headers: Record<string, string> = {};
  if (options?.auth !== undefined) {
    if (options.auth) headers.authorization = options.auth;
  } else {
    headers.authorization = "Bearer sb_live_runner_1.secret";
  }

  if (options?.body !== undefined) {
    headers["content-type"] = "application/json";
  }

  return new NextRequest(url, {
    method,
    headers,
    body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
}

describe("Automation OS HTTP Endpoints", () => {
  beforeEach(() => {
    mockAuth(["automation.*"]);
  });

  afterEach(() => {
    setMockQueryHandler(null);
  });

  describe("Authentication & Authorization Guard", () => {
    it("returns 401 MISSING_CREDENTIALS when authorization header is absent", async () => {
      const request = req("http://localhost:3000/api/internal/v1/automations/status", "GET", {
        auth: "",
      });
      const res = await getStatus(request);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.code).toBe("MISSING_CREDENTIALS");
    });

    it("returns 401 MALFORMED_CREDENTIALS on invalid token shape without dot", async () => {
      const request = req("http://localhost:3000/api/internal/v1/automations/status", "GET", {
        auth: "Bearer invalid_token_without_dot",
      });
      const res = await getStatus(request);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.code).toBe("MALFORMED_CREDENTIALS");
    });

    it("returns 403 FORBIDDEN when authenticated agent lacks required automation action", async () => {
      // Mock agent with only context.read grant
      mockAuth(["context.read"]);

      const request = req("http://localhost:3000/api/internal/v1/automations/status", "GET");
      const res = await getStatus(request);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.code).toBe("FORBIDDEN");
      expect(data.reason).toBeDefined();
    });
  });

  describe("Error Shielding", () => {
    it("returns shielded 500 without leaking database error details, table names, or SQL", async () => {
      const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      setMockQueryHandler(async (text: string) => {
        if (text.includes("authenticate_agent")) {
          return {
            rows: [
              {
                auth_result: {
                  authenticated: true,
                  principal: {
                    id: "p-1",
                    key: "runner",
                    displayName: "Runner",
                    principalType: "agent",
                  },
                  credential: {
                    id: "c-1",
                    keyId: "sb_live_runner_1",
                    description: null,
                    lastRotatedAt: null,
                    expiresAt: null,
                  },
                  principalGrants: [
                    {
                      grantId: "g-1",
                      effect: "ALLOW",
                      action: "automation.status.read",
                      resourceType: "*",
                      resourceKey: "*",
                      constraints: null,
                      expiresAt: null,
                    },
                  ],
                  credentialScopes: [
                    {
                      scopeId: "s-1",
                      effect: "ALLOW",
                      action: "automation.status.read",
                      resourceType: "*",
                      resourceKey: "*",
                      constraints: null,
                      expiresAt: null,
                    },
                  ],
                },
              },
            ],
            command: "SELECT",
            rowCount: 1,
            oid: 0,
            fields: [],
          };
        }
        // Throw realistic database exception with sensitive internal details
        throw new Error(
          'relation "public.execution_claims_automation" does not exist at character 42, SQL: SELECT password_hash FROM secret_table',
        );
      });

      const request = req("http://localhost:3000/api/internal/v1/automations/status", "GET");
      const res = await getStatus(request);
      errSpy.mockRestore();
      expect(res.status).toBe(500);
      const data = await res.json();

      expect(data).toEqual({
        error: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
      // Verify no sensitive leakage
      const rawText = JSON.stringify(data);
      expect(rawText).not.toContain("password_hash");
      expect(rawText).not.toContain("secret_table");
      expect(rawText).not.toContain("execution_claims_automation");
    });
  });

  describe("GET /api/internal/v1/automations/status", () => {
    it("returns operational status when authorized", async () => {
      mockAuth(["automation.status.read"]);
      const request = req("http://localhost:3000/api/internal/v1/automations/status", "GET");
      const res = await getStatus(request);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBeDefined();
      expect(data.status.active_claims_count).toBe(0);
    });
  });

  describe("GET /api/internal/v1/automations/due-jobs", () => {
    it("evaluates and returns due jobs", async () => {
      mockAuth(["automation.evaluate"]);
      const request = req("http://localhost:3000/api/internal/v1/automations/due-jobs", "GET");
      const res = await getDueJobs(request);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.count).toBe(1);
      expect(data.dueJobs[0].automation_key).toBe("daily-sync");
    });
  });

  describe("GET /api/internal/v1/automations/jobs/[key]", () => {
    it("returns detailed job configuration for existing key", async () => {
      mockAuth(["automation.read"]);
      const request = req(
        "http://localhost:3000/api/internal/v1/automations/jobs/daily-sync",
        "GET",
      );
      const res = await getJobConfig(request, { params: Promise.resolve({ key: "daily-sync" }) });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.job.automation_key).toBe("daily-sync");
    });

    it("returns 404 when job does not exist", async () => {
      mockAuth(["automation.read"]);
      const request = req(
        "http://localhost:3000/api/internal/v1/automations/jobs/unknown-job",
        "GET",
      );
      const res = await getJobConfig(request, { params: Promise.resolve({ key: "unknown-job" }) });
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.code).toBe("NOT_FOUND");
    });
  });

  describe("POST /api/internal/v1/automations/occurrences/ensure", () => {
    it("rejects request missing required fields with 400", async () => {
      mockAuth(["automation.occurrence.write"]);
      const request = req(
        "http://localhost:3000/api/internal/v1/automations/occurrences/ensure",
        "POST",
        {
          body: { jobId: "job-1" }, // missing occurrenceKey
        },
      );
      const res = await postEnsureOccurrence(request);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.code).toBe("BAD_REQUEST");
    });

    it("rejects unexpected extra properties due to strict schema", async () => {
      mockAuth(["automation.occurrence.write"]);
      const request = req(
        "http://localhost:3000/api/internal/v1/automations/occurrences/ensure",
        "POST",
        {
          body: {
            jobId: "job-1",
            occurrenceKey: "daily-sync:2026-09-22-0900",
            unexpectedField: "malicious_payload",
          },
        },
      );
      const res = await postEnsureOccurrence(request);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.code).toBe("BAD_REQUEST");
      expect(data.error).toContain("Unrecognized key(s)");
    });

    it("ensures occurrence successfully with valid payload", async () => {
      mockAuth(["automation.occurrence.write"]);
      const request = req(
        "http://localhost:3000/api/internal/v1/automations/occurrences/ensure",
        "POST",
        {
          body: {
            jobId: "00000000-0000-0000-0000-000000000001",
            occurrenceKey: "daily-sync:2026-09-22-0900",
            queueState: "queued",
          },
        },
      );
      const res = await postEnsureOccurrence(request);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.occurrence.occurrence_key).toBe("daily-sync:2026-09-22-0900");
    });
  });

  describe("POST /api/internal/v1/automations/claims/acquire", () => {
    it("rejects malformed payload missing claimedBy with 400", async () => {
      mockAuth(["automation.claim.acquire"]);
      const request = req(
        "http://localhost:3000/api/internal/v1/automations/claims/acquire",
        "POST",
        {
          body: { occurrenceId: "occ-123" },
        },
      );
      const res = await postAcquireClaim(request);
      expect(res.status).toBe(400);
    });

    it("acquires lease claim successfully", async () => {
      mockAuth(["automation.claim.acquire"]);
      const request = req(
        "http://localhost:3000/api/internal/v1/automations/claims/acquire",
        "POST",
        {
          body: {
            occurrenceId: "occ-123",
            claimedBy: "runner-node-1",
            leaseDurationSeconds: 300,
          },
        },
      );
      const res = await postAcquireClaim(request);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.claim.claim_id).toBe("claim-123");
      expect(data.claim.claimed_by).toBe("runner-node-1");
    });
  });

  describe("POST /api/internal/v1/automations/claims/release", () => {
    it("releases claim successfully", async () => {
      mockAuth(["automation.claim.release"]);
      const request = req(
        "http://localhost:3000/api/internal/v1/automations/claims/release",
        "POST",
        {
          body: { claimId: "claim-123" },
        },
      );
      const res = await postReleaseClaim(request);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.claim.claim_id).toBe("claim-123");
    });

    it("returns 404 when claim is not found or already released", async () => {
      mockAuth(["automation.claim.release"]);
      const request = req(
        "http://localhost:3000/api/internal/v1/automations/claims/release",
        "POST",
        {
          body: { claimId: "non-existent-claim" },
        },
      );
      const res = await postReleaseClaim(request);
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.code).toBe("NOT_FOUND");
    });
  });

  describe("POST /api/internal/v1/automations/attempts/start", () => {
    it("rejects attempt missing attemptNumber with 400", async () => {
      mockAuth(["automation.attempt.write"]);
      const request = req(
        "http://localhost:3000/api/internal/v1/automations/attempts/start",
        "POST",
        {
          body: { occurrenceId: "occ-123" },
        },
      );
      const res = await postStartAttempt(request);
      expect(res.status).toBe(400);
    });

    it("records start of execution attempt", async () => {
      mockAuth(["automation.attempt.write"]);
      const request = req(
        "http://localhost:3000/api/internal/v1/automations/attempts/start",
        "POST",
        {
          body: {
            occurrenceId: "occ-123",
            attemptNumber: 1,
            source: "scheduler",
          },
        },
      );
      const res = await postStartAttempt(request);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.attempt.attempt_id).toBe("att-123");
      expect(data.attempt.status).toBe("running");
    });
  });

  describe("POST /api/internal/v1/automations/attempts/finish", () => {
    it("rejects attempt with invalid status enum value with 400", async () => {
      mockAuth(["automation.attempt.write"]);
      const request = req(
        "http://localhost:3000/api/internal/v1/automations/attempts/finish",
        "POST",
        {
          body: {
            attemptId: "att-123",
            status: "unknown_status",
          },
        },
      );
      const res = await postFinishAttempt(request);
      expect(res.status).toBe(400);
    });

    it("records attempt finish successfully with valid enum status", async () => {
      mockAuth(["automation.attempt.write"]);
      const request = req(
        "http://localhost:3000/api/internal/v1/automations/attempts/finish",
        "POST",
        {
          body: {
            attemptId: "att-123",
            status: "succeeded",
            schedulerDisposition: "COMPLETE",
          },
        },
      );
      const res = await postFinishAttempt(request);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.attempt.status).toBe("succeeded");
      expect(data.attempt.scheduler_disposition).toBe("COMPLETE");
    });

    it("returns 404 when attempt ID is unknown", async () => {
      mockAuth(["automation.attempt.write"]);
      const request = req(
        "http://localhost:3000/api/internal/v1/automations/attempts/finish",
        "POST",
        {
          body: {
            attemptId: "non-existent-attempt",
            status: "failed",
            error: "Timeout error",
          },
        },
      );
      const res = await postFinishAttempt(request);
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.code).toBe("NOT_FOUND");
    });
  });

  describe("POST /api/internal/v1/automations/cycles/upsert", () => {
    it("rejects cycles payload with invalid/unexpected fields", async () => {
      mockAuth(["automation.cycle.write"]);
      const request = req(
        "http://localhost:3000/api/internal/v1/automations/cycles/upsert",
        "POST",
        {
          body: {
            automationCycleKey: "cycle-1",
            legacyRunId: "run-1",
            injectedDangerousField: "drop table",
          },
        },
      );
      const res = await postUpsertCycle(request);
      expect(res.status).toBe(400);
    });

    it("upserts cycle telemetry successfully", async () => {
      mockAuth(["automation.cycle.write"]);
      const request = req(
        "http://localhost:3000/api/internal/v1/automations/cycles/upsert",
        "POST",
        {
          body: {
            automationCycleKey: "cycle-2026-09-22-0900",
            legacyRunId: "run-001",
            runTitle: "Scheduled Morning Batch",
            status: "completed",
            jobsEvaluated: 10,
            dueCount: 2,
            executedCount: 2,
          },
        },
      );
      const res = await postUpsertCycle(request);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.cycle.automation_cycle_key).toBe("cycle-2026-09-22-0900");
    });
  });
});
