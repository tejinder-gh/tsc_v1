-- ============================================================================
-- Migration 004: Provision Initial Machine Identities (Zero-Grant Starting State)
-- Principles:
-- - Provision only specified principals: chatgpt, claude, muse, automation-os, skill-corner-internal
-- - New principals start with ZERO effective permissions (Strict Default Deny)
-- - No speculative broad grants seeded
-- - Detailed declarative policies are managed in db/policies/*.json for user approval
-- ============================================================================

INSERT INTO second_brain_security.agent_principals (
    principal_key, display_name, description, principal_type, enabled
) VALUES
    ('chatgpt', 'ChatGPT', 'Machine identity for ChatGPT reasoning assistant', 'agent', true),
    ('claude', 'Claude', 'Machine identity for Claude strategy and architecture agent', 'agent', true),
    ('muse', 'Muse', 'Machine identity for Muse creative and social agent', 'agent', true),
    ('automation-os', 'Automation OS Runner', 'Machine identity for scheduled workflow dispatcher', 'service', true),
    ('skill-corner-internal', 'Skill Corner Internal', 'Machine identity for internal orchestrator and system operations', 'service', true)
ON CONFLICT (principal_key) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    enabled = EXCLUDED.enabled,
    updated_at = clock_timestamp();
