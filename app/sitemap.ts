/**
 * What: sitemap.xml - all static routes plus every industry and service page.
 * Why: Industry pages are the SEO engine; the sitemap must include them automatically as
 *      content grows.
 * How: Next metadata route deriving URLs from the typed content arrays.
 * From Where: TheSkillCorner marketing site build brief (SEO spec), 2026-06.
 * When: 2026-06.
 */

import type { MetadataRoute } from "next";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/industries",
    "/what-we-automate",
    "/book",
    "/contact",
    "/checklist",
    "/about",
    "/legal/privacy",
    "/legal/terms",
  ].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const industryRoutes = industries.map((industry) => ({
    url: `${site.url}/industries/${industry.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${site.url}/what-we-automate/${service.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...industryRoutes, ...serviceRoutes];
}
