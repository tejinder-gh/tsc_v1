import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/FinalCta";
import { JsonLd } from "@/components/JsonLd";
import { NewsletterSubscribeForm } from "@/features/newsletters/components/NewsletterSubscribeForm";
import { getAllNewsletters, getNewsletterBySlug } from "@/features/newsletters/data/newsletters";
import { breadcrumbJsonLd } from "@/lib/structured-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
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
    { name: "Newsletters", path: "/newsletters" },
    { name: newsletter.name, path: `/newsletters/${newsletter.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <div className="bg-paper min-h-screen">
        {/* Navigation & Header */}
        <section className="pt-24 pb-12 px-6 border-b border-line bg-mist/60">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/newsletters"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-navy mb-6 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all newsletters</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-blue text-white">
                {newsletter.cadence} publication
              </span>
              <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-blue-tint text-blue">
                {newsletter.generationMode === "ai"
                  ? "AI Generated · Human Curated"
                  : newsletter.generationMode === "hybrid"
                    ? "Hybrid Intake Radar"
                    : "Editorial Brief"}
              </span>
            </div>

            <h1 className="font-display font-semibold text-4xl sm:text-5xl text-navy tracking-tight leading-[1.1] mb-3">
              {newsletter.name}
            </h1>
            <p className="text-lg text-slate-700 font-medium mb-4">{newsletter.tagline}</p>
            <p className="text-slate leading-relaxed max-w-3xl">{newsletter.description}</p>

            {/* Quick stats / metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-200 text-xs">
              <div>
                <span className="text-muted block mb-1">Target Audience</span>
                <span className="font-semibold text-navy">{newsletter.audience}</span>
              </div>
              <div>
                <span className="text-muted block mb-1">Publishing Schedule</span>
                <span className="font-semibold text-navy capitalize">
                  {newsletter.cadence} delivery
                </span>
              </div>
              <div>
                <span className="text-muted block mb-1">Price / Access</span>
                <span className="font-semibold text-navy">{newsletter.priceDisplay}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 px-6 max-w-4xl mx-auto">
          {/* Subscription Box */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-tint/60 to-white border-2 border-blue/30 shadow-xs mb-12">
            <div className="max-w-xl">
              <h2 className="font-display font-semibold text-xl text-navy mb-2">
                Subscribe to {newsletter.name}
              </h2>
              <p className="text-sm text-slate mb-6">
                Receive the next edition in your inbox every {newsletter.cadence}. Zero fluff,
                actionable takeaways only.
              </p>
              <NewsletterSubscribeForm
                newsletterSlug={newsletter.slug}
                buttonLabel="Get the next issue"
                sourceContext={`newsletter-detail-${newsletter.slug}`}
              />
            </div>
          </div>

          {/* Latest Issue Sample */}
          {latestIssue ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue block mb-1">
                    {latestIssue.isSample ? "Curated Sample Edition" : "Featured Edition"} · Issue #
                    {latestIssue.issueNumber}
                  </span>
                  <h2 className="font-display font-semibold text-2xl text-navy">
                    {latestIssue.title}
                  </h2>
                </div>
                {latestIssue.publishedAt && (
                  <span className="text-xs text-muted">
                    {new Date(latestIssue.publishedAt).toLocaleDateString("en-CA", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>

              {/* Key takeaways callout */}
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue" />
                  <span>Key Takeaways in this Edition</span>
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  {latestIssue.keyTakeaways.map((takeaway) => (
                    <li key={takeaway} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue flex-shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Issue Content */}
              <div className="prose max-w-none text-slate-800 leading-relaxed space-y-4">
                <p className="text-base text-slate font-medium italic border-l-4 border-blue pl-4 py-1">
                  {latestIssue.summary}
                </p>
                <div className="whitespace-pre-line text-sm text-slate-700 bg-white p-6 rounded-xl border border-slate-200">
                  {latestIssue.contentMarkdown}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted text-sm italic">
              First issue currently in production editorial review.
            </p>
          )}

          {/* Methodology and Sources */}
          <div className="mt-16 pt-8 border-t border-line">
            <h3 className="font-display font-semibold text-lg text-navy mb-4">
              Intelligence Sources &amp; Verification
            </h3>
            <p className="text-sm text-slate mb-4">
              Our automated intake pipeline monitors verified registries, model documentation, and
              public filings before compiling draft issues for editorial review:
            </p>
            <div className="flex flex-wrap gap-2">
              {newsletter.sourceInputs.map((src) => (
                <span
                  key={src}
                  className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                >
                  {src}
                </span>
              ))}
            </div>
          </div>
        </section>

        <FinalCta location={`newsletter-${newsletter.slug}`} />
      </div>
    </>
  );
}
