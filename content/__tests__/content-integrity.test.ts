import { describe, expect, it } from "vitest";
import { digitalServices } from "../digital-services";
import { industries } from "../industries";
import { PRINCIPLES } from "../principles";
import { services } from "../services";

describe("Content Slug and Reference Integrity", () => {
  const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  describe("Industries Catalog", () => {
    it("has unique, valid slugs for all industries", () => {
      const slugs = industries.map((i) => i.slug);
      expect(new Set(slugs).size).toBe(slugs.length);

      for (const industry of industries) {
        expect(industry.slug).toMatch(SLUG_REGEX);
        expect(industry.name.length).toBeGreaterThan(0);
        expect(industry.automations.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Automation Services Catalog", () => {
    it("has unique, valid slugs for all automation services", () => {
      const slugs = services.map((s) => s.slug);
      expect(new Set(slugs).size).toBe(slugs.length);

      for (const service of services) {
        expect(service.slug).toMatch(SLUG_REGEX);
        expect(service.name.length).toBeGreaterThan(0);
        expect(service.whatWeBuild.length).toBeGreaterThan(0);
      }
    });

    it("verifies that all relatedIndustries resolve to a real industry in the catalog", () => {
      const industrySlugs = new Set(industries.map((i) => i.slug));
      const invalidReferences: { service: string; invalidIndustry: string }[] = [];

      for (const service of services) {
        for (const indSlug of service.relatedIndustries) {
          if (!industrySlugs.has(indSlug)) {
            invalidReferences.push({
              service: service.slug,
              invalidIndustry: indSlug,
            });
          }
        }
      }

      expect(invalidReferences).toEqual([]);
    });
  });

  describe("Digital Services Catalog", () => {
    it("has unique, valid slugs for all digital services", () => {
      const slugs = digitalServices.map((d) => d.slug);
      expect(new Set(slugs).size).toBe(slugs.length);

      for (const ds of digitalServices) {
        expect(ds.slug).toMatch(SLUG_REGEX);
        expect(ds.name.length).toBeGreaterThan(0);
        expect(ds.features.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Architectural Guardrails & Principles (HowWeDecide)", () => {
    it("has exactly 4 sequentially numbered principles with valid metadata", () => {
      expect(PRINCIPLES).toHaveLength(4);

      const numbers = PRINCIPLES.map((p) => p.number);
      expect(numbers).toEqual(["01", "02", "03", "04"]);

      for (const p of PRINCIPLES) {
        expect(p.label.length).toBeGreaterThan(0);
        expect(p.headline.length).toBeGreaterThan(0);
        expect(p.thesis.length).toBeGreaterThan(0);
        expect(p.inPractice.length).toBeGreaterThan(0);
        expect(p.guardrail.length).toBeGreaterThan(0);
        expect(p.metric.length).toBeGreaterThan(0);
        expect(p.tags.length).toBeGreaterThanOrEqual(1);
        expect(["Target", "Workflow", "ShieldCheck", "LineChart"]).toContain(p.iconName);
      }
    });
  });
});
