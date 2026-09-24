-- Migration 006: Relay Nonces Deduplication & Distributed Rate Limits Tables
-- Author: TheSkillCorner Security Architecture
-- Date: 2026-09-24

-- 1. Atomic Nonce Deduplication for SMS Relay (P0 Replay Protection)
CREATE TABLE IF NOT EXISTS public.relay_nonces (
  nonce_key VARCHAR(255) PRIMARY KEY,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_relay_nonces_expires_at ON public.relay_nonces (expires_at);

-- 2. Distributed Sliding Window Rate Limits for Public Ingestion APIs (P0 Abuse Protection)
CREATE TABLE IF NOT EXISTS public.rate_limits (
  limit_key VARCHAR(255) PRIMARY KEY,
  count INT NOT NULL DEFAULT 1,
  reset_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at ON public.rate_limits (reset_at);

-- 3. Grant Least-Privilege Access to Web Runtime Role (skill_corner_runtime)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'skill_corner_runtime') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.relay_nonces TO skill_corner_runtime;
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.rate_limits TO skill_corner_runtime;
  END IF;
END
$$;
