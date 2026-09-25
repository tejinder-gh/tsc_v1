import { describe, expect, it } from "vitest";
import { CUSTOM_RADAR_FEATURES, DISCOVERY_VECTORS, PROVEN_PIPELINES } from "../briefings";
import { digitalServices } from "../digital-services";
import { industries } from "../industries";
import { PRINCIPLES } from "../principles";
import { services } from "../services";
import { SYSTEM_STUDIES } from "../system-studies";

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

  describe("System Studies Catalog", () => {
    it("has 5 sequentially indexed studies with valid operational schemas", () => {
      expect(SYSTEM_STUDIES).toHaveLength(5);

      const indices = SYSTEM_STUDIES.map((s) => s.index);
      expect(indices).toEqual(["01", "02", "03", "04", "05"]);

      const ids = SYSTEM_STUDIES.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);

      for (const study of SYSTEM_STUDIES) {
        expect(study.id).toMatch(SLUG_REGEX);
        expect(study.title.length).toBeGreaterThan(0);
        expect(study.location.length).toBeGreaterThan(0);
        expect(study.problem.length).toBeGreaterThan(0);
        expect(study.system.length).toBeGreaterThan(0);
        expect(study.expectedChange.length).toBeGreaterThan(0);
        expect(study.diagramSteps.length).toBeGreaterThanOrEqual(4);

        for (const step of study.diagramSteps) {
          expect(step.name.length).toBeGreaterThan(0);
          expect(step.latency.length).toBeGreaterThan(0);
          expect(step.subtext.length).toBeGreaterThan(0);
          if (step.telemetryPayload) {
            expect(Object.keys(step.telemetryPayload).length).toBeGreaterThanOrEqual(3);
          }
        }
      }
    });
  });

  describe("Executive Briefings & Intelligence Radar", () => {
    it("has 3 valid custom radar pipeline features", () => {
      expect(CUSTOM_RADAR_FEATURES).toHaveLength(3);

      for (const feature of CUSTOM_RADAR_FEATURES) {
        expect(feature.title.length).toBeGreaterThan(0);
        expect(feature.badge.length).toBeGreaterThan(0);
        expect(feature.description.length).toBeGreaterThan(0);
        expect(feature.outputSpec.length).toBeGreaterThan(0);
      }
    });

    it("has 3 valid proven client pipeline architectures", () => {
      expect(PROVEN_PIPELINES).toHaveLength(3);

      for (const pipeline of PROVEN_PIPELINES) {
        expect(pipeline.category.length).toBeGreaterThan(0);
        expect(pipeline.title.length).toBeGreaterThan(0);
        expect(pipeline.description.length).toBeGreaterThan(0);
      }
    });

    it("has 3 valid companion discovery vectors with real routes", () => {
      expect(DISCOVERY_VECTORS).toHaveLength(3);

      for (const vector of DISCOVERY_VECTORS) {
        expect(vector.tag.length).toBeGreaterThan(0);
        expect(vector.badge.length).toBeGreaterThan(0);
        expect(vector.title.length).toBeGreaterThan(0);
        expect(vector.description.length).toBeGreaterThan(0);
        expect(vector.href.startsWith("/")).toBe(true);
        expect(vector.cta.length).toBeGreaterThan(0);
      }
    });
  });
});
