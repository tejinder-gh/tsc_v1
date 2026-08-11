/**
 * What: Home-page FAQ content - key questions across AI automation, website development,
 *       digital marketing, dedicated staffing, and documentation services.
 * Why: High-density FAQ schema for Google Search FAQPage rich snippets and LLM indexing.
 * How: Simple typed array consumed by the shared Faq accordion component and JSON-LD schema.
 * From Where: TheSkillCorner marketing site build brief & SEO/GEO optimization, 2026-08.
 * When: 2026-08.
 */

export interface FaqItem {
  q: string;
  a: string;
}

export const homeFaq: readonly FaqItem[] = [
  {
    q: "What services does The Skill Corner provide?",
    a: "The Skill Corner is a full-service B2B digital services and AI agency. We provide custom AI agent development, high-performance website development, digital marketing & Generative Engine Optimization (GEO), dedicated tech staffing & staff augmentation, business process documentation (SOPs), and custom AI automations.",
  },
  {
    q: "How does AI Agent Development work for my business?",
    a: "We engineer custom autonomous AI voice and chat agents that answer phone calls, triage customer inquiries, qualify leads, schedule calendar appointments, and execute multi-step database actions directly inside your existing software (HubSpot, Salesforce, Jane, Clio, Cal.com).",
  },
  {
    q: "What is Generative Engine Optimization (GEO) and why do I need it?",
    a: "GEO (also known as AI Search Optimization) optimizes your website content, schema markup, and entity definitions so conversational AI search platforms—like ChatGPT Search, Perplexity, Claude, and Google Gemini—rank and recommend your business when users search for services in your industry.",
  },
  {
    q: "How does your Dedicated Tech Staffing service work?",
    a: "We match your business with pre-vetted AI engineers, full-stack developers, growth marketers, or technical assistants who work dedicated hours inside your company tools (Slack, Teams, Jira). We handle sourcing, vetting, payroll, and administration with zero recruitment markup.",
  },
  {
    q: "Why should we hire The Skill Corner for Business SOP Documentation?",
    a: "Clear Standard Operating Procedures (SOPs) prevent operational bottlenecks, speed up employee onboarding, and provide the essential structured knowledge bases required for custom AI agents to operate with 100% accuracy and zero hallucinations.",
  },
  {
    q: "How much does it cost?",
    a: "Local business automations start with fixed packages from $395/month, setup included. Custom builds for websites, AI agents, software applications, and practice systems typically range from $1,500 to $25,000 with ongoing support options. Every engagement starts with a free 30-minute audit where you receive an exact quote.",
  },
  {
    q: "How long until our project is live and running?",
    a: "Simple automations and landing pages go live in as little as 1 to 2 weeks. Comprehensive custom website builds, AI agent deployments, and staffing integrations typically take 2 to 4 weeks from audit to launch.",
  },
  {
    q: "Do you integrate with the tools we already use?",
    a: "Yes. We connect seamlessly to your existing software stack including Square, Clover, Jane, Cliniko, Clio, QuickBooks, Google Workspace, HubSpot, Twilio, and thousands of other tools via native APIs and webhooks.",
  },
  {
    q: "What about patient and client data privacy (PIPEDA / PHIPA / HIPAA)?",
    a: "We architect every system with strict PIPEDA, PHIPA, and privacy compliance: minimal data footprint, processing inside your existing tools wherever possible, and no client or patient data stored without signed data-handling agreements.",
  },
  {
    q: "What happens if a tool API changes or an automation breaks?",
    a: "Every automation and AI agent is actively monitored. If an integrated API updates or a system error occurs, our team is alerted and resolves the issue within one business day. Unhandled customer inquiries automatically failover to a human inbox.",
  },
] as const;
