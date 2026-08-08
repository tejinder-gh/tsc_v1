/**
 * What: Isolated component gallery - every real primitive on the site, at real size,
 *       with its states (brief §16 step 3).
 * Why: A review surface for the design system separate from any marketing page, so
 *      tokens/components can be checked without hunting through nine different routes.
 * How: Server page reusing the actual components (CtaLink, Faq) rather than redrawing
 *      them, so the gallery can never drift from what ships. noindex'd and disallowed in
 *      robots.txt - this is a working document, not a page for visitors.
 * From Where: Brief working order step 3, 2026-08.
 * When: 2026-08.
 */

import type { Metadata } from "next";
import { CtaLink } from "@/components/CtaLink";
import { Faq } from "@/components/Faq";

export const metadata: Metadata = {
  title: "Component gallery (internal)",
  robots: { index: false, follow: false },
};

const colorTokens = [
  { name: "navy-900", cls: "bg-navy-900", hex: "#06183F" },
  { name: "navy-700", cls: "bg-navy-700", hex: "#08215B" },
  { name: "navy-500", cls: "bg-navy-500", hex: "#1B3A80" },
  { name: "blue-700", cls: "bg-blue-700", hex: "#1B49B8" },
  { name: "blue-500", cls: "bg-blue-500", hex: "#2563EB" },
  { name: "blue-100", cls: "bg-blue-100", hex: "#EAF0FE" },
  { name: "slate-600", cls: "bg-slate-600", hex: "#5A6480" },
  { name: "slate-400", cls: "bg-slate-400", hex: "#97A0B8" },
  { name: "line", cls: "bg-line", hex: "#DDE3EE" },
  { name: "mist", cls: "bg-mist", hex: "#F2F5FA" },
  { name: "paper", cls: "bg-paper border border-line", hex: "#FFFFFF" },
  { name: "success", cls: "bg-success", hex: "#0F7B4F" },
  { name: "warning", cls: "bg-warning", hex: "#9A5B00" },
  { name: "danger", cls: "bg-danger", hex: "#B42318" },
];

