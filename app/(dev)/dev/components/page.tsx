/**
 * What: Isolated component gallery - canonical editorial primitives at real size with states.
 * Why: A review surface for the design system separate from any marketing page, so
 *      tokens/components can be audited against DESIGN.md without route hunting.
 * How: Server page reusing actual design tokens and components (CtaLink, EditorialFaq).
 *      noindex'd and disallowed in robots.txt - working document only.
 * From Where: DESIGN.md - "approachable precision" editorial redesign.
 * When: 2026.
 */

import type { Metadata } from "next";
import { CtaLink } from "@/components/CtaLink";
import { EditorialFaq } from "@/components/public/EditorialFaq";
import { PageEyebrow } from "@/components/public/PageEyebrow";

export const metadata: Metadata = {
  title: "Component Gallery (Internal) | The Skill Corner",
  robots: { index: false, follow: false },
};

const canonicalPalette = [
  {
    name: "ink",
    variable: "--tsc-ink",
    hex: "#12130f",
    cls: "bg-[var(--tsc-ink)] text-[var(--tsc-paper)]",
  },
  {
    name: "paper",
    variable: "--tsc-paper",
    hex: "#f4f1e9",
    cls: "bg-[var(--tsc-paper)] border border-[var(--tsc-line)]",
  },
  {
    name: "surface",
    variable: "--tsc-surface",
    hex: "#fbf9f3",
    cls: "bg-[var(--tsc-surface)] border border-[var(--tsc-line)]",
  },
  { name: "line", variable: "--tsc-line", hex: "#d7d2c7", cls: "bg-[var(--tsc-line)]" },
  {
    name: "line-strong",
    variable: "--tsc-line-strong",
    hex: "#817e74",
    cls: "bg-[var(--tsc-line-strong)] text-white",
  },
  {
    name: "muted",
    variable: "--tsc-muted",
    hex: "#6d6b63",
    cls: "bg-[var(--tsc-muted)] text-white",
  },
  {
    name: "signal",
    variable: "--tsc-signal",
    hex: "#d5ff52",
    cls: "bg-[var(--tsc-signal)] text-[var(--tsc-ink)]",
  },
  {
    name: "action",
    variable: "--tsc-action",
    hex: "#2d51ff",
    cls: "bg-[var(--tsc-action)] text-white",
  },
  {
    name: "positive",
    variable: "--tsc-positive",
    hex: "#2e694e",
    cls: "bg-[var(--tsc-positive)] text-white",
  },
  {
    name: "white",
    variable: "--tsc-white",
    hex: "#ffffff",
    cls: "bg-white border border-[var(--tsc-line)]",
  },
];

