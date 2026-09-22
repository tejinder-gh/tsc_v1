/**
 * Central Authorization Engine
 * Enforces the strict invariant:
 * Principal Grants ∩ Credential Scopes ∩ Action ∩ Resource ∩ Constraints = Effective Access
 *
 * Rules:
 * 1. Default Deny: If not explicitly authorized at BOTH layers, denied.
 * 2. Explicit Deny Overrides Allow: DENY in either principal grant or credential scope strictly denies.
 * 3. Credential scopes can narrow principal grants, but never broaden them.
 * 4. Field-level mutations strictly enforce allowedFields constraints.
 */

import type {
  AuthorizeRequest,
  AuthorizeResult,
  CredentialScope,
  GrantConstraints,
  PrincipalGrant,
} from "../types/iam";

function matchesAction(ruleAction: string, requestedAction: string): boolean {
  if (ruleAction === "*") return true;
  if (ruleAction === requestedAction) return true;

  if (ruleAction.endsWith(".*")) {
    const prefix = ruleAction.slice(0, -2);
    if (requestedAction.startsWith(`${prefix}.`)) return true;
  }

  return false;
}

function matchesResource(
  ruleType: string,
  ruleKey: string,
  requestedType: string,
  requestedKey: string,
): boolean {
  const typeMatches = ruleType === "*" || ruleType === requestedType;
  if (!typeMatches) return false;

  if (ruleKey === "*") return true;
  if (ruleKey === requestedKey) return true;

  if (ruleKey.endsWith("*")) {
    const prefix = ruleKey.slice(0, -1);
    if (requestedKey.startsWith(prefix)) return true;
  }

  return false;
}

function evaluateConstraints(
  constraints: GrantConstraints | null | undefined,
  evalContext: AuthorizeRequest["evalContext"],
): { valid: boolean; reason?: string; allowedFields?: string[] } {
  if (!constraints) return { valid: true };

  // 1. Domain constraint
  if (constraints.domains && constraints.domains.length > 0 && evalContext?.domain) {
    if (!constraints.domains.includes(evalContext.domain)) {
      return {
        valid: false,
        reason: `Domain '${evalContext.domain}' is not in permitted list: [${constraints.domains.join(", ")}]`,
      };
    }
  }

  // 2. Subdomain constraint
  if (constraints.subdomains && constraints.subdomains.length > 0 && evalContext?.subdomain) {
    if (!constraints.subdomains.includes(evalContext.subdomain)) {
      return {
        valid: false,
        reason: `Subdomain '${evalContext.subdomain}' is not in permitted list: [${constraints.subdomains.join(", ")}]`,
      };
    }
  }

  // 3. Column/Field constraint for mutations
  if (constraints.allowedFields && evalContext?.fields && evalContext.fields.length > 0) {
    const allowed = new Set(constraints.allowedFields);
    for (const field of evalContext.fields) {
      if (!allowed.has(field)) {
        return {
          valid: false,
          reason: `Field '${field}' is not permitted. Allowed fields: [${constraints.allowedFields.join(", ")}]`,
          allowedFields: constraints.allowedFields,
        };
      }
    }
  }

  return { valid: true, allowedFields: constraints.allowedFields };
}

export function authorize(req: AuthorizeRequest): AuthorizeResult {
  const { context, action, resourceType, resourceKey, evalContext } = req;
  const { principalGrants, credentialScopes } = context;

  // 1. Check for ANY explicit DENY at the Principal level
  for (const grant of principalGrants) {
    if (grant.effect === "DENY") {
      if (
        matchesAction(grant.action, action) &&
        matchesResource(grant.resourceType, grant.resourceKey, resourceType, resourceKey)
      ) {
        return {
          authorized: false,
          decision: "DENY",
          reason: `Explicit DENY in principal grant: ${grant.description || grant.action}`,
        };
      }
    }
  }

  // 2. Check for ANY explicit DENY at the Credential Scope level
  for (const scope of credentialScopes) {
    if (scope.effect === "DENY") {
      if (
        matchesAction(scope.action, action) &&
        matchesResource(scope.resourceType, scope.resourceKey, resourceType, resourceKey)
      ) {
        return {
          authorized: false,
          decision: "DENY",
          reason: `Explicit DENY in credential scope: ${scope.description || scope.action}`,
        };
      }
    }
  }

  // 3. Find matching ALLOW grant at the Principal level
  let matchedGrant: PrincipalGrant | undefined;
  let principalConstraintError: string | undefined;

  for (const grant of principalGrants) {
    if (grant.effect === "ALLOW") {
      if (
        matchesAction(grant.action, action) &&
        matchesResource(grant.resourceType, grant.resourceKey, resourceType, resourceKey)
      ) {
        const constraintCheck = evaluateConstraints(grant.constraints, evalContext);
        if (constraintCheck.valid) {
          matchedGrant = grant;
          break;
        } else {
          principalConstraintError = constraintCheck.reason;
        }
      }
    }
  }

  if (!matchedGrant) {
    return {
      authorized: false,
      decision: "DENY",
      reason:
        principalConstraintError ||
        `No matching principal grant authorizes action '${action}' on ${resourceType}:${resourceKey}`,
    };
  }

  // 4. Find matching ALLOW scope at the Credential Scope level
  let matchedScope: CredentialScope | undefined;
  let finalAllowedFields: string[] | undefined;

  for (const scope of credentialScopes) {
    if (scope.effect === "ALLOW") {
      if (
        matchesAction(scope.action, action) &&
        matchesResource(scope.resourceType, scope.resourceKey, resourceType, resourceKey)
      ) {
        const constraintCheck = evaluateConstraints(scope.constraints, evalContext);
        if (constraintCheck.valid) {
          matchedScope = scope;
          finalAllowedFields = constraintCheck.allowedFields;
          break;
        } else {
          return {
            authorized: false,
            decision: "DENY",
            reason: constraintCheck.reason,
            allowedFields: constraintCheck.allowedFields,
          };
        }
      }
    }
  }

  if (!matchedScope) {
    return {
      authorized: false,
      decision: "DENY",
      reason: `Credential scope does not permit action '${action}' on ${resourceType}:${resourceKey} (key cannot exceed assigned scopes)`,
    };
  }

  // Intersection successful: Both principal AND credential scope ALLOW the action
  return {
    authorized: true,
    decision: "ALLOW",
    matchedGrant,
    matchedScope,
    allowedFields: finalAllowedFields,
  };
}
