export interface CustomRadarFeature {
  readonly title: string;
  readonly badge: string;
  readonly description: string;
  readonly outputSpec: string;
}

export interface ProvenPipeline {
  readonly category: string;
  readonly title: string;
  readonly description: string;
}

export interface DiscoveryVector {
  readonly tag: string;
  readonly badge: string;
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly cta: string;
}

export const CUSTOM_RADAR_FEATURES: readonly CustomRadarFeature[] = [
  {
    title: "Autonomous Web & Registry Ingestion",
    badge: "01 // INGEST",
    description:
      "Automated workers crawl opaque portals, municipal databases, bankruptcy filings, and supplier pricing on deterministic crons.",
    outputSpec: "Headless Chromium · Playwright · PDF OCR · TLS Fingerprint Masking",
  },
  {
    title: "Deterministic AI Entity Extraction",
    badge: "02 // EXTRACT",
    description:
      "Strict schema enforcement converts raw text and scans into verified JSON. Guaranteed zero hallucination with rule-based fallback.",
    outputSpec: "Zod Schema Gate · Semantic De-duplication · Strict Input Allowlist",
  },
  {
    title: "Real-Time Multi-Channel Dispatches",
    badge: "03 // DISPATCH",
    description:
      "Instant push alerts to Slack channels, executive SMS, secure webhook receivers, or direct database replication within seconds.",
    outputSpec: "Slack BlockKit · Twilio SMS · Webhook HMAC Signature · Postgres Sync",
  },
];

export const PROVEN_PIPELINES: readonly ProvenPipeline[] = [
  {
    category: "MUNICIPAL PROCUREMENT",
    title: "Sub-$100k RFP Crawler",
    description:
      "Monitors 22 Ontario municipality portals; filters out union-only bids and pushes matching trade RFPs to Slack.",
  },
  {
    category: "PRIVATE EQUITY & M&A",
    title: "Receivership & Asset Radar",
    description:
      "Scrapes bankruptcy trustee notices and court files at 06:00 AM; calculates asset-to-debt ratio before auction.",
  },
  {
    category: "REGULATORY & COMPLIANCE",
    title: "Zoning Variance Tracker",
    description:
      "Detects new Committee of Adjustment filings within 500m of client commercial assets with zero manual oversight.",
  },
];

export const DISCOVERY_VECTORS: readonly DiscoveryVector[] = [
  {
    tag: "ASSESSMENT · 5 MIN",
    badge: "ZERO PAYWALL",
    title: "Automation Opportunities Checklist",
    description:
      "Calculate wasted hours across intake, scheduling, and billing before writing a line of code.",
    href: "/checklist",
    cta: "Launch Diagnostic",
  },
  {
    tag: "REPOSITORY · SCHEMAS",
    badge: "34 VERIFIED",
    title: "The Skill Corner Systems Library",
    description:
      "Open reference architectures for AI receptionists, 2-way scheduling, and autonomous workflow engines.",
    href: "/library",
    cta: "Browse 34 Blueprints",
  },
  {
    tag: "SECTORS · MATRICES",
    badge: "24 VERTICALS",
    title: "Industry-Specific Automation Radars",
    description:
      "Explore tailored automation blueprints for dental offices, law firms, restaurants, and trade contractors.",
    href: "/industries",
    cta: "View All 24 Sectors",
  },
];
