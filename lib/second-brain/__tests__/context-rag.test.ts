/**
 * Canonical Context RAG Test Suite
 * Validates search ranking algorithm and pre-query authorization enforcement.
 */

import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { POST } from "../../../app/api/internal/v1/context/search/route";
import { setMockQueryHandler } from "../db/client";
import { ContextRepository } from "../repositories/ContextRepository";

describe("Canonical Context RAG", () => {
  it("executes canonical ranking and fetches top resources", async () => {
    let capturedParams: any[] = [];
    setMockQueryHandler(async (text, params) => {
      capturedParams = params || [];
      return {
        rows: [
          {
            index_id: "idx-1",
            domain: "strategy",
            subdomain: "acquisition",
            summary: "M&A Diligence Playbook",
            priority: 10,
            is_primary: true,
            routing_keywords: ["m&a", "finance", "diligence"],
            resource_id: "res-1",
            resource_key: "playbook:mna",
            canonical_resource_key: "playbook:mna",
            title: "M&A Playbook",
            resource_type: "playbook",
            purpose: "Diligence process",
            access_mode: "read-only",
            source_page_url: "https://notion.so/mna",
            locations: [
              {
                locationId: "loc-1",
                provider: "notion",
                locator: "page-123",
                url: "https://notion.so/mna",
                role: "canonical",
                isCanonical: true,
              },
            ],
          },
        ],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      };
    });

    const results = await ContextRepository.searchContext({
      domain: "strategy",
      subdomain: "acquisition",
      keywords: ["finance", "diligence"],
      limit: 2,
    });

    expect(results).toHaveLength(1);
    expect(results[0].domain).toBe("strategy");
    expect(results[0].subdomain).toBe("acquisition");
    expect(results[0].resource.title).toBe("M&A Playbook");
    expect(results[0].resource.locations).toHaveLength(1);
    expect(capturedParams[0]).toBe("strategy");
    expect(capturedParams[1]).toBe("acquisition");
  });

  it("POST /api/internal/v1/context/search rejects unauthorized domain access with 403 Forbidden", async () => {
    // Authenticate with Claude key that only has access to domain:strategy
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: true,
            principal: {
              id: "p-claude",
              key: "claude",
              displayName: "Claude",
              principalType: "agent",
            },
            credential: {
              id: "c-1",
              keyId: "sb_live_claude_1",
              description: null,
              lastRotatedAt: null,
              expiresAt: null,
            },
            principalGrants: [
              {
                grantId: "g-strat",
                effect: "ALLOW",
                action: "context.read",
                resourceType: "SECOND_BRAIN_DOMAIN",
                resourceKey: "domain:strategy",
                constraints: { domains: ["strategy"] },
                expiresAt: null,
              },
            ],
            credentialScopes: [
              {
                scopeId: "s-strat",
                effect: "ALLOW",
                action: "context.read",
                resourceType: "SECOND_BRAIN_DOMAIN",
                resourceKey: "domain:strategy",
                constraints: { domains: ["strategy"] },
                expiresAt: null,
              },
            ],
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    // Claude attempts to search domain:private-financial-records
    const req = new NextRequest("http://localhost:3000/api/internal/v1/context/search", {
      method: "POST",
      headers: {
        authorization: "Bearer sb_live_claude_1.secret",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        domain: "private-financial-records",
        keywords: ["tax", "pnl"],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.code).toBe("FORBIDDEN");
  });
});
