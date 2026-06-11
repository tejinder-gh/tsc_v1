/**
 * What: Reusable FAQ accordion built on native details/summary, with FAQPage JSON-LD.
 * Why: FAQ appears on home, industry, and service pages; native disclosure elements give
 *      keyboard and screen-reader support with zero JavaScript, and the schema makes
 *      every Q&A extractable by search engines and LLM crawlers.
 * How: Maps FaqItem[]; chevron rotation handled in globals.css via details[open].
 *      Emitting the JSON-LD here guarantees schema and visible copy never drift.
 * From Where: TheSkillCorner marketing site build brief, 2026-06; schema added in the
 *             SEO + AI-indexing pass, 2026-06.
 * When: 2026-06.
 */

import { JsonLd } from "@/components/JsonLd";
import type { FaqItem } from "@/content/faq";
import { faqPageJsonLd } from "@/lib/structured-data";

interface FaqProps {
  items: readonly FaqItem[];
  title?: string;
}

export function Faq({ items, title = "Questions owners actually ask" }: FaqProps) {
  return (
    <section aria-labelledby="faq-heading" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JsonLd data={faqPageJsonLd(items)} />
      <h2 id="faq-heading" className="font-display text-3xl font-bold sm:text-4xl">
        {title}
      </h2>
      <div className="mt-8 divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white">
        {items.map((item) => (
          <details key={item.q} className="group px-5 py-4">
            <summary className="flex items-center justify-between gap-4 font-display text-base font-semibold text-ink sm:text-lg">
              {item.q}
              <span
                aria-hidden="true"
                className="faq-chevron shrink-0 text-ledger transition-transform"
              >
                <svg aria-hidden="true" width="14" height="9" viewBox="0 0 14 9" fill="none">
                  <path
                    d="M1 1l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </summary>
            <p className="mt-3 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
