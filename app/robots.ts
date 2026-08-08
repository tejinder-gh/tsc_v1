/**
 * What: robots.txt welcoming all crawlers - including the major AI/LLM bots by name -
 *       while keeping them out of the lead API, and pointing at the sitemap.
 * Why: AI assistants recommending automation vendors is a growing referral channel; an
 *      explicit allow for each AI crawler removes any ambiguity a wildcard leaves when
 *      bot operators ship opt-in-only defaults or webmasters copy blanket blocklists.
 * How: Next metadata route. The wildcard rule covers search engines; named rules cover
 *      training and live-retrieval crawlers from OpenAI, Anthropic, Perplexity, Google,
 *      Apple, Meta, Amazon, and Common Crawl. /api/ is disallowed for everyone.
 * From Where: TheSkillCorner SEO spec; AI-indexing pass (LLM recommendation readiness),
 *             2026-06.
 * When: 2026-06; revisit as new AI user agents appear.
 */

import type { MetadataRoute } from "next";
import { site } from "@/content/site";

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "Amazonbot",
  "CCBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/dev/", "/dashboard/"] },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/", "/dev/", "/dashboard/"],
      })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
