import { ArrowRight, Calendar, FileText, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/FinalCta";
import { JsonLd } from "@/components/JsonLd";
import { NewsletterSubscribeForm } from "@/features/newsletters/components/NewsletterSubscribeForm";
import { getAllNewsletters } from "@/features/newsletters/data/newsletters";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Newsletters & Intelligence Briefings | The Skill Corner",
  description:
    "Curated technical briefings and daily market radar: Applied AI architectures, Ontario deal flow, and municipal procurement tenders.",
  alternates: { canonical: "/newsletters" },
};

export default function NewslettersHubPage() {
  const newsletters = getAllNewsletters();

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Newsletters", path: "/newsletters" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <div className="bg-paper min-h-screen">
        {/* Header Hero */}
        <section className="pt-24 pb-12 px-6 border-b border-line bg-mist/60">
          <div className="max-w-site mx-auto">
            <p className="text-[13px] font-bold tracking-[0.16em] uppercase text-blue mb-3">
              INTELLIGENCE &amp; BRIEFINGS
            </p>
            <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl text-navy max-w-4xl tracking-tight leading-[1.08] mb-4">
              Newsletters &amp; Market Radars
            </h1>
            <p className="text-slate text-lg max-w-2xl leading-relaxed">
              Actionable AI engineering shifts, regional business opportunities, and public sector
              tenders—delivered directly to your inbox with zero sensationalism.
            </p>
          </div>
        </section>

        {/* Publication Cards Grid */}
        <section className="py-16 px-6 max-w-site mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {newsletters.map((newsletter) => {
              const latestIssue = newsletter.issues[newsletter.issues.length - 1];
              const isAi = newsletter.generationMode === "ai";
              const isHybrid = newsletter.generationMode === "hybrid";

              return (
                <article
                  key={newsletter.id}
                  className="flex flex-col justify-between bg-white rounded-2xl border-2 border-navy/10 hover:border-blue transition-all duration-200 p-8 shadow-xs hover:shadow-md"
                >
                  <div>
                    {/* Top badges */}
                    <div className="flex items-center justify-between gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-blue-tint flex items-center justify-center text-blue">
                        <FileText className="w-6 h-6" strokeWidth={1.7} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                          {newsletter.cadence}
                        </span>
                        <span
                          className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${
                            isAi
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : isHybrid
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-blue-tint text-blue"
                          }`}
                        >
                          {isAi ? "AI Generated" : isHybrid ? "Hybrid Curated" : "Editorial"}
                        </span>
                      </div>
                    </div>

                    <h2 className="font-display font-semibold text-2xl text-navy mb-2">
                      <Link
                        href={`/newsletters/${newsletter.slug}`}
                        className="hover:text-blue transition-colors"
                      >
                        {newsletter.name}
                      </Link>
                    </h2>
                    <p className="text-xs font-semibold text-blue uppercase tracking-wider mb-4">
                      {newsletter.tagline}
                    </p>
                    <p className="text-sm text-slate leading-relaxed mb-6">
                      {newsletter.description}
                    </p>

                    {/* Metadata summary */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6 space-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted flex-shrink-0" />
                        <span>
                          <strong>Audience:</strong> {newsletter.audience}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted flex-shrink-0" />
                        <span>
                          <strong>Cadence:</strong> {newsletter.cadence.toUpperCase()}
                        </span>
                      </div>
                      {latestIssue && (
                        <div className="pt-2 border-t border-slate-200/60 text-slate-500">
                          <span className="font-semibold text-slate-700 block mb-0.5">
                            Latest Edition:
                          </span>
                          <span className="line-clamp-1 italic">"{latestIssue.title}"</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Inline Subscribe Form */}
                  <div className="pt-6 border-t border-line">
                    <div className="mb-4">
                      <NewsletterSubscribeForm
                        newsletterSlug={newsletter.slug}
                        buttonLabel="Join Free"
                        placeholder="Your email address..."
                        sourceContext={`newsletters-hub-${newsletter.slug}`}
                      />
                    </div>
                    <Link
                      href={`/newsletters/${newsletter.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue transition-colors"
                    >
                      <span>Read sample issues &amp; archives</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <FinalCta location="newsletters-hub" />
      </div>
    </>
  );
}
