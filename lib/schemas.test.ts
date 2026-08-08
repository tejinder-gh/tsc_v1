/**
 * What: Unit tests for the lead validation schemas shared by forms and /api/lead.
 * Why: The webhook is the only data boundary in v1; these schemas are the gate that
 *      keeps junk and oversized payloads out of the CRM.
 * How: Vitest over zod safeParse results - required fields, the email-or-message rule,
 *      segment enum, and size limits.
 * From Where: House testing rules (validate at system boundaries), 2026-06.
 * When: 2026-06.
 */

import { describe, expect, it } from "vitest";
import {
  checklistFormSchema,
  contactFormSchema,
  leadSchema,
  quickQuestionSchema,
  roiReportSchema,
} from "./schemas";

describe("leadSchema", () => {
  it("accepts a minimal email-only lead and defaults segment to unknown", () => {
    const result = leadSchema.safeParse({ lead_source: "checklist_page", email: "a@b.co" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.segment).toBe("unknown");
  });

  it("accepts a message-only lead (no email)", () => {
    const result = leadSchema.safeParse({
      lead_source: "quick_widget",
      message: "Can you automate my ordering?",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a lead with neither email nor message", () => {
    const result = leadSchema.safeParse({ lead_source: "roi_calculator" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown segment value", () => {
    const result = leadSchema.safeParse({
      lead_source: "contact_form",
      email: "a@b.co",
      segment: "enterprise",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing lead_source", () => {
    const result = leadSchema.safeParse({ email: "a@b.co" });
    expect(result.success).toBe(false);
  });

  it("rejects an oversized message", () => {
    const result = leadSchema.safeParse({
      lead_source: "contact_form",
      email: "a@b.co",
      message: "x".repeat(3001),
    });
    expect(result.success).toBe(false);
  });

  it("parses with the honeypot field absent, empty, or filled (rejection is the route's job)", () => {
    const absent = leadSchema.safeParse({ lead_source: "contact_form", email: "a@b.co" });
    expect(absent.success).toBe(true);
    if (absent.success) expect(absent.data.website).toBeUndefined();

    const filled = leadSchema.safeParse({
      lead_source: "contact_form",
      email: "a@b.co",
      website: "http://spam.example",
    });
    expect(filled.success).toBe(true);
    if (filled.success) expect(filled.data.website).toBe("http://spam.example");
  });

  it("rejects an oversized honeypot value", () => {
    const result = leadSchema.safeParse({
      lead_source: "contact_form",
      email: "a@b.co",
      website: "x".repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it("carries ROI numbers through when valid", () => {
    const result = leadSchema.safeParse({
      lead_source: "roi_calculator",
      email: "a@b.co",
      segment: "local",
      roi_hours_per_week: 10,
      roi_hourly_cost: 35,
      roi_annual_cost: 18200,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.roi_annual_cost).toBe(18200);
  });
});

describe("contactFormSchema", () => {
  it("requires step-one fields (name, business, email, business type)", () => {
    expect(
      contactFormSchema.safeParse({
        name: "Sam",
        business: "Sam's Corner Store",
        email: "sam@store.ca",
        businessType: "convenience-store",
      }).success,
    ).toBe(true);
    expect(
      contactFormSchema.safeParse({
        name: "",
        business: "Sam's Corner Store",
        email: "sam@store.ca",
        businessType: "convenience-store",
      }).success,
    ).toBe(false);
    expect(
      contactFormSchema.safeParse({
        name: "Sam",
        email: "sam@store.ca",
        businessType: "convenience-store",
      }).success,
    ).toBe(false);
  });

  it("treats step-two fields (phone, message, budget) as optional", () => {
    expect(
      contactFormSchema.safeParse({
        name: "Sam",
        business: "Sam's Corner Store",
        email: "sam@store.ca",
        businessType: "convenience-store",
        phone: "437-555-0100",
        message: "Ordering takes me five hours every Sunday.",
      }).success,
    ).toBe(true);
  });
});

describe("checklistFormSchema", () => {
  it("rejects an invalid email", () => {
    expect(
      checklistFormSchema.safeParse({ email: "not-an-email", businessType: "restaurant" }).success,
    ).toBe(false);
  });
});

describe("quickQuestionSchema", () => {
  it("requires a question of at least a few characters", () => {
    expect(quickQuestionSchema.safeParse({ email: "a@b.co", message: "Hi" }).success).toBe(false);
    expect(
      quickQuestionSchema.safeParse({ email: "a@b.co", message: "Do you work with Square?" })
        .success,
    ).toBe(true);
  });
});

describe("honeypot on form schemas", () => {
  // The field must survive each PER-FORM schema or zodResolver strips it
  // client-side before submit and the server check never sees it.
  it("every form schema declares and carries the website honeypot field", () => {
    const cases = [
      contactFormSchema.safeParse({
        name: "Sam",
        business: "Sam's Corner Store",
        email: "sam@store.ca",
        businessType: "convenience-store",
        website: "http://spam.example",
      }),
      checklistFormSchema.safeParse({
        email: "a@b.co",
        businessType: "restaurant",
        website: "http://spam.example",
      }),
      quickQuestionSchema.safeParse({
        email: "a@b.co",
        message: "Do you work with Square?",
        website: "http://spam.example",
      }),
      roiReportSchema.safeParse({ email: "a@b.co", website: "http://spam.example" }),
    ];
    for (const result of cases) {
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.website).toBe("http://spam.example");
    }
  });
});
