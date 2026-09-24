import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sanitizeEmailHeader, sendResendEmail, sendSendGridEmail } from "../transport";

interface SendGridTestPayload {
  subject?: string;
  personalizations?: Array<{ to: Array<{ email: string; name?: string }> }>;
  reply_to?: { email: string };
  custom_args?: Record<string, string>;
  headers?: Record<string, string>;
}

interface ResendTestPayload {
  from?: string;
  to?: string[];
  subject?: string;
  text?: string;
  headers?: Record<string, string>;
}

describe("Shared Email Transport Infrastructure", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("sanitizeEmailHeader", () => {
    it("strips CRLF and control characters preventing header injection", () => {
      const malicious = "legit@example.com\r\nBcc: victim@example.com\x00\x1f";
      const sanitized = sanitizeEmailHeader(malicious);
      expect(sanitized).toBe("legit@example.com Bcc: victim@example.com");
      expect(sanitized).not.toContain("\r");
      expect(sanitized).not.toContain("\n");
      expect(sanitized).not.toContain("\x00");
    });
  });

  describe("sendSendGridEmail", () => {
    it("successfully sends an email and extracts x-message-id", async () => {
      let requestUrl: string | undefined;
      let requestBody: SendGridTestPayload = {};
      let authHeader: string | null = null;

      globalThis.fetch = vi.fn().mockImplementation((url, init) => {
        requestUrl = url.toString();
        requestBody = JSON.parse(init.body as string) as SendGridTestPayload;
        authHeader = init.headers?.Authorization;
        return Promise.resolve(
          new Response(null, {
            status: 202,
            headers: { "x-message-id": "sg-test-id-12345" },
          }),
        );
      });

      const res = await sendSendGridEmail(
        {
          from: { email: "sender@theskillcorner.com", name: "Sender" },
          to: [{ email: "client@example.com", name: "Client" }],
          subject: "Test Subject\r\n",
          text: "Hello plain text",
          replyTo: "support@theskillcorner.com",
          customArgs: { eventId: "evt-123" },
        },
        { apiKey: "SG.secret-key" },
      );

      expect(res.ok).toBe(true);
      expect(res.provider).toBe("sendgrid");
      expect(res.messageId).toBe("sg-test-id-12345");
      expect(res.statusCode).toBe(202);

      expect(requestUrl).toBe("https://api.sendgrid.com/v3/mail/send");
      expect(authHeader).toBe("Bearer SG.secret-key");
      expect(requestBody.subject).toBe("Test Subject");
      expect(requestBody.personalizations?.[0]?.to).toEqual([
        { email: "client@example.com", name: "Client" },
      ]);
      expect(requestBody.reply_to).toEqual({ email: "support@theskillcorner.com" });
      expect(requestBody.custom_args).toEqual({ eventId: "evt-123" });
    });

    it("classifies 429 rate limit or 500 server error as retryable", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response("Too Many Requests", {
          status: 429,
        }),
      );

      const res = await sendSendGridEmail(
        {
          from: "sender@example.com",
          to: "client@example.com",
          subject: "Rate limited",
          text: "Test",
        },
        { apiKey: "SG.key" },
      );

      expect(res.ok).toBe(false);
      expect(res.retryable).toBe(true);
      expect(res.statusCode).toBe(429);
      expect(res.error).toContain("429");
    });

    it("classifies 400 client error as non-retryable", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response("Bad Request: Invalid email format", {
          status: 400,
        }),
      );

      const res = await sendSendGridEmail(
        {
          from: "sender@example.com",
          to: "invalid-email",
          subject: "Invalid",
          text: "Test",
        },
        { apiKey: "SG.key" },
      );

      expect(res.ok).toBe(false);
      expect(res.retryable).toBe(false);
      expect(res.statusCode).toBe(400);
    });

    it("classifies network errors and timeouts as retryable", async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error("Connection reset by peer"));

      const res = await sendSendGridEmail(
        {
          from: "sender@example.com",
          to: "client@example.com",
          subject: "Timeout",
          text: "Test",
        },
        { apiKey: "SG.key" },
      );

      expect(res.ok).toBe(false);
      expect(res.retryable).toBe(true);
      expect(res.error).toContain("Connection reset by peer");
    });
  });

  describe("sendResendEmail", () => {
    it("successfully sends an email and extracts json id", async () => {
      let requestUrl: string | undefined;
      let requestBody: ResendTestPayload = {};

      globalThis.fetch = vi.fn().mockImplementation((url, init) => {
        requestUrl = url.toString();
        requestBody = JSON.parse(init.body as string) as ResendTestPayload;
        return Promise.resolve(
          new Response(JSON.stringify({ id: "resend-msg-777" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      });

      const res = await sendResendEmail(
        {
          from: "Sender <sender@theskillcorner.com>",
          to: ["client@example.com"],
          subject: "Resend Subject",
          text: "Hello from Resend",
          headers: { "X-Test": "1" },
        },
        { apiKey: "re_secret_key" },
      );

      expect(res.ok).toBe(true);
      expect(res.provider).toBe("resend");
      expect(res.messageId).toBe("resend-msg-777");
      expect(requestUrl).toBe("https://api.resend.com/emails");
      expect(requestBody.headers).toEqual({ "X-Test": "1" });
    });

    it("classifies 500 server error as retryable", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response("Internal Server Error", {
          status: 500,
        }),
      );

      const res = await sendResendEmail(
        {
          from: "sender@example.com",
          to: "client@example.com",
          subject: "Server error",
          text: "Test",
        },
        { apiKey: "re_key" },
      );

      expect(res.ok).toBe(false);
      expect(res.retryable).toBe(true);
      expect(res.statusCode).toBe(500);
    });
  });
});
