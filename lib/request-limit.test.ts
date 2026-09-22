import { describe, expect, it } from "vitest";
import { readBoundedBody } from "./request-limit";

describe("readBoundedBody", () => {
  it("processes normal body under limit", async () => {
    const text = JSON.stringify({ hello: "world" });
    const req = new Request("http://localhost/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: text,
    });

    const res = await readBoundedBody(req, 1024);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.text).toBe(text);
      expect(res.buffer.byteLength).toBe(new TextEncoder().encode(text).byteLength);
    }
  });

  it("rejects early when Content-Length exceeds limit", async () => {
    const req = new Request("http://localhost/test", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": "2000" },
      body: "small",
    });

    const res = await readBoundedBody(req, 1024);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.status).toBe(413);
      expect(res.error).toBe("Payload too large");
    }
  });

  it("rejects when actual stream exceeds limit without Content-Length", async () => {
    const large = "a".repeat(2000);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(large));
        controller.close();
      },
    });

    const req = new Request("http://localhost/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: stream,
      // @ts-expect-error duplex required for stream body in Node
      duplex: "half",
    });

    const res = await readBoundedBody(req, 1024);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.status).toBe(413);
      expect(res.error).toBe("Payload too large");
    }
  });

  it("rejects when Content-Length claims small value but actual stream exceeds limit", async () => {
    const large = "a".repeat(2000);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(large));
        controller.close();
      },
    });

    const req = new Request("http://localhost/test", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": "10" },
      body: stream,
      // @ts-expect-error duplex required for stream body in Node
      duplex: "half",
    });

    const res = await readBoundedBody(req, 1024);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.status).toBe(413);
      expect(res.error).toBe("Payload too large");
    }
  });

  it("handles empty body safely", async () => {
    const req = new Request("http://localhost/test", {
      method: "POST",
    });

    const res = await readBoundedBody(req, 1024);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.text).toBe("");
      expect(res.buffer.byteLength).toBe(0);
    }
  });
});
