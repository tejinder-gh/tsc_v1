import type { ErrorEvent as SentryEvent } from "@sentry/nextjs";
import { describe, expect, it } from "vitest";
import { sanitizeObject, sanitizeSentryEvent, sanitizeString } from "../scrubber";

describe("Telemetry Scrubber: PII, Secrets & Payment Redaction", () => {
  describe("sanitizeString", () => {
    it("redacts email addresses", () => {
      const input = "User reached out from founder@startup.io to enquire";
      expect(sanitizeString(input)).toBe("User reached out from [REDACTED_EMAIL] to enquire");
    });

    it("redacts North American and international phone numbers", () => {
      const input = "Contact caller at +1 (416) 555-0199 or 416-555-0123";
      const sanitized = sanitizeString(input);
      expect(sanitized).not.toContain("416) 555-0199");
      expect(sanitized).not.toContain("416-555-0123");
      expect(sanitized).toContain("[REDACTED_PHONE]");
    });

    it("redacts credit card and payment card numbers (13-19 digits)", () => {
      const visaCard = "Card number 4111 2222 3333 4444 provided";
      expect(sanitizeString(visaCard)).toBe("Card number [REDACTED_PAYMENT_DATA] provided");

      const mastercard = "Payment card 5500000000000004 processed";
      expect(sanitizeString(mastercard)).toBe("Payment card [REDACTED_PAYMENT_DATA] processed");
    });

    it("redacts Bearer and JWT tokens", () => {
      const token = "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-ID";
      expect(sanitizeString(token)).toContain("[REDACTED_TOKEN]");
      expect(sanitizeString(token)).not.toContain("eyJhbGciOi");
    });

    it("redacts database credentials in connection strings", () => {
      const dbUrl =
        "postgres://skill_corner_admin:superSecretPass123@ep-cool-db.aws.neon.tech/neondb?sslmode=require";
      const sanitized = sanitizeString(dbUrl);
      expect(sanitized).not.toContain("superSecretPass123");
      expect(sanitized).toContain("[REDACTED_SECRET]");
    });
  });

  describe("sanitizeObject", () => {
    it("strips denylist keys and sanitizes values", () => {
      const payload = {
        name: "Alice Smith",
        email: "alice@example.com",
        phone: "+14165551234",
        message: "Need help automating payroll",
        creditCard: "4111222233334444",
        route: "/contact",
        nested: {
          password: "mysecretpassword",
          details: "Contact at bob@example.com for inquiries",
        },
      };

      const result = sanitizeObject(payload) as Record<string, unknown>;
      const nested = result.nested as Record<string, unknown>;

      expect(result.name).toBe("[REDACTED]");
      expect(result.email).toBe("[REDACTED]");
      expect(result.phone).toBe("[REDACTED]");
      expect(result.message).toBe("[REDACTED]");
      expect(result.creditCard).toBe("[REDACTED]");
      expect(result.route).toBe("/contact");
      expect(nested.password).toBe("[REDACTED]");
      expect(nested.details).toBe("Contact at [REDACTED_EMAIL] for inquiries");
    });
  });

  describe("sanitizeSentryEvent (GlitchTip beforeSend)", () => {
    it("preserves stack trace frames intact while sanitizing messages and headers", () => {
      const mockEvent = {
        message: "Failed to process lead from customer@example.com",
        exception: {
          values: [
            {
              type: "Error",
              value: "Connection timeout to postgres://user:secret@db.host/db",
              stacktrace: {
                frames: [
                  {
                    filename: "app/api/lead/route.ts",
                    function: "POST",
                    lineno: 42,
                    colno: 12,
                  },
                ],
              },
            },
          ],
        },
        request: {
          headers: {
            Authorization: "Bearer token1234567890",
            Cookie: "session=xyz123",
            "User-Agent": "Mozilla/5.0",
          },
          data: { email: "lead@business.com" },
        },
        extra: {
          customerNote: "Call +14165550188 immediately",
        },
        user: {
          email: "operator@theskillcorner.com",
          id: "op_123",
        },
      };

      const sanitized = sanitizeSentryEvent(mockEvent as unknown as SentryEvent);
      expect(sanitized).not.toBeNull();
      if (!sanitized) return;

      // Message is scrubbed
      expect(sanitized.message).toBe("Failed to process lead from [REDACTED_EMAIL]");
      // Exception value is scrubbed
      expect(sanitized.exception?.values?.[0]?.value).toBe(
        "Connection timeout to postgres://user:[REDACTED_SECRET]@db.host/db",
      );
      // Stacktrace frames are preserved completely intact
      expect(sanitized.exception?.values?.[0]?.stacktrace?.frames?.[0]).toEqual({
        filename: "app/api/lead/route.ts",
        function: "POST",
        lineno: 42,
        colno: 12,
      });
      // Headers stripped
      expect(sanitized.request?.headers?.Authorization).toBe("[REDACTED]");
      expect(sanitized.request?.headers?.Cookie).toBe("[REDACTED]");
      expect(sanitized.request?.headers?.["User-Agent"]).toBe("Mozilla/5.0");
      expect(sanitized.request?.data).toBe("[REDACTED_PAYLOAD]");
      // Extra data scrubbed
      expect(sanitized.extra?.customerNote).toContain("[REDACTED_PHONE]");
      // User identity stripped
      expect(sanitized.user?.email).toBeUndefined();
    });
  });
});
