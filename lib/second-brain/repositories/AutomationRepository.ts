/**
 * Canonical Automation OS State Machine Repository
 * Operates on canonical public schema automation tables:
 * - jobs_automation
 * - schedules_automation
 * - job_execution_policy_automation
 * - job_dependencies_automation
 * - job_targets_automation
 * - occurrences_automation
 * - execution_claims_automation
 * - occurrence_attempts_automation
 * - runner_cycles_automation
 * - runner_cycle_jobs_automation
 *
 * Invariant: Operations can never broaden a job's declared targets.
 */

import { dbQuery } from "../db/client";

export class AutomationRepository {
  /**
   * Evaluate due jobs based on schedules and queue state.
   */
  public static async evaluateDueJobs(): Promise<any[]> {
    const queryText = `
      SELECT 
        j.job_id,
        j.automation_key,
        j.legacy_job_key,
        j.name,
        j.domain,
        j.work_type,
        s.frequency,
        s.timezone,
        s.run_hours,
        s.run_minute,
        s.run_days,
        ep.criticality,
        ep.priority,
        ep.execution_mode
      FROM public.jobs_automation j
      JOIN public.schedules_automation s ON j.job_id = s.job_id
      LEFT JOIN public.job_execution_policy_automation ep ON j.job_id = ep.job_id
      WHERE j.enabled = true
      ORDER BY coalesce(ep.priority, 100) ASC;
    `;
    const res = await dbQuery(queryText);
    return res.rows;
  }

  /**
   * Read detailed job configuration, dependencies, declared targets, and policies.
   */
  public static async getJobConfiguration(automationKey: string): Promise<any | null> {
    const queryText = `
      SELECT 
        j.*,
        row_to_json(ep.*) AS execution_policy,
        coalesce(
          (
            SELECT jsonb_agg(
              jsonb_build_object(
                'resourceId', jt.resource_id,
                'declaredKey', jt.declared_key,
                'ordinal', jt.ordinal,
                'title', rr.title,
                'resourceType', rr.resource_type
              ) ORDER BY jt.ordinal ASC
            )
            FROM public.job_targets_automation jt
            JOIN public.resource_registry rr ON jt.resource_id = rr.resource_id
            WHERE jt.job_id = j.job_id
          ),
          '[]'::jsonb
        ) AS declared_targets,
        coalesce(
          (
            SELECT jsonb_agg(
              jsonb_build_object(
                'dependencyResourceId', jd.resource_id,
                'dependencyType', jd.dependency_type,
                'isMandatory', jd.is_mandatory
              )
            )
            FROM public.job_dependencies_automation jd
            WHERE jd.job_id = j.job_id
          ),
          '[]'::jsonb
        ) AS dependencies,
        coalesce(
          (
            SELECT row_to_json(rd.*)
            FROM public.job_report_delivery_automation rd
            WHERE rd.job_id = j.job_id
          ),
          '{}'::json
        ) AS report_delivery
      FROM public.jobs_automation j
      LEFT JOIN public.job_execution_policy_automation ep ON j.job_id = ep.job_id
      WHERE j.automation_key = $1 OR j.legacy_job_key = $1;
    `;
    const res = await dbQuery(queryText, [automationKey]);
    return res.rows[0] || null;
  }

  /**
   * Idempotently ensure an occurrence record exists for a job.
   */
  public static async ensureOccurrence(params: {
    jobId: string;
    occurrenceKey: string;
    queueState?: string;
  }): Promise<any> {
    const { jobId, occurrenceKey, queueState = "queued" } = params;
    const queryText = `
      INSERT INTO public.occurrences_automation (
        job_id, occurrence_key, queue_state, source_snapshot_at
      ) VALUES ($1, $2, $3, now())
      ON CONFLICT (job_id, occurrence_key) 
      DO UPDATE SET
        queue_state = coalesce(occurrences_automation.queue_state, EXCLUDED.queue_state)
      RETURNING *;
    `;
    const res = await dbQuery(queryText, [jobId, occurrenceKey, queueState]);
    return res.rows[0];
  }

  /**
   * Acquire a lease claim on an occurrence.
   */
  public static async acquireClaim(params: {
    occurrenceId: string;
    claimedBy: string;
    leaseDurationSeconds?: number;
  }): Promise<any> {
    const { occurrenceId, claimedBy, leaseDurationSeconds = 300 } = params;
    const queryText = `
      INSERT INTO public.execution_claims_automation (
        occurrence_id, claimed_by, claimed_at, lease_until, source_snapshot_at
      ) VALUES (
        $1, $2, now(), now() + ($3 || ' seconds')::interval, now()
      )
      RETURNING *;
    `;
    const res = await dbQuery(queryText, [occurrenceId, claimedBy, leaseDurationSeconds]);
    return res.rows[0];
  }

