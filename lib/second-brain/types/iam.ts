/**
 * Database-Native Agent IAM Types
 * Represents principal identity, credentials, scopes, grants, and authorization contexts.
 */

export interface Principal {
  id: string;
  key: string;
  displayName: string;
  principalType: "agent" | "service" | "operator";
}

export interface CredentialSummary {
  id: string;
  keyId: string;
  description: string | null;
  lastRotatedAt: string | null;
  expiresAt: string | null;
}

export interface GrantConstraints {
  domains?: string[];
  subdomains?: string[];
  allowedFields?: string[];
  automationKeys?: string[];
  resourceIds?: string[];
  [key: string]: unknown;
}

export interface PrincipalGrant {
  grantId: string;
  effect: "ALLOW" | "DENY";
  action: string;
  resourceType: string;
  resourceKey: string;
  constraints: GrantConstraints | null;
  expiresAt: string | null;
  description?: string | null;
}

export interface CredentialScope {
  scopeId: string;
  effect: "ALLOW" | "DENY";
  action: string;
  resourceType: string;
  resourceKey: string;
  constraints: GrantConstraints | null;
  expiresAt: string | null;
  description?: string | null;
}

export interface AuthenticatedContext {
  authenticated: boolean;
  principal: Principal;
  credential: CredentialSummary;
  principalGrants: PrincipalGrant[];
  credentialScopes: CredentialScope[];
}

export interface AuthorizeRequest {
  context: AuthenticatedContext;
  action: string;
  resourceType: string;
  resourceKey: string;
  evalContext?: {
    domain?: string;
    subdomain?: string;
    fields?: string[];
    jobKey?: string;
    resourceId?: string;
    [key: string]: unknown;
  };
}

export interface AuthorizeResult {
  authorized: boolean;
  decision: "ALLOW" | "DENY";
  reason?: string;
  allowedFields?: string[];
  matchedGrant?: PrincipalGrant;
  matchedScope?: CredentialScope;
}

export interface SafeCredentialMetadata {
  credentialId: string;
  keyId: string;
  principalId: string;
  principalKey: string;
  displayName: string;
  description: string | null;
  enabled: boolean;
  revoked: boolean;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string | null;
  lastRotatedAt: string | null;
  expiresAt: string | null;
  rotationParentId: string | null;
  scopes: CredentialScope[];
}

export interface CreateCredentialResult {
  credentialId: string;
  principalKey: string;
  keyId: string;
  secret: string;
  combinedKey: string;
  scopes: CredentialScope[];
  createdAt: string;
  expiresAt: string | null;
}
