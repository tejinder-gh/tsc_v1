import type { Metadata } from "next";
import { FinalCta } from "@/components/FinalCta";
import { JsonLd } from "@/components/JsonLd";
import { LibraryClient } from "@/features/catalog/components/LibraryClient";
import { getAllOfferings } from "@/features/catalog/data/registry";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "The Skill Corner Library | Services, Automations & Intelligence",
  description:
    "Explore productized automations, custom digital engineering pillars, market research feeds, and technical briefings designed to eliminate operational drag.",
  alternates: { canonical: "/library" },
};

export default function LibraryPage() {
  const offerings = getAllOfferings();

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Library", path: "/library" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <div className="bg-paper min-h-screen">
        {/* Header Hero */}
        <section className="pt-24 pb-12 px-6 border-b border-line bg-mist/60">
          <div className="max-w-site mx-auto">
            <p className="text-[13px] font-bold tracking-[0.16em] uppercase text-blue mb-3">
              PRODUCT CATALOG &amp; DIRECTORY
            </p>
            <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl text-navy max-w-4xl tracking-tight leading-[1.08] mb-4">
              The Skill Corner Library
            </h1>
            <p className="text-slate text-lg max-w-2xl leading-relaxed">
              Explore 30+ productized automations, digital engineering services, market intelligence
              feeds, and curated newsletters built to eliminate operational friction.
            </p>
          </div>
        </section>

        {/* Catalog Body */}
        <section className="py-12 px-6 max-w-site mx-auto">
          <LibraryClient initialOfferings={offerings} />
        </section>

        {/* Global Final CTA */}
        <FinalCta location="library" />
      </div>
    </>
  );
}
