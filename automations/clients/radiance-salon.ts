/**
 * What: A complete example client - "Radiance Salon", a local salon/spa - showing exactly what an
 *       operator writes to onboard a paying customer: one config object plus the wiring to their
 *       real tools (here, an in-memory demo dataset standing in for Fresha + a POS).
 * Why: This file is the product's value proposition in code. Four automations (reminders, review
 *       booster, no-show rebooking, win-back) are switched on purely by config - no new code - on
 *       the same engine that serves every other client.
 * How: loadClientConfig validates the config at import time (fail fast). demoData seeds the
 *       in-memory integrations so the CLI/tests can run this client end-to-end in dry-run.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import { type ClientConfig, loadClientConfig } from "../core/config";
import type { MemoryDataset } from "../integrations/memory";
import { D, H, rel } from "./demo-clock";

export const radianceSalonConfig: ClientConfig = loadClientConfig({
  id: "radiance-salon",
  business: {
    name: "Radiance Salon",
    segment: "local",
    timezone: "America/Toronto",
    locale: "en-CA",
    brandVoice: "Warm, upbeat, and personal - like a favourite stylist who remembers your name.",
    replyTo: "hello@radiancesalon.ca",
    bookingLink: "https://radiancesalon.ca/book",
    reviewLink: "https://g.page/r/radiance-salon/review",
  },
  channels: {
    sms: { provider: "twilio", fromEnv: "RADIANCE_TWILIO_FROM" },
    email: {
      provider: "sendgrid",
      fromAddress: "hello@radiancesalon.ca",
      fromName: "Radiance Salon",
    },
    quietHours: { start: "21:00", end: "08:00" },
    // Onboard in dry-run: every send prints instead of dialing Twilio/SendGrid. Flip to false to go live.
    dryRun: true,
  },
  notify: {
    owner: { sms: "+14165550101", email: "owner@radiancesalon.ca" },
  },
  automations: [
    {
      id: "reminders",
      recipe: "booking-reminders",
      enabled: true,
      config: { reminderWindowDays: 8 },
    },
    { id: "reviews", recipe: "review-booster", enabled: true, config: { lookbackDays: 2 } },
    { id: "rebook", recipe: "no-show-rebook", enabled: true, config: { lookbackDays: 7 } },
    {
      id: "winback",
      recipe: "win-back",
      enabled: true,
      config: { inactiveDays: 90, offerCode: "WELCOME15" },
    },
  ],
});

/** Stand-in for Radiance's real booking/POS data, anchored to DEMO_NOW. */
export const radianceSalonData: MemoryDataset = {
  appointments: [
    {
      id: "appt-soon",
      contact: {
        id: "c-amara",
        name: "Amara Okafor",
        phone: "+14165550110",
        email: "amara@example.com",
        consent: { sms: true, email: true },
        timezone: "America/Toronto",
      },
      startAt: rel(2 * H), // in 2h → fires the "2h" SMS reminder now
      service: "balayage",
      staff: "Priya",
      status: "booked",
    },
    {
      id: "appt-tomorrow",
      contact: {
        id: "c-liam",
        name: "Liam Chen",
        phone: "+14165550111",
        email: "liam@example.com",
        consent: { sms: true, email: true },
        timezone: "America/Toronto",
      },
      startAt: rel(24 * H), // in 24h → fires the "24h" SMS reminder now
      service: "cut & colour",
      staff: "Jordan",
      status: "booked",
    },
    {
      id: "appt-completed",
      contact: {
        id: "c-sofia",
        name: "Sofia Rossi",
        phone: "+14165550112",
        email: "sofia@example.com",
        consent: { sms: true, email: true },
        timezone: "America/Toronto",
      },
      startAt: rel(-2 * H), // finished 2h ago → review request is due now
      service: "manicure",
      status: "completed",
    },
    {
      id: "appt-noshow",
      contact: {
        id: "c-dev",
        name: "Dev Patel",
        phone: "+14165550113",
        consent: { sms: true, email: false },
        timezone: "America/Toronto",
      },
      startAt: rel(-2 * H), // missed 2h ago → same-day rebooking nudge due now
      service: "beard trim",
      status: "no_show",
    },
  ],
  customers: [
    {
      id: "cust-noor",
      contact: {
        id: "c-noor",
        name: "Noor Haddad",
        phone: "+14165550114",
        email: "noor@example.com",
        consent: { sms: true, email: true },
        timezone: "America/Toronto",
      },
      lastVisitAt: rel(-90 * D), // exactly at the 90-day lapse threshold → win-back check-in due now
      visits: 7,
      topService: "colour refresh",
    },
  ],
};
