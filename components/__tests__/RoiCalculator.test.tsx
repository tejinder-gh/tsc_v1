import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RoiCalculator } from "../roi";

describe("RoiCalculator Component", () => {
  it("renders the interactive sliders and labels", () => {
    const html = renderToStaticMarkup(<RoiCalculator />);

    expect(html).toContain("Team Size");
    expect(html).toContain("Blended Loaded Hourly Wage");
    expect(html).toContain("Manual Workflow Hours");
    expect(html).toContain("FINANCIAL JUSTIFICATION");
    expect(html).toContain("Net Annual Wage Recapture");
  });

  it("renders preset operational configuration buttons", () => {
    const html = renderToStaticMarkup(<RoiCalculator />);

    expect(html).toContain("Boutique Firm");
    expect(html).toContain("Multi-Provider Clinic");
    expect(html).toContain("Mid-Market Enterprise");
  });

  it("renders link to /book carrying discovery parameters", () => {
    const html = renderToStaticMarkup(<RoiCalculator />);

    expect(html).toContain('href="/book?');
    expect(html).toContain("Book an Audit with this Model");
    expect(html).toContain("Copy Financial Summary for Leadership");
  });
});
