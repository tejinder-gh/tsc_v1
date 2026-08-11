/**
 * What: sitemap.xml - all static routes plus every industry, automation service, and digital service page.
 * Why: Search engine indexation requires complete discovery of all content endpoints.
 * How: Next metadata route deriving URLs from the typed content arrays.
 * From Where: TheSkillCorner marketing site build brief (SEO spec), updated 2026-08.
 * When: 2026-08.
 */

import type { MetadataRoute } from "next";
import { digitalServices } from "@/content/digital-services";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/industries",
    "/what-we-automate",
    "/digital-services",
    "/social",
    "/how-it-works",
    "/results",
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

  const digitalServiceRoutes = digitalServices.map((service) => ({
    url: `${site.url}/digital-services/${service.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...industryRoutes, ...serviceRoutes, ...digitalServiceRoutes];
}
