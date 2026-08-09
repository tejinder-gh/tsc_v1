/**
 * What: /contact.vcf - a downloadable organization vCard for The Skill Corner, generated
 *       from content/site.ts. Represents the company, not an individual.
 * Why: /social exists for people scanning the company's physical business card - "save our
 *      contact" needs to actually add a contact, not just show a phone number to retype.
 *      Single-sourced from site.ts so it can never drift from the number/email shown
 *      elsewhere on the site. Deliberately company-branded (FN/ORG both the company name,
 *      no personal N) per explicit direction: this card is TSC's, not a person's.
 * How: Statically-generated route handler returning text/vcard (vCard 3.0), following the
 *      same root-level file-route pattern as /pricing.md and /llms.txt. X-ABShowAs:COMPANY
 *      is an Apple/Google-recognized hint that tells contact apps to file this as an
 *      organization card rather than a person.
 * From Where: Founder request, 2026-08 - the /social business-card landing page; re-scoped
 *      to company-only framing same day.
 * When: 2026-08.
 */

import { site } from "@/content/site";

export const dynamic = "force-static";

function buildVCard(): string {
  const phone = site.phone.replace(/[^+\d]/g, "");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:;;;;",
    `FN:${site.name}`,
    `ORG:${site.legalName}`,
    "X-ABShowAs:COMPANY",
    `TEL;TYPE=WORK,VOICE:${phone}`,
    `EMAIL;TYPE=WORK:${site.email}`,
    `URL:${site.url}`,
    "END:VCARD",
    "",
  ].join("\r\n");
}

export function GET(): Response {
  return new Response(buildVCard(), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="contact.vcf"',
    },
  });
}
