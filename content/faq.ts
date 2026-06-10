/**
 * What: Home-page FAQ content - the six questions every prospect asks before booking.
 * Why: Objection handling on the page reduces drop-off before the booking CTA; kept in
 *      content so answers can be tuned without touching components.
 * How: Simple typed array consumed by the shared Faq accordion component.
 * From Where: TheSkillCorner marketing site build brief, 2026-06.
 * When: 2026-06; revisit as real sales objections come in.
 */

export interface FaqItem {
  q: string;
  a: string;
}

export const homeFaq: readonly FaqItem[] = [
  {
    q: "How much does it cost?",
    a: "Local businesses start with fixed packages from $395/month, setup included. Practices and firms get custom builds - typical engagements run $7,500 to $25,000 with support from $750/month. Either way, you get an exact quote after the free audit, and the audit costs nothing.",
  },
  {
    q: "How long until something is actually running?",
    a: "Simple builds like missed-call answering go live inside a week. Most projects take two to four weeks from audit to launch. Nothing ships until you have tested it yourself.",
  },
  {
    q: "Do you work with the tools I already have?",
    a: "Yes - that is the default. Square, Clover, Jane, Cliniko, Clio, QuickBooks, Google Workspace, and thousands of other apps. We connect to what you have; we almost never ask you to switch systems.",
  },
  {
    q: "What about patient and client privacy?",
    a: "We design for PIPEDA and PHIPA from the start: minimal data collection, processing inside your existing systems where possible, and no patient or client records stored by us without a signed agreement. We will walk through data flow in plain English before anything is built.",
  },
  {
    q: "What happens if an automation breaks?",
    a: "Every build is monitored. If a connected tool changes or something fails, we get an alert and fix it - within one business day on every plan. Nothing fails silently: anything an automation cannot handle falls back to a human inbox.",
  },
  {
    q: "Do I need technical staff to use this?",
    a: "No. We build it, host it, and maintain it. If you can use email, you can run everything we hand over. Your team gets a one-page guide per automation, written for people who have better things to do.",
  },
] as const;
