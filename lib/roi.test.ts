/**
 * What: Unit tests for the ROI calculator math.
 * Why: The annual-cost figure is the site's signature number and is also sent to the
 *      webhook; a silent math regression would corrupt both the pitch and the lead data.
 * How: Vitest over the pure functions in lib/roi.ts - happy path, clamping, formatting.
 * From Where: House testing rules (unit coverage for all lib logic), 2026-06.
 * When: 2026-06.
 */

import { describe, expect, it } from "vitest";
import {
  annualCost,
  calculateEnterpriseRoi,
  clamp,
  ENTERPRISE_ROI_BOUNDS,
  formatCurrency,
  monthlyCost,
  PRACTICE_BUILD_FEE_RANGE,
  practicePaybackRange,
  ROI_BOUNDS,
} from "./roi";

describe("annualCost", () => {
  it("multiplies hours x rate x 52", () => {
    expect(annualCost({ hoursPerWeek: 10, hourlyCost: 35 })).toBe(18200);
  });

  it("clamps inputs below the slider minimums", () => {
    expect(annualCost({ hoursPerWeek: 0, hourlyCost: 0 })).toBe(
      ROI_BOUNDS.hoursPerWeek.min * ROI_BOUNDS.hourlyCost.min * 52,
    );
  });

  it("clamps inputs above the slider maximums", () => {
    expect(annualCost({ hoursPerWeek: 999, hourlyCost: 999 })).toBe(
      ROI_BOUNDS.hoursPerWeek.max * ROI_BOUNDS.hourlyCost.max * 52,
    );
  });
});

describe("monthlyCost", () => {
  it("is the annual cost divided by 12, rounded", () => {
    expect(monthlyCost({ hoursPerWeek: 10, hourlyCost: 35 })).toBe(Math.round(18200 / 12));
  });
});

describe("clamp", () => {
  it("returns the value when inside bounds", () => {
    expect(clamp(5, 1, 10)).toBe(5);
  });
  it("returns bounds when outside", () => {
    expect(clamp(-1, 1, 10)).toBe(1);
    expect(clamp(99, 1, 10)).toBe(10);
  });
});

describe("PRACTICE_BUILD_FEE_RANGE", () => {
  it("parses the published $15,000-$75,000 range from content/site.ts", () => {
    expect(PRACTICE_BUILD_FEE_RANGE).toEqual({ low: 15000, high: 75000 });
  });
});

describe("practicePaybackRange", () => {
  it("computes a low/high month range from the visitor's annual savings", () => {
    const annual = annualCost({ hoursPerWeek: 10, hourlyCost: 35 }); // 18200
    const monthlySavings = annual / 12;
    const result = practicePaybackRange(annual);
    expect(result).toEqual({
      lowMonths: Math.round(PRACTICE_BUILD_FEE_RANGE.low / monthlySavings),
      highMonths: Math.round(PRACTICE_BUILD_FEE_RANGE.high / monthlySavings),
    });
    expect(result?.lowMonths).toBeLessThan(result?.highMonths ?? 0);
  });

  it("returns null for zero annual savings instead of dividing by zero", () => {
    expect(practicePaybackRange(0)).toBeNull();
    expect(practicePaybackRange(-100)).toBeNull();
  });

  it("returns null when savings are so small the payback would read as nonsense", () => {
    // With $15,000 low end, anything taking > 60 months returns null (i.e. monthly savings < $250, annual < $3000)
    expect(practicePaybackRange(2000)).toBeNull();
  });

  it("scales the low and high months with the low and high end of the fee range", () => {
    // 6000/12 = 500 monthly savings divides both ends of the fee range evenly (15000/500=30,
    // 75000/500=150), so rounding introduces no error and the ratio is exact.
    const result = practicePaybackRange(6000);
    expect(result).not.toBeNull();
    const ratio = (result?.highMonths ?? 0) / (result?.lowMonths ?? 1);
    const expectedRatio = PRACTICE_BUILD_FEE_RANGE.high / PRACTICE_BUILD_FEE_RANGE.low;
    expect(ratio).toBeCloseTo(expectedRatio, 1);
  });
});

describe("formatCurrency", () => {
  it("formats whole CAD dollars with separators", () => {
    expect(formatCurrency(18200)).toMatch(/\$18,200/);
  });
  it("never shows decimals", () => {
    expect(formatCurrency(1234.56)).not.toMatch(/\./);
  });
});

describe("calculateEnterpriseRoi", () => {
  it("computes accurate baseline metrics for default enterprise inputs", () => {
    const result = calculateEnterpriseRoi({
      teamSize: 5,
      hourlyWage: 45,
      weeklyHoursPerPerson: 12,
    });

    // 5 * 12 * 50 = 3,000 total hours
    expect(result.totalAnnualHours).toBe(3000);
    // 3,000 * 0.75 = 2,250 hours recaptured
    expect(result.annualHoursRecaptured).toBe(2250);
    // 2,250 * $45 = $101,250
    expect(result.annualWageSavings).toBe(101250);
    // Base cost $15,000
    expect(result.estimatedDeploymentCost).toBe(15000);
    // Monthly savings = $8,437.50 -> 15000 / 8437.50 = 1.8 months
    expect(result.paybackMonths).toBe(1.8);
    expect(result.paybackDays).toBe(55);
    // 3-year net ROI multiple: (303750 - 15000) / 15000 = 19.3x
    expect(result.threeYearNetRoiMultiple).toBe(19.3);
  });

  it("clamps inputs to ENTERPRISE_ROI_BOUNDS limits", () => {
    const lowResult = calculateEnterpriseRoi({
      teamSize: 0,
      hourlyWage: 10,
      weeklyHoursPerPerson: 1,
    });
    expect(lowResult.totalAnnualHours).toBe(
      ENTERPRISE_ROI_BOUNDS.teamSize.min *
        ENTERPRISE_ROI_BOUNDS.weeklyHoursPerPerson.min *
        50,
    );

    const highResult = calculateEnterpriseRoi({
      teamSize: 100,
      hourlyWage: 500,
      weeklyHoursPerPerson: 80,
    });
    expect(highResult.totalAnnualHours).toBe(
      ENTERPRISE_ROI_BOUNDS.teamSize.max *
        ENTERPRISE_ROI_BOUNDS.weeklyHoursPerPerson.max *
        50,
    );
    expect(highResult.estimatedDeploymentCost).toBeLessThanOrEqual(75000);
  });
});
