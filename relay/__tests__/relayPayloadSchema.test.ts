import { describe, expect, it } from "vitest";
import { PayloadValidationError } from "../errors/RelayError";
import { buildRelayMessage, validateAndParsePayload } from "../validation/relayPayloadSchema";

describe("relayPayloadSchema & validateAndParsePayload", () => {
  const validEvent = {
    eventId: "748ffec8-47dd-4acb-a908-63bdbbb1d834",
    sender: "VM-HDFCBK",
    body: "Your OTP is 123456",
    receivedAt: "2026-09-16T17:35:44.291Z",
  };

  it("parses and validates a valid payload", () => {
    const raw = JSON.stringify(validEvent);
    const parsed = validateAndParsePayload(raw);

    expect(parsed.eventId).toBe(validEvent.eventId);
    expect(parsed.sender).toBe("VM-HDFCBK");
    expect(parsed.body).toBe("Your OTP is 123456");
    expect(parsed.receivedAt).toBe(validEvent.receivedAt);
    expect(parsed.sim).toBeUndefined();
  });

  it("accepts valid optional dual-SIM metadata", () => {
    const raw = JSON.stringify({
      ...validEvent,
      sim: {
        slotIndex: 0,
        subscriptionId: 101,
      },
    });
    const parsed = validateAndParsePayload(raw);

    expect(parsed.sim?.slotIndex).toBe(0);
    expect(parsed.sim?.subscriptionId).toBe(101);
  });

  it("rejects invalid JSON syntax", () => {
    expect(() => validateAndParsePayload("{not valid json")).toThrow(PayloadValidationError);
  });

  it("rejects non-UUID eventId", () => {
    const raw = JSON.stringify({ ...validEvent, eventId: "not-a-uuid" });
    expect(() => validateAndParsePayload(raw)).toThrow(PayloadValidationError);
  });

  it("rejects sender exceeding 128 characters", () => {
    const raw = JSON.stringify({ ...validEvent, sender: "a".repeat(129) });
    expect(() => validateAndParsePayload(raw)).toThrow(PayloadValidationError);
  });

  it("rejects empty body", () => {
    const raw = JSON.stringify({ ...validEvent, body: "" });
    expect(() => validateAndParsePayload(raw)).toThrow(PayloadValidationError);
  });

  it("rejects body exceeding 4096 characters", () => {
    const raw = JSON.stringify({ ...validEvent, body: "x".repeat(4097) });
    expect(() => validateAndParsePayload(raw)).toThrow(PayloadValidationError);
  });

  it("accepts body exactly 4096 characters", () => {
    const raw = JSON.stringify({ ...validEvent, body: "x".repeat(4096) });
    const parsed = validateAndParsePayload(raw);
    expect(parsed.body).toHaveLength(4096);
  });

  it("rejects invalid receivedAt timestamp", () => {
    const raw = JSON.stringify({ ...validEvent, receivedAt: "yesterday afternoon" });
    expect(() => validateAndParsePayload(raw)).toThrow(PayloadValidationError);
  });

  it("rejects unexpected extra properties (strict mode)", () => {
    const raw = JSON.stringify({ ...validEvent, hackerProperty: "injection" });
    expect(() => validateAndParsePayload(raw)).toThrow(PayloadValidationError);
  });

  it("buildRelayMessage attaches envelope relayId and deviceId to payload", () => {
    const parsed = validateAndParsePayload(JSON.stringify(validEvent));
    const message = buildRelayMessage(parsed, {
      relayId: "india-sms",
      deviceId: "india-phone-primary",
    });

    expect(message.relayId).toBe("india-sms");
    expect(message.deviceId).toBe("india-phone-primary");
    expect(message.eventId).toBe(validEvent.eventId);
  });
});
