/**
 * What: A minimal, dependency-free message templating function with {{var}} interpolation,
 *       {{var|fallback}} defaults, and strict missing-variable detection.
 * Why: Client message copy lives in config ("Hi {{name}}, you're due for {{service}}"). One
 *      renderer used by every recipe means message wording is data a non-engineer can edit -
 *      the heart of "configure once per client, never rewrite code".
 * How: Single regex pass. A variable with no value and no fallback is collected and thrown as
 *      a TemplateError, so a typo surfaces at validation/dry-run time rather than sending a
 *      half-blank text to a real customer (fail fast at the boundary).
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

export type TemplateVars = Record<string, string | number | undefined>;

export class TemplateError extends Error {
  constructor(public readonly missing: string[]) {
    super(`Template is missing values for: ${missing.join(", ")}`);
    this.name = "TemplateError";
  }
}

const TOKEN = /\{\{\s*([\w.]+)\s*(?:\|\s*([^}]*?)\s*)?\}\}/g;

/**
 * Render `template`, substituting `{{key}}` with vars[key]. `{{key|default}}` uses the default
 * when the value is null/undefined/empty. Throws TemplateError listing every unfilled token.
 */
export function render(template: string, vars: TemplateVars): string {
  const missing: string[] = [];

  const out = template.replace(TOKEN, (_match, key: string, fallback?: string) => {
    const raw = vars[key];
    const value = raw === undefined || raw === null || raw === "" ? undefined : String(raw);
    if (value !== undefined) return value;
    if (fallback !== undefined) return fallback;
    missing.push(key);
    return "";
  });

  if (missing.length > 0) {
    // De-duplicate so the error names each token once.
    throw new TemplateError([...new Set(missing)]);
  }
  return out;
}

/** Returns the variable names a template references, for config validation/preview tooling. */
export function variablesUsed(template: string): string[] {
  const names = new Set<string>();
  for (const match of template.matchAll(TOKEN)) {
    if (match[1]) names.add(match[1]);
  }
  return [...names];
}
