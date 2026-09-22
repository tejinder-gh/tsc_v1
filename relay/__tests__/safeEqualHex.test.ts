import { describe, expect, it } from "vitest";
import { safeEqualHex } from "../auth/safeEqualHex";

describe("safeEqualHex", () => {
  const hexA = "ccca291cbc7a51b49a461d06957dd6b8ea2f388caee8557352f4b180c011cd28";
  const hexB = "ccca291cbc7a51b49a461d06957dd6b8ea2f388caee8557352f4b180c011cd28";
  const hexDiff = "0000000000000000000000000000000000000000000000000000000000000000";

  it("returns true for identical 64-char hex strings", () => {
    expect(safeEqualHex(hexA, hexB)).toBe(true);
  });

  it("is case-insensitive for hex characters", () => {
    expect(safeEqualHex(hexA.toLowerCase(), hexB.toUpperCase())).toBe(true);
  });

  it("returns false for different hex strings", () => {
    expect(safeEqualHex(hexA, hexDiff)).toBe(false);
  });

  it("returns false for different lengths", () => {
    expect(safeEqualHex(hexA, "ccca29")).toBe(false);
  });

  it("returns false for non-hex characters", () => {
    const invalidHex = "z".repeat(64);
    expect(safeEqualHex(hexA, invalidHex)).toBe(false);
  });

  it("returns false for non-string inputs", () => {
    // @ts-expect-error test non-string types
    expect(safeEqualHex(null, hexA)).toBe(false);
    // @ts-expect-error test non-string types
    expect(safeEqualHex(hexA, undefined)).toBe(false);
  });
});
