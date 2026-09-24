import type { Metadata } from "next";
import { BookingEmbed } from "@/components/BookingEmbed";
import { PreFlightBlueprint } from "@/components/booking/PreFlightBlueprint";
import { CtaLink } from "@/components/CtaLink";
import { JsonLd } from "@/components/JsonLd";
import { ActiveJourneyBanner } from "@/components/journey";
import { EditorialHero } from "@/components/public/EditorialHero";
import { PageEyebrow } from "@/components/public/PageEyebrow";
import { booking } from "@/content/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Book an Engineering Discovery Audit | The Skill Corner",
  description:
    "30 minutes, no pitch deck. We evaluate your operational bottlenecks and map three high-payback automation architectures whether you hire us or not.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "Book an Engineering Discovery Audit | The Skill Corner",
    description:
      "30-minute discovery call mapping your operational bottlenecks with concrete system recommendations.",
    url: "https://theskillcorner.com/book",
  },
};

export default function BookPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Book Audit", path: "/book" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />

      {/* Hero Section */}
      <EditorialHero
        eyebrow="AUDIT BOOKING"
        headline="Book an engineering discovery audit."
        supportingCopy={booking.promise}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Book Audit", href: "/book" },
        ]}
        metadata={[
          { label: "DURATION", value: "30 Minutes" },
          { label: "FORMAT", value: "Direct Technical Call" },
          { label: "DELIVERABLE", value: "3 Scoped Architectures" },
        ]}
      />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-16 py-12 sm:py-16 font-geist">
        {/* Active Journey Context if carried over */}
        <ActiveJourneyBanner />

        {/* What to expect briefing grid */}
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-2">
            <PageEyebrow>01 / CALL STRUCTURE</PageEyebrow>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]">
              What to expect on the call.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
              We review actual workflows rather than presenting sales decks.
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
        <PreFlightBlueprint />

        {/* Cal.com Embed */}
        <div id="booking-calendar" className="space-y-4 scroll-mt-8">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--tsc-muted)] uppercase border-b border-[var(--tsc-line)] pb-3">
            <span>SELECT AUDIT DATE &amp; TIME</span>
            <span>TIMEZONE: LOCAL</span>
          </div>
          <BookingEmbed />
        </div>

        {/* Alternative Lower-Commitment Rungs */}
        <div className="mt-14 pt-8 border-t border-[var(--tsc-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm text-[var(--tsc-muted)]">
          <p>
            Rather not schedule a call yet? Frame your problem directly or run the checklist
            diagnostic:
          </p>
          <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
            <CtaLink href="/contact" location="book_page_footer" variant="text">
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
