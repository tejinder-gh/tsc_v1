import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Code2,
  FileText,
  Globe,
  LineChart,
  Palette,
  Sparkles,
  Users2,
  Workflow,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { EditorialHero, type MetadataItem } from "@/components/public/EditorialHero";
import { PageEyebrow } from "@/components/public/PageEyebrow";
import { SecondaryProblemPrompt } from "@/components/public/SecondaryProblemPrompt";
import { ArchitectureVisualizer } from "@/components/services/ArchitectureVisualizer";
import { type DigitalService, digitalServices } from "@/content/digital-services";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Engineering & Digital Capabilities | The Skill Corner",
  description:
    "Production-grade AI agent development, high-performance Next.js web platforms, custom application software, generative engine optimization (GEO), and dedicated technical staffing.",
  alternates: { canonical: "/digital-services" },
  openGraph: {
    title: "Engineering & Digital Capabilities | The Skill Corner",
    description:
      "Autonomous voice and chat AI agents, high-performance Next.js web platforms, custom applications, and generative engine optimization.",
    url: "https://www.theskillcorner.com/digital-services",
  },
};

export default function DigitalServicesPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Digital Services", path: "/digital-services" },
  ]);

  const metadataItems: MetadataItem[] = [
    { label: "PRACTICE", value: "Systems, Software & Growth" },
    { label: "DELIVERY", value: "Custom Architecture & Deployment" },
    { label: "CODE OWNERSHIP", value: "100% Client Intellectual Property" },
  ];

  const pillars = [
    {
      index: "01",
      title: "SYSTEMS & SOFTWARE ENGINEERING",
      description:
        "Custom autonomous voice & text AI agents, sub-second Next.js web platforms, and bespoke internal application software engineered around how your practice operates.",
      services: digitalServices.filter((s) => s.category === "engineering"),
    },
    {
      index: "02",
      title: "MARKET ACQUISITION & POSITIONING",
      description:
        "Generative Engine Optimization (GEO/AIO) for ChatGPT, Claude, Perplexity & Gemini, data-driven Google PPC ad funnels, and enterprise brand design systems.",
      services: digitalServices.filter((s) => s.category === "growth"),
    },
    {
      index: "03",
      title: "OPERATIONAL SCALE & INFRASTRUCTURE",
      description:
        "Embedded top-3% dedicated tech talent (AI engineers, web developers, technical virtual assistants) and AI-ready Standard Operating Procedure (SOP) knowledge bases.",
      services: digitalServices.filter((s) => s.category === "operations"),
    },
  ];

  const getServiceIcon = (slug: string) => {
    switch (slug) {
      case "ai-agent-development":
        return <Bot className="h-5 w-5 text-[var(--tsc-action)]" />;
      case "website-development":
        return <Globe className="h-5 w-5 text-blue-600" />;
      case "application-development":
        return <Code2 className="h-5 w-5 text-purple-600" />;
      case "digital-marketing":
        return <LineChart className="h-5 w-5 text-emerald-600" />;
      case "rebranding":
        return <Palette className="h-5 w-5 text-amber-600" />;
      case "staffing":
        return <Users2 className="h-5 w-5 text-indigo-600" />;
      case "documentation":
        return <FileText className="h-5 w-5 text-teal-600" />;
      default:
        return <Zap className="h-5 w-5 text-[var(--tsc-action)]" />;
    }
  };

  const engagementSteps = [
    {
      step: "01",
      title: "Isolate the Operational Constraint",
      body: "We begin by observing where hours, phone calls, client intake, or revenue currently leak before discussing technology or writing code.",
    },
    {
      step: "02",
      title: "Design the High-Leverage Architecture",
      body: "We specify the single highest-leverage system or agent that resolves the bottleneck, complete with deterministic fallback guardrails.",
    },
    {
      step: "03",
      title: "Build Against Existing Tools & Rails",
      body: "We connect into the software, phone lines (Twilio), EHRs (Jane/Clio), and databases your team already relies on. Zero staff disruption.",
    },
    {
      step: "04",
      title: "Measure Hard Operational Return",
      body: "Success is evaluated strictly by time recovered, calls captured, or operational velocity gained, monitored via live production telemetry.",
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbs} />

      {/* Hero Section */}
      <EditorialHero
        eyebrow="CAPABILITIES &amp; PRACTICE"
        headline="Engineering the systems that power modern operations."
        supportingCopy="From autonomous voice and chat AI agents to sub-second Next.js web platforms, bespoke internal applications, and generative engine optimization — built for durability, data privacy, and measurable operational ROI."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Digital Services", href: "/digital-services" },
        ]}
        metadata={metadataItems}
        primaryAction={{
          label: "Start with a problem →",
          href: "/#start",
        }}
        secondaryAction={{
          label: "Browse 3 core pillars ↓",
          href: "#pillars",
        }}
      />

      {/* Turnkey Operational Automations Bridge Banner */}
      <section
        aria-label="Automation Catalog Bridge"
        className="border-b border-[var(--tsc-line)] bg-[var(--tsc-surface)]/40 py-10 font-geist"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-8 rounded-[12px] border border-[var(--tsc-line-strong)] bg-[var(--tsc-paper)] shadow-[var(--shadow-warm-xs)]">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Workflow className="h-4 w-4 text-[var(--tsc-action)]" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--tsc-action)]">
                  LOOKING FOR TURNKEY OPERATIONAL AUTOMATION?
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]">
                Explore our 18 concrete business automation systems.
              </h2>
              <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                If you need immediate operational workflows — such as missed-call phone triage,
                two-way SMS recall, automated review generation, or contractor dispatch — visit our
                dedicated Automation Index.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/what-we-automate"
                className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[var(--tsc-ink)] px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-[var(--tsc-action)] transition-colors shadow-sm"
              >
                <span>View 18-System Automation Index</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Capabilities Pillars */}
      <section
        id="pillars"
        aria-label="Core Capabilities Pillars"
        className="py-16 sm:py-24 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16 space-y-24">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start"
            >
              {/* Left Column: Pillar Category Description */}
              <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28 lg:self-start">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)] tracking-wider">
                    {pillar.index}
                  </span>
                  <span className="font-mono text-xs text-[var(--tsc-line)]">/</span>
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-ink)] tracking-wider uppercase">
                    {pillar.title}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
                  {pillar.description}
                </p>
                <div className="pt-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[var(--tsc-muted)]">
                    {pillar.services.length} Specialized Capabilities
                  </span>
                </div>
              </div>

              {/* Right Column: Elevated Editorial Specimen Cards */}
              <div className="lg:col-span-8 space-y-8">
                {pillar.services.map((service: DigitalService) => (
                  <div
                    key={service.slug}
                    className="group rounded-[14px] border border-[var(--tsc-line)] bg-white p-6 sm:p-8 lg:p-10 shadow-[var(--shadow-warm-xs)] hover:shadow-[var(--shadow-warm-md)] hover:border-[var(--tsc-line-strong)] transition-all space-y-6"
                  >
                    {/* Card Top: Icon, Eyebrow & Metric */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--tsc-line)] pb-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-[8px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)]">
                          {getServiceIcon(service.slug)}
                        </div>
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--tsc-muted)]">
                          SPECIFICATION &middot; {service.slug}
                        </span>
                      </div>

                      <span className="font-mono text-xs font-semibold px-3 py-1 rounded-[6px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[var(--tsc-ink)] self-start sm:self-auto">
                        {service.primaryMetric}
                      </span>
                    </div>

                    {/* Card Headline & Tagline */}
                    <div className="space-y-2">
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] transition-colors">
                        <Link
                          href={`/digital-services/${service.slug}`}
                          className="hover:underline"
                        >
                          {service.name}
                        </Link>
                      </h3>
                      <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
                        {service.tagline}
                      </p>
                    </div>

                    {/* Bullet Points Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {service.bullets.map((bullet) => (
                        <div
                          key={bullet}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--tsc-ink)]"
                        >
                          <CheckCircle2 className="h-4 w-4 text-[var(--tsc-action)] shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Badges */}
                    <div className="pt-2 flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] mr-1">
                        Stack:
                      </span>
                      {service.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[11px] px-2 py-0.5 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[var(--tsc-ink)] font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Bottom CTA Row */}
                    <div className="pt-4 border-t border-[var(--tsc-line)] flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--tsc-muted)]">
                        <Sparkles className="h-3.5 w-3.5 text-[var(--tsc-action)]" />
                        <span>Production Architecture &middot; Full Source Delivery</span>
                      </div>

                      <Link
                        href={`/digital-services/${service.slug}`}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--tsc-action)] hover:text-[var(--tsc-ink)] transition-colors group-hover:translate-x-0.5"
                      >
                        <span>View Technical Pipeline</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive System Architecture Comparison */}
      <section
        aria-label="System Architecture Comparison"
        className="py-16 sm:py-24 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <ArchitectureVisualizer />
        </div>
      </section>

      {/* How an Engagement Starts */}
      <section
        aria-labelledby="how-engagement-starts"
        className="py-16 sm:py-24 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="max-w-3xl mb-12 space-y-3">
            <PageEyebrow>ENGINEERING METHODOLOGY</PageEyebrow>
            <h2
              id="how-engagement-starts"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]"
            >
              How an engineering engagement executes.
            </h2>
            <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
              We deploy disciplined interventions rather than open-ended consulting cycles. Every
              build is designed for production reliability and operational permanence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {engagementSteps.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-[10px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/30 space-y-3 shadow-xs"
              >
                <div className="font-mono text-xs font-semibold text-[var(--tsc-action)] tracking-wider">
                  PHASE {step.step}
                </div>
                <h3 className="font-semibold text-base text-[var(--tsc-ink)]">{step.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Problem Prompt */}
      <SecondaryProblemPrompt
        eyebrow="START HERE"
        heading="Not sure which technical pillar solves your bottleneck?"
        supportingCopy="Good. Start with the operational constraint instead. Describe what is taking more time, manual transcription, or custom effort than it should, and our engineering team will evaluate the right system intervention."
      />
    </>
  );
}
