import { describe, expect, it } from "vitest";
import { render, TemplateError, variablesUsed } from "../core/template";

describe("template.render", () => {
  it("interpolates known variables", () => {
    expect(render("Hi {{name}}, see you {{when}}", { name: "Amara", when: "Tuesday" })).toBe(
      "Hi Amara, see you Tuesday",
    );
  });

  it("uses a fallback when a value is missing or empty", () => {
    expect(render("Use {{code|nothing}} today", { code: "" })).toBe("Use nothing today");
    expect(render("Use {{code|nothing}} today", {})).toBe("Use nothing today");
  });

  it("coerces numbers to strings", () => {
    expect(render("Total {{amount}}", { amount: 42 })).toBe("Total 42");
  });

  it("throws TemplateError listing every unfilled token without a fallback", () => {
    try {
      render("Hi {{name}}, owe {{amount}}", {});
      throw new Error("expected TemplateError");
    } catch (error) {
      expect(error).toBeInstanceOf(TemplateError);
      expect((error as TemplateError).missing).toEqual(["name", "amount"]);
    }
  });

  it("reports the variables a template uses", () => {
    expect(variablesUsed("Hi {{name}}, {{name}} {{when|today}}")).toEqual(["name", "when"]);
  });
});
