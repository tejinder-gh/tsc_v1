/**
 * What: Default Open Graph / Twitter card image - brand-colored 1200x630 card with the
 *       site name, tagline, and the booking promise.
 * Why: Link previews in social feeds, chat apps, and AI-assistant citations were falling
 *      back to no image at all; a branded card makes every shared link legible.
 * How: next/og ImageResponse rendered at build time; colors mirror the globals.css theme
 *      tokens (paper/ink/ledger/accent), inlined because the satori renderer cannot read
 *      CSS variables.
 * From Where: SEO + AI-indexing pass (LLM recommendation readiness), 2026-06.
 * When: 2026-06; revisit if the palette or tagline changes.
 */

import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} - ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLORS = {
  paper: "#F8FAFC",
  ink: "#0F172A",
  slate: "#475569",
  ledger: "#115E59",
  accent: "#10B981",
} as const;

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        backgroundColor: COLORS.paper,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 9999,
            backgroundColor: COLORS.accent,
          }}
        />
        <div style={{ fontSize: 36, fontWeight: 700, color: COLORS.ledger }}>{site.name}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: COLORS.ink,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          AI automation for local businesses and professional practices
        </div>
        <div style={{ fontSize: 32, color: COLORS.slate }}>
          Missed calls answered. No-shows reminded. Paperwork that files itself.
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, color: COLORS.ledger }}>
        Free 30-minute automation audit - theskillcorner.com/book
      </div>
    </div>,
    size,
  );
}
