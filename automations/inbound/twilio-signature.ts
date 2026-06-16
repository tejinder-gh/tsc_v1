/**
 * What: Twilio request-signature verification - proves an inbound webhook actually came from Twilio
 *       and wasn't forged by someone who guessed the URL.
 * Why: The inbound route is a public endpoint that can opt customers out and trigger replies. Anyone
 *       could POST a fake "STOP" for a rival's number without this check. Verifying the signature is
 *       the mandatory security control on the ingestion edge.
 * How: Twilio signs (full URL + the POST params sorted by key and concatenated) with HMAC-SHA1 keyed
 *       by your auth token, base64-encoded. We recompute it and compare in constant time.
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 *             Algorithm per Twilio's request-validation documentation.
 * When: 2026-06.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * @param url The exact URL Twilio requested (scheme+host+path, no query for POSTs).
 * @param params The POST form fields.
 * @param signature The X-Twilio-Signature header value.
 * @param authToken Your Twilio auth token (from the environment).
 */
export function validateTwilioSignature(
  url: string,
  params: Record<string, string>,
  signature: string,
  authToken: string,
): boolean {
  const data =
    url +
    Object.keys(params)
      .sort()
      .map((key) => key + params[key])
      .join("");
  const expected = createHmac("sha1", authToken)
    .update(Buffer.from(data, "utf-8"))
    .digest("base64");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
