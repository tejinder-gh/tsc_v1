/**
 * What: A second example client - "BrightSmile Dental", a professional practice - running a
 *       different mix of automations (reminders, invoice dunning, lead responder, review responder)
 *       on the exact same engine. Proof of "write once, sell many".
 * Why: The practice segment monetizes differently (higher-value, compliance-aware) yet needs zero
 *       new engine code - only a different config object and a different set of enabled recipes.
 * How: Same shape as radiance-salon.ts: a validated ClientConfig plus a demo dataset (stand-in for
 *       Jane + QuickBooks + Google Business Profile) anchored to DEMO_NOW.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import { type ClientConfig, loadClientConfig } from "../core/config";
import type { MemoryDataset } from "../integrations/memory";
import { D, H, rel } from "./demo-clock";

export const brightSmileDentalConfig: ClientConfig = loadClientConfig({
  id: "brightsmile-dental",
  business: {
    name: "BrightSmile Dental",
    segment: "practice",
    timezone: "America/Toronto",
    locale: "en-CA",
    brandVoice: "Calm, professional, and reassuring - clinical confidence without jargon.",
    replyTo: "reception@brightsmile.ca",
    bookingLink: "https://brightsmile.ca/book",
    reviewLink: "https://g.page/r/brightsmile-dental/review",
  },
  channels: {
    sms: { provider: "twilio", fromEnv: "BRIGHTSMILE_TWILIO_FROM" },
    email: {
      provider: "sendgrid",
      fromAddress: "reception@brightsmile.ca",
      fromName: "BrightSmile Dental",
    },
    quietHours: { start: "20:00", end: "08:00" },
    dryRun: true,
  },
  notify: {
    "front-desk": { sms: "+14165550201", email: "reception@brightsmile.ca" },
  },
  automations: [
    {
      id: "reminders",
      recipe: "booking-reminders",
      enabled: true,
      config: { reminderWindowDays: 8 },
    },
    { id: "dunning", recipe: "invoice-reminders", enabled: true, config: {} },
    {
      id: "intake-leads",
      recipe: "lead-responder",
      enabled: true,
      config: {
        lookbackHours: 48,
        qualify: {
          keywords: ["emergency", "urgent", "pain", "root canal"],
          notifyTo: "front-desk",
        },
      },
    },
    {
      id: "reputation",
      recipe: "review-responder",
      enabled: true,
      config: { lookbackDays: 3, negativeMaxRating: 3, notifyTo: "front-desk" },
    },
  ],
});

/** Stand-in for BrightSmile's Jane + QuickBooks + Google data, anchored to DEMO_NOW. */
export const brightSmileDentalData: MemoryDataset = {
  appointments: [
    {
      id: "appt-cleaning",
      contact: {
        id: "p-maria",
        name: "Maria Gomez",
        phone: "+14165550210",
        email: "maria@example.com",
        consent: { sms: true, email: true },
        timezone: "America/Toronto",
      },
      startAt: rel(24 * H), // 24h reminder due now
      service: "hygiene cleaning",
      staff: "Dr. Lee",
      status: "booked",
    },
  ],
  invoices: [
    {
      id: "inv-1042",
      contact: {
        id: "p-omar",
        name: "Omar Said",
        email: "omar@example.com",
        phone: "+14165550211",
        consent: { sms: true, email: true },
        timezone: "America/Toronto",
      },
      number: "1042",
      amount: 240,
      currency: "CAD",
      issuedAt: rel(-30 * D),
      dueAt: rel(-3 * D), // 3 days past due → first dunning email due now
      status: "open",
      payLink: "https://brightsmile.ca/pay/1042",
    },
  ],
  leads: [
    {
      id: "lead-emergency",
      contact: {
        id: "l-jess",
        name: "Jess Bauer",
        phone: "+14165550212",
        email: "jess@example.com",
        consent: { sms: true, email: true },
        timezone: "America/Toronto",
      },
      createdAt: rel(-1 * H),
      source: "website form",
      message: "I have severe tooth pain, is this an emergency you can see today?",
    },
  ],
  reviews: [
    {
      id: "rev-happy",
      platform: "google",
      author: "Tom W.",
      rating: 5,
      text: "Painless cleaning and the friendliest front desk. Highly recommend!",
      createdAt: rel(-12 * H),
    },
    {
      id: "rev-unhappy",
      platform: "google",
      author: "Priya S.",
      rating: 2,
      text: "Waited 40 minutes past my appointment time. Disappointed.",
      createdAt: rel(-18 * H),
    },
  ],
};
