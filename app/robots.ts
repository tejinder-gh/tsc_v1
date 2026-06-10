/**
 * What: robots.txt allowing all crawlers and pointing at the sitemap.
 * Why: Standard SEO plumbing required by the brief.
 * How: Next metadata route.
 * From Where: TheSkillCorner marketing site build brief (SEO spec), 2026-06.
 * When: 2026-06.
 */

import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
