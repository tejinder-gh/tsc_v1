import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { EditorialHero, type MetadataItem } from "@/components/public/EditorialHero";
import { PageEyebrow } from "@/components/public/PageEyebrow";
import { SecondaryProblemPrompt } from "@/components/public/SecondaryProblemPrompt";
import { NewsletterSubscribeForm } from "@/features/newsletters/components/NewsletterSubscribeForm";
import { getAllNewsletters, getNewsletterBySlug } from "@/features/newsletters/data/newsletters";
import { breadcrumbJsonLd } from "@/lib/structured-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const newsletters = getAllNewsletters();
  return newsletters.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const newsletter = getNewsletterBySlug(slug);
  if (!newsletter) return {};

  return {
    title: `${newsletter.name} | The Skill Corner`,
    description: newsletter.description,
    alternates: { canonical: `/newsletters/${newsletter.slug}` },
    openGraph: {
      title: `${newsletter.name} | The Skill Corner`,
      description: newsletter.description,
      url: `https://theskillcorner.com/newsletters/${newsletter.slug}`,
      type: "article",
    },
  };
}

export default async function NewsletterDetailPage({ params }: Props) {
  const { slug } = await params;
  const newsletter = getNewsletterBySlug(slug);

  if (!newsletter) {
    notFound();
  }

  const latestIssue = newsletter.issues[newsletter.issues.length - 1];

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Briefings", path: "/newsletters" },
    { name: newsletter.name, path: `/newsletters/${newsletter.slug}` },
  ]);

  // Source-only metadata bar per Amendment 4 & 6
  const metadataItems: MetadataItem[] = [];
  if (newsletter.topic) {
    metadataItems.push({ label: "TOPIC", value: newsletter.topic });
  }
  if (newsletter.audience) {
    metadataItems.push({ label: "AUDIENCE", value: newsletter.audience });
  }
  if (newsletter.cadence) {
    metadataItems.push({ label: "CADENCE", value: `${newsletter.cadence} delivery` });
  }
  if (newsletter.priceDisplay) {
    metadataItems.push({ label: "ACCESS", value: newsletter.priceDisplay });
  }

  return (
    <>
      <JsonLd data={breadcrumbs} />

      {/* Hero Section */}
      <EditorialHero
        eyebrow="BRIEFING SPECIFICATION"
        headline={newsletter.name}
        supportingCopy={`${newsletter.tagline} ${newsletter.description}`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Briefings", href: "/newsletters" },
          { label: newsletter.name, href: `/newsletters/${newsletter.slug}` },
        ]}
        metadata={metadataItems}
        primaryAction={{
          label: "Subscribe below ↓",
          href: "#subscribe",
        }}
        secondaryAction={{
          label: "Read sample issue ↓",
          href: "#sample",
        }}
      />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-16 py-14 sm:py-20 font-geist">
        <div className="max-w-3xl space-y-16">
          {/* Subscription Section */}
          <section
            id="subscribe"
            aria-labelledby="subscribe-heading"
            className="p-7 sm:p-8 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/30 space-y-4"
          >
            <div className="space-y-1">
              <PageEyebrow>SUBSCRIPTION DISPATCH</PageEyebrow>
              <h2
                id="subscribe-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
              >
                Receive {newsletter.name}
              </h2>
              <p className="text-sm text-[var(--tsc-muted)] leading-relaxed">
                Direct email delivery{" "}
                {newsletter.cadence ? `every ${newsletter.cadence}` : "on publication"}. No
                promotions, zero marketing sponsored content.
              </p>
            </div>

            <div className="pt-2">
              <NewsletterSubscribeForm
                newsletterSlug={newsletter.slug}
                buttonLabel="Subscribe to briefing"
                sourceContext={`newsletter-detail-${newsletter.slug}`}
              />
            </div>
          </section>

          {/* Sample Issue */}
          <section id="sample" aria-labelledby="sample-heading" className="space-y-8">
            {latestIssue ? (
              <div className="space-y-6">
                <div className="space-y-2 border-b border-[var(--tsc-line)] pb-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--tsc-muted)]">
                      {latestIssue.isSample ? "SAMPLE EDITION" : "FEATURED ISSUE"} · ISSUE #
                      {latestIssue.issueNumber}
                    </span>
                    {latestIssue.publishedAt && (
                      <span className="font-mono text-xs text-[var(--tsc-muted)]">
                        {new Date(latestIssue.publishedAt).toLocaleDateString("en-CA", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <h2
                    id="sample-heading"
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]"
                  >
                    {latestIssue.title}
                  </h2>
                </div>

                {/* Key Takeaways */}
                {latestIssue.keyTakeaways && latestIssue.keyTakeaways.length > 0 && (
                  <div className="p-6 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-paper)] space-y-3">
                    <span className="font-mono text-xs font-semibold text-[var(--tsc-ink)] tracking-wider uppercase block">
                      KEY TAKEAWAYS
                    </span>
                    <ul className="space-y-2.5 text-sm text-[var(--tsc-ink)]">
                      {latestIssue.keyTakeaways.map((takeaway) => (
                        <li key={takeaway} className="flex items-start gap-2.5">
                          <span className="font-mono text-[var(--tsc-muted)] select-none">+</span>
                          <span className="leading-relaxed">{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Issue Content Markdown */}
                <div className="p-6 sm:p-8 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/20 whitespace-pre-line text-sm sm:text-base text-[var(--tsc-ink)] leading-relaxed font-sans">
                  {latestIssue.contentMarkdown}
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-[8px] border border-[var(--tsc-line)] text-center text-sm font-mono text-[var(--tsc-muted)]">
                Initial edition currently in editorial compilation.
              </div>
            )}
          </section>

          {/* Intelligence Sources */}
          {newsletter.sourceInputs && newsletter.sourceInputs.length > 0 && (
            <section
              aria-labelledby="sources-heading"
              className="pt-8 border-t border-[var(--tsc-line)] space-y-4"
            >
              <div className="space-y-1">
                <PageEyebrow>METHODOLOGY &amp; SOURCES</PageEyebrow>
                <h3 id="sources-heading" className="text-lg font-semibold text-[var(--tsc-ink)]">
                  Verified ingestion sources
                </h3>
                <p className="text-sm text-[var(--tsc-muted)] leading-relaxed">
                  Inputs monitored and filtered before compilation:
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {newsletter.sourceInputs.map((src) => (
                  <span
                    key={src}
                    className="font-mono text-xs px-3 py-1.5 rounded-[4px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/50 text-[var(--tsc-ink)]"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Closing Problem Prompt */}
      <SecondaryProblemPrompt
        eyebrow="YOUR OPERATION"
        heading="Need custom market or technical monitoring?"
        supportingCopy="If your team regularly monitors complex procurement data or public filings, describe what you track and we will assess whether a custom ingestion radar is practical."
      />
    </>
  );
}
