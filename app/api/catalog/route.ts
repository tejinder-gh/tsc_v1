/**
 * GET /api/catalog (Alias to /api/catalogue)
 * Exposes identical authenticated catalogue functionality with zero redirect latency.
 */

export const dynamic = "force-dynamic";
export { GET } from "../catalogue/route";
