/**
 * What: Renders a JSON-LD object as an application/ld+json script tag.
 * Why: Search engines and LLM crawlers read structured data from raw script tags; one
 *      component keeps the dangerouslySetInnerHTML escape hatch in a single audited spot.
 * How: JSON.stringify of locally-defined content objects (never user input). "<" is
 *      escaped to prevent script-tag breakout if content ever contains markup.
 * From Where: SEO + AI-indexing pass (LLM recommendation readiness), 2026-06.
 * When: 2026-06.
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replaceAll("<", "\\u003c");
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: static, locally-defined JSON with < escaped
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
