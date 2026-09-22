import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { EditorialHero } from "@/components/public/EditorialHero";
import { PageEyebrow } from "@/components/public/PageEyebrow";
import { SecondaryProblemPrompt } from "@/components/public/SecondaryProblemPrompt";
import { LibraryClient } from "@/features/catalog/components/LibraryClient";
import { getAllOfferings } from "@/features/catalog/data/registry";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Library & Field Notes | The Skill Corner",
  description:
    "Browse practical resources, automation ideas, technical references, and tools without needing to know which service category they belong to.",
  alternates: { canonical: "/library" },
  openGraph: {
    title: "Library & Field Notes | The Skill Corner",
    description:
      "Useful systems, tools, and field notes — practical resources for operational bottlenecks.",
    url: "https://theskillcorner.com/library",
  },
};

export default function LibraryPage() {
  const offerings = getAllOfferings();

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Explore", path: "/library" },
  ]);

  const featuredItems = [
    {
      badge: "TOOL",
      title: "Automation Opportunities Checklist",
      description:
        "A 25-task diagnostic to identify repetitive operational drag and calculate hours returned across your business.",
      href: "/checklist",
    },
    {
      badge: "FEATURED AUTOMATION",
      title: "AI Receptionist & Inbound Coordinator",
      description:
        "24/7 call and inquiry triage, appointment scheduling, and urgent human escalation connected to your phone and calendar.",
      href: "/what-we-automate/ai-receptionist",
    },
    {
      badge: "BRIEFING",
      title: "Tech Founder Briefing",
      description:
        "Actionable AI and engineering shifts, distilled weekly for founders, CTOs, and software operators with zero hype.",
      href: "/newsletters/tech-founder-briefing",
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbs} />

      {/* Hero Section */}
      <EditorialHero
        eyebrow="EXPLORE"
        headline="Useful systems, tools, and field notes."
        supportingCopy="Browse practical resources, automation ideas, technical references, and tools without needing to know which service category they belong to."
        primaryAction={{
          label: "Start with a problem →",
          href: "/#start",
        }}
        secondaryAction={{
          label: "Browse index ↓",
          href: "#catalog",
        }}
      />

      {/* Featured / Useful Now (Max 3 items per §26 & Amendment 3) */}
      <section
        aria-labelledby="featured-now-heading"
        className="py-12 sm:py-16 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="mb-6">
            <PageEyebrow>FEATURED / USEFUL NOW</PageEyebrow>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group p-6 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/40 hover:border-[var(--tsc-ink)]/40 hover:bg-[var(--tsc-surface)] transition-all flex flex-col justify-between gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
              >
                <div className="space-y-2">
                  <span className="font-mono text-[11px] font-semibold tracking-wider text-[var(--tsc-muted)] uppercase">
                    [{item.badge}]
                  </span>
                  <h3 className="font-semibold text-lg text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="font-mono text-xs text-[var(--tsc-muted)] group-hover:text-[var(--tsc-ink)] group-hover:translate-x-1 transition-all flex items-center gap-1.5 select-none pt-2 border-t border-[var(--tsc-line)]">
                  <span>Open resource</span>
                  <span aria-hidden="true">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog & Filter Index */}
      <section
        id="catalog"
        aria-label="Publication Catalog"
        className="py-14 sm:py-20 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <LibraryClient initialOfferings={offerings} />
        </div>
      </section>

      {/* Closing Problem Prompt */}
      <SecondaryProblemPrompt
        eyebrow="YOUR OPERATION"
        heading="Need an intervention not in the library?"
        supportingCopy="Describe what is causing friction or wasting time in your operation. We will assess the root cause and advise whether a custom system is justified."
      />
    </>
  );
}
