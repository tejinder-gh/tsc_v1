/**
 * Canonical Context RAG Repository
 * Interacts with public.resource_context_index, public.resource_registry, and public.resource_locations.
 *
 * Algorithm:
 * domain + subdomain + keywords
 * → rank exact route
 * → is_primary
 * → priority
 * → keyword fit
 * → fetch top 1–2 canonical resources
 */

import { dbQuery } from "../db/client";

export interface ContextSearchResult {
  indexId: string;
  domain: string;
  subdomain: string;
  summary: string;
  priority: number;
  isPrimary: boolean;
  routingKeywords: string[];
  resource: {
    resourceId: string;
    resourceKey: string;
    canonicalResourceKey: string;
    title: string;
    resourceType: string;
    purpose: string | null;
    accessMode: string | null;
    sourcePageUrl: string | null;
    locations: Array<{
      locationId: string;
      provider: string | null;
      locator: string | null;
      url: string | null;
      role: string;
      isCanonical: boolean;
    }>;
  };
}

export interface SearchContextParams {
  domain: string;
  subdomain?: string;
  keywords?: string[];
  limit?: number;
}

export class ContextRepository {
  /**
   * Search canonical context index matching domain, subdomain, and keywords.
   * Authorization must be verified prior to calling or by passing authorized domains.
   */
  public static async searchContext(params: SearchContextParams): Promise<ContextSearchResult[]> {
    const { domain, subdomain = null, keywords = [], limit = 2 } = params;

    const queryText = `
      SELECT 
        ci.index_id,
        ci.domain,
        ci.subdomain,
        ci.summary,
        ci.priority,
        ci.is_primary,
        ci.routing_keywords,
        rr.resource_id,
        rr.resource_key,
        rr.canonical_resource_key,
        rr.title,
        rr.resource_type,
        rr.purpose,
        rr.access_mode,
        rr.source_page_url,
        coalesce(
          (
            SELECT jsonb_agg(
              jsonb_build_object(
                'locationId', rl.location_id,
                'provider', rl.provider,
                'locator', rl.locator,
                'url', rl.url,
                'role', rl.role,
                'isCanonical', rl.is_canonical
              )
            )
            FROM public.resource_locations rl
            WHERE rl.resource_id = rr.resource_id
          ),
          '[]'::jsonb
        ) AS locations
      FROM public.resource_context_index ci
      JOIN public.resource_registry rr ON ci.resource_id = rr.resource_id
      WHERE ci.enabled = true
        AND rr.enabled = true
        AND ci.domain = $1
        AND ($2::text IS NULL OR ci.subdomain = $2)
      ORDER BY
        CASE WHEN $2::text IS NOT NULL AND ci.subdomain = $2 THEN 0 ELSE 1 END,
        ci.is_primary DESC,
        ci.priority ASC,
        (
          SELECT count(*) 
          FROM unnest(ci.routing_keywords) k 
          WHERE k = ANY($3::text[])
        ) DESC
      LIMIT $4;
    `;

    const res = await dbQuery(queryText, [domain, subdomain, keywords, limit]);

    return res.rows.map((row) => ({
      indexId: row.index_id,
      domain: row.domain,
      subdomain: row.subdomain,
      summary: row.summary,
      priority: row.priority,
      isPrimary: row.is_primary,
      routingKeywords: row.routing_keywords || [],
      resource: {
        resourceId: row.resource_id,
        resourceKey: row.resource_key,
        canonicalResourceKey: row.canonical_resource_key,
        title: row.title,
        resourceType: row.resource_type,
        purpose: row.purpose,
        accessMode: row.access_mode,
        sourcePageUrl: row.source_page_url,
        locations: row.locations || [],
      },
    }));
  }
}