const demoFaq = [
  {
    q: "How does the editorial system establish visual hierarchy?",
    a: "Roughly 70% warm paper canvas, 20% carbon ink typography, and 10% signal / action accents. One primary action per view.",
  },
  {
    q: "Why Geist Sans and Geist Mono?",
    a: "Geist provides geometric precision and disciplined tracking for technical journalism, while Geist Mono brings dense tabular readability to metadata and status tags.",
  },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[var(--tsc-line)] py-12 first:border-t-0 first:pt-0">
      <h2 className="text-xl font-bold tracking-tight text-[var(--tsc-ink)]">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function ComponentGalleryPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 font-geist text-[var(--tsc-ink)]">
      <PageEyebrow>INTERNAL AUDIT SURFACE</PageEyebrow>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-[var(--tsc-ink)]">
        Editorial Design System Gallery
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--tsc-muted)] leading-relaxed">
        Canonical semantic tokens, typography hierarchy, input primitives, and buttons meeting WCAG
        AA 3:1 contrast guidelines under DESIGN.md.
      </p>

      {/* Semantic Palette */}
      <Section title="01 / Canonical Palette (DESIGN.md §1.1)">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {canonicalPalette.map((c) => (
            <div key={c.name} className="space-y-1.5">
              <div
                className={`h-16 rounded-[6px] p-2 flex items-end justify-start font-mono text-[10px] font-semibold ${c.cls}`}
              >
                {c.hex}
              </div>
              <p className="font-semibold text-xs text-[var(--tsc-ink)]">{c.name}</p>
              <p className="font-mono text-[10px] text-[var(--tsc-muted)]">{c.variable}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Typography Scale */}
      <Section title="02 / Typography Scale (Geist Sans & Mono)">
        <div className="flex flex-col gap-5">
          <div>
            <span className="font-mono text-[10px] text-[var(--tsc-muted)] uppercase block mb-1">
              Hero Cover H1 (62–84px, leading-[0.95], tracking-[-0.035em])
            </span>
            <p className="text-4xl sm:text-5xl font-bold tracking-[-0.035em] text-[var(--tsc-ink)]">
              Operational Systems
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-[var(--tsc-muted)] uppercase block mb-1">
              Section Title H2 (36–48px, leading-[1.05], tracking-[-0.025em])
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[var(--tsc-ink)]">
              Autonomous Software Engineering
            </h3>
          </div>
          <div>
            <span className="font-mono text-[10px] text-[var(--tsc-muted)] uppercase block mb-1">
              Card Title H3 (18–24px, leading-[1.2])
            </span>
            <h4 className="text-lg font-semibold text-[var(--tsc-ink)]">
              AI Receptionist & Inbound Coordinator
            </h4>
          </div>
          <div>
            <span className="font-mono text-[10px] text-[var(--tsc-muted)] uppercase block mb-1">
              Body Copy (15–18px, leading-[1.6])
            </span>
            <p className="text-base text-[var(--tsc-muted)] leading-relaxed max-w-xl">
              Skilled people should spend less of their attention moving information, repeating
              routine decisions, and compensating for disconnected software systems.
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-[var(--tsc-muted)] uppercase block mb-1">
              Monospace Technical Label (Geist Mono, tracking-[0.14em])
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--tsc-muted)] font-semibold">
              01 / SPECIFICATION DELIVERABLE
            </span>
          </div>
        </div>
      </Section>

      {/* Interactive Controls & Buttons */}
      <Section title="03 / Action Controls & CTA Primitives">
        <div className="flex flex-wrap items-center gap-4">
          <CtaLink href="#" location="gallery" variant="primary">
            Primary (Ink)
          </CtaLink>
          <CtaLink href="#" location="gallery" variant="secondary">
            Secondary (Border)
          </CtaLink>
          <CtaLink href="#" location="gallery" variant="action">
            Action (Signal Blue)
          </CtaLink>
          <CtaLink href="#" location="gallery" variant="text">
            Text Link CTA &rarr;
          </CtaLink>
        </div>

        <div className="mt-4 rounded-[8px] bg-[var(--tsc-ink)] p-6">
          <div className="flex flex-wrap items-center gap-4">
            <CtaLink href="#" location="gallery" variant="primaryOnDark">
              Primary on Dark
            </CtaLink>
            <CtaLink href="#" location="gallery" variant="secondaryOnDark">
              Secondary on Dark
            </CtaLink>
          </div>
        </div>
      </Section>

      {/* Form Inputs */}
      <Section title="04 / High-Contrast Inputs (WCAG AA 3:1)">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="gallery-input-default"
              className="block text-xs font-mono uppercase text-[var(--tsc-muted)] mb-1"
            >
              Standard Input
            </label>
            <input
              id="gallery-input-default"
              type="text"
              placeholder="e.g. you@organization.ca"
              className="w-full rounded-[6px] border border-[var(--tsc-line-strong)] bg-white px-3.5 py-2.5 text-sm text-[var(--tsc-ink)] placeholder-[var(--tsc-muted)] focus:outline-none focus:border-[var(--tsc-ink)] focus:ring-1 focus:ring-[var(--tsc-ink)]"
            />
          </div>
          <div>
            <label
              htmlFor="gallery-input-error"
              className="block text-xs font-mono uppercase text-[var(--tsc-muted)] mb-1"
            >
              Error State
            </label>
            <input
              id="gallery-input-error"
              type="text"
              defaultValue="invalid-format"
              aria-invalid="true"
              aria-describedby="gallery-input-error-msg"
              className="w-full rounded-[6px] border border-red-500 bg-white px-3.5 py-2.5 text-sm text-[var(--tsc-ink)] focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <p
              id="gallery-input-error-msg"
              className="mt-1 text-xs font-mono text-red-600"
              role="alert"
            >
              Enter a valid work email address
            </p>
          </div>
        </div>
      </Section>

      {/* Graphical Indicators & Tags */}
      <Section title="05 / Technical Indicators & Pills">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--tsc-signal)] ring-4 ring-[var(--tsc-line)]" />
            <span className="font-mono text-xs text-[var(--tsc-ink)]">Live System Observed</span>
          </div>

          <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[var(--tsc-ink)]">
            [FEATURED SPEC]
          </span>

          <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[var(--tsc-muted)]">
            BETA ARCHITECTURE
          </span>
        </div>
      </Section>

      {/* Cards */}
      <Section title="06 / Cards & Surface Hierarchy">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-6 shadow-sm space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--tsc-muted)] block">
              ELEVATED SURFACE
            </span>
            <h3 className="text-lg font-bold text-[var(--tsc-ink)]">Static Card Container</h3>
            <p className="text-sm text-[var(--tsc-muted)] leading-relaxed">
              White background floating on warm paper canvas with disciplined 8px radius and
              hairline rule.
            </p>
          </div>

          <a
            href="#interactive-card-demo"
            id="interactive-card-demo"
            className="group rounded-[8px] border border-[var(--tsc-line)] bg-white p-6 shadow-sm transition-all hover:border-[var(--tsc-ink)]/40 hover:bg-[var(--tsc-surface)]/40 space-y-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
          >
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--tsc-muted)] block">
              HOVER ACTIVE
            </span>
            <h3 className="text-lg font-bold text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] transition-colors">
              Interactive Card Link &rarr;
            </h3>
            <p className="text-sm text-[var(--tsc-muted)] leading-relaxed">
              Responds with subtle border darkening and background tint without exaggerated 3D
              lifts.
            </p>
          </a>
        </div>
      </Section>

      {/* Accordion Component */}
      <Section title="07 / Accordion Primitive">
        <EditorialFaq items={demoFaq} title="System Frequently Asked Questions" />
      </Section>
    </div>
  );
}
