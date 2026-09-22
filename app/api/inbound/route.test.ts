import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function makeTwilioSignature(
  url: string,
  params: Record<string, string>,
  authToken: string,
): string {
  const data =
    url +
    Object.keys(params)
      .sort()
      .map((k) => k + params[k])
      .join("");
  return createHmac("sha1", authToken).update(Buffer.from(data, "utf-8")).digest("base64");
}

describe("POST /api/inbound security & signature verification", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    delete process.env.TWILIO_AUTH_TOKEN;
    delete process.env.PUBLIC_INBOUND_URL;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("rejects payload exceeding 32KB with 413", async () => {
    const req = new Request("http://localhost:3000/api/inbound", {
      method: "POST",
      headers: {
        "content-length": "35000",
      },
    });
    const res = await POST(req);
    expect(res.status).toBe(413);
  });

  it("rejects actual payload exceeding 32KB with 413", async () => {
    const params = new URLSearchParams();
    params.set("From", "+14165550114");
    params.set("To", "+15550000000");
    params.set("Body", "x".repeat(35000));

    const req = new Request("http://localhost:3000/api/inbound", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const res = await POST(req);
    expect(res.status).toBe(413);
  });

  it("rejects actual payload exceeding 32KB when Content-Length is absent with 413", async () => {
    const params = new URLSearchParams();
    params.set("From", "+14165550114");
    params.set("To", "+15550000000");
    params.set("Body", "x".repeat(35000));
    const raw = params.toString();

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(raw));
        controller.close();
      },
    });

    const req = new Request("http://localhost:3000/api/inbound", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: stream,
      // @ts-expect-error duplex required for ReadableStream body in Node
      duplex: "half",
    });
    const res = await POST(req);
    expect(res.status).toBe(413);
  });

  it("rejects actual payload exceeding 32KB when Content-Length claims small value with 413", async () => {
    const params = new URLSearchParams();
    params.set("From", "+14165550114");
    params.set("To", "+15550000000");
    params.set("Body", "x".repeat(35000));
    const raw = params.toString();

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(raw));
        controller.close();
      },
    });

    const req = new Request("http://localhost:3000/api/inbound", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "content-length": "10",
      },
      body: stream,
      // @ts-expect-error duplex required for ReadableStream body in Node
      duplex: "half",
    });
    const res = await POST(req);
    expect(res.status).toBe(413);
  });

  it("fails closed in production with 500 when TWILIO_AUTH_TOKEN is missing", async () => {
    process.env.VERCEL_ENV = "production";
    delete process.env.TWILIO_AUTH_TOKEN;

    const formData = new FormData();
    formData.append("From", "+14165550114");
    formData.append("To", "+15550000000");
    formData.append("Body", "STOP");

    const req = new Request("http://localhost:3000/api/inbound", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(await res.text()).toBe("Configuration error");
  });

  it("rejects request with 403 if signature is missing when auth token is configured", async () => {
    process.env.TWILIO_AUTH_TOKEN = "secret-token-123";

    const formData = new FormData();
    formData.append("From", "+14165550114");
    formData.append("To", "+15550000000");
    formData.append("Body", "Hello");

    const req = new Request("http://localhost:3000/api/inbound", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
    expect(await res.text()).toBe("Invalid signature");
  });

  it("rejects request with 403 if signature is invalid", async () => {
    process.env.TWILIO_AUTH_TOKEN = "secret-token-123";

    const formData = new FormData();
    formData.append("From", "+14165550114");
    formData.append("To", "+15550000000");
    formData.append("Body", "Hello");

    const req = new Request("http://localhost:3000/api/inbound", {
      method: "POST",
      headers: {
        "x-twilio-signature": "forged-or-invalid-signature",
      },
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("accepts valid Twilio signature", async () => {
    const token = "secret-token-123";
    process.env.TWILIO_AUTH_TOKEN = token;
    const url = "http://localhost:3000/api/inbound";
    process.env.PUBLIC_INBOUND_URL = url;

    const params: Record<string, string> = {
      From: "+14165550114",
      To: "+15550000000",
      Body: "STATUS",
      MessageSid: "SM12345",
    };

    const signature = makeTwilioSignature(url, params, token);

    const formData = new FormData();
    for (const [k, v] of Object.entries(params)) {
      formData.append(k, v);
    }

    const req = new Request(url, {
      method: "POST",
      headers: {
        "x-twilio-signature": signature,
      },
      body: formData,
    });

    const res = await POST(req);
    // Even if client is unknown number, it returns 200 with empty TwiML
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/xml");
  });

  it("fails closed in development (500) when TWILIO_AUTH_TOKEN is missing and ALLOW_UNSIGNED_TWILIO_WEBHOOKS_DEV is not set", async () => {
    delete process.env.TWILIO_AUTH_TOKEN;
    delete process.env.ALLOW_UNSIGNED_TWILIO_WEBHOOKS_DEV;
    (process.env as Record<string, string | undefined>).NODE_ENV = "development";
    delete process.env.VERCEL_ENV;

    const formData = new FormData();
    formData.append("From", "+14165550114");
    formData.append("To", "+15550000000");
    formData.append("Body", "STATUS");

    const req = new Request("http://localhost:3000/api/inbound", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(await res.text()).toBe("Configuration error");
  });

  it("permits unsigned inbound in development only when ALLOW_UNSIGNED_TWILIO_WEBHOOKS_DEV=true", async () => {
    delete process.env.TWILIO_AUTH_TOKEN;
    process.env.ALLOW_UNSIGNED_TWILIO_WEBHOOKS_DEV = "true";
    (process.env as Record<string, string | undefined>).NODE_ENV = "development";
    delete process.env.VERCEL_ENV;

    const formData = new FormData();
    formData.append("From", "+14165550114");
    formData.append("To", "+15550000000");
    formData.append("Body", "STATUS");
    formData.append("MessageSid", "SM12345");

    const req = new Request("http://localhost:3000/api/inbound", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/xml");
  });

  it("never permits ALLOW_UNSIGNED_TWILIO_WEBHOOKS_DEV to bypass verification in production", async () => {
    delete process.env.TWILIO_AUTH_TOKEN;
    process.env.ALLOW_UNSIGNED_TWILIO_WEBHOOKS_DEV = "true";
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    process.env.VERCEL_ENV = "production";

    const formData = new FormData();
    formData.append("From", "+14165550114");
    formData.append("To", "+15550000000");
    formData.append("Body", "STATUS");

    const req = new Request("http://localhost:3000/api/inbound", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(await res.text()).toBe("Configuration error");
  });
});
