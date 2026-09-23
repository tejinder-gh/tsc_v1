import { describe, expect, it } from "vitest";
import {
  DEMONSTRATION_DISCLAIMER,
  DEMONSTRATION_REGISTRY,
  getDemonstrationConfig,
} from "../demonstration-config";
import {
  selectAlternateDemonstrationScenario,
  selectDemonstrationScenario,
} from "../demonstration-engine";
import { OPPORTUNITY_DEFINITIONS, type OpportunityId } from "../opportunity-config";

describe("Ticket 004: Interactive Demonstration Engine & Configuration", () => {
  const allOpportunityIds = Object.keys(OPPORTUNITY_DEFINITIONS) as OpportunityId[];

  describe("Completeness & Registry Integrity", () => {
    it("provides registered demonstration configurations for all 19 Opportunity IDs", () => {
      expect(allOpportunityIds.length).toBe(19);

      for (const oppId of allOpportunityIds) {
        const config = getDemonstrationConfig(oppId);
        expect(config).toBeDefined();
        expect(config.opportunityId).toBe(oppId);
        expect(config.title).toBeTruthy();
        expect(config.subtitle).toBeTruthy();
        expect(config.systemBadge).toBeTruthy();
        expect([
          "pipeline-stream",
          "decision-router",
          "system-spec",
          "educational-artifact",
        ]).toContain(config.archetype);
      }
    });

    it("verifies expected archetype distributions across domains", () => {
      // Save Time opportunities
      expect(DEMONSTRATION_REGISTRY["communication-automation"].archetype).toBe("pipeline-stream");
      expect(DEMONSTRATION_REGISTRY["admin-automation"].archetype).toBe("pipeline-stream");
      expect(DEMONSTRATION_REGISTRY["scheduling-orchestration"].archetype).toBe("pipeline-stream");
      expect(DEMONSTRATION_REGISTRY["reporting-intelligence"].archetype).toBe("decision-router");
      expect(DEMONSTRATION_REGISTRY["workflow-orchestration"].archetype).toBe("decision-router");

      // Grow opportunities
      expect(DEMONSTRATION_REGISTRY["demand-generation"].archetype).toBe("system-spec");
      expect(DEMONSTRATION_REGISTRY["response-conversion"].archetype).toBe("pipeline-stream");
      expect(DEMONSTRATION_REGISTRY["follow-up-system"].archetype).toBe("decision-router");
      expect(DEMONSTRATION_REGISTRY["conversion-optimization"].archetype).toBe("decision-router");
      expect(DEMONSTRATION_REGISTRY["retention-system"].archetype).toBe("decision-router");

      // Build opportunities
      expect(DEMONSTRATION_REGISTRY["customer-product"].archetype).toBe("system-spec");
      expect(DEMONSTRATION_REGISTRY["internal-software"].archetype).toBe("system-spec");
      expect(DEMONSTRATION_REGISTRY["systems-integration"].archetype).toBe("pipeline-stream");
      expect(DEMONSTRATION_REGISTRY["ai-product-feature"].archetype).toBe("system-spec");
      expect(DEMONSTRATION_REGISTRY["product-modernization"].archetype).toBe("system-spec");

      // Learn opportunities
      expect(DEMONSTRATION_REGISTRY["learning-orientation"].archetype).toBe("educational-artifact");
      expect(DEMONSTRATION_REGISTRY["learning-guide"].archetype).toBe("educational-artifact");
      expect(DEMONSTRATION_REGISTRY["learning-toolkit"].archetype).toBe("educational-artifact");
      expect(DEMONSTRATION_REGISTRY["learning-briefing"].archetype).toBe("educational-artifact");
    });
  });

  describe("Scenario & Step Anatomy Invariants", () => {
    it("ensures every opportunity has at least 2 distinct deterministic scenarios", () => {
      for (const oppId of allOpportunityIds) {
        const config = getDemonstrationConfig(oppId);
        expect(config.scenarios.length).toBeGreaterThanOrEqual(2);

        const [standard, alternate] = config.scenarios;
        expect(standard.id).toBeTruthy();
        expect(standard.name).toBeTruthy();
        expect(standard.description).toBeTruthy();
        expect(standard.summaryOutcome).toBeTruthy();
        expect(standard.isException).toBe(false);

        expect(alternate.id).toBeTruthy();
        expect(alternate.name).toBeTruthy();
        expect(alternate.description).toBeTruthy();
        expect(alternate.summaryOutcome).toBeTruthy();
        expect(alternate.isException).toBe(true);
      }
    });

    it("verifies every scenario contains complete, valid, annotated execution steps", () => {
      const validPhases = [
        "INPUT",
        "INTERPRETATION",
        "BUSINESS RULE",
        "SYSTEM ACTION",
        "OUTCOME",
        "EXCEPTION",
      ];

      for (const oppId of allOpportunityIds) {
        const config = getDemonstrationConfig(oppId);
        for (const scenario of config.scenarios) {
          expect(scenario.steps.length).toBeGreaterThanOrEqual(4);

          for (const step of scenario.steps) {
            expect(step.id).toBeTruthy();
            expect(validPhases).toContain(step.phase);
            expect(step.title).toBeTruthy();
            expect(step.description).toBeTruthy();
            // Data payload inspection
            if (step.dataPayload) {
              expect(Object.keys(step.dataPayload).length).toBeGreaterThan(0);
            }
          }
        }
      }
    });
  });

  describe("Learn Path Educational Artifact Invariants", () => {
    const learnIds: OpportunityId[] = [
      "learning-orientation",
      "learning-guide",
      "learning-toolkit",
      "learning-briefing",
    ];

    it("enforces educational artifact archetype and structured framework sections", () => {
      for (const learnId of learnIds) {
        const config = getDemonstrationConfig(learnId);
        expect(config.archetype).toBe("educational-artifact");
        expect(config.educationalSections).toBeDefined();
        expect(config.educationalSections?.length).toBeGreaterThanOrEqual(2);

        for (const sec of config.educationalSections || []) {
          expect(sec.id).toBeTruthy();
          expect(sec.title).toBeTruthy();
          expect(sec.badge).toBeTruthy();
          expect(sec.summary).toBeTruthy();
          expect(sec.bullets.length).toBeGreaterThanOrEqual(2);
        }
      }
    });
  });

  describe("Truthfulness, Disclaimer & Privacy Invariants", () => {
    it("provides the standard honest illustrative disclaimer", () => {
      expect(DEMONSTRATION_DISCLAIMER).toContain("SIMULATION / SYSTEM DEMONSTRATION");
      expect(DEMONSTRATION_DISCLAIMER).toContain(
        "Illustrative deterministic model. No customer data or production performance is fabricated.",
      );
    });

    it("verifies no configuration contains private user text or ungrounded guarantees", () => {
      const serialized = JSON.stringify(DEMONSTRATION_REGISTRY);

      expect(serialized).not.toContain("freeformProblem");
      expect(serialized).not.toContain("guaranteed 10x ROI");
      expect(serialized).not.toContain("guaranteed revenue");
    });

    it("verifies prohibited unqualified operational claims are absent from the registry (T-023 / F-08 / AC1 / AC4)", () => {
      const serialized = JSON.stringify(DEMONSTRATION_REGISTRY);

      // Prohibited unverified claims (AC1 & AC4)
      expect(serialized).not.toContain("rate_limit_active");
      expect(serialized).not.toContain("100% delivered to inbox");
      expect(serialized).not.toContain("450 regional operators");
      expect(serialized).not.toContain("54% open rate");
    });

    it("verifies revised demonstration steps visibly carry illustrative and example markers (T-023 / AC2 / AC5)", () => {
      const demandGenConfig = DEMONSTRATION_REGISTRY["demand-generation"];
      const syndicationScenario = demandGenConfig.scenarios.find(
        (s) => s.id === "syndication-engine",
      );
      expect(syndicationScenario).toBeDefined();
      expect(syndicationScenario?.summaryOutcome.toLowerCase()).toContain("illustrative");

      const step2 = syndicationScenario?.steps.find((s) => s.id === "step-2");
      expect(step2?.description.toLowerCase()).toContain("illustrative");
      expect(step2?.annotation?.toLowerCase()).toContain("illustrative");
      expect(JSON.stringify(step2?.dataPayload).toLowerCase()).toContain("illustrative");

      const step4 = syndicationScenario?.steps.find((s) => s.id === "step-4");
      expect(step4?.description.toLowerCase()).toContain("illustrative");
      expect(step4?.annotation?.toLowerCase()).toContain("illustrative");
      expect(JSON.stringify(step4?.dataPayload).toLowerCase()).toContain("illustrative");

      const learningGuideConfig = DEMONSTRATION_REGISTRY["learning-guide"];
      const checklistScenario = learningGuideConfig.scenarios.find(
        (s) => s.id === "guide-checklist",
      );
      expect(checklistScenario).toBeDefined();

      const rateLimitStep = checklistScenario?.steps.find((s) => s.id === "step-3");
      expect(rateLimitStep?.description.toLowerCase()).toContain("illustrative");
      expect(rateLimitStep?.annotation?.toLowerCase()).toContain("illustrative");
      expect(JSON.stringify(rateLimitStep?.dataPayload).toLowerCase()).toContain("illustrative");
      expect(rateLimitStep?.statusTag).not.toBe("ACTIVE");
    });
  });

  describe("Engine Determinism & Pure Function Invariants", () => {
    it("returns identical deterministic configurations across multiple calls", () => {
      const call1 = getDemonstrationConfig("communication-automation");
      const call2 = getDemonstrationConfig("communication-automation");

      expect(call1).toEqual(call2);
      expect(call1.scenarios[0].steps.length).toBe(call2.scenarios[0].steps.length);
    });

    it("throws a descriptive error when requested for an unknown opportunity ID", () => {
      expect(() =>
        getDemonstrationConfig("completely-bogus-id" as unknown as OpportunityId),
      ).toThrow("No demonstration configuration registered for opportunity: completely-bogus-id");
    });

    it("selects the configured example deterministically and cycles alternates in declaration order", () => {
      const config = getDemonstrationConfig("communication-automation");

      expect(selectDemonstrationScenario(config, 0).id).toBe(config.scenarios[0].id);
      expect(selectDemonstrationScenario(config, 999).id).toBe(config.scenarios[0].id);
      expect(selectAlternateDemonstrationScenario(config, 0).id).toBe(config.scenarios[1].id);
      expect(selectAlternateDemonstrationScenario(config, 1).id).toBe(config.scenarios[0].id);
    });
  });
});