  /**
   * Release an active lease claim.
   */
  public static async releaseClaim(claimId: string): Promise<any> {
    const queryText = `
      UPDATE public.execution_claims_automation
      SET released_at = now()
      WHERE claim_id = $1 AND released_at IS NULL
      RETURNING *;
    `;
    const res = await dbQuery(queryText, [claimId]);
    return res.rows[0] || null;
  }

  /**
   * Record attempt start for an occurrence.
   */
  public static async startAttempt(params: {
    occurrenceId: string;
    attemptNumber: number;
    source?: string;
  }): Promise<any> {
    const { occurrenceId, attemptNumber, source = "runner" } = params;
    const queryText = `
      INSERT INTO public.occurrence_attempts_automation (
        occurrence_id, attempt_number, started_at, status, source
      ) VALUES (
        $1, $2, now(), 'running', $3
      )
      ON CONFLICT (occurrence_id, attempt_number)
      DO UPDATE SET
        started_at = now(),
        status = 'running'
      RETURNING *;
    `;
    const res = await dbQuery(queryText, [occurrenceId, attemptNumber, source]);
    return res.rows[0];
  }

  /**
   * Record attempt finish.
   */
  public static async finishAttempt(params: {
    attemptId: string;
    status: "succeeded" | "failed" | "deferred";
    error?: string | null;
    schedulerDisposition?: string | null;
    schedulerReason?: string | null;
  }): Promise<any> {
    const {
      attemptId,
      status,
      error = null,
      schedulerDisposition = null,
      schedulerReason = null,
    } = params;
    const queryText = `
      UPDATE public.occurrence_attempts_automation
      SET
        finished_at = now(),
        status = $2,
        error = $3,
        scheduler_disposition = $4,
        scheduler_reason = $5
      WHERE attempt_id = $1
      RETURNING *;
    `;
    const res = await dbQuery(queryText, [
      attemptId,
      status,
      error,
      schedulerDisposition,
      schedulerReason,
    ]);
    return res.rows[0] || null;
  }

  /**
   * Upsert runner cycle telemetry and cycle job links.
   */
  public static async upsertRunnerCycle(cycleData: {
    automationCycleKey: string;
    legacyRunId: string;
    runTitle?: string;
    automationName?: string;
    automationId?: string;
    runDate?: string;
    slot?: string;
    status?: string;
    jobsEvaluated?: number;
    dueCount?: number;
    executedCount?: number;
    deferredCount?: number;
    failedCount?: number;
    updatedTargetResources?: string[];
  }): Promise<any> {
    const queryText = `
      INSERT INTO public.runner_cycles_automation (
        automation_cycle_key, legacy_run_id, run_title, automation_name,
        automation_id, run_date, slot, status, jobs_evaluated,
        due_count, executed_count, deferred_count, failed_count,
        updated_target_resources, started_at, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, coalesce($6::timestamptz, now()), $7, $8,
        $9, $10, $11, $12, $13, $14, now(), now()
      )
      ON CONFLICT (automation_cycle_key)
      DO UPDATE SET
        status = coalesce(EXCLUDED.status, runner_cycles_automation.status),
        finished_at = now(),
        jobs_evaluated = coalesce(EXCLUDED.jobs_evaluated, runner_cycles_automation.jobs_evaluated),
        executed_count = coalesce(EXCLUDED.executed_count, runner_cycles_automation.executed_count)
      RETURNING *;
    `;
    const res = await dbQuery(queryText, [
      cycleData.automationCycleKey,
      cycleData.legacyRunId,
      cycleData.runTitle || null,
      cycleData.automationName || null,
      cycleData.automationId || null,
      cycleData.runDate || null,
      cycleData.slot || null,
      cycleData.status || "completed",
      cycleData.jobsEvaluated || 0,
      cycleData.dueCount || 0,
      cycleData.executedCount || 0,
      cycleData.deferredCount || 0,
      cycleData.failedCount || 0,
      cycleData.updatedTargetResources || [],
    ]);
    return res.rows[0];
  }

  /**
   * Read runtime operational status (active claims, recent cycles).
   */
  public static async getRuntimeStatus(): Promise<any> {
    const queryText = `
      SELECT
        (SELECT count(*) FROM public.execution_claims_automation WHERE released_at IS NULL AND (lease_until IS NULL OR lease_until > now())) AS active_claims_count,
        (SELECT count(*) FROM public.occurrences_automation WHERE queue_state IN ('queued', 'retrying')) AS queued_occurrences_count,
        (SELECT jsonb_agg(row_to_json(rc.*)) FROM (SELECT * FROM public.runner_cycles_automation ORDER BY run_date DESC LIMIT 5) rc) AS recent_cycles;
    `;
    const res = await dbQuery(queryText);
    return res.rows[0];
  }
}
