import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { EditorialHero } from "@/components/public/EditorialHero";
import { SecondaryProblemPrompt } from "@/components/public/SecondaryProblemPrompt";
import { industriesBySegment } from "@/content/industries";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Industry Applications | The Skill Corner",
  description:
    "Operational automation and software systems tailored to local businesses and professional practices.",
  alternates: { canonical: "/industries" },
  openGraph: {
    title: "Industry Applications | The Skill Corner",
    description:
      "Operational automation and software systems tailored to recurring sector bottlenecks.",
    url: "https://theskillcorner.com/industries",
  },
};

export default function IndustriesIndexPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
  ]);

  const localIndustries = industriesBySegment("local");
  const practiceIndustries = industriesBySegment("practice");

  const groups = [
    {
      id: "local-businesses",
      index: "01",
      title: "LOCAL BUSINESSES",
      intro:
        "Fast setup, resilient integrations, and direct ROI for operations managing high customer velocity.",
      items: localIndustries,
    },
    {
      id: "practices",
      index: "02",
      title: "PRACTICES & FIRMS",
      intro:
        "Confidentiality-aware, structured workflows engineered for appointments, intake, and document routing.",
      items: practiceIndustries,
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbs} />

      {/* Hero Section */}
      <EditorialHero
        eyebrow="INDUSTRIES"
        headline="Systems tailored to how your industry operates."
        supportingCopy="Same engineering discipline, sector-specific workflows. Operational systems addressing recurring friction across commercial businesses and professional practices."
        primaryAction={{
          label: "Start with a problem →",
          href: "/#start",
        }}
        secondaryAction={{
          label: "Browse sectors ↓",
          href: "#sectors",
        }}
      />

      {/* Editorial Industry Index */}
      <section
        id="sectors"
        aria-label="Industry Sectors"
        className="py-16 sm:py-24 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16 space-y-20">
          {groups.map((group) => (
            <div
              key={group.id}
              id={group.id}
              className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start"
            >
              {/* Left Column: Group Description */}
              <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-28 lg:self-start">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)] tracking-wider">
                    {group.index}
                  </span>
                  <span className="font-mono text-xs text-[var(--tsc-line)]">/</span>
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-ink)] tracking-wider uppercase">
                    {group.title}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
                  {group.intro}
                </p>
              </div>

              {/* Right Column: Editorial Listing */}
              <div className="lg:col-span-8">
                <div className="divide-y divide-[var(--tsc-line)] border-y border-[var(--tsc-line)]">
                  {group.items.map((ind) => (
                    <Link
                      key={ind.slug}
                      href={`/industries/${ind.slug}`}
                      className="group flex items-start sm:items-center justify-between gap-4 py-5 px-3 -mx-3 rounded-[4px] hover:bg-[var(--tsc-surface)]/70 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="font-semibold text-base sm:text-lg text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] transition-colors">
                          {ind.name}
                        </div>
                        <div className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                          {ind.cardLine}
                        </div>
                      </div>
                      <span
                        className="font-mono text-sm text-[var(--tsc-muted)] group-hover:text-[var(--tsc-ink)] group-hover:translate-x-1 transition-all pt-1 sm:pt-0 shrink-0 select-none"
                        aria-hidden="true"
                      >
                        &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closing Problem Prompt */}
      <SecondaryProblemPrompt
        eyebrow="YOUR OPERATION"
        heading="Operate in an industry not listed above?"
        supportingCopy="Our core systems are engineered around communication, intake, scheduling, documents, and reporting bottlenecks. Describe how information moves in your business and we will assess whether our architecture fits."
      />
    </>
  );
}
