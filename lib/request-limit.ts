/**
 * What: Request body reader with strict size boundary enforcement.
 * Why: Content-Length headers can be absent, forged, or inaccurate. Server endpoints
 *      must reject bodies that exceed maximum size boundaries before buffering large
 *      payloads into memory.
 * How: Rejects immediately if Content-Length exceeds maxBytes. Reads the incoming
 *      ReadableStream chunk by chunk, tracking byte length, and cancels the reader
 *      immediately if the cumulative payload size exceeds maxBytes.
 */

export type BoundedBodyResult =
  | { ok: true; buffer: Uint8Array; text: string }
  | { ok: false; status: 413; error: string };

export async function readBoundedBody(
  request: Request,
  maxBytes = 32 * 1024,
): Promise<BoundedBodyResult> {
  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const parsed = Number.parseInt(contentLength, 10);
    if (!Number.isNaN(parsed) && parsed > maxBytes) {
      return { ok: false, status: 413, error: "Payload too large" };
    }
  }

  if (!request.body) {
    return { ok: true, buffer: new Uint8Array(0), text: "" };
  }

  if (typeof request.body.getReader === "function") {
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          totalBytes += value.byteLength;
          if (totalBytes > maxBytes) {
            try {
              await reader.cancel();
            } catch {
              // ignore stream cancellation errors
            }
            return { ok: false, status: 413, error: "Payload too large" };
          }
          chunks.push(value);
        }
      }
    } catch (err) {
      throw err;
    }

    const buffer = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const text = new TextDecoder().decode(buffer);
    return { ok: true, buffer, text };
  }

  // Fallback for mock requests in unit tests that provide text() but no body reader
  if (typeof request.text === "function") {
    const text = await request.text();
    const buffer = new TextEncoder().encode(text);
    if (buffer.byteLength > maxBytes) {
      return { ok: false, status: 413, error: "Payload too large" };
    }
    return { ok: true, buffer, text };
  }

  return { ok: true, buffer: new Uint8Array(0), text: "" };
}
