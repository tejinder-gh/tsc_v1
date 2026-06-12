/**
 * What: The shared honeypot input rendered (last) inside every lead form. Bots
 *       auto-fill it; the server drops any submission where it has a value.
 * Why: Spam submissions burn webhook (Zapier) task quota - enough spam takes the
 *      lead pipeline down for real visitors. One shared component keeps the
 *      invisibility contract identical across all capture surfaces.
 * How: Off-screen positioning (NOT display:none - some bots skip hidden fields),
 *      tabIndex=-1 so keyboard focus can never land in it (ExitIntentModal's
 *      autofocus selector also excludes [tabindex="-1"] inputs), aria-hidden so
 *      screen readers skip it, autoComplete="off" to discourage browser autofill.
 *      Pair with `withHoneypot(schema)` from lib/schemas.ts - the field must be
 *      declared on the form schema or zodResolver strips it before submit.
 * From Where: /plan-eng-review Engineering Spec (honeypot contract v2), 2026-06-12.
 * When: 2026-06; revisit only if the field name or attribute set changes.
 */

import type { UseFormRegisterReturn } from "react-hook-form";

interface HoneypotFieldProps {
  registration: UseFormRegisterReturn;
}

export function HoneypotField({ registration }: HoneypotFieldProps) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" tabIndex={-1} autoComplete="off" {...registration} />
      </label>
    </div>
  );
}
