/**
 * Structured Agent Audit Logger
 * Invokes second_brain_security.record_agent_audit(...)
 * Strictly ensures no secrets or secret hashes are recorded.
 */

import { dbQuery } from "../db/client";

export interface RecordAuditParams {
  principalId?: string | null;
  credentialId?: string | null;
  requestId?: string | null;
  action: string;
  resourceType: string;
  resourceKey: string;
  decision:
    | "ALLOW"
    | "DENY"
    | "AUTH_FAILED"
    | "KEY_REVOKED"
    | "KEY_EXPIRED"
    | "KEY_DISABLED"
    | "SCOPE_DENIED";
  metadata?: Record<string, unknown>;
}

export async function recordAgentAudit(params: RecordAuditParams): Promise<string | null> {
  try {
    const {
      principalId = null,
      credentialId = null,
      requestId = null,
      action,
      resourceType,
      resourceKey,
      decision,
      metadata = {},
    } = params;

    // Sanitize metadata to guarantee secrets never leak
    const sanitizedMeta = { ...metadata };
    delete sanitizedMeta.secret;
    delete sanitizedMeta.secret_hash;
    delete sanitizedMeta.secretHash;
    delete sanitizedMeta.combinedKey;
    delete sanitizedMeta.password;
    delete sanitizedMeta.key;

    const queryText = `
      SELECT second_brain_security.record_agent_audit(
        $1, $2, $3, $4, $5, $6, $7, $8
      ) AS audit_id;
    `;

    const res = await dbQuery<{ audit_id: string }>(queryText, [
      principalId,
      credentialId,
      requestId,
      action,
      resourceType,
      resourceKey,
      decision,
      JSON.stringify(sanitizedMeta),
    ]);

    return res.rows[0]?.audit_id || null;
  } catch (err) {
    console.error("Failed to record agent audit event", err);
    return null;
  }
}