const demoFaq = [
  {
    q: "Is this a real question?",
    a: "It's demo content for the gallery, but the component rendering it is the real Faq component used on every page.",
  },
  { q: "Does it really allow only one item open?", a: "Yes - try opening this one." },
  { q: "Third item", a: "Third answer, for a normal-length accordion." },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-12 first:border-t-0 first:pt-0">
      <h2 className="font-display text-2xl font-semibold text-navy-700">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function ComponentGalleryPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-500">Internal</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-navy-700">Component gallery</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Every primitive actually used on the site, rendered at real size with its real states. Not
        indexed, not linked from navigation.
      </p>

      <Section title="Color tokens">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {colorTokens.map((c) => (
            <div key={c.name}>
              <div className={`h-16 rounded-card ${c.cls}`} />
              <p className="mt-2 text-sm font-semibold text-navy-700">{c.name}</p>
              <p className="text-xs text-slate-400">{c.hex}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type scale">
        <div className="flex flex-col gap-4">
          <p className="font-display text-[62px] font-semibold leading-[1.05] tracking-[-0.03em] text-navy-700">
            Display
          </p>
          <h3 className="font-display text-[46px] font-semibold leading-[1.13] tracking-[-0.03em] text-navy-700">
            H1 heading
          </h3>
          <h3 className="font-display text-[38px] font-semibold leading-[1.16] tracking-[-0.02em] text-navy-700">
            H2 heading
          </h3>
          <h3 className="font-display text-[26px] font-semibold leading-[1.3] tracking-[-0.02em] text-navy-700">
            H3 card title
          </h3>
          <p className="text-[21px] leading-[1.6] text-slate-600">
            Lead paragraph, used once under the hero H1.
          </p>
          <p className="text-[18px] leading-[1.67] text-slate-600">
            Body copy, the default size for running text anywhere on the site.
          </p>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-500">
            Eyebrow label
          </p>
        </div>
      </Section>

      <Section title="Button">
        <div className="flex flex-wrap items-center gap-4">
          <CtaLink href="#" location="gallery" variant="primary">
            Primary
          </CtaLink>
          <CtaLink href="#" location="gallery" variant="secondary">
            Secondary
          </CtaLink>
          <CtaLink href="#" location="gallery" variant="text">
            Text link CTA
          </CtaLink>
          <button
            type="button"
            disabled
            className="inline-flex min-h-12 items-center justify-center rounded-control bg-blue-500 px-6 font-display text-[15px] font-medium text-white opacity-60"
          >
            Disabled
          </button>
        </div>
        <div className="mt-4 rounded-card bg-navy-700 p-6">
          <div className="flex flex-wrap items-center gap-4">
            <CtaLink href="#" location="gallery" variant="primaryOnDark">
              Primary on dark
            </CtaLink>
            <CtaLink href="#" location="gallery" variant="secondaryOnDark">
              Secondary on dark
            </CtaLink>
          </div>
        </div>
      </Section>

      <Section title="Inputs">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="gallery-input-default" className="block font-medium text-navy">
              Default
            </label>
            <input
              id="gallery-input-default"
              type="text"
              placeholder="Type here"
              className="mt-1 w-full rounded-control border-[1.5px] border-line px-4 py-3.5 text-base focus:border-blue-500 focus:outline-none focus:ring-[3px] focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="gallery-input-error" className="block font-medium text-navy">
              Error
            </label>
            <input
              id="gallery-input-error"
              type="text"
              defaultValue="not-an-email"
              aria-invalid="true"
              aria-describedby="gallery-input-error-msg"
              className="mt-1 w-full rounded-control border-[1.5px] border-danger px-4 py-3.5 text-base focus:border-danger focus:outline-none focus:ring-[3px] focus:ring-danger/20"
            />
            <p id="gallery-input-error-msg" className="mt-1 text-sm text-danger" role="alert">
              Enter an email we can reply to
            </p>
          </div>
        </div>
      </Section>

      <Section title="Tag / pill">
        <div className="flex flex-wrap gap-2">
          {["Twilio", "Cal.com", "Make", "Claude API"].map((tool) => (
            <span
              key={tool}
              className="rounded-pill bg-mist px-3 py-1 text-sm font-medium text-navy-700"
            >
              {tool}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Card">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-card border-[1.5px] border-line bg-white p-6 shadow-sm">
            <h3 className="font-display text-lg font-semibold text-navy-700">Static card</h3>
            <p className="mt-2 text-sm text-slate-600">Hairline border, sm elevation, at rest.</p>
          </div>
          <a
            href="#interactive-card-demo"
            id="interactive-card-demo"
            className="group rounded-card border-[1.5px] border-line bg-white p-6 shadow-sm transition-all duration-220 hover:-translate-y-0.5 hover:shadow-md"
          >
            <h3 className="font-display text-lg font-semibold text-navy-700 underline-offset-4 group-hover:underline">
              Interactive card
            </h3>
            <p className="mt-2 text-sm text-slate-600">Whole card is one link; hover lifts.</p>
          </a>
        </div>
      </Section>

      <Section title="Stat block">
        <div className="flex gap-10">
          <div>
            <p className="font-display text-5xl font-semibold text-navy-700">25</p>
            <p className="mt-1 text-sm font-bold uppercase tracking-[0.16em] text-blue-500">
              Tasks on the checklist
            </p>
          </div>
        </div>
      </Section>

      <Section title="Accordion (live Faq component)">
        <Faq items={demoFaq} title="Demo questions" />
      </Section>

      <Section title="Not built - no current use case">
        <ul className="list-disc space-y-2 pl-5 text-slate-600">
          <li>
            <strong className="text-navy-700">Toast</strong> - nothing on the site currently
            triggers a transient notification; forms show inline success/error states in place
            instead.
          </li>
          <li>
            <strong className="text-navy-700">Table, tabs, pagination</strong> - no tabular or
            paginated content exists anywhere in the IA.
          </li>
          <li>
            <strong className="text-navy-700">Skeleton loader</strong> - every public route is
            static or server-rendered; the only async UI is form submission, already covered by each
            button's aria-busy "Sending..." state.
          </li>
          <li>
            <strong className="text-navy-700">Breadcrumb, logo strip, testimonial block</strong> -
            breadcrumb data exists only as JSON-LD (no visible client name/logo/testimonial data
            exists yet to render honestly).
          </li>
          <li>
            <strong className="text-navy-700">Modal</strong> - not duplicated here; see{" "}
            <code className="rounded bg-mist px-1.5 py-0.5 text-sm">
              components/capture/ExitIntentModal.tsx
            </code>{" "}
            for the real implementation (focus trap, Escape, backdrop click, focus return).
          </li>
        </ul>
      </Section>
    </div>
  );
}
