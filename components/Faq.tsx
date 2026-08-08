"use client";

/**
 * What: Reusable FAQ accordion (brief §6) - one item open at a time, first item open by
 *       default, button + aria-expanded, animated height - plus FAQPage JSON-LD.
 * Why: FAQ appears on home, industry, and service pages; the brief requires a real
 *      single-open accordion rather than independent native <details> elements (which
 *      let every item stay open simultaneously and can't default the first one open
 *      without JS). The schema makes every Q&A extractable by search engines and LLM
 *      crawlers.
 * How: Client component; open index in state, grid-rows animation for smooth height
 *      (no JS height measurement needed). Emitting the JSON-LD here guarantees schema
 *      and visible copy never drift.
 * From Where: TheSkillCorner marketing site build brief, 2026-06; schema added in the
 *             SEO + AI-indexing pass, 2026-06; rebuilt to the §6 accordion spec 2026-08.
 * When: 2026-08.
 */

import { useId, useState } from "react";
import { JsonLd } from "@/components/JsonLd";
import type { FaqItem } from "@/content/faq";
import { faqPageJsonLd } from "@/lib/structured-data";

interface FaqProps {
  items: readonly FaqItem[];
  title?: string;
}

export function Faq({ items, title = "Questions owners actually ask" }: FaqProps) {
  const [openIndex, setOpenIndex] = useState(0);
  const baseId = useId();

  return (
    <section aria-labelledby="faq-heading" className="bg-mist">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <JsonLd data={faqPageJsonLd(items)} />
        <h2 id="faq-heading" className="font-display text-3xl font-bold sm:text-4xl">
          {title}
        </h2>
        <div className="mt-8 divide-y divide-line rounded-card border-[1.5px] border-line bg-white">
          {items.map((item, index) => {
            const open = index === openIndex;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-base font-semibold text-navy transition-colors hover:text-blue-500 sm:text-lg"
                  >
                    {item.q}
                    <span
                      aria-hidden="true"
                      className={`shrink-0 text-blue-500 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
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
                  </button>
                </h3>
                <section
                  id={panelId}
                  aria-labelledby={buttonId}
                  className="grid transition-[grid-template-rows] duration-220 ease-[cubic-bezier(0.2,0,0,1)]"
                  style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 leading-relaxed">{item.a}</p>
                  </div>
                </section>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
