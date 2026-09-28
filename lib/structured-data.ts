/**
 * What: JSON-LD builders - FAQPage, Service, DigitalService, and BreadcrumbList objects
 *       derived from the typed content arrays.
 * Why: Structured data is how search engines and LLM crawlers extract the business's
 *      services, answers, and page hierarchy for rich results and AI recommendations;
 *      building it from content/*.ts keeps schema in lockstep with visible copy.
 * How: Pure functions returning plain objects; components serialize them via <JsonLd>.
 *      The LocalBusiness node in app/layout.tsx carries an @id these nodes reference as
 *      provider, linking every page's schema into one graph.
 * From Where: SEO + AI-indexing pass (LLM recommendation readiness), 2026-08.
 * When: 2026-08.
 */

import type { DigitalService } from "@/content/digital-services";
import type { FaqItem } from "@/content/faq";
import type { Industry } from "@/content/industries";
import type { Service } from "@/content/services";
import { site } from "@/content/site";
import type { CommercialOffer } from "@/lib/commercial/types";

/** Shared @id of the LocalBusiness node emitted in the root layout. */
export const BUSINESS_ID = `${site.url}/#business`;

export function faqPageJsonLd(items: readonly FaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function serviceJsonLd(service: Service): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.excerpt,
    url: `${site.url}/what-we-automate/${service.slug}`,
    serviceType: "AI automation",
    provider: { "@id": BUSINESS_ID },
  };
}

export function digitalServiceJsonLd(service: DigitalService): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: `${site.url}/digital-services/${service.slug}`,
    serviceType: service.name,
    provider: { "@id": BUSINESS_ID },
  };
}

export function industryServiceJsonLd(industry: Industry): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `AI automation for ${industry.name.toLowerCase()}`,
    description: industry.metaDescription,
    url: `${site.url}/industries/${industry.slug}`,
    serviceType: "AI automation",
    audience: { "@type": "BusinessAudience", name: industry.name },
    provider: { "@id": BUSINESS_ID },
  };
}

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(entries: readonly BreadcrumbEntry[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: `${site.url}${entry.path}`,
    })),
  };
}

export function commercialOfferJsonLd(offer: CommercialOffer): Record<string, unknown> {
  const price = (offer.pricing.recurringAmountCents ?? offer.pricing.setupAmountCents ?? 0) / 100;
  const offerUrl = `${site.url}/briefings/${offer.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: offer.publicName,
    description: offer.deliverable.description,
    sku: offer.sku,
    url: offerUrl,
    brand: {
      "@type": "Brand",
      name: site.name,
    },
    offers: {
      "@type": "Offer",
      url: offerUrl,
      priceCurrency: offer.pricing.currency,
      price: price.toString(),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: price.toString(),
        priceCurrency: offer.pricing.currency,
        unitText: offer.pricing.billingPeriod ?? "one-time",
      },
      availability:
        offer.availability === "public"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      seller: { "@id": BUSINESS_ID },
    },
  };
}

export function commercialCatalogJsonLd(
  offers: readonly CommercialOffer[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "The Skill Corner Commercial Catalog",
    description:
      "Turnkey autonomous AI operating systems, multi-agent workflows, and custom engineering deployments.",
    numberOfItems: offers.length,
    itemListElement: offers.map((offer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: commercialOfferJsonLd(offer),
    })),
  };
}
