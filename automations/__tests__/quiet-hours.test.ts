import { describe, expect, it } from "vitest";
import { isQuietHours, localHHMM } from "../runtime/quiet-hours";

describe("quiet hours", () => {
  it("formats an instant to local HH:MM", () => {
    // 15:00 UTC is 11:00 in Toronto (EDT, UTC-4) in June.
    expect(localHHMM("2026-06-15T15:00:00.000Z", "America/Toronto")).toBe("11:00");
  });

  it("handles overnight windows (21:00-08:00)", () => {
    const tz = "America/Toronto";
    const quiet = { start: "21:00", end: "08:00" };
    // 11:00 local -> awake
    expect(isQuietHours("2026-06-15T15:00:00.000Z", tz, quiet)).toBe(false);
    // 02:00 local -> quiet (06:00 UTC)
    expect(isQuietHours("2026-06-15T06:00:00.000Z", tz, quiet)).toBe(true);
    // 23:00 local -> quiet (03:00 UTC next day)
    expect(isQuietHours("2026-06-16T03:00:00.000Z", tz, quiet)).toBe(true);
  });

  it("handles same-day windows (01:00-06:00)", () => {
    const tz = "America/Toronto";
    const quiet = { start: "01:00", end: "06:00" };
    expect(isQuietHours("2026-06-15T06:00:00.000Z", tz, quiet)).toBe(true); // 02:00 local
    expect(isQuietHours("2026-06-15T15:00:00.000Z", tz, quiet)).toBe(false); // 11:00 local
  });
});
