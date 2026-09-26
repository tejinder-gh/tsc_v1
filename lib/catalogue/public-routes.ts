/**
 * Public Routes & Endpoints Catalog Registry
 * Canonical single-source-of-truth definition of all publicly accessible
 * UI routes, API endpoints, machine-readable specifications, and URL redirects.
 */

import { digitalServices } from "@/content/digital-services";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { CANONICAL_NEWSLETTERS } from "@/features/newsletters/data/newsletters";

export type PublicRouteType = "api" | "document" | "page" | "redirect";
export type PublicRouteAccess =
  | "public"
  | "rate_limited"
  | "webhook"
  | "secret_authenticated"
  | "api_key_authenticated";

export interface PublicEndpointDefinition {
  path: string;
  method: "GET" | "POST";
  type: PublicRouteType;
  access: PublicRouteAccess;
  title: string;
  description: string;
  category?: string;
  contentType?: string;
  authDetails?: string;
  rateLimit?: string;
  queryParams?: Record<string, string>;
  requestSchema?: Record<string, unknown>;
  responseSchema?: Record<string, unknown>;
  dynamicSlugs?: readonly string[];
  targetUrl?: string; // For redirects (308 permanent)
}

export function getPublicEndpointsRegistry(): PublicEndpointDefinition[] {
  const digitalServiceSlugs = digitalServices.map((item) => item.slug);
  const automationServiceSlugs = services.map((item) => item.slug);
  const industrySlugs = industries.map((item) => item.slug);
  const newsletterSlugs = CANONICAL_NEWSLETTERS.map((item) => item.slug);

  return [
    // -------------------------------------------------------------------------
    // 1. Public API & Webhook Endpoints
    // -------------------------------------------------------------------------
    {
      path: "/api/catalogue",
      method: "GET",
      type: "api",
      access: "api_key_authenticated",
      title: "Public Route & API Catalog Introspection",
      category: "Catalog & Introspection",
      description:
        "Authenticated catalog exposing all publicly available endpoints, machine-readable documents, pages, and redirects. Authenticates against machine identities in database.",
      authDetails:
        "Bearer <key> in Authorization header, x-api-key header, or ?key=<key> query parameter.",
      contentType: "application/json",
      queryParams: {
        type: "Optional filter by endpoint type: 'api', 'document', 'page', 'redirect'.",
        expand: "Set to 'slugs' or 'true' to expand dynamic parameters into canonical URLs.",
        format: "Set to 'openapi' for OpenAPI 3.0 schema or 'json' (default).",
      },
      responseSchema: {
        domain: "string",
        version: "string",
        authenticatedAs: { principal: "string", keyId: "string" },
        summary: { total: "number", apiEndpoints: "number" },
        endpoints: "array",
      },
    },
    {
      path: "/api/lead",
      method: "POST",
      type: "api",
      access: "rate_limited",
      title: "Inbound Lead & Demonstration Architecture Capture",
      category: "Lead Acquisition & Booking",
      description:
        "Validates inbound consultation leads and demonstration architecture requests. Enforces 32KB payload limits, honeypot bot dropping, and PII-redacted delivery to downstream webhook.",
      authDetails: "Public with Honeypot verification and rate limiting.",
      rateLimit: "10 requests per minute per IP. 429 Retry-After on abuse.",
      contentType: "application/json",
      requestSchema: {
        name: "string (min 1 char, required)",
        email: "string (valid email format, required)",
        phone: "string (optional phone digits)",
        service: "string (optional service identifier)",
        message: "string (optional narrative query)",
        journey_context: "object (optional validated interactive demonstration context)",
        honeypot: "string (must remain empty; non-empty drops payload safely)",
      },
      responseSchema: {
        success: "boolean",
        delivered: "boolean",
        timestamp: "string (ISO 8601)",
      },
    },
    {
      path: "/api/newsletter/subscribe",
      method: "POST",
      type: "api",
      access: "rate_limited",
      title: "Executive Briefing Subscription Dispatch",
      category: "Briefings & Subscriptions",
      description:
        "Subscribes email addresses to curated technical briefings (Tech Founder Briefing, Ontario Opportunity Monitor, Tender Brief). Strictly validates publication slug and enforces truthful delivery.",
      authDetails: "Public with Honeypot verification and rate limiting.",
      rateLimit: "10 requests per minute per IP. 429 Retry-After on abuse.",
      contentType: "application/json",
      requestSchema: {
        email: "string (valid email format, required)",
        publication:
          "string (active publication slug: 'tech-founder-briefing', 'ontario-opportunity-monitor', 'tender-brief')",
        honeypot: "string (must remain empty)",
      },
      responseSchema: {
        success: "boolean",
        delivered: "boolean",
        publication: "string",
        timestamp: "string (ISO 8601)",
      },
    },
    {
      path: "/api/inbound",
      method: "POST",
      type: "api",
      access: "webhook",
      title: "Twilio Inbound SMS Webhook",
      category: "Telephony & SMS",
      description:
        "Webhook receiving inbound SMS replies from Twilio. Validates Twilio cryptographic signature (x-twilio-signature), parses customer intent, handles opt-outs (STOP), and dispatches AI draft queues.",
      authDetails:
        "Twilio HTTP signature verification (x-twilio-signature). Fails closed in production.",
      contentType: "application/x-www-form-urlencoded",
      responseSchema: {
        twiml: "text/xml (empty TwiML Response)",
      },
    },
    {
      path: "/api/cron",
      method: "GET",
      type: "api",
      access: "secret_authenticated",
      title: "Automation OS Runner Scheduler Tick",
      category: "Automation OS",
      description:
        "Periodic scheduler trigger executed by Vercel Cron. Evaluates active client automations, evaluates due occurrences, and acquires non-conflicting leases.",
      authDetails: "Bearer <CRON_SECRET> in Authorization header.",
      contentType: "application/json",
      responseSchema: {
        status: "string",
        executedAt: "string (ISO 8601)",
        clientsProcessed: "number",
      },
    },
    {
      path: "/api/v1/relay",
      method: "POST",
      type: "api",
      access: "secret_authenticated",
      title: "Hardware SMS Capture Relay Gateway",
      category: "Telephony & SMS",
      description:
        "Hardware SMS relay gateway for Android capture devices. Validates HMAC-SHA256 device signatures, enforces atomic 300s nonce replay protection, and forwards to delivery adapters with zero body persistence.",
      authDetails: "HMAC-SHA256 signature in X-Relay-Signature header + distributed nonce check.",
      contentType: "application/json",
      responseSchema: {
        status: "string ('accepted')",
        relayId: "string",
        processedAt: "string (ISO 8601)",
      },
    },

    // -------------------------------------------------------------------------
    // 2. Machine-Readable & Document Route Handlers
    // -------------------------------------------------------------------------
    {
      path: "/llms.txt",
      method: "GET",
      type: "document",
      access: "public",
      title: "LLM Manifest (llmstxt.org Standard)",
      category: "AI Discovery & Search",
      description:
        "Compact summary of services, core capabilities, pricing anchors, and canonical documentation links formatted for autonomous AI search engines (Perplexity, ChatGPT, Claude, Gemini).",
      contentType: "text/plain; charset=utf-8",
    },
    {
      path: "/llms-full.txt",
      method: "GET",
      type: "document",
      access: "public",
      title: "Full LLM Technical & SOP Knowledge Export",
      category: "AI Discovery & Search",
      description:
        "Deep technical textual export of all 7 digital services, 18 automation solutions, delivery frameworks, architecture blueprints, and engineering SOPs for LLM retrieval and ingestion.",
      contentType: "text/plain; charset=utf-8",
    },
    {
      path: "/pricing.md",
      method: "GET",
      type: "document",
      access: "public",
      title: "Dynamic Markdown Pricing Sheet",
      category: "AI Discovery & Search",
      description:
        "Machine-readable markdown pricing schedule formatted for autonomous AI buying agents and corporate procurement evaluations.",
      contentType: "text/plain; charset=utf-8",
    },
    {
      path: "/contact.vcf",
      method: "GET",
      type: "document",
      access: "public",
      title: "Organization Electronic Business Card (vCard 3.0)",
      category: "Contact & Identity",
      description:
        "Standard vCard 3.0 format for saving The Skill Corner contact coordinates directly to mobile address books from NFC business cards and QR codes.",
      contentType: "text/vcard; charset=utf-8",
    },
    {
      path: "/sitemap.xml",
      method: "GET",
      type: "document",
      access: "public",
      title: "Dynamic XML Search Sitemap",
      category: "Search Engine Optimization",
      description:
        "Dynamic XML sitemap indexing all canonical marketing, capability, automation, industry vertical, and briefing URLs.",
      contentType: "application/xml; charset=utf-8",
    },
    {
      path: "/robots.txt",
      method: "GET",
      type: "document",
      access: "public",
      title: "Robots Crawl Directives",
      category: "Search Engine Optimization",
      description:
        "Search engine and AI crawler crawl permissions, disallows, and sitemap pointer.",
      contentType: "text/plain; charset=utf-8",
    },

    // -------------------------------------------------------------------------
    // 3. Public Marketing & Conversion Pages
    // -------------------------------------------------------------------------
    {
      path: "/",
      method: "GET",
      type: "page",
      access: "public",
      title: "Homepage (Editorial Studio Narrative)",
      category: "Marketing Pages",
      description:
        "Global Masthead, 01 Intent Router & Live Observed System, 02 How We Decide, 03 System Studies, 04 Founder POV, 05 Curated Explore, 06 Open Prompt, and Conversion QuickActions.",
      contentType: "text/html",
    },
    {
      path: "/about",
      method: "GET",
      type: "page",
      access: "public",
      title: "About & Engineering Philosophy",
      category: "Marketing Pages",
      description:
        "Founder story, practical engineering philosophy, and 5 core operating principles applied to real client software development.",
      contentType: "text/html",
    },
    {
      path: "/how-it-works",
      method: "GET",
      type: "page",
      access: "public",
      title: "Delivery Process (Audit → Build → Run)",
      category: "Marketing Pages",
      description:
        "Explicit 3-stage delivery breakdown detailing what The Skill Corner handles vs. what the client handles to eliminate onboarding friction.",
      contentType: "text/html",
    },
    {
      path: "/results",
      method: "GET",
      type: "page",
      access: "public",
      title: "Results & Scenarios",
      category: "Marketing Pages",
      description:
        "Concrete problem/build/anticipated outcome scenarios with transparent non-fabricated operational benchmarks and interactive ROI calculator.",
      contentType: "text/html",
    },
    {
      path: "/book",
      method: "GET",
      type: "page",
      access: "public",
      title: "Audit Booking Portal",
      category: "Conversion & Booking",
      description:
        "Cal.com scheduling embed for a free 30-minute AI Automation Audit ('leave with 3 ideas whether you hire us or not').",
      contentType: "text/html",
    },
    {
      path: "/contact",
      method: "GET",
      type: "page",
      access: "public",
      title: "Quick Query & Contact Form",
      category: "Conversion & Booking",
      description:
        "Contact form and sidebar booking links for visitors with architectural or scoping questions.",
      contentType: "text/html",
    },
    {
      path: "/library",
      method: "GET",
      type: "page",
      access: "public",
      title: "Explore / Library Index",
      category: "Knowledge & Resources",
      description:
        "Authoritative catalog of systems, tools, and engineering field notes with outcome filters and dense listings.",
      contentType: "text/html",
    },
    {
      path: "/checklist",
      method: "GET",
      type: "page",
      access: "public",
      title: "Interactive Automation Opportunities Checklist",
      category: "Lead Magnet & Assessment",
      description:
        "Interactive 25-task assessment tool calculating potential monthly hours saved across communications, scheduling, document handling, and payments.",
      contentType: "text/html",
    },
    {
      path: "/social",
      method: "GET",
      type: "page",
      access: "public",
      title: "Physical Business Card Mobile Landing Page",
      category: "Contact & Identity",
      description:
        "Mobile-first target for NFC smart cards and QR codes. Features direct messaging form and instant vCard download.",
      contentType: "text/html",
    },
    {
      path: "/legal/privacy",
      method: "GET",
      type: "page",
      access: "public",
      title: "Privacy Policy & PIPEDA Guidelines",
      category: "Legal & Compliance",
      description:
        "Transparent privacy guidelines, zero-retention principles, and Canadian PIPEDA/PHIPA compliance standards.",
      contentType: "text/html",
    },
    {
      path: "/legal/terms",
      method: "GET",
      type: "page",
      access: "public",
      title: "Terms of Service",
      category: "Legal & Compliance",
      description: "Standard terms of service, engagement agreements, and delivery parameters.",
      contentType: "text/html",
    },

    // -------------------------------------------------------------------------
    // 4. Dynamic Hubs & Slugs
    // -------------------------------------------------------------------------
    {
      path: "/digital-services",
      method: "GET",
      type: "page",
      access: "public",
      title: "Digital Services & Practice Hub",
      category: "Digital Capabilities Hub",
      description:
        "Digital capabilities directory organized across 3 core pillars: Systems & Software Engineering, Market Acquisition & Positioning, Operational Scale & Infrastructure.",
      contentType: "text/html",
    },
    {
      path: "/digital-services/[slug]",
      method: "GET",
      type: "page",
      access: "public",
      title: "Digital Capability Specification",
      category: "Digital Capabilities Hub",
      description:
        "Technical capability specification detailing operational bottlenecks, interactive architecture schematics, deliverables matrix, and engineering FAQs.",
      contentType: "text/html",
      dynamicSlugs: digitalServiceSlugs,
    },
    {
      path: "/what-we-automate",
      method: "GET",
      type: "page",
      access: "public",
      title: "Automation Services Catalog",
      category: "Automation Services Index",
      description:
        "Directory of concrete systems for communications, client intake, scheduling, invoicing, and recurring operations.",
      contentType: "text/html",
    },
    {
      path: "/what-we-automate/[slug]",
      method: "GET",
      type: "page",
      access: "public",
      title: "Automation Solution Specification",
      category: "Automation Services Index",
      description:
        "Automation specification detailing operational bottlenecks, workflow pipelines, deliverables, and fit assessments.",
      contentType: "text/html",
      dynamicSlugs: automationServiceSlugs,
    },
    {
      path: "/industries",
      method: "GET",
      type: "page",
      access: "public",
      title: "Industry Solutions Catalog",
      category: "Industry Solutions Index",
      description:
        "Systems tailored specifically to how local businesses and professional practices operate day-to-day.",
      contentType: "text/html",
    },
    {
      path: "/industries/[slug]",
      method: "GET",
      type: "page",
      access: "public",
      title: "Industry Sector Narrative",
      category: "Industry Solutions Index",
      description:
        "Sector narrative detailing the recurring operating week, workflow friction points, illustrative scenarios, and priority systems.",
      contentType: "text/html",
      dynamicSlugs: industrySlugs,
    },
    {
      path: "/newsletters",
      method: "GET",
      type: "page",
      access: "public",
      title: "Executive Briefings & Market Intelligence Hub",
      category: "Executive Briefings Hub",
      description:
        "Curated technical briefings and recurring market radars for founders, technical operators, and Canadian SMBs.",
      contentType: "text/html",
    },
    {
      path: "/newsletters/[slug]",
      method: "GET",
      type: "page",
      access: "public",
      title: "Single Briefing Publication & Archive",
      category: "Executive Briefings Hub",
      description:
        "Briefing publication overview, subscription intake, sample issue reader, and methodology.",
      contentType: "text/html",
      dynamicSlugs: newsletterSlugs,
    },

    // -------------------------------------------------------------------------
    // 5. Permanent URL Redirects (HTTP 308)
    // -------------------------------------------------------------------------
    {
      path: "/services",
      method: "GET",
      type: "redirect",
      access: "public",
      title: "Legacy Services Redirect",
      description: "Redirects permanently (308) to canonical /what-we-automate",
      targetUrl: "/what-we-automate",
    },
    {
      path: "/services/:slug",
      method: "GET",
      type: "redirect",
      access: "public",
      title: "Legacy Dynamic Services Redirect",
      description: "Redirects permanently (308) to canonical /what-we-automate/:slug",
      targetUrl: "/what-we-automate/:slug",
    },
    {
      path: "/for",
      method: "GET",
      type: "redirect",
      access: "public",
      title: "Legacy Industries Redirect",
      description: "Redirects permanently (308) to canonical /industries",
      targetUrl: "/industries",
    },
    {
      path: "/for/:slug",
      method: "GET",
      type: "redirect",
      access: "public",
      title: "Legacy Dynamic Industries Redirect",
      description: "Redirects permanently (308) to canonical /industries/:slug",
      targetUrl: "/industries/:slug",
    },
    {
      path: "/industry",
      method: "GET",
      type: "redirect",
      access: "public",
      title: "Legacy Singular Industry Redirect",
      description: "Redirects permanently (308) to canonical /industries",
      targetUrl: "/industries",
    },
    {
      path: "/industry/:slug",
      method: "GET",
      type: "redirect",
      access: "public",
      title: "Legacy Dynamic Singular Industry Redirect",
      description: "Redirects permanently (308) to canonical /industries/:slug",
      targetUrl: "/industries/:slug",
    },
    {
      path: "/privacy",
      method: "GET",
      type: "redirect",
      access: "public",
      title: "Legacy Privacy URL Redirect",
      description: "Redirects permanently (308) to canonical /legal/privacy",
      targetUrl: "/legal/privacy",
    },
    {
      path: "/terms",
      method: "GET",
      type: "redirect",
      access: "public",
      title: "Legacy Terms URL Redirect",
      description: "Redirects permanently (308) to canonical /legal/terms",
      targetUrl: "/legal/terms",
    },
    {
      path: "/what-we-automate/feedback-and-reviews",
      method: "GET",
      type: "redirect",
      access: "public",
      title: "Legacy Feedback Slug Redirect",
      description:
        "Redirects permanently (308) to canonical /what-we-automate/reviews-and-reputation",
      targetUrl: "/what-we-automate/reviews-and-reputation",
    },
  ];
}
