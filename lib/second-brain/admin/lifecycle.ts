/**
 * Administrative Credential Lifecycle Operations
 * Admin-only: executed with admin DB connectivity (neondb_owner)
 *
 * Capabilities:
 * - CREATE key with scopes
 * - UPDATE metadata / scopes (secret_hash is strictly immutable)
 * - ROTATE secret (creates child key, links rotation_parent_id, supports grace period)
 * - REGENERATE key (alias to rotate)
 * - REVOKE key (permanent revocation)
 * - DISABLE / ENABLE key (temporary toggle; cannot re-enable revoked key)
 * - SAFE METADATA INSPECTION (never leaks secret or secret_hash)
 */

import { Pool } from "pg";
import { resolveDatabaseSslConfig } from "../db/client";
import type { CreateCredentialResult, CredentialScope, SafeCredentialMetadata } from "../types/iam";

let adminPool: Pool | null = null;
let mockAdminHandler: ((text: string, params?: unknown[]) => Promise<unknown>) | null = null;

export function getAdminPool(): Pool {
  if (adminPool) return adminPool;

  const adminUrl = process.env.SECOND_BRAIN_ADMIN_DATABASE_URL;
  if (!adminUrl) {
    throw new Error(
      "SECOND_BRAIN_ADMIN_DATABASE_URL is not configured. Administrative credential lifecycle operations require the admin connection string.",
    );
  }

  const ssl = resolveDatabaseSslConfig(adminUrl);

  adminPool = new Pool({
    connectionString: adminUrl,
    ssl,
    max: 5,
    idleTimeoutMillis: 10000,
  });

  return adminPool;
}

export function setMockAdminHandler(
  handler: ((text: string, params?: unknown[]) => Promise<unknown>) | null,
): void {
  mockAdminHandler = handler;
}

export async function adminQuery<T = unknown>(text: string, params?: unknown[]): Promise<T> {
  if (mockAdminHandler) {
    return (await mockAdminHandler(text, params)) as T;
  }

  const p = getAdminPool();
  const res = await p.query(text, params);
  return res.rows as unknown as T;
}

export async function closeAdminPool(): Promise<void> {
  if (adminPool) {
    await adminPool.end();
    adminPool = null;
  }
}

export interface CreateKeyParams {
  principalKey: string;
  scopes?: Partial<CredentialScope>[];
  description?: string;
  expiresAt?: string | null;
  rotationParentId?: string | null;
}

export async function createAgentCredential(
  params: CreateKeyParams,
): Promise<CreateCredentialResult> {
  const {
    principalKey,
    scopes = [],
    description = null,
    expiresAt = null,
    rotationParentId = null,
  } = params;

  const queryText = `
    SELECT second_brain_security.create_agent_credential(
      $1, $2::jsonb, $3, $4, $5
    ) AS result;
  `;

  const rows = await adminQuery<Array<{ result: CreateCredentialResult }>>(queryText, [
    principalKey,
    JSON.stringify(scopes),
    description,
    expiresAt,
    rotationParentId,
  ]);

  return rows[0].result;
}

export interface UpdateKeyParams {
  credentialId: string;
  description?: string;
  enabled?: boolean;
  expiresAt?: string | null;
  updateExpires?: boolean;
  scopes?: Partial<CredentialScope>[];
}

export async function updateAgentCredential(
  params: UpdateKeyParams,
): Promise<SafeCredentialMetadata> {
  const {
    credentialId,
    description = null,
    enabled = null,
    expiresAt = null,
    updateExpires = false,
    scopes = null,
  } = params;

  const queryText = `
    SELECT second_brain_security.update_agent_credential(
      $1, $2, $3, $4, $5, $6::jsonb
    ) AS result;
  `;

  const rows = await adminQuery<Array<{ result: SafeCredentialMetadata }>>(queryText, [
    credentialId,
    description,
    enabled,
    expiresAt,
    updateExpires,
    scopes ? JSON.stringify(scopes) : null,
  ]);

  return rows[0].result;
}

export interface RotateKeyParams {
  credentialId: string;
  replacementScopes?: Partial<CredentialScope>[] | null;
  replacementExpiresAt?: string | null;
  gracePeriodSeconds?: number | null;
}

export async function rotateAgentCredential(
  params: RotateKeyParams,
): Promise<CreateCredentialResult> {
  const {
    credentialId,
    replacementScopes = null,
    replacementExpiresAt = null,
    gracePeriodSeconds = null,
  } = params;

  const queryText = `
    SELECT second_brain_security.rotate_agent_credential(
      $1, $2::jsonb, $3, $4
    ) AS result;
  `;

  const rows = await adminQuery<Array<{ result: CreateCredentialResult }>>(queryText, [
    credentialId,
    replacementScopes ? JSON.stringify(replacementScopes) : null,
    replacementExpiresAt,
    gracePeriodSeconds,
  ]);

  return rows[0].result;
}

export async function regenerateAgentCredential(
  credentialId: string,
  gracePeriodSeconds = 0,
): Promise<CreateCredentialResult> {
  // Regenerate is an alias to rotation, preserving lineage and audit history
  return rotateAgentCredential({
    credentialId,
    gracePeriodSeconds,
  });
}

export async function revokeAgentCredential(credentialId: string): Promise<SafeCredentialMetadata> {
  const queryText = `
    SELECT second_brain_security.revoke_agent_credential($1) AS result;
  `;

  const rows = await adminQuery<Array<{ result: SafeCredentialMetadata }>>(queryText, [
    credentialId,
  ]);

  return rows[0].result;
}

export async function setAgentCredentialEnabled(
  credentialId: string,
  enabled: boolean,
): Promise<SafeCredentialMetadata> {
  const queryText = `
    SELECT second_brain_security.set_agent_credential_enabled($1, $2) AS result;
  `;

  const rows = await adminQuery<Array<{ result: SafeCredentialMetadata }>>(queryText, [
    credentialId,
    enabled,
  ]);

  return rows[0].result;
}

export async function getAgentCredentialSafe(
  credentialId: string,
): Promise<SafeCredentialMetadata> {
  const queryText = `
    SELECT second_brain_security.get_agent_credential_safe($1) AS result;
  `;

  const rows = await adminQuery<Array<{ result: SafeCredentialMetadata }>>(queryText, [
    credentialId,
  ]);

  return rows[0].result;
}

export async function listAgentCredentials(
  principalKey?: string,
): Promise<SafeCredentialMetadata[]> {
  const queryText = `
    SELECT second_brain_security.list_agent_credentials($1) AS result;
  `;

  const rows = await adminQuery<Array<{ result: SafeCredentialMetadata[] }>>(queryText, [
    principalKey || null,
  ]);

  return rows[0].result;
}
