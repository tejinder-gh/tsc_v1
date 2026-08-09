/**
 * What: /contact.vcf - a downloadable vCard for the founder, generated from content/site.ts.
 * Why: /social exists for people scanning the founder's physical business card - "save my
 *      contact" needs to actually add a contact, not just show a phone number to retype.
 *      Single-sourced from site.ts so it can never drift from the number/email shown
 *      elsewhere on the site.
 * How: Statically-generated route handler returning text/vcard (vCard 3.0), following the
 *      same root-level file-route pattern as /pricing.md and /llms.txt.
 * From Where: Founder request, 2026-08 - the /social business-card landing page.
 * When: 2026-08.
 */

import { site } from "@/content/site";

export const dynamic = "force-static";

function buildVCard(): string {
  const phone = site.phone.replace(/[^+\d]/g, "");
  // vCard N is exactly 5 semicolon-separated components: FamilyName;GivenName;
  // Additional;Prefix;Suffix. site.principal.name is a single free-text string, so
  // the last word becomes the family name and everything before it the given name
  // - avoids guessing at which word is a real middle name.
  const nameParts = site.principal.name.split(" ");
  const familyName = nameParts[nameParts.length - 1];
  const givenName = nameParts.slice(0, -1).join(" ");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${familyName};${givenName};;;`,
    `FN:${site.principal.name}`,
    `ORG:${site.legalName}`,
    `TITLE:${site.principal.title}`,
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
