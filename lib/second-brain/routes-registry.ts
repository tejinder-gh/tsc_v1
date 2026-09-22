/**
 * Second Brain Routes Registry
 * Canonical single-source-of-truth definition of all Second Brain API endpoints.
 * Powers the self-documenting authorized introspection endpoint GET /api/internal/v1/endpoints.
 */

export interface SecondBrainRouteDefinition {
  id: string;
  path: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  actionRequired: string;
  resourceType: string;
  resourceKey: string;
  description: string;
  howToUse: {
    authentication: string;
    queryParams?: Record<string, string>;
    requestBody?: Record<string, any>;
    responseSchema?: Record<string, any>;
  };
  whereToUse: string;
  sampleRequest: {
    headers: Record<string, string>;
    body?: Record<string, any>;
    params?: Record<string, string>;
  };
  sampleResponse: Record<string, any>;
}

export const SECOND_BRAIN_ROUTES: SecondBrainRouteDefinition[] = [
  {
    id: "endpoints-introspection",
    path: "/api/internal/v1/endpoints",
    method: "GET",
    actionRequired: "meta.endpoints.read",
    resourceType: "API_ENDPOINT",
    resourceKey: "/api/internal/v1/endpoints",
    description:
      "Self-documenting API catalog. Returns a dynamic list of endpoints and capabilities authorized for the caller's specific credential.",
    howToUse: {
      authentication: "Bearer <key_id>.<secret> in Authorization header",
      queryParams: {
        format: "Optional format ('json' or 'openapi'). Defaults to 'json'.",
      },
    },
    whereToUse:
      "Used by agents during initial discovery to discover what actions and resources their current credential is authorized to access.",
    sampleRequest: {
      headers: {
        Authorization: "Bearer sb_live_claude_xxx.secret_yyy",
      },
    },
    sampleResponse: {
      domain: "Second Brain API",
      version: "1.0.0",
      callerPrincipal: "claude",
      authorizedEndpoints: [],
    },
  },
  {
    id: "context-search",
    path: "/api/internal/v1/context/search",
    method: "POST",
    actionRequired: "context.read",
    resourceType: "SECOND_BRAIN_DOMAIN",
    resourceKey: "domain:*",
    description:
      "Hierarchical context routing engine. Resolves high-level prompts and tasks to the single canonical Second Brain resource context.",
    howToUse: {
      authentication: "Bearer <key_id>.<secret> in Authorization header",
      requestBody: {
        domain: "Target Second Brain domain (e.g. 'strategy', 'social-content', 'automations')",
        subdomain: "Optional subdomain filter (e.g. 'architecture', 'acquisition')",
        keywords: "Array of search keywords used for fit ranking",
        limit: "Optional maximum results to return (default 2)",
      },
    },
    whereToUse:
      "Called at the start of any durable agent task to locate the authoritative context page, canonical Notion/Drive URL, and guidelines.",
    sampleRequest: {
      headers: {
        Authorization: "Bearer sb_live_claude_xxx.secret_yyy",
        "Content-Type": "application/json",
      },
      body: {
        domain: "strategy",
        subdomain: "acquisition",
        keywords: ["diligence", "financial"],
      },
    },
    sampleResponse: {
      matches: [
        {
          indexId: "...",
          domain: "strategy",
          subdomain: "acquisition",
          summary: "M&A Playbook & Diligence",
          priority: 10,
          isPrimary: true,
          resource: {
            title: "M&A Playbook",
            resourceType: "playbook",
            sourcePageUrl: "https://notion.so/...",
          },
        },
      ],
    },
  },
  {
    id: "automations-due-jobs",
    path: "/api/internal/v1/automations/due-jobs",
    method: "GET",
    actionRequired: "automation.evaluate",
    resourceType: "AUTOMATION_JOB",
    resourceKey: "*",
    description:
      "Evaluates scheduled Automation OS jobs and returns due items prioritized by criticality and execution policy.",
    howToUse: {
      authentication: "Bearer <key_id>.<secret> in Authorization header",
    },
    whereToUse:
      "Called by the Automation OS runner at scheduled cron intervals to determine what jobs require execution.",
    sampleRequest: {
      headers: {
        Authorization: "Bearer sb_live_automation_xxx.secret_yyy",
      },
    },
    sampleResponse: {
      dueJobs: [
        {
          jobId: "...",
          automationKey: "daily-sync",
          name: "Daily Operations Sync",
          frequency: "daily",
          criticality: "high",
        },
      ],
    },
  },
  {
    id: "automations-job-config",
    path: "/api/internal/v1/automations/jobs/[key]",
    method: "GET",
    actionRequired: "automation.read",
    resourceType: "AUTOMATION_JOB",
    resourceKey: "*",
    description:
      "Reads detailed Automation OS job configuration, including execution policy, dependencies, prompt references, and declared targets.",
    howToUse: {
      authentication: "Bearer <key_id>.<secret> in Authorization header",
      queryParams: {
        key: "The automation_key or legacy_job_key of the target job",
      },
    },
    whereToUse:
      "Called by the runner prior to job execution to load execution limits, prompts, and target resource boundaries.",
    sampleRequest: {
      headers: {
        Authorization: "Bearer sb_live_automation_xxx.secret_yyy",
      },
    },
    sampleResponse: {
      job: {
        automationKey: "daily-sync",
        name: "Daily Operations Sync",
        executionPolicy: { runBudgetMinutes: 5, model: "gemini-flash" },
        declaredTargets: [{ declaredKey: "target_sheet" }],
      },
    },
  },
  {
    id: "automations-occurrences-ensure",
    path: "/api/internal/v1/automations/occurrences/ensure",
    method: "POST",
    actionRequired: "automation.occurrence.write",
    resourceType: "AUTOMATION_OPERATION",
    resourceKey: "occurrences",
    description: "Idempotently ensures an occurrence record exists for a scheduled job and slot.",
    howToUse: {
      authentication: "Bearer <key_id>.<secret> in Authorization header",
      requestBody: {
        jobId: "UUID of the job",
        occurrenceKey: "Deterministic key (e.g. 'daily-sync:2026-09-22-0900')",
        queueState: "Initial queue state ('queued')",
      },
    },
    whereToUse: "Called when a job is scheduled or triggered to ensure occurrence deduplication.",
    sampleRequest: {
      headers: {
        Authorization: "Bearer sb_live_automation_xxx.secret_yyy",
        "Content-Type": "application/json",
      },
      body: {
        jobId: "00000000-0000-0000-0000-000000000000",
        occurrenceKey: "daily-sync:2026-09-22-0900",
      },
    },
    sampleResponse: {
      occurrenceId: "...",
      occurrenceKey: "daily-sync:2026-09-22-0900",
      queueState: "queued",
    },
  },
  {
    id: "automations-claims-acquire",
    path: "/api/internal/v1/automations/claims/acquire",
    method: "POST",
    actionRequired: "automation.claim.acquire",
    resourceType: "AUTOMATION_OPERATION",
    resourceKey: "claims",
    description:
      "Atomically acquires a timed execution lease claim on an occurrence to prevent concurrent runner collisions.",
    howToUse: {
      authentication: "Bearer <key_id>.<secret> in Authorization header",
      requestBody: {
        occurrenceId: "UUID of the occurrence",
        claimedBy: "Runner worker identifier",
        leaseDurationSeconds: "Optional lease duration (default 300 seconds)",
      },
    },
    whereToUse: "Called immediately before launching a job execution attempt.",
    sampleRequest: {
      headers: {
        Authorization: "Bearer sb_live_automation_xxx.secret_yyy",
        "Content-Type": "application/json",
      },
      body: {
        occurrenceId: "...",
        claimedBy: "runner-node-1",
        leaseDurationSeconds: 300,
      },
    },
    sampleResponse: {
      claimId: "...",
      occurrenceId: "...",
      leaseUntil: "...",
    },
  },
  {
    id: "automations-claims-release",
    path: "/api/internal/v1/automations/claims/release",
    method: "POST",
    actionRequired: "automation.claim.release",
    resourceType: "AUTOMATION_OPERATION",
    resourceKey: "claims",
    description: "Releases an active execution lease claim once execution completes or aborts.",
    howToUse: {
      authentication: "Bearer <key_id>.<secret> in Authorization header",
      requestBody: {
        claimId: "UUID of the claim to release",
      },
    },
    whereToUse: "Called in finally block after job attempt finishes.",
    sampleRequest: {
      headers: {
        Authorization: "Bearer sb_live_automation_xxx.secret_yyy",
        "Content-Type": "application/json",
      },
      body: {
        claimId: "...",
      },
    },
    sampleResponse: {
      claimId: "...",
      releasedAt: "...",
    },
  },
  {
    id: "automations-attempts-start",
    path: "/api/internal/v1/automations/attempts/start",
    method: "POST",
    actionRequired: "automation.attempt.write",
    resourceType: "AUTOMATION_OPERATION",
    resourceKey: "attempts",
    description: "Records the beginning of an execution attempt for an occurrence.",
    howToUse: {
      authentication: "Bearer <key_id>.<secret> in Authorization header",
      requestBody: {
        occurrenceId: "UUID of the occurrence",
        attemptNumber: "1-based attempt sequence number",
        source: "Runner source ('scheduler' or 'cli')",
      },
    },
    whereToUse: "Called at the start of job execution to log start timestamp and attempt sequence.",
    sampleRequest: {
      headers: {
        Authorization: "Bearer sb_live_automation_xxx.secret_yyy",
        "Content-Type": "application/json",
      },
      body: {
        occurrenceId: "...",
        attemptNumber: 1,
      },
    },
    sampleResponse: {
      attemptId: "...",
      status: "running",
      startedAt: "...",
    },
  },
  {
    id: "automations-attempts-finish",
    path: "/api/internal/v1/automations/attempts/finish",
    method: "POST",
    actionRequired: "automation.attempt.write",
    resourceType: "AUTOMATION_OPERATION",
    resourceKey: "attempts",
    description:
      "Records attempt completion with status, error details, and scheduler disposition.",
    howToUse: {
      authentication: "Bearer <key_id>.<secret> in Authorization header",
      requestBody: {
        attemptId: "UUID of the attempt",
        status: "'succeeded', 'failed', or 'deferred'",
        error: "Optional error message if failed",
        schedulerDisposition: "Disposition code ('COMPLETE', 'RETRY', 'DEFER')",
        schedulerReason: "Detailed explanation",
      },
    },
    whereToUse: "Called when execution finishes to record telemetry and update occurrence state.",
    sampleRequest: {
      headers: {
        Authorization: "Bearer sb_live_automation_xxx.secret_yyy",
        "Content-Type": "application/json",
      },
      body: {
        attemptId: "...",
        status: "succeeded",
        schedulerDisposition: "COMPLETE",
      },
    },
    sampleResponse: {
      attemptId: "...",
      status: "succeeded",
      finishedAt: "...",
    },
  },
  {
    id: "automations-cycles-upsert",
    path: "/api/internal/v1/automations/cycles/upsert",
    method: "POST",
    actionRequired: "automation.cycle.write",
    resourceType: "AUTOMATION_OPERATION",
    resourceKey: "cycles",
    description:
      "Upserts runner cycle summary metadata, batch evaluation statistics, and cycle job links.",
    howToUse: {
      authentication: "Bearer <key_id>.<secret> in Authorization header",
      requestBody: {
        automationCycleKey: "Unique cycle key (e.g. 'cycle-2026-09-22-0900')",
        legacyRunId: "Legacy runner run ID",
        runTitle: "Human-readable cycle title",
        status: "Cycle status ('completed', 'failed')",
        jobsEvaluated: 5,
        executedCount: 3,
      },
    },
    whereToUse: "Called at the conclusion of a full runner tick/batch.",
    sampleRequest: {
      headers: {
        Authorization: "Bearer sb_live_automation_xxx.secret_yyy",
        "Content-Type": "application/json",
      },
      body: {
        automationCycleKey: "cycle-2026-09-22-0900",
        legacyRunId: "run-001",
        jobsEvaluated: 5,
        executedCount: 3,
      },
    },
    sampleResponse: {
      runnerCycleId: "...",
      automationCycleKey: "cycle-2026-09-22-0900",
      status: "completed",
    },
  },
  {
    id: "automations-status",
    path: "/api/internal/v1/automations/status",
    method: "GET",
    actionRequired: "automation.status.read",
    resourceType: "AUTOMATION_OPERATION",
    resourceKey: "status",
    description:
      "Inspects real-time Automation OS operational status, active claims, and queue backlogs.",
    howToUse: {
      authentication: "Bearer <key_id>.<secret> in Authorization header",
    },
    whereToUse: "Called by dashboards, health checks, and operators to verify runner health.",
    sampleRequest: {
      headers: {
        Authorization: "Bearer sb_live_automation_xxx.secret_yyy",
      },
    },
    sampleResponse: {
      activeClaimsCount: 1,
      queuedOccurrencesCount: 0,
      recentCycles: [],
    },
  },
];
