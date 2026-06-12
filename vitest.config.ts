/**
 * What: Vitest config - resolves the `@/` path alias (matching tsconfig.json)
 *       so tests can exercise files that import across module boundaries.
 * Why: app/api/lead/route.ts imports "@/lib/schemas"; without the alias the
 *      route test suite cannot load the route.
 * How: One alias entry mirroring tsconfig's "@/*": ["./*"].
 * From Where: /plan-eng-review Engineering Spec (test suite), 2026-06-12.
 * When: 2026-06.
 */

import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
});
