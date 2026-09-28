/**
 * What: sitemap.xml - all static routes plus every industry, automation service,
 *       digital service page, library hub, and newsletter publication page.
 * Why: Search engine indexation requires complete discovery of all content endpoints.
 * How: Next metadata route deriving URLs from typed content arrays.
 *      Omit lastModified on static content where no reliable date is tracked;
 *      preserve real lastPublishedAt on newsletters.
 * From Where: Commercial acceptance remediation pass, 2026-09.
 */

import type { MetadataRoute } from "next";
import { digitalServices } from "@/content/digital-services";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { getAllNewsletters } from "@/features/newsletters/data/newsletters";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/library",
    "/newsletters",
    "/briefings",
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
    priority: path === "" ? 1 : path === "/library" ? 0.9 : 0.7,
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

  const newsletterRoutes = getAllNewsletters().map((newsletter) => {
    const entry: MetadataRoute.Sitemap[number] = {
      url: `${site.url}/newsletters/${newsletter.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
    if (newsletter.lastPublishedAt) {
      entry.lastModified = new Date(newsletter.lastPublishedAt);
    }
    return entry;
  });

  return [
    ...staticRoutes,
    ...industryRoutes,
    ...serviceRoutes,
    ...digitalServiceRoutes,
    ...newsletterRoutes,
  ];
}
