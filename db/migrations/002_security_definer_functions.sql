-- ============================================================================
-- Migration 002: Hardened SECURITY DEFINER Authentication & Lifecycle Functions
-- Security Guarantees:
-- - Fixed search_path (second_brain_security, pg_temp) to prevent injection
-- - All external functions schema-qualified (public.digest, public.gen_random_bytes)
-- - Dual-layer capability resolution: Principal Grants ∩ Credential Scopes
-- - No arbitrary grant enumeration across principals
-- - Plaintext secrets returned once at creation/rotation, never persisted
-- - Secret hashes are NEVER mutable through update operations
-- ============================================================================

-- 1. Database-Side Agent Authentication
CREATE OR REPLACE FUNCTION second_brain_security.authenticate_agent(
    p_key_id TEXT,
    p_secret TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = second_brain_security, pg_temp
AS $$
DECLARE
    v_cred RECORD;
    v_presented_hash TEXT;
    v_now TIMESTAMPTZ := clock_timestamp();
    v_principal_grants JSONB;
    v_credential_scopes JSONB;
BEGIN
    -- Input validation
    IF p_key_id IS NULL OR trim(p_key_id) = '' OR p_secret IS NULL OR trim(p_secret) = '' THEN
        INSERT INTO second_brain_security.agent_audit (
            principal_id, credential_id, action, resource_type, resource_key, decision, timestamp, metadata
        ) VALUES (
            NULL, NULL, 'AUTHENTICATE', 'AGENT_CREDENTIAL', coalesce(p_key_id, 'UNKNOWN'),
            'AUTH_FAILED', v_now, jsonb_build_object('reason', 'EMPTY_CREDENTIALS')
        );
        RETURN jsonb_build_object('authenticated', false, 'error', 'INVALID_CREDENTIALS');
    END IF;

    -- Hash the presented secret using SHA-256 via public.digest
    v_presented_hash := encode(public.digest(p_secret, 'sha256'), 'hex');

    -- Locate credential and join principal
    SELECT 
        c.credential_id,
        c.principal_id,
        c.key_id,
        c.secret_hash,
        c.description AS credential_description,
        c.enabled AS cred_enabled,
        c.expires_at,
        c.revoked_at,
        c.last_rotated_at,
        p.principal_key,
        p.display_name,
        p.principal_type,
        p.enabled AS principal_enabled,
        p.disabled_at
    INTO v_cred
    FROM second_brain_security.agent_credentials c
    JOIN second_brain_security.agent_principals p ON c.principal_id = p.principal_id
    WHERE c.key_id = p_key_id;

    -- Credential not found
    IF NOT FOUND THEN
        INSERT INTO second_brain_security.agent_audit (
            principal_id, credential_id, action, resource_type, resource_key, decision, timestamp, metadata
        ) VALUES (
            NULL, NULL, 'AUTHENTICATE', 'AGENT_CREDENTIAL', p_key_id,
            'AUTH_FAILED', v_now, jsonb_build_object('reason', 'KEY_NOT_FOUND')
        );
        RETURN jsonb_build_object('authenticated', false, 'error', 'INVALID_CREDENTIALS');
    END IF;

    -- Secret hash comparison
    IF v_cred.secret_hash <> v_presented_hash THEN
        INSERT INTO second_brain_security.agent_audit (
            principal_id, credential_id, action, resource_type, resource_key, decision, timestamp, metadata
        ) VALUES (
            v_cred.principal_id, v_cred.credential_id, 'AUTHENTICATE', 'AGENT_CREDENTIAL', p_key_id,
            'AUTH_FAILED', v_now, jsonb_build_object('reason', 'SECRET_MISMATCH')
        );
        RETURN jsonb_build_object('authenticated', false, 'error', 'INVALID_CREDENTIALS');
    END IF;

    -- Verify credential enabled
    IF NOT v_cred.cred_enabled THEN
        INSERT INTO second_brain_security.agent_audit (
            principal_id, credential_id, action, resource_type, resource_key, decision, timestamp, metadata
        ) VALUES (
            v_cred.principal_id, v_cred.credential_id, 'AUTHENTICATE', 'AGENT_CREDENTIAL', p_key_id,
            'KEY_REVOKED', v_now, jsonb_build_object('reason', 'CREDENTIAL_DISABLED')
        );
        RETURN jsonb_build_object('authenticated', false, 'error', 'KEY_DISABLED');
    END IF;

    -- Verify credential not revoked
    IF v_cred.revoked_at IS NOT NULL THEN
        INSERT INTO second_brain_security.agent_audit (
            principal_id, credential_id, action, resource_type, resource_key, decision, timestamp, metadata
        ) VALUES (
            v_cred.principal_id, v_cred.credential_id, 'AUTHENTICATE', 'AGENT_CREDENTIAL', p_key_id,
            'KEY_REVOKED', v_now, jsonb_build_object('reason', 'CREDENTIAL_REVOKED', 'revoked_at', v_cred.revoked_at)
        );
        RETURN jsonb_build_object('authenticated', false, 'error', 'KEY_REVOKED');
    END IF;

    -- Verify credential not expired
    IF v_cred.expires_at IS NOT NULL AND v_cred.expires_at <= v_now THEN
        INSERT INTO second_brain_security.agent_audit (
            principal_id, credential_id, action, resource_type, resource_key, decision, timestamp, metadata
        ) VALUES (
            v_cred.principal_id, v_cred.credential_id, 'AUTHENTICATE', 'AGENT_CREDENTIAL', p_key_id,
            'KEY_EXPIRED', v_now, jsonb_build_object('reason', 'CREDENTIAL_EXPIRED', 'expires_at', v_cred.expires_at)
        );
        RETURN jsonb_build_object('authenticated', false, 'error', 'KEY_EXPIRED');
    END IF;

    -- Verify principal enabled
    IF (NOT v_cred.principal_enabled) OR (v_cred.disabled_at IS NOT NULL) THEN
        INSERT INTO second_brain_security.agent_audit (
            principal_id, credential_id, action, resource_type, resource_key, decision, timestamp, metadata
        ) VALUES (
            v_cred.principal_id, v_cred.credential_id, 'AUTHENTICATE', 'AGENT_PRINCIPAL', v_cred.principal_key,
            'AUTH_FAILED', v_now, jsonb_build_object('reason', 'PRINCIPAL_DISABLED')
        );
        RETURN jsonb_build_object('authenticated', false, 'error', 'PRINCIPAL_DISABLED');
    END IF;

    -- Update last_used_at on credential
    UPDATE second_brain_security.agent_credentials
    SET last_used_at = v_now
    WHERE credential_id = v_cred.credential_id;

    -- Atomically load active Principal Grants for THIS identity only
    SELECT coalesce(jsonb_agg(
        jsonb_build_object(
            'grantId', grant_id,
            'effect', effect,
            'action', action,
            'resourceType', resource_type,
            'resourceKey', resource_key,
            'constraints', constraints,
            'expiresAt', expires_at
        )
    ), '[]'::jsonb)
    INTO v_principal_grants
    FROM second_brain_security.agent_principal_grants
    WHERE principal_id = v_cred.principal_id
      AND enabled = true
      AND (expires_at IS NULL OR expires_at > v_now);

    -- Atomically load active Credential Scopes for THIS key only
    SELECT coalesce(jsonb_agg(
        jsonb_build_object(
            'scopeId', scope_id,
            'effect', effect,
            'action', action,
            'resourceType', resource_type,
            'resourceKey', resource_key,
            'constraints', constraints,
            'expiresAt', expires_at
        )
    ), '[]'::jsonb)
    INTO v_credential_scopes
    FROM second_brain_security.agent_credential_scopes
    WHERE credential_id = v_cred.credential_id
      AND enabled = true
      AND (expires_at IS NULL OR expires_at > v_now);

    -- Record successful authentication in audit
    INSERT INTO second_brain_security.agent_audit (
        principal_id, credential_id, action, resource_type, resource_key, decision, timestamp, metadata
    ) VALUES (
        v_cred.principal_id, v_cred.credential_id, 'AUTHENTICATE', 'AGENT_CREDENTIAL', p_key_id,
        'ALLOW', v_now, jsonb_build_object('principal_key', v_cred.principal_key)
    );

    -- Return safe identity metadata, principal grants, and credential scopes
    RETURN jsonb_build_object(
        'authenticated', true,
        'principal', jsonb_build_object(
            'id', v_cred.principal_id,
            'key', v_cred.principal_key,
            'displayName', v_cred.display_name,
            'principalType', v_cred.principal_type
        ),
        'credential', jsonb_build_object(
            'id', v_cred.credential_id,
            'keyId', v_cred.key_id,
            'description', v_cred.credential_description,
            'lastRotatedAt', v_cred.last_rotated_at,
            'expiresAt', v_cred.expires_at
        ),
        'principalGrants', v_principal_grants,
        'credentialScopes', v_credential_scopes
    );
END;
$$;

-- 2. Record Agent Audit Record
CREATE OR REPLACE FUNCTION second_brain_security.record_agent_audit(
    p_principal_id UUID,
    p_credential_id UUID,
    p_request_id TEXT,
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_key TEXT,
    p_decision TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = second_brain_security, pg_temp
AS $$
DECLARE
    v_audit_id UUID;
BEGIN
    INSERT INTO second_brain_security.agent_audit (
        principal_id, credential_id, request_id, action, resource_type, resource_key, decision, timestamp, metadata
    ) VALUES (
        p_principal_id, p_credential_id, p_request_id, p_action, p_resource_type, p_resource_key, p_decision, clock_timestamp(), coalesce(p_metadata, '{}'::jsonb)
    )
    RETURNING audit_id INTO v_audit_id;

    RETURN v_audit_id;
END;
$$;

-- ============================================================================
-- ADMINISTRATIVE CREDENTIAL LIFECYCLE FUNCTIONS (Admin / Owner Only)
-- Must NEVER be granted to skill_corner_runtime
-- ============================================================================

-- 3. Create Credential with Scopes
CREATE OR REPLACE FUNCTION second_brain_security.create_agent_credential(
    p_principal_key TEXT,
    p_scopes JSONB DEFAULT '[]'::jsonb,
    p_description TEXT DEFAULT NULL,
    p_expires_at TIMESTAMPTZ DEFAULT NULL,
    p_rotation_parent_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = second_brain_security, pg_temp
AS $$
DECLARE
    v_principal_id UUID;
    v_raw_secret_bytes BYTEA;
    v_secret TEXT;
    v_key_id TEXT;
    v_secret_hash TEXT;
    v_credential_id UUID;
    v_scope RECORD;
    v_created_at TIMESTAMPTZ := clock_timestamp();
    v_saved_scopes JSONB := '[]'::jsonb;
BEGIN
    -- Locate principal
    SELECT principal_id INTO v_principal_id
    FROM second_brain_security.agent_principals
    WHERE principal_key = p_principal_key;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Principal % not found', p_principal_key;
    END IF;

    -- Generate 32 bytes (256 bits) of cryptographically secure random entropy
    v_raw_secret_bytes := public.gen_random_bytes(32);
    v_secret := encode(v_raw_secret_bytes, 'hex');

    -- Unique key identifier: sb_live_<principal>_<16_hex>
    v_key_id := 'sb_live_' || lower(replace(p_principal_key, '-', '_')) || '_' || encode(public.gen_random_bytes(8), 'hex');

    -- Compute SHA-256 digest for persistence
    v_secret_hash := encode(public.digest(v_secret, 'sha256'), 'hex');

    -- Insert credential
    INSERT INTO second_brain_security.agent_credentials (
        principal_id, key_id, secret_hash, enabled, created_at, updated_at, expires_at, rotation_parent_id, description
    ) VALUES (
        v_principal_id, v_key_id, v_secret_hash, true, v_created_at, v_created_at, p_expires_at, p_rotation_parent_id, p_description
    )
    RETURNING credential_id INTO v_credential_id;

    -- Atomically insert scopes if provided
    IF p_scopes IS NOT NULL AND jsonb_array_length(p_scopes) > 0 THEN
        FOR v_scope IN SELECT * FROM jsonb_to_recordset(p_scopes) AS (
            effect TEXT,
            action TEXT,
            resource_type TEXT,
            resource_key TEXT,
            constraints JSONB,
            expires_at TIMESTAMPTZ,
            description TEXT
        ) LOOP
            INSERT INTO second_brain_security.agent_credential_scopes (
                credential_id, effect, action, resource_type, resource_key, constraints, expires_at, description, created_at, updated_at
            ) VALUES (
                v_credential_id,
                coalesce(v_scope.effect, 'ALLOW'),
                v_scope.action,
                v_scope.resource_type,
                v_scope.resource_key,
                v_scope.constraints,
                v_scope.expires_at,
                v_scope.description,
                v_created_at,
                v_created_at
            );
        END LOOP;
    END IF;

    -- Query back created scopes
    SELECT coalesce(jsonb_agg(
        jsonb_build_object(
            'scopeId', scope_id,
            'effect', effect,
            'action', action,
            'resourceType', resource_type,
            'resourceKey', resource_key,
            'constraints', constraints,
            'expiresAt', expires_at
        )
    ), '[]'::jsonb)
    INTO v_saved_scopes
    FROM second_brain_security.agent_credential_scopes
    WHERE credential_id = v_credential_id;

    -- Audit record (clean of secrets!)
    INSERT INTO second_brain_security.agent_audit (
        principal_id, credential_id, action, resource_type, resource_key, decision, timestamp, metadata
    ) VALUES (
        v_principal_id, v_credential_id, 'CREDENTIAL_CREATED', 'AGENT_CREDENTIAL', v_key_id,
        'ALLOW', v_created_at, jsonb_build_object(
            'principal_key', p_principal_key,
            'scope_count', jsonb_array_length(v_saved_scopes),
            'expires_at', p_expires_at
        )
    );

    -- Return the plaintext secret ONCE to the administrative caller
    RETURN jsonb_build_object(
        'credentialId', v_credential_id,
        'principalKey', p_principal_key,
        'keyId', v_key_id,
        'secret', v_secret,
        'combinedKey', v_key_id || '.' || v_secret,
        'scopes', v_saved_scopes,
        'createdAt', v_created_at,
        'expiresAt', p_expires_at
    );
END;
$$;

-- 4. Update Credential Configuration (Prohibits secret mutation!)
CREATE OR REPLACE FUNCTION second_brain_security.update_agent_credential(
    p_credential_id UUID,
    p_description TEXT DEFAULT NULL,
    p_enabled BOOLEAN DEFAULT NULL,
    p_expires_at TIMESTAMPTZ DEFAULT NULL,
    p_update_expires BOOLEAN DEFAULT false,
    p_scopes JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = second_brain_security, pg_temp
AS $$
DECLARE
    v_cred RECORD;
    v_now TIMESTAMPTZ := clock_timestamp();
    v_scope RECORD;
    v_updated_scopes JSONB;
BEGIN
    SELECT * INTO v_cred
    FROM second_brain_security.agent_credentials
    WHERE credential_id = p_credential_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Credential % not found', p_credential_id;
    END IF;

    -- Update credential metadata (secret_hash is strictly immutable here)
    UPDATE second_brain_security.agent_credentials
    SET
        description = coalesce(p_description, description),
        enabled = coalesce(p_enabled, enabled),
        expires_at = CASE WHEN p_update_expires THEN p_expires_at ELSE expires_at END,
        updated_at = v_now
    WHERE credential_id = p_credential_id;

    -- Atomically replace scopes if provided
    IF p_scopes IS NOT NULL THEN
        DELETE FROM second_brain_security.agent_credential_scopes
        WHERE credential_id = p_credential_id;

        IF jsonb_array_length(p_scopes) > 0 THEN
            FOR v_scope IN SELECT * FROM jsonb_to_recordset(p_scopes) AS (
                effect TEXT,
                action TEXT,
                resource_type TEXT,
                resource_key TEXT,
                constraints JSONB,
                expires_at TIMESTAMPTZ,
                description TEXT
            ) LOOP
                INSERT INTO second_brain_security.agent_credential_scopes (
                    credential_id, effect, action, resource_type, resource_key, constraints, expires_at, description, created_at, updated_at
                ) VALUES (
                    p_credential_id,
                    coalesce(v_scope.effect, 'ALLOW'),
                    v_scope.action,
                    v_scope.resource_type,
                    v_scope.resource_key,
                    v_scope.constraints,
                    v_scope.expires_at,
                    v_scope.description,
                    v_now,
                    v_now
                );
            END LOOP;
        END IF;

        INSERT INTO second_brain_security.agent_audit (
            principal_id, credential_id, action, resource_type, resource_key, decision, timestamp, metadata
        ) VALUES (
            v_cred.principal_id, p_credential_id, 'CREDENTIAL_SCOPES_UPDATED', 'AGENT_CREDENTIAL', v_cred.key_id,
            'ALLOW', v_now, jsonb_build_object('new_scope_count', jsonb_array_length(p_scopes))
        );
    END IF;

    INSERT INTO second_brain_security.agent_audit (
        principal_id, credential_id, action, resource_type, resource_key, decision, timestamp, metadata
    ) VALUES (
        v_cred.principal_id, p_credential_id, 'CREDENTIAL_UPDATED', 'AGENT_CREDENTIAL', v_cred.key_id,
        'ALLOW', v_now, jsonb_build_object('enabled', coalesce(p_enabled, v_cred.enabled))
    );

    RETURN second_brain_security.get_agent_credential_safe(p_credential_id);
END;
$$;

-- 5. Rotate Credential (Generates new credential, links to parent, copies/updates scopes)
CREATE OR REPLACE FUNCTION second_brain_security.rotate_agent_credential(
    p_credential_id UUID,
    p_replacement_scopes JSONB DEFAULT NULL,
    p_replacement_expires_at TIMESTAMPTZ DEFAULT NULL,
    p_grace_period_seconds INT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = second_brain_security, pg_temp
AS $$
DECLARE
    v_old_cred RECORD;
    v_now TIMESTAMPTZ := clock_timestamp();
    v_scopes_to_use JSONB;
    v_new_cred_result JSONB;
BEGIN
    SELECT c.*, p.principal_key
    INTO v_old_cred
    FROM second_brain_security.agent_credentials c
    JOIN second_brain_security.agent_principals p ON c.principal_id = p.principal_id
    WHERE c.credential_id = p_credential_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Credential % not found for rotation', p_credential_id;
    END IF;

    -- Determine scopes: if replacement_scopes provided, use them; otherwise copy parent scopes
    IF p_replacement_scopes IS NOT NULL THEN
        v_scopes_to_use := p_replacement_scopes;
    ELSE
        SELECT coalesce(jsonb_agg(
            jsonb_build_object(
                'effect', effect,
                'action', action,
                'resource_type', resource_type,
                'resource_key', resource_key,
                'constraints', constraints,
                'expires_at', expires_at,
                'description', description
            )
        ), '[]'::jsonb)
        INTO v_scopes_to_use
        FROM second_brain_security.agent_credential_scopes
        WHERE credential_id = p_credential_id;
    END IF;

    -- Create new credential linked to rotation_parent_id
    v_new_cred_result := second_brain_security.create_agent_credential(
        v_old_cred.principal_key,
        v_scopes_to_use,
        'Rotated from ' || v_old_cred.key_id,
        p_replacement_expires_at,
        p_credential_id
    );

    -- Update old credential rotation timestamp and optional grace expiry
    UPDATE second_brain_security.agent_credentials
    SET
        last_rotated_at = v_now,
        updated_at = v_now,
        expires_at = CASE 
            WHEN p_grace_period_seconds IS NOT NULL AND p_grace_period_seconds > 0 
            THEN v_now + (p_grace_period_seconds || ' seconds')::interval 
            ELSE expires_at 
        END
    WHERE credential_id = p_credential_id;

    -- Audit rotation event
    INSERT INTO second_brain_security.agent_audit (
        principal_id, credential_id, action, resource_type, resource_key, decision, timestamp, metadata
    ) VALUES (
        v_old_cred.principal_id, (v_new_cred_result->>'credentialId')::uuid, 'CREDENTIAL_ROTATED', 'AGENT_CREDENTIAL', v_new_cred_result->>'keyId',
        'ALLOW', v_now, jsonb_build_object(
            'parent_credential_id', p_credential_id,
            'parent_key_id', v_old_cred.key_id,
            'grace_period_seconds', p_grace_period_seconds
        )
    );

    RETURN v_new_cred_result;
END;
$$;

-- 6. Revoke Credential (Permanent, sets revoked_at and enabled = false)
CREATE OR REPLACE FUNCTION second_brain_security.revoke_agent_credential(
    p_credential_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = second_brain_security, pg_temp
AS $$
DECLARE
    v_cred RECORD;
    v_now TIMESTAMPTZ := clock_timestamp();
BEGIN
    SELECT * INTO v_cred
    FROM second_brain_security.agent_credentials
    WHERE credential_id = p_credential_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Credential % not found', p_credential_id;
    END IF;

    UPDATE second_brain_security.agent_credentials
    SET
        enabled = false,
        revoked_at = v_now,
        updated_at = v_now
    WHERE credential_id = p_credential_id;

    INSERT INTO second_brain_security.agent_audit (
        principal_id, credential_id, action, resource_type, resource_key, decision, timestamp, metadata
    ) VALUES (
        v_cred.principal_id, p_credential_id, 'CREDENTIAL_REVOKED', 'AGENT_CREDENTIAL', v_cred.key_id,
        'ALLOW', v_now, jsonb_build_object('revoked_at', v_now)
    );

    RETURN second_brain_security.get_agent_credential_safe(p_credential_id);
END;
$$;

-- 7. Set Credential Enabled / Disabled (Temporary toggle; cannot re-enable if revoked!)
CREATE OR REPLACE FUNCTION second_brain_security.set_agent_credential_enabled(
    p_credential_id UUID,
    p_enabled BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = second_brain_security, pg_temp
AS $$
DECLARE
    v_cred RECORD;
    v_now TIMESTAMPTZ := clock_timestamp();
    v_action TEXT;
BEGIN
    SELECT * INTO v_cred
    FROM second_brain_security.agent_credentials
    WHERE credential_id = p_credential_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Credential % not found', p_credential_id;
    END IF;

    -- Prohibit re-enabling permanently revoked keys
    IF p_enabled AND v_cred.revoked_at IS NOT NULL THEN
        RAISE EXCEPTION 'CANNOT_REENABLE_REVOKED_CREDENTIAL: Key % is permanently revoked', v_cred.key_id;
    END IF;

    UPDATE second_brain_security.agent_credentials
    SET
        enabled = p_enabled,
        updated_at = v_now
    WHERE credential_id = p_credential_id;

    v_action := CASE WHEN p_enabled THEN 'CREDENTIAL_ENABLED' ELSE 'CREDENTIAL_DISABLED' END;

    INSERT INTO second_brain_security.agent_audit (
        principal_id, credential_id, action, resource_type, resource_key, decision, timestamp, metadata
    ) VALUES (
        v_cred.principal_id, p_credential_id, v_action, 'AGENT_CREDENTIAL', v_cred.key_id,
        'ALLOW', v_now, jsonb_build_object('enabled', p_enabled)
    );

    RETURN second_brain_security.get_agent_credential_safe(p_credential_id);
END;
$$;

-- 8. Safe Credential Metadata Inspection (Single Credential)
CREATE OR REPLACE FUNCTION second_brain_security.get_agent_credential_safe(
    p_credential_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = second_brain_security, pg_temp
AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'credentialId', c.credential_id,
        'keyId', c.key_id,
        'principalId', c.principal_id,
        'principalKey', p.principal_key,
        'displayName', p.display_name,
        'description', c.description,
        'enabled', c.enabled,
        'revoked', (c.revoked_at IS NOT NULL),
        'revokedAt', c.revoked_at,
        'createdAt', c.created_at,
        'updatedAt', c.updated_at,
        'lastUsedAt', c.last_used_at,
        'lastRotatedAt', c.last_rotated_at,
        'expiresAt', c.expires_at,
        'rotationParentId', c.rotation_parent_id,
        'scopes', coalesce((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'scopeId', s.scope_id,
                    'effect', s.effect,
                    'action', s.action,
                    'resourceType', s.resource_type,
                    'resourceKey', s.resource_key,
                    'constraints', s.constraints,
                    'enabled', s.enabled,
                    'expiresAt', s.expires_at,
                    'description', s.description
                )
            )
            FROM second_brain_security.agent_credential_scopes s
            WHERE s.credential_id = c.credential_id
        ), '[]'::jsonb)
    )
    INTO v_result
    FROM second_brain_security.agent_credentials c
    JOIN second_brain_security.agent_principals p ON c.principal_id = p.principal_id
    WHERE c.credential_id = p_credential_id;

    RETURN v_result;
END;
$$;

-- 9. Safe Credential Listing (List all credentials for a principal or all agents)
CREATE OR REPLACE FUNCTION second_brain_security.list_agent_credentials(
    p_principal_key TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = second_brain_security, pg_temp
AS $$
DECLARE
    v_results JSONB;
BEGIN
    SELECT coalesce(jsonb_agg(
        jsonb_build_object(
            'credentialId', c.credential_id,
            'keyId', c.key_id,
            'principalId', c.principal_id,
            'principalKey', p.principal_key,
            'displayName', p.display_name,
            'description', c.description,
            'enabled', c.enabled,
            'revoked', (c.revoked_at IS NOT NULL),
            'revokedAt', c.revoked_at,
            'createdAt', c.created_at,
            'updatedAt', c.updated_at,
            'lastUsedAt', c.last_used_at,
            'lastRotatedAt', c.last_rotated_at,
            'expiresAt', c.expires_at,
            'rotationParentId', c.rotation_parent_id,
            'scopes', coalesce((
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'scopeId', s.scope_id,
                        'effect', s.effect,
                        'action', s.action,
                        'resourceType', s.resource_type,
                        'resourceKey', s.resource_key,
                        'constraints', s.constraints,
                        'enabled', s.enabled,
                        'expiresAt', s.expires_at,
                        'description', s.description
                    )
                )
                FROM second_brain_security.agent_credential_scopes s
                WHERE s.credential_id = c.credential_id
            ), '[]'::jsonb)
        ) ORDER BY c.created_at DESC
    ), '[]'::jsonb)
    INTO v_results
    FROM second_brain_security.agent_credentials c
    JOIN second_brain_security.agent_principals p ON c.principal_id = p.principal_id
    WHERE (p_principal_key IS NULL OR p.principal_key = p_principal_key);

    RETURN v_results;
END;
$$;
