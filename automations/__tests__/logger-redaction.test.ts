import { describe, expect, it, vi } from "vitest";
import {
  consoleLogger,
  PROHIBITED_LOG_KEYS,
  sanitizeLogFields,
  sanitizeLogValue,
} from "../core/logger";

describe("Logger PII and Sensitive Data Redaction", () => {
  it("defines standard prohibited keys", () => {
    const requiredKeys = [
      "body",
      "messagebody",
      "subject",
      "email",
      "phone",
      "to",
      "from",
      "contact",
      "authorization",
      "apikey",
      "token",
      "url",
      "secret",
      "password",
      "summary",
    ];

    for (const key of requiredKeys) {
      expect(PROHIBITED_LOG_KEYS.has(key)).toBe(true);
    }
  });

  it("recursively strips prohibited keys from nested objects and arrays", () => {
    const rawPayload = {
      clientId: "client-123",
      channel: "sms",
      to: "+14165550114",
      from: "+15550000000",
      contact: "+14165550114",
      subject: "Appointment Reminder",
      body: "Hi John, your booking is confirmed.",
      messageBody: "Secret message",
      metadata: {
        email: "john@example.com",
        phone: "555-123-4567",
        authorization: "Bearer secret-token",
        apiKey: "sk-live-12345",
        token: "tok_abc",
        url: "https://crm.provider.internal/webhook",
        secret: "super-secret",
        password: "super-password",
        summary: "Inbound handoff containing private patient notes",
        safeCategory: "reminder_dispatch",
      },
      tags: ["active", "inbound"],
      subArray: [
        { email: "nested@example.com", valid: true },
        { to: "555", status: "ok" },
      ],
    };

    const sanitized = sanitizeLogFields(rawPayload);

    expect(sanitized).toEqual({
      clientId: "client-123",
      channel: "sms",
      metadata: {
        safeCategory: "reminder_dispatch",
      },
      tags: ["active", "inbound"],
      subArray: [{ valid: true }, { status: "ok" }],
    });

    const serialized = JSON.stringify(sanitized);
    for (const prohibited of [
      "john@example.com",
      "+14165550114",
      "secret-token",
      "sk-live-12345",
      "super-secret",
      "super-password",
      "private patient notes",
      "Secret message",
      "Appointment Reminder",
    ]) {
      expect(serialized.includes(prohibited)).toBe(false);
    }
  });

  it("converts raw Error instances into safe name and code descriptors without leaking stack or raw message", () => {
    const error = new Error("Database connection string postgresql://user:pass@ep-host/db failed");
    (error as unknown as { code: string }).code = "ECONNREFUSED";

    const sanitized = sanitizeLogValue(error);

    expect(sanitized).toEqual({
      name: "Error",
      code: "ECONNREFUSED",
    });

    const errorNoCode = new TypeError("Cannot read properties of undefined");
    const sanitizedTypeError = sanitizeLogValue(errorNoCode);

    expect(sanitizedTypeError).toEqual({
      name: "TypeError",
      code: "ERROR",
    });
  });

  it("consoleLogger emits valid JSON without PII", () => {
    const stdoutSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const stderrSpy = vi.spyOn(process.stderr, "write").mockImplementation(() => true);

    try {
      consoleLogger.info("inbound processed", {
        clientId: "radiance-salon",
        contact: "+14165550114",
        to: "+14165550114",
        intent: "opt_out",
        confidence: 1,
        actionsCount: 1,
      });

      expect(stdoutSpy).toHaveBeenCalledTimes(1);
      const output = String(stdoutSpy.mock.calls[0][0]);
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe("info");
      expect(parsed.message).toBe("inbound processed");
      expect(parsed.clientId).toBe("radiance-salon");
      expect(parsed.intent).toBe("opt_out");
      expect(parsed.confidence).toBe(1);
      expect(parsed.actionsCount).toBe(1);
      expect(parsed.contact).toBeUndefined();
      expect(parsed.to).toBeUndefined();
      expect(output.includes("+14165550114")).toBe(false);
    } finally {
      stdoutSpy.mockRestore();
      stderrSpy.mockRestore();
    }
  });
});
