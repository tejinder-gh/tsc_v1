-- ============================================================================
-- Migration 001: Dedicated Private Security Schema & Agent IAM Tables
-- Architecture: Database-native machine identity and authorization system
-- Principle: Agents NEVER receive direct DB access; security tables locked down
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

CREATE SCHEMA IF NOT EXISTS second_brain_security;

-- 1. Agent Principals (durable machine identity records)
CREATE TABLE IF NOT EXISTS second_brain_security.agent_principals (
    principal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    principal_key TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    enabled BOOLEAN NOT NULL DEFAULT true,
    principal_type TEXT NOT NULL DEFAULT 'agent',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    disabled_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_agent_principals_key ON second_brain_security.agent_principals(principal_key);
CREATE INDEX IF NOT EXISTS idx_agent_principals_enabled ON second_brain_security.agent_principals(enabled);

-- 2. Agent Credentials (cryptographic secrets; stores only digests)
CREATE TABLE IF NOT EXISTS second_brain_security.agent_credentials (
    credential_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    principal_id UUID NOT NULL REFERENCES second_brain_security.agent_principals(principal_id) ON DELETE CASCADE,
    key_id TEXT UNIQUE NOT NULL,
    secret_hash TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_rotated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    rotation_parent_id UUID REFERENCES second_brain_security.agent_credentials(credential_id) ON DELETE SET NULL,
    description TEXT
);

CREATE INDEX IF NOT EXISTS idx_agent_credentials_key_id ON second_brain_security.agent_credentials(key_id);
CREATE INDEX IF NOT EXISTS idx_agent_credentials_principal ON second_brain_security.agent_credentials(principal_id);
CREATE INDEX IF NOT EXISTS idx_agent_credentials_active ON second_brain_security.agent_credentials(enabled, revoked_at, expires_at);

-- 3. Agent Principal Grants (maximum capability ceiling for the identity)
CREATE TABLE IF NOT EXISTS second_brain_security.agent_principal_grants (
    grant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    principal_id UUID NOT NULL REFERENCES second_brain_security.agent_principals(principal_id) ON DELETE CASCADE,
    effect TEXT NOT NULL CHECK (effect IN ('ALLOW', 'DENY')),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_key TEXT NOT NULL,
    constraints JSONB,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    description TEXT
);

CREATE INDEX IF NOT EXISTS idx_agent_principal_grants_lookup ON second_brain_security.agent_principal_grants(principal_id, enabled, action, resource_type);
CREATE INDEX IF NOT EXISTS idx_agent_principal_grants_resource ON second_brain_security.agent_principal_grants(resource_key);

-- 4. Agent Credential Scopes (capability restrictions on a specific API key)
-- A credential scope can narrow the principal's authority, but never broaden it.
CREATE TABLE IF NOT EXISTS second_brain_security.agent_credential_scopes (
    scope_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credential_id UUID NOT NULL REFERENCES second_brain_security.agent_credentials(credential_id) ON DELETE CASCADE,
    effect TEXT NOT NULL CHECK (effect IN ('ALLOW', 'DENY')),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_key TEXT NOT NULL,
    constraints JSONB,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    description TEXT
);

CREATE INDEX IF NOT EXISTS idx_agent_credential_scopes_lookup ON second_brain_security.agent_credential_scopes(credential_id, enabled, action, resource_type);

-- 5. Agent Audit (tamper-evident audit trail for security events)
CREATE TABLE IF NOT EXISTS second_brain_security.agent_audit (
    audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    principal_id UUID REFERENCES second_brain_security.agent_principals(principal_id) ON DELETE SET NULL,
    credential_id UUID REFERENCES second_brain_security.agent_credentials(credential_id) ON DELETE SET NULL,
    request_id TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_key TEXT NOT NULL,
    decision TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_agent_audit_timestamp ON second_brain_security.agent_audit(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_agent_audit_principal ON second_brain_security.agent_audit(principal_id);
CREATE INDEX IF NOT EXISTS idx_agent_audit_decision ON second_brain_security.agent_audit(decision);
