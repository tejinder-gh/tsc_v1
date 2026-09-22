-- ============================================================================
-- Migration 003: Database Role Hardening & Least-Privilege Grants
-- Principles:
-- - neondb_owner: trusted administrator, owns all objects
-- - skill_corner_runtime: ordinary runtime role
--   - CANNOT SELECT/INSERT/UPDATE/DELETE on second_brain_security.*
--   - CANNOT access credential hashes or table internals
--   - CAN execute authenticate_agent, record_agent_audit
--   - CANNOT execute administrative credential lifecycle functions
--   - CAN SELECT canonical registries & configs in public
--   - CAN SELECT, INSERT, UPDATE occurrence & claim lifecycle tables in public
-- - PUBLIC: zero access to security schema & functions
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'skill_corner_runtime') THEN
        CREATE ROLE skill_corner_runtime WITH LOGIN PASSWORD 'change_this_runtime_secret_in_prod';
    END IF;
END
$$;

-- 1. Lock down PUBLIC permissions
REVOKE ALL ON SCHEMA second_brain_security FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA second_brain_security FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA second_brain_security FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA second_brain_security FROM PUBLIC;

-- 2. Lock down runtime role on second_brain_security tables
REVOKE ALL ON SCHEMA second_brain_security FROM skill_corner_runtime;
REVOKE SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER 
    ON ALL TABLES IN SCHEMA second_brain_security 
    FROM skill_corner_runtime;

-- 3. Grant schema USAGE and specific SECURITY DEFINER execution to runtime role
GRANT USAGE ON SCHEMA second_brain_security TO skill_corner_runtime;

GRANT EXECUTE ON FUNCTION second_brain_security.authenticate_agent(TEXT, TEXT) TO skill_corner_runtime;
GRANT EXECUTE ON FUNCTION second_brain_security.record_agent_audit(UUID, UUID, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) TO skill_corner_runtime;

-- Admin provisioning & lifecycle functions MUST NOT be executable by runtime role
REVOKE EXECUTE ON FUNCTION second_brain_security.create_agent_credential(TEXT, JSONB, TEXT, TIMESTAMPTZ, UUID) FROM skill_corner_runtime, PUBLIC;
REVOKE EXECUTE ON FUNCTION second_brain_security.update_agent_credential(UUID, TEXT, BOOLEAN, TIMESTAMPTZ, BOOLEAN, JSONB) FROM skill_corner_runtime, PUBLIC;
REVOKE EXECUTE ON FUNCTION second_brain_security.rotate_agent_credential(UUID, JSONB, TIMESTAMPTZ, INT) FROM skill_corner_runtime, PUBLIC;
REVOKE EXECUTE ON FUNCTION second_brain_security.revoke_agent_credential(UUID) FROM skill_corner_runtime, PUBLIC;
REVOKE EXECUTE ON FUNCTION second_brain_security.set_agent_credential_enabled(UUID, BOOLEAN) FROM skill_corner_runtime, PUBLIC;
REVOKE EXECUTE ON FUNCTION second_brain_security.get_agent_credential_safe(UUID) FROM skill_corner_runtime, PUBLIC;
REVOKE EXECUTE ON FUNCTION second_brain_security.list_agent_credentials(TEXT) FROM skill_corner_runtime, PUBLIC;

-- 4. Grant least privilege on canonical public schema
GRANT USAGE ON SCHEMA public TO skill_corner_runtime;

-- Read-only tables (SELECT only)
GRANT SELECT ON public.resource_context_index TO skill_corner_runtime;
GRANT SELECT ON public.resource_registry TO skill_corner_runtime;
GRANT SELECT ON public.resource_locations TO skill_corner_runtime;
GRANT SELECT ON public.resource_aliases TO skill_corner_runtime;
GRANT SELECT ON public.jobs_automation TO skill_corner_runtime;
GRANT SELECT ON public.schedules_automation TO skill_corner_runtime;
GRANT SELECT ON public.job_execution_policy_automation TO skill_corner_runtime;
GRANT SELECT ON public.job_dependencies_automation TO skill_corner_runtime;
GRANT SELECT ON public.job_targets_automation TO skill_corner_runtime;
GRANT SELECT ON public.job_prompt_refs_automation TO skill_corner_runtime;
GRANT SELECT ON public.job_report_delivery_automation TO skill_corner_runtime;

-- Lifecycle state execution (SELECT, INSERT, UPDATE)
GRANT SELECT, INSERT, UPDATE ON public.occurrences_automation TO skill_corner_runtime;
GRANT SELECT, INSERT, UPDATE ON public.execution_claims_automation TO skill_corner_runtime;
GRANT SELECT, INSERT, UPDATE ON public.occurrence_attempts_automation TO skill_corner_runtime;
GRANT SELECT, INSERT, UPDATE ON public.runner_cycles_automation TO skill_corner_runtime;
GRANT SELECT, INSERT, UPDATE ON public.runner_cycle_jobs_automation TO skill_corner_runtime;

-- Sequences in public
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO skill_corner_runtime;
