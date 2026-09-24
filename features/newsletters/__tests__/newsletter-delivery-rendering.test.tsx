import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { NewsletterContentRenderer } from "../components/NewsletterContentRenderer";
import { NewsletterDeliveryPreview } from "../components/NewsletterDeliveryPreview";
import type { Newsletter, NewsletterIssue } from "../domain/types";

describe("NewsletterContentRenderer", () => {
  const sampleMarkdown = `## The Shift Toward Constrained Determinism

Over the past quarter, the consensus among engineers shipping autonomous systems to commercial clients has fundamentally shifted. Here is *verified evidence* from Q3 deployments.

### 1. State Machines over Open-Ended Autonomy
- **Status**: Verified in production
- **Scope**: Deterministic state transitions
- Benchmark improvements by 40%

*Review takeaways and edit before approving publication.*`;

  it("renders semantic headings without raw hash syntax", () => {
    const html = renderToStaticMarkup(
      <NewsletterContentRenderer content={sampleMarkdown} variant="editorial" />,
    );

    expect(html).toContain("<h2");
    expect(html).toContain("The Shift Toward Constrained Determinism");
    // Ensure no raw markdown hashes remain in heading
    expect(html).not.toContain("## The Shift");

    expect(html).toContain("<h3");
    expect(html).toContain("1. State Machines over Open-Ended Autonomy");
    expect(html).not.toContain("### 1. State");
  });

  it("renders lists with bold tokens instead of raw asterisks", () => {
    const html = renderToStaticMarkup(
      <NewsletterContentRenderer content={sampleMarkdown} variant="email" />,
    );

    expect(html).toContain("<ul");
    expect(html).toContain("<li");
    expect(html).toContain("<strong");
    expect(html).toContain("Status</strong>");
    expect(html).toContain(": Verified in production");
    expect(html).not.toContain("**Status**");
  });

  it("renders inline italics and callout blocks without raw asterisks", () => {
    const html = renderToStaticMarkup(
      <NewsletterContentRenderer content={sampleMarkdown} variant="email" />,
    );

    // Inline italic
    expect(html).toContain("<em");
    expect(html).toContain("verified evidence</em>");

    // Callout block with italic class
    expect(html).toContain("italic");
    expect(html).toContain("Review takeaways and edit before approving publication.");
    expect(html).not.toContain("*Review takeaways");
  });
});

describe("NewsletterDeliveryPreview", () => {
  const mockIssue: NewsletterIssue = {
    id: "test-001",
    newsletterSlug: "tech-founder-briefing",
    issueNumber: 4,
    title: "Autonomous Agent Guardrails in Enterprise Stacks",
    slug: "autonomous-guardrails",
    summary:
      "A practical guide to securing LLM tool dispatch against unauthorized data exfiltration.",
    keyTakeaways: [
      "Zero-trust credential scoping per tool execution context",
      "Cryptographic request hashing for audit log non-repudiation",
    ],
    contentMarkdown: `## Security Hardening for Autonomous Pipelines\n\nImplementing strict policy engines at the execution boundary.\n\n### Core Tenet\n- **Isolation**: Subprocess execution sandboxes`,
    generatedBy: "ai",
    status: "review",
    scheduledFor: "2026-10-01T12:00:00Z",
    sourceItemCount: 14,
  };

  const mockNewsletter: Newsletter = {
    id: "tech-founder-briefing",
    slug: "tech-founder-briefing",
    name: "Tech Founder Briefing",
    tagline: "Actionable AI & engineering shifts, distilled weekly.",
    description: "Curated weekly briefing for software operators.",
    topic: "Applied AI",
    audience: "Technical founders & CTOs",
    categories: ["ai", "engineering"],
    tags: ["agents", "architecture"],
    generationMode: "ai",
    cadence: "weekly",
    deliveryChannel: "all",
    subscriptionModel: "free",
    priceDisplay: "Free",
    editorialOwner: "The Skill Corner Engineering",
    sourceInputs: ["GitHub", "ArXiv"],
    status: "active",
    visibility: "public",
    subscriberCount: 150,
    issues: [mockIssue],
  };

  it("renders an email dispatch envelope with metadata and rendered delivery document", () => {
    const html = renderToStaticMarkup(
      <NewsletterDeliveryPreview newsletter={mockNewsletter} issue={mockIssue} />,
    );

    // Envelope header checks
    expect(html).toContain("Email Dispatch Preview");
    expect(html).toContain("Direct Delivery");
    expect(html).toContain("Ready for Delivery");
    expect(html).toContain("Tech Founder Briefing");
    expect(html).toContain("Issue #4");
    expect(html).toContain("subscriber@enterprise-domain.com");
    expect(html).toContain("SPF / DKIM / DMARC PASS");

    // Delivered content checks
    expect(html).toContain("Autonomous Agent Guardrails in Enterprise Stacks");
    expect(html).toContain("Executive Briefing Summary");
    expect(html).toContain(
      "A practical guide to securing LLM tool dispatch against unauthorized data exfiltration.",
    );
    expect(html).toContain("Zero-trust credential scoping per tool execution context");

    // Content body is rendered into semantic tags without raw markup
    expect(html).toContain("<h2");
    expect(html).toContain("Security Hardening for Autonomous Pipelines");
    expect(html).not.toContain("## Security Hardening");

    // Footer checks
    expect(html).toContain("Unsubscribe");
    expect(html).toContain("Delivery Preferences");
    expect(html).toContain("The Skill Corner Inc.");
  });
});
