import type { Metadata } from "next";
import { BookingEmbed } from "@/components/BookingEmbed";
import { PreFlightBlueprint } from "@/components/booking/PreFlightBlueprint";
import { CtaLink } from "@/components/CtaLink";
import { JsonLd } from "@/components/JsonLd";
import { ActiveJourneyBanner } from "@/components/journey";
import { EditorialHero } from "@/components/public/EditorialHero";
import { PageEyebrow } from "@/components/public/PageEyebrow";
import { booking } from "@/content/site";
import { getCommercialOfferBySlug } from "@/lib/commercial/offers";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export interface BookPageProps {
  searchParams?: Promise<{
    package?: string;
    offer_id?: string;
    sku?: string;
    source?: string;
    intent?: string;
    problem?: string;
    segment?: string;
    tier?: string;
    campaign?: string;
    referrer?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Book an Engineering Discovery Audit | The Skill Corner",
  description:
    "30 minutes, no pitch deck. We evaluate your operational bottlenecks and map three high-payback automation architectures whether you hire us or not.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "Book an Engineering Discovery Audit | The Skill Corner",
    description:
      "30-minute discovery call mapping your operational bottlenecks with concrete system recommendations.",
    url: "https://www.theskillcorner.com/book",
  },
};

function getPackageScopingCopy(slug: string, publicName: string): string {
  if (slug === "business-buyer-os") {
    return "You're evaluating the Business Buyer OS. We'll use this session to define acquisition criteria, source coverage, diligence depth, alert preferences, and reporting cadence.";
  }
  if (slug === "deal-hunter") {
    return "You're evaluating the Deal Hunter Pack. We'll use this session to configure local marketplace coverage, liquidation auction feeds, discount thresholds, and real-time alert triggers.";
  }
  if (slug === "founder-growth-os") {
    return "You're evaluating the Founder Growth OS. We'll use this session to calibrate ideal customer profiles, competitor watch domains, and outbound trigger cadences.";
  }
  if (slug === "small-business-coo") {
    return "You're evaluating the Small Business COO. We'll use this session to map intake workflows, phone answering scripts, appointment rules, and accounts receivable automation.";
  }
  if (slug === "ecommerce-intelligence") {
    return "You're evaluating the E-Commerce Launch Pack. We'll use this session to configure supplier catalog feeds, inventory triggers, and MAP repricing rules.";
  }
  return `You're evaluating ${publicName}. We'll use this 30-minute technical session to scope your stack, confirm data inputs, and outline 3 concrete execution options.`;
}

export default async function BookPage({ searchParams }: BookPageProps) {
  const params = searchParams ? await searchParams : {};
  const packageSlug = params.package || params.sku || params.offer_id;
  const matchedOffer = packageSlug ? getCommercialOfferBySlug(packageSlug) : undefined;

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Book Audit", path: "/book" },
  ]);

  const eyebrow = matchedOffer
    ? `EVALUATION SESSION // ${matchedOffer.publicName.toUpperCase()}`
    : "AUDIT BOOKING";

  const headline = matchedOffer
    ? `Book your ${matchedOffer.publicName} discovery audit.`
    : "Book an engineering discovery audit.";

  const supportingCopy = matchedOffer
    ? getPackageScopingCopy(matchedOffer.slug, matchedOffer.publicName)
    : booking.promise;

  const metadataItems = matchedOffer
    ? [
        { label: "DURATION", value: "30 Minutes" },
        { label: "FORMAT", value: "Direct Technical Call" },
        { label: "DELIVERABLE", value: matchedOffer.deliverable.title },
        { label: "INVESTMENT", value: matchedOffer.pricing.displayPrice },
      ]
    : [
        { label: "DURATION", value: "30 Minutes" },
        { label: "FORMAT", value: "Direct Technical Call" },
        { label: "DELIVERABLE", value: "3 Scoped Architectures" },
      ];

  return (
    <>
      <JsonLd data={breadcrumbs} />

      {/* Hero Section */}
      <EditorialHero
        eyebrow={eyebrow}
        headline={headline}
        supportingCopy={supportingCopy}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Book Audit", href: "/book" },
        ]}
        metadata={metadataItems}
      />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-16 py-12 sm:py-16 font-geist">
        {/* Active Commercial Evaluation or Journey Context */}
        <ActiveJourneyBanner packageSlug={packageSlug} />

        {/* What to expect briefing grid */}
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-2 lg:sticky lg:top-28 lg:self-start">
            <PageEyebrow>01 / CALL STRUCTURE</PageEyebrow>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]">
              What to expect on the call.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
              We review actual workflows and data sources rather than presenting sales pitch decks.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/40 space-y-2">
              <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)]">01</span>
              <h3 className="font-semibold text-sm text-[var(--tsc-ink)]">Constraint Mapping</h3>
              <p className="text-xs text-[var(--tsc-muted)] leading-relaxed">
                We review where your team spends manual effort, misses calls, or repeats data entry.
              </p>
            </div>

            <div className="p-5 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/40 space-y-2">
              <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)]">02</span>
              <h3 className="font-semibold text-sm text-[var(--tsc-ink)]">System Scoping</h3>
              <p className="text-xs text-[var(--tsc-muted)] leading-relaxed">
                You receive three concrete automation architecture options sized to your tools.
              </p>
            </div>

            <div className="p-5 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/40 space-y-2">
              <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)]">03</span>
              <h3 className="font-semibold text-sm text-[var(--tsc-ink)]">Zero Pressure</h3>
              <p className="text-xs text-[var(--tsc-muted)] leading-relaxed">
                No high-pressure sales pitch. If a system is not economically justified, we say so
                plainly.
              </p>
            </div>
          </div>
        </div>

        {/* Pre-Flight Architecture Blueprint Configurator */}
        <PreFlightBlueprint initialPackageSlug={packageSlug} />

        {/* Cal.com Embed / Direct Technical Scheduler */}
        <div id="booking-calendar" className="space-y-4 scroll-mt-8">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--tsc-muted)] uppercase border-b border-[var(--tsc-line)] pb-3">
            <span>
              {matchedOffer
                ? `RESERVE ${matchedOffer.publicName.toUpperCase()} SCOPING SESSION`
                : "SELECT AUDIT DATE & TIME"}
            </span>
            <span>TIMEZONE: LOCAL &middot; 30-DAY REFUND GUARANTEE APPLIES</span>
          </div>
          <BookingEmbed
            selectedPackageSlug={packageSlug}
            selectedPackageName={matchedOffer?.publicName}
            initialContext={params}
          />
        </div>

        {/* Alternative Lower-Commitment Rungs */}
        <div className="mt-14 pt-8 border-t border-[var(--tsc-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm text-[var(--tsc-muted)]">
          <p>
            Rather not schedule a call yet? Frame your problem directly or run the checklist
            diagnostic:
          </p>
          <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
            <CtaLink
              href={packageSlug ? `/contact?package=${packageSlug}` : "/contact"}
              location="book_page_footer"
              variant="text"
            >
              Direct inquiry &rarr;
            </CtaLink>
            <CtaLink href="/checklist" location="book_page_footer" variant="text">
              25-task checklist &rarr;
            </CtaLink>
          </div>
        </div>
      </div>
    </>
  );
}
