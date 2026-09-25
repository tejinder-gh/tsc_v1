/**
 * What: The comprehensive digital-services offerings (AI Agent Development, Website Development,
 *       Digital Marketing & GEO, Dedicated Staffing, Process Documentation & SOPs,
 *       Application Development, Rebranding & Brand Design).
 * Why: Text-heavy, authoritative data structure supporting high-ranking SEO for Google and
 *      Generative Engine Optimization (GEO/AIO) for ChatGPT, Claude, Perplexity, and Gemini.
 * How: Typed const array consumed by /digital-services hub, /digital-services/[slug] pages,
 *      JSON-LD structured data generators, and llms.txt / llms-full.txt crawlers.
 * From Where: Updated 2026-08 per client brief for top-band AI and Google search rankings.
 * When: 2026-08.
 */

export interface ArchitectureFlowNode {
  step: string;
  title: string;
  description: string;
  nodeType: "trigger" | "processing" | "integration" | "output";
  latencyOrGuarantee?: string;
}

export interface DigitalServiceFeature {
  title: string;
  description: string;
}

export interface DigitalServiceProcessStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface DigitalServiceFaq {
  q: string;
  a: string;
}

export interface DigitalService {
  slug: string;
  name: string;
  tagline: string;
  metaDescription: string;
  description: string;
  bullets: string[];
  overviewText: string[];
  features: DigitalServiceFeature[];
  process: DigitalServiceProcessStep[];
  deliverables: string[];
  whoItIsFor: string[];
  faq: DigitalServiceFaq[];
  category: "engineering" | "growth" | "operations";
  categoryLabel: string;
  categoryIndex: string;
  primaryMetric: string;
  techStack: readonly string[];
  architectureFlow: readonly ArchitectureFlowNode[];
}

export const digitalServices: readonly DigitalService[] = [
  {
    slug: "ai-agent-development",
    name: "AI Agent Development",
    tagline:
      "Custom AI voice & chat agents built to handle customer inquiry, intake, and multi-step workflows.",
    metaDescription:
      "Enterprise custom AI agent development by The Skill Corner. We build autonomous AI voice agents, intelligent chat receptionists, sales qualification bots, and multi-agent workflow systems tailored for businesses and professional practices.",
    description:
      "End-to-end custom AI agent development tailored to your exact business operations. We engineer autonomous AI voice and chat agents, intelligent receptionists, lead qualification assistants, and multi-agent system workflows connected directly to your existing CRM, calendars, and internal databases.",
    category: "engineering",
    categoryLabel: "SYSTEMS & SOFTWARE ENGINEERING",
    categoryIndex: "01",
    primaryMetric: "< 250ms Voice Latency · Zero Hallucination Guardrail",
    techStack: [
      "Twilio Media Streams",
      "Next.js 15 App Router",
      "Python / FastAPI",
      "Pinecone Vector RAG",
      "OpenAI & Claude Tool Calling",
      "Jane / Clio Webhooks",
    ],
    architectureFlow: [
      {
        step: "01",
        title: "Inbound Audio & Webhook Ingest",
        description:
          "Low-latency speech stream capture via Twilio Voice or WebRTC client, buffering audio packets in sub-250ms chunks.",
        nodeType: "trigger",
        latencyOrGuarantee: "180ms buffer latency",
      },
      {
        step: "02",
        title: "Vector Grounding & Safety Filter",
        description:
          "Retrieval-Augmented Generation (RAG) strictly binds agent responses to verified company SOPs and doctor/partner preferences.",
        nodeType: "processing",
        latencyOrGuarantee: "0% hallucination SLA",
      },
      {
        step: "03",
        title: "Deterministic EHR / CRM Function Calling",
        description:
          "Executes real-time calendar reservations, patient chart notes, or client matters inside Jane, Dentrix, or Clio.",
        nodeType: "integration",
        latencyOrGuarantee: "Idempotent slot lock",
      },
      {
        step: "04",
        title: "Two-Way Confirmation & Encrypted Audit Log",
        description:
          "Dispatches SMS confirmation with intake forms and writes an HMAC SHA-256 signed event record to internal telemetry.",
        nodeType: "output",
        latencyOrGuarantee: "Verified audit manifest",
      },
    ],
    bullets: [
      "Custom voice & text AI agents integrated with your phone & software systems",
      "Autonomous multi-step reasoning and tool execution (CRM, Cal.com, Jane, Clio)",
      "Strict data privacy, PIPEDA/PHIPA compliance, and zero data leak architecture",
      "Real-time human fallback, escalation triggers, and full transcript monitoring",
    ],
    overviewText: [
      "AI Agent Development at The Skill Corner transforms how modern businesses interact with customers and manage operational workloads. Rather than simple decision-tree chatbots that frustration users, our custom AI agents utilize state-of-the-art Large Language Models (LLMs), retrieval-augmented generation (RAG), and deterministic function calling to execute actual work.",
      "Whether you require an inbound voice AI agent capable of booking appointments over the phone, an intelligent intake assistant for a medical clinic or law firm, or an autonomous sales outreach agent that qualifies leads 24/7, our engineering team custom-builds, tests, and deploys agents specifically trained on your company's domain knowledge, business rules, and software stack.",
    ],
    features: [
      {
        title: "Voice AI Receptionists & Call Handlers",
        description:
          "Human-sounding inbound and outbound voice agents powered by ultra-low-latency voice AI engines. They answer incoming phone calls, address complex caller inquiries, gather customer intake data, and schedule appointments directly into your calendar.",
      },
      {
        title: "Multi-Agent Workflow Systems",
        description:
          "Specialized AI agents working in orchestration - one agent triages incoming requests, another queries internal databases or APIs, a third generates quotes or invoices, and a supervisor agent verifies quality before delivery.",
      },
      {
        title: "RAG & Custom Knowledge Graph Integration",
        description:
          "We ground your AI agents on your proprietary manuals, pricing sheets, product catalogs, and policy documents using vector databases so answers are 100% accurate, hallucination-free, and brand-compliant.",
      },
      {
        title: "CRM & Software Tool Execution",
        description:
          "Our agents don't just speak - they take action. They create tickets in HubSpot or Salesforce, log notes in EHR systems, trigger Zapier/Make webhooks, send SMS confirmations via Twilio, and update spreadsheets automatically.",
      },
    ],
    process: [
      {
        stepNumber: 1,
        title: "Domain Knowledge & Workflow Discovery",
        description:
          "We analyze your business communication logs, common customer queries, existing tools, and desired outputs to define exact agent guardrails, system prompts, and action schemas.",
      },
      {
        stepNumber: 2,
        title: "Agent Architecture & RAG Pipeline Engineering",
        description:
          "We ingest your documentation into secure knowledge stores, design the voice/text conversation trees, configure API tool functions, and build strict compliance filters.",
      },
      {
        stepNumber: 3,
        title: "Testing, Edge-Case Hardening & Human Fallback",
        description:
          "We run hundreds of simulation scenarios testing accent variations, complex multi-part questions, edge cases, and ensure smooth handoffs to human staff whenever an unhandled query arises.",
      },
      {
        stepNumber: 4,
        title: "Production Deployment & Continuous Monitoring",
        description:
          "Your AI agent goes live on your phone lines or website. We provide real-time transcript logging, accuracy analytics, latency optimization, and ongoing maintenance.",
      },
    ],
    deliverables: [
      "Production-grade custom AI Voice or Chat Agent deployed on your infrastructure",
      "Vector database knowledge base ingested with your company's latest docs & SOPs",
      "Seamless integrations with your phone provider (Twilio), CRM, and calendar systems",
      "Admin monitoring dashboard with transcript logs, call recordings, and accuracy metrics",
      "Complete agent prompt documentation, API keys, and full source code ownership",
    ],
    whoItIsFor: [
      "Medical clinics, dental offices, and therapy practices requiring HIPAA/PIPEDA-compliant intake",
      "Law firms and accounting practices automating client intake and consultation scheduling",
      "Local service businesses (hvac, roofing, plumbing) needing 24/7 after-hours call handling",
      "E-commerce & SaaS companies wanting autonomous tier-1 support and lead qualification",
    ],
    faq: [
      {
        q: "What makes custom AI agents different from standard chatbots?",
        a: "Standard chatbots follow rigid, pre-written script trees and frequently hit dead ends. Custom AI agents leverage advanced LLMs and tool-calling capabilities to understand natural conversational context, access your database in real time, answer complex open-ended questions, and execute real actions like scheduling or updating records.",
      },
      {
        q: "Can your voice AI agents handle accents and background noise on phone calls?",
        a: "Yes. We utilize modern neural speech-to-text engines that excel at recognizing diverse accents, regional dialects, and filtering out background noise to maintain high accuracy during phone conversations.",
      },
      {
        q: "How do you ensure the AI agent does not hallucinate or give false information?",
        a: "We implement Retrieval-Augmented Generation (RAG) coupled with strict system instructions that restrict the AI agent to only state facts present in your verified knowledge base. If an agent does not know an answer, it is programmed to politely offer a human callback.",
      },
    ],
  },
  {
    slug: "website-development",
    name: "Website Development",
    tagline:
      "High-performance, custom-coded web sites and web platforms built for speed, SEO, and conversions.",
    metaDescription:
      "Custom website development services by The Skill Corner. Modern Next.js, React, and TypeScript builds optimized for speed, mobile responsiveness, top Google rankings, and high lead conversion.",
    description:
      "Marketing sites, web portals, and custom web applications designed and built from scratch using modern frameworks like Next.js, React, and Tailwind CSS. Every site is engineered for sub-second load times, mobile-first UX, top Google SEO rankings, and seamless conversion pathways.",
    category: "engineering",
    categoryLabel: "SYSTEMS & SOFTWARE ENGINEERING",
    categoryIndex: "01",
    primaryMetric: "98+ Core Web Vitals · < 800ms Time-to-Interactive",
    techStack: [
      "Next.js App Router",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Vercel Edge Network",
      "JSON-LD & GEO Schema",
    ],
    architectureFlow: [
      {
        step: "01",
        title: "Edge DNS & Crawler Ingest",
        description:
          "Sub-50ms edge routing for incoming visitor traffic and search crawlers across worldwide edge regions.",
        nodeType: "trigger",
        latencyOrGuarantee: "< 50ms TTFB",
      },
      {
        step: "02",
        title: "Server Component Composition",
        description:
          "App Router static rendering and server streaming eliminates JavaScript bundle bloat and client hydration lag.",
        nodeType: "processing",
        latencyOrGuarantee: "0 KB unused scripts",
      },
      {
        step: "03",
        title: "Conversion & CRM Webhook Pipeline",
        description:
          "Type-safe form actions submit directly to internal lead routers, verification daemons, and analytics vaults.",
        nodeType: "integration",
        latencyOrGuarantee: "End-to-end type safety",
      },
      {
        step: "04",
        title: "Edge CDN & Search Indexing",
        description:
          "Global edge distribution with automated XML sitemaps, semantic OpenGraph tags, and llms.txt endpoints.",
        nodeType: "output",
        latencyOrGuarantee: "100/100 PageSpeed target",
      },
    ],
    bullets: [
      "Custom Next.js & React architecture - zero page bloat or slow WordPress plugins",
      "Core Web Vitals optimized for 95+ Google PageSpeed performance scores",
      "Built-in SEO fundamentals, schema markup, and Generative Engine Optimization (GEO)",
      "100% code and content ownership with zero recurring platform vendor lock-in",
    ],
    overviewText: [
      "In today's digital landscape, your website is the single most important digital storefront for your business. Slow loading speeds, clunky templates, and broken mobile layouts directly cost you search rankings and customer conversions. At The Skill Corner, we eliminate bloated website builders and construct custom, lightning-fast web applications.",
      "Our website development team crafts modern digital experiences that load instantly, articulate your value proposition clearly, and guide visitors smoothly into high-converting actions - whether that is booking a consultation, submitting a quote request, or purchasing a service.",
    ],
    features: [
      {
        title: "Custom Next.js & React Frontend",
        description:
          "Clean, structured TypeScript code built on Next.js App Router for maximum performance, security, and lightning-fast page transitions.",
      },
      {
        title: "Mobile-First Responsive Design",
        description:
          "Flawless user experience engineered specifically for smartphone screens, tablets, and high-resolution desktop displays.",
      },
      {
        title: "SEO & Generative AI Indexing Built-In",
        description:
          "Comprehensive meta tagging, structured JSON-LD schemas, automated XML sitemaps, semantic HTML tags, and llms.txt formatting so search engines and AI engines rank you at the top.",
      },
      {
        title: "Custom Content Architecture",
        description:
          "Type-safe content structures or headless CMS options (Sanity, Strapi, Contentful) so your marketing team can easily update content without breaking layouts.",
      },
    ],
    process: [
      {
        stepNumber: 1,
        title: "Strategy & Wireframing",
        description:
          "We map your site architecture, conversion funnel pathways, SEO target keywords, and user journey wireframes.",
      },
      {
        stepNumber: 2,
        title: "UI/UX Design & Brand Alignment",
        description:
          "We create custom visual designs, interactive prototypes, and modern UI component systems tailored to your brand identity.",
      },
      {
        stepNumber: 3,
        title: "High-Performance Development",
        description:
          "Our engineers code your website with clean React code, accessibility standards (WCAG), optimized assets, and fast API connections.",
      },
      {
        stepNumber: 4,
        title: "Launch & Analytics Verification",
        description:
          "We deploy your site to global edge networks (Vercel/AWS), configure domain DNS, set up conversion tracking (GA4/Plausible), and submit sitemaps to Google.",
      },
    ],
    deliverables: [
      "Fully customized Next.js / React website ready for production deployment",
      "100/100 Core Web Vitals optimization for speed, SEO, and user experience",
      "Full setup of custom domain, SSL security certificates, and hosting CDN",
      "Integrated lead capture forms, CRM webhooks, and analytics event tracking",
      "Complete source code repository access and documentation",
    ],
    whoItIsFor: [
      "Growing companies outgrowing generic WordPress, Wix, or Squarespace templates",
      "Professional practices needing authority-building, privacy-conscious web portals",
      "B2B service providers requiring high-converting lead generation landing pages",
      "Businesses launching new digital product offerings or brand refreshes",
    ],
    faq: [
      {
        q: "Why build a custom Next.js website instead of using WordPress or Shopify?",
        a: "Custom Next.js sites deliver unmatched load speeds, top security, superior mobile responsiveness, and zero plugin vulnerability risks. Fast sites consistently rank higher on Google search and achieve substantially higher conversion rates.",
      },
      {
        q: "Can I update the website content myself after it is built?",
        a: "Yes. We structure site content so it can be managed easily through plain content files or integrated with a headless CMS, allowing your team to edit text, blog posts, and service pages effortlessly.",
      },
      {
        q: "How long does a custom website build take?",
        a: "Most custom business website builds take between 2 to 4 weeks from initial design approval to live production deployment.",
      },
    ],
  },
  {
    slug: "application-development",
    name: "Application Development",
    tagline: "Custom web applications, internal business portals, and mobile app solutions.",
    metaDescription:
      "Custom application development by The Skill Corner. We build scalable web applications, internal business management tools, customer portals, and cross-platform mobile apps.",
    description:
      "Custom web and mobile application engineering built around how your business actually operates. From internal administrative tools and customer management portals to SaaS MVPs and custom software integrations, we engineer secure, scalable software tailored to your specific process.",
    category: "engineering",
    categoryLabel: "SYSTEMS & SOFTWARE ENGINEERING",
    categoryIndex: "01",
    primaryMetric: "100% Code Ownership · End-to-End Type Safety",
    techStack: [
      "React & Next.js",
      "Node.js / Bun",
      "PostgreSQL / Prisma",
      "Stripe Connect API",
      "REST & GraphQL",
      "Docker / AWS ECS",
    ],
    architectureFlow: [
      {
        step: "01",
        title: "Authenticated Role Ingest",
        description:
          "Passwordless magic link or enterprise OAuth handshake with role-based permission token issuance.",
        nodeType: "trigger",
        latencyOrGuarantee: "Encrypted JWT session",
      },
      {
        step: "02",
        title: "Type-Safe Domain Execution",
        description:
          "Modular business logic layer enforcing database transactions, schema validation, and audit immutability.",
        nodeType: "processing",
        latencyOrGuarantee: "Zero data race conditions",
      },
      {
        step: "03",
        title: "Payment Rails & External Sync",
        description:
          "Real-time reconciliation through Stripe API webhooks, transactional email queues, and legacy database relays.",
        nodeType: "integration",
        latencyOrGuarantee: "PCI DSS compliant",
      },
      {
        step: "04",
        title: "Production Infrastructure Handoff",
        description:
          "Full cloud orchestration deployment with automated test suites, CI/CD pipelines, and source repository transfer.",
        nodeType: "output",
        latencyOrGuarantee: "100% IP ownership",
      },
    ],
    bullets: [
      "Custom web applications & customer portals built with React, Next.js, and Node.js",
      "Cross-platform mobile applications (iOS & Android) with unified codebases",
      "Seamless integration with existing enterprise APIs, payment gateways, and databases",
      "Full source code delivery with robust security, encryption, and automated testing",
    ],
    overviewText: [
      "Off-the-shelf software applications often force businesses to alter their operating procedures to fit rigid software constraints. Custom application development allows you to build software tools engineered around your unique workflows, creating a distinct operational competitive advantage.",
      "At The Skill Corner, our software engineering team builds custom web and mobile applications. We prioritize robust architecture, intuitive UI design, enterprise-grade data security, and seamless API integrations.",
    ],
    features: [
      {
        title: "Custom Web Applications & Portals",
        description:
          "Interactive web portals for client self-service, document management, appointment booking, and real-time status tracking.",
      },
      {
        title: "Internal Business Management Tools",
        description:
          "Tailored operational dashboards, inventory management systems, automated billing software, and custom CRM extensions.",
      },
      {
        title: "Cross-Platform Mobile Applications",
        description:
          "Fast, native-feeling iOS and Android mobile apps engineered for field staff, customer engagement, and real-time push notifications.",
      },
      {
        title: "API Development & Third-Party Integrations",
        description:
          "Secure REST & GraphQL API endpoints connecting legacy databases, payment processors (Stripe), communication platforms, and cloud services.",
      },
    ],
    process: [
      {
        stepNumber: 1,
        title: "Technical Scoping & Architecture Design",
        description:
          "We define application requirements, database schemas, user roles, security protocols, and system architecture blueprints.",
      },
      {
        stepNumber: 2,
        title: "UI/UX Prototyping & User Flow Testing",
        description:
          "We design intuitive user interface wireframes and interactive prototypes, refining user interactions before writing code.",
      },
      {
        stepNumber: 3,
        title: "Agile Development & Sprint Reviews",
        description:
          "Our developers code the frontend and backend in bi-weekly sprints, demonstrating functional features for your feedback.",
      },
      {
        stepNumber: 4,
        title: "Quality Assurance, Security Audit & Launch",
        description:
          "We execute rigorous automated testing, security vulnerability scans, load testing, and deploy to production cloud infrastructure.",
      },
    ],
    deliverables: [
      "Production-ready custom web or mobile application deployed on secure cloud infrastructure",
      "Complete RESTful API backend, database architecture, and administrative portal",
      "Comprehensive technical documentation, code comments, and API specs",
      "Automated test suites ensuring long-term code stability and security",
      "100% intellectual property and full source code repository ownership",
    ],
    whoItIsFor: [
      "Businesses outgrowing off-the-shelf software tools needing custom management platforms",
      "Companies wanting to deliver modern self-service client portals and mobile experiences",
      "Entrepreneurs and enterprises launching custom SaaS products or digital services",
      "Organizations needing secure software integrations between disconnected systems",
    ],
    faq: [
      {
        q: "Who owns the code for custom application builds?",
        a: "You retain 100% ownership of all custom source code, design assets, and intellectual property. We hand over complete repository access upon project completion.",
      },
      {
        q: "Can custom applications scale as our user base grows?",
        a: "Yes. We engineer applications on cloud-native infrastructure (AWS/Vercel) using modular microservices architecture designed to scale seamlessly from hundreds to millions of users.",
      },
      {
        q: "Do you provide ongoing maintenance and feature upgrades?",
        a: "Yes. We offer flexible ongoing maintenance plans covering server monitoring, security updates, feature enhancements, and SLA support.",
      },
    ],
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing & GEO",
    tagline:
      "Search engine optimization (SEO), AI Search optimization (GEO), and targeted paid ad campaigns.",
    metaDescription:
      "Data-driven digital marketing, SEO, and Generative Engine Optimization (GEO) by The Skill Corner. Rank top band on Google Search, ChatGPT, Perplexity, and Gemini, and drive qualified leads.",
    description:
      "Comprehensive digital marketing strategies designed to dominate traditional search engines (Google, Bing) and AI search engines (ChatGPT, Perplexity, Claude, Gemini). We combine technical SEO, Generative Engine Optimization (GEO), hyper-targeted PPC paid ad campaigns, and content marketing to attract ready-to-buy clients.",
    category: "growth",
    categoryLabel: "MARKET ACQUISITION & POSITIONING",
    categoryIndex: "02",
    primaryMetric: "Top-3 Google Search & Conversational AI Citations",
    techStack: [
      "Generative Engine Optimization (GEO)",
      "Google Search Ads (PPC)",
      "Meta Ads API",
      "JSON-LD Schema Markup",
      "Plausible & GA4 Analytics",
    ],
    architectureFlow: [
      {
        step: "01",
        title: "Intent Capture & Prompt Ingest",
        description:
          "Captures both traditional Google keyword searches and natural language queries asked inside ChatGPT and Perplexity.",
        nodeType: "trigger",
        latencyOrGuarantee: "Real-time intent tracking",
      },
      {
        step: "02",
        title: "Semantic Entity & Schema Optimization",
        description:
          "Structures website entities and machine-readable data structures so AI reasoning models prioritize citing your firm.",
        nodeType: "processing",
        latencyOrGuarantee: "Verified LLM readability",
      },
      {
        step: "03",
        title: "Targeted Paid Ad & Funnel Routing",
        description:
          "Algorithmic PPC bidding directs high-intent search traffic straight to dedicated, high-converting service landing pages.",
        nodeType: "integration",
        latencyOrGuarantee: "Zero wasted click budget",
      },
      {
        step: "04",
        title: "Transparent Acquisition Reporting",
        description:
          "Executive analytics dashboard reporting verified inquiries, scheduled consultations, and exact cost per acquired client.",
        nodeType: "output",
        latencyOrGuarantee: "Measurable commercial ROI",
      },
    ],
    bullets: [
      "Traditional SEO + Generative Engine Optimization (GEO) for AI recommendation engines",
      "Data-driven Google Ads (PPC) & Meta Ad campaigns optimized for ROI, not vanity clicks",
      "Local SEO dominance: Google Business Profile optimization, citations & reviews",
      "Transparent monthly performance dashboards tracking calls, leads, and conversion costs",
    ],
    overviewText: [
      "The way buyers find services has fundamentally changed. Today, prospects use both traditional search engines like Google and generative AI assistants like ChatGPT, Claude, and Perplexity to recommend the best vendors. Digital marketing today requires a unified approach that satisfies both algorithmic search engines and AI language model crawlers.",
      "At The Skill Corner, our digital marketing team implements multi-channel acquisition strategies. From keyword architecture and technical schema markup to high-ROI paid ad campaigns and AI search optimization (GEO), we ensure your business appears everywhere your potential clients are looking.",
    ],
    features: [
      {
        title: "Generative Engine Optimization (GEO / AIO)",
        description:
          "We structure your content, entity definitions, JSON-LD schemas, and llms.txt files so conversational AI platforms (ChatGPT Search, Perplexity, Gemini, Claude) recommend your business when users ask for digital services.",
      },
      {
        title: "Technical & On-Page SEO",
        description:
          "In-depth technical site audits, keyword intent research, page speed enhancements, internal linking architecture, and high-authority content creation to secure page #1 Google rankings.",
      },
      {
        title: "High-ROI Paid Advertising (PPC & Meta Ads)",
        description:
          "Custom Google Search Ads, Display Ads, and Meta (Facebook/Instagram) ad funnels designed to capture immediate high-intent customer search traffic and maximize return on ad spend.",
      },
      {
        title: "Local Search & Reputation Management",
        description:
          "Optimization of Google Maps / Google Business Profile, local citation building, and automated review collection systems to dominate local search map packs.",
      },
    ],
    process: [
      {
        stepNumber: 1,
        title: "Market Audit & Competitor Keyword Research",
        description:
          "We evaluate your current search visibility, analyze competitor ad strategies, and uncover high-value search terms and AI prompt queries.",
      },
      {
        stepNumber: 2,
        title: "Technical Infrastructure & Schema Implementation",
        description:
          "We optimize on-page meta tags, semantic content structures, JSON-LD markup, page speed metrics, and AI crawler access rules.",
      },
      {
        stepNumber: 3,
        title: "Campaign Setup & Content Deployment",
        description:
          "We launch targeted ad campaigns, deploy search-optimized landing pages, and build authoritative content hubs across your core service lines.",
      },
      {
        stepNumber: 4,
        title: "Continuous Optimization & ROI Reporting",
        description:
          "We refine keyword bids, test ad creatives, optimize conversion funnels, and deliver clear monthly reports outlining cost per acquisition and lead volume.",
      },
    ],
    deliverables: [
      "Complete technical SEO & Generative Engine Optimization (GEO) implementation",
      "Custom Google Ads and Meta Ads campaign structure with copy, assets & bidding rules",
      "Google Business Profile & local citation enhancement for top map pack rankings",
      "Real-time analytics dashboard tracking impressions, clicks, leads, and conversion costs",
      "Monthly strategic reviews and ongoing search performance optimizations",
    ],
    whoItIsFor: [
      "Businesses seeking top rankings on Google and recommendation by AI chat platforms",
      "Local service providers and professional practices looking to increase incoming lead call volume",
      "Companies wanting transparent, high-return ad campaigns without wasteful agency ad spend",
      "Brands launching new products or expanding into new geographical service territories",
    ],
    faq: [
      {
        q: "What is Generative Engine Optimization (GEO) and why is it important?",
        a: "GEO is the discipline of optimizing your website content and machine-readable data so AI platforms like ChatGPT, Perplexity, Claude, and Google Gemini cite and recommend your company when users ask natural language questions.",
      },
      {
        q: "How soon can I expect results from SEO and Paid Ads?",
        a: "Paid ad campaigns (Google Ads, Meta Ads) begin generating traffic and leads within days of launch. Organic SEO and GEO optimizations typically build momentum and deliver sustainable top-ranking results over 60 to 90 days.",
      },
      {
        q: "Do you require long-term lock-in marketing contracts?",
        a: "No. We operate on performance-focused, flexible engagements because we believe our results should earn your business every month.",
      },
    ],
  },
  {
    slug: "rebranding",
    name: "Rebranding & Brand Design",
    tagline: "Strategic brand identity, visual guidelines, and logo design.",
    metaDescription:
      "Professional rebranding and brand design services by The Skill Corner. Custom logo design, brand identity systems, visual guidelines, and corporate design strategy.",
    description:
      "Elevate your market presence with a cohesive brand identity that commands authority and resonates with your target audience. We craft modern visual identities, logo designs, typography systems, and brand guidelines for businesses outgrowing their original look.",
    category: "growth",
    categoryLabel: "MARKET ACQUISITION & POSITIONING",
    categoryIndex: "02",
    primaryMetric: "Enterprise Visual Authority · 100% WCAG Accessible",
    techStack: [
      "Vector Master Asset Systems",
      "Figma Design Tokens",
      "Digital Typography Systems",
      "WCAG 2.1 Contrast Testing",
      "Interactive Brand Guidelines",
    ],
    architectureFlow: [
      {
        step: "01",
        title: "Market Perception & Identity Audit",
        description:
          "Comprehensive audit of your visual touchpoints, competitor aesthetics, and alignment with high-value service pricing.",
        nodeType: "trigger",
        latencyOrGuarantee: "In-depth executive alignment",
      },
      {
        step: "02",
        title: "Vector Geometry & Typography Pairing",
        description:
          "Engineers versatile logomarks, accessible color palettes, and typographic hierarchies tailored for digital screens.",
        nodeType: "processing",
        latencyOrGuarantee: "100% WCAG AA compliance",
      },
      {
        step: "03",
        title: "Design System & CSS Token Synthesis",
        description:
          "Converts visual identity into production design tokens, theme variables, and reusable web UI component specs.",
        nodeType: "integration",
        latencyOrGuarantee: "Direct web engineer handoff",
      },
      {
        step: "04",
        title: "Brand Standards & Master Asset Suite",
        description:
          "Delivers infinite-resolution vector packages (SVG, EPS, AI), digital templates, and a living online brand guidelines wiki.",
        nodeType: "output",
        latencyOrGuarantee: "Complete IP & asset ownership",
      },
    ],
    bullets: [
      "Complete visual identity systems: modern logos, color palettes, and typography",
      "Comprehensive brand guidelines book for internal team and external marketing use",
      "Consistent asset suite across digital sites, print collateral, social media, and signage",
      "Strategic brand positioning aligning your visual look with enterprise service value",
    ],
    overviewText: [
      "As your business expands and introduces higher-value services, an outdated or inconsistent visual brand identity creates a disconnect with premium clients. A professional brand identity communicates credibility, trust, and market leadership before a single word is spoken.",
      "At The Skill Corner, our brand design team crafts visual identity systems tailored to modern digital mediums. We build brand guidelines that ensure consistency across your website, pitch decks, marketing collateral, social media channels, and physical signage.",
    ],
    features: [
      {
        title: "Logo & Visual Identity Design",
        description:
          "Versatile logo marks, wordmarks, primary/secondary logos, icon variants, and favicon suites designed for digital screens and print.",
      },
      {
        title: "Color Palette & Typography Architecture",
        description:
          "Accessible color systems tailored for digital accessibility (WCAG), paired with modern typography systems that convey brand authority.",
      },
      {
        title: "Brand Style Guide & Standards Book",
        description:
          "Comprehensive brand guidelines outlining logo usage rules, spacing, visual do's and don'ts, image styles, and brand voice guidelines.",
      },
      {
        title: "Digital & Physical Collateral Design",
        description:
          "Custom design templates for business cards, letterheads, social media graphics, email signatures, presentation decks, and signage.",
      },
    ],
    process: [
      {
        stepNumber: 1,
        title: "Brand Discovery & Market Positioning",
        description:
          "We analyze your industry positioning, target customer persona, business values, and competitor visual design landscapes.",
      },
      {
        stepNumber: 2,
        title: "Concept Development & Moodboards",
        description:
          "We explore multiple creative directions, presenting moodboards, visual concepts, logo directions, and color explorations.",
      },
      {
        stepNumber: 3,
        title: "Design Refinement & Asset Creation",
        description:
          "We hone your selected brand direction, perfecting logo geometry, color harmony, typography pairing, and visual assets.",
      },
      {
        stepNumber: 4,
        title: "Guideline Packaging & Production Handoff",
        description:
          "We deliver all vector source files (SVG, EPS, AI), high-res PNGs, brand guideline books, and web asset packages.",
      },
    ],
    deliverables: [
      "Master logo package in vector (SVG, EPS, AI) and raster (PNG, JPG) formats",
      "Comprehensive Brand Guidelines Document (PDF and interactive web version)",
      "Curated digital color palette (HEX, RGB, HSL) and typography pairings",
      "Social media profile asset suite, email signatures, and presentation template",
      "Business card, letterhead, and collateral design vector print files",
    ],
    whoItIsFor: [
      "Established businesses outgrowing their initial draft logo or DIY branding",
      "Companies undergoing strategic shifts toward higher-tier enterprise markets",
      "Mergers or acquisitions requiring a unified brand identity framework",
      "New ventures looking to enter competitive industries with immediate visual authority",
    ],
    faq: [
      {
        q: "What file formats will we receive for our new logo and brand assets?",
        a: "You receive full vector master files (SVG, EPS, AI) suitable for billboard scaling, along with high-resolution web formats (PNG, JPG, WebP) with transparent backgrounds.",
      },
      {
        q: "How long does a full brand redesign project take?",
        a: "A complete rebranding project typically takes 2 to 3 weeks from brand discovery to final vector asset handoff.",
      },
      {
        q: "Will our new brand identity work seamlessly on our website and social channels?",
        a: "Yes. Every brand identity we create is engineered digital-first, ensuring high visibility and crisp presentation on mobile screens, web apps, social graphics, and print media.",
      },
    ],
  },
  {
    slug: "staffing",
    name: "Dedicated Staffing & Tech Talent",
    tagline:
      "Dedicated AI engineers, full-stack developers, digital marketers, and technical staff for your team.",
    metaDescription:
      "Dedicated tech talent and staff augmentation by The Skill Corner. Hire pre-vetted AI engineers, web developers, digital marketing specialists, and technical staff to scale your organization fast.",
    description:
      "Scale your engineering, technical operations, and digital capabilities with pre-vetted dedicated talent. We provide experienced AI engineers, full-stack developers, digital marketing specialists, and technical virtual assistants who integrate directly into your workflow on full-time or part-time arrangements.",
    category: "operations",
    categoryLabel: "OPERATIONAL SCALE & INFRASTRUCTURE",
    categoryIndex: "03",
    primaryMetric: "48h Candidate Match · Top 3% Vetted Tech Talent",
    techStack: [
      "Slack & Teams Embedded",
      "Linear & Jira Native",
      "GitHub & GitLab Direct Access",
      "Timezone Aligned (EST/PST)",
      "Zero Recruitment Overhead",
    ],
    architectureFlow: [
      {
        step: "01",
        title: "Role & Competency Scoping",
        description:
          "Profiles the exact technical skills, repository frameworks, hours, and daily deliverables required for your project.",
        nodeType: "trigger",
        latencyOrGuarantee: "48-hour matching SLA",
      },
      {
        step: "02",
        title: "Technical Auditing & Coding Screen",
        description:
          "Rigorous code reviews, architecture problem-solving, and communication vetting to isolate the top 3% of candidates.",
        nodeType: "processing",
        latencyOrGuarantee: "Top 3% quality filter",
      },
      {
        step: "03",
        title: "Direct Workflow & Tool Integration",
        description:
          "Talent is onboarded directly into your internal Slack/Teams, project boards, and repositories under your management.",
        nodeType: "integration",
        latencyOrGuarantee: "100% daily transparency",
      },
      {
        step: "04",
        title: "Zero-Risk Production Output",
        description:
          "Talent delivers continuous sprint output with all payroll, compliance, and equipment managed by The Skill Corner.",
        nodeType: "output",
        latencyOrGuarantee: "14-day replacement guarantee",
      },
    ],
    bullets: [
      "Pre-vetted, top 3% tech talent: AI engineers, web developers, digital marketers & technical staff",
      "Flexible engagement models: full-time dedicated, part-time, or project-based team augmentation",
      "Direct communication: your staff works in your Slack/Teams, tools, and time zone hours",
      "Zero recruitment overhead: we handle sourcing, vetting, payroll, and infrastructure",
    ],
    overviewText: [
      "Hiring specialized in-house tech talent is expensive, time-consuming, and risky. Whether you need an experienced AI developer to build custom LLM agents, a senior web developer to manage web platforms, or a digital marketing specialist to scale ad campaigns, finding qualified staff can stall business growth.",
      "The Skill Corner's Staffing & Tech Talent Augmentation service bridges this gap. We match your business with pre-vetted, highly qualified technical talent. Our staff function as seamless extensions of your internal team, working inside your existing software systems and communication channels.",
    ],
    features: [
      {
        title: "Dedicated AI Engineers & Developers",
        description:
          "Senior software engineers specializing in AI agent architecture, Python, TypeScript, React, Next.js, Node.js, API integrations, and cloud infrastructure.",
      },
      {
        title: "Digital Marketing & SEO Specialists",
        description:
          "Data-driven growth marketers skilled in SEO, Google Ads management, social media strategy, funnel conversion optimization, and analytics.",
      },
      {
        title: "Technical Virtual Assistants & Operations Staff",
        description:
          "Detail-oriented technical staff trained to manage customer inbox workflows, data entry, CRM hygiene, document processing, and administrative systems.",
      },
      {
        title: "Flexible Staff Scaling",
        description:
          "Easily add specialized talent as your project demands grow, without long-term severance obligations or expensive headhunter placement fees.",
      },
    ],
    process: [
      {
        stepNumber: 1,
        title: "Talent Requirements Discovery",
        description:
          "We analyze your project goals, required tech stack skillsets, working hours, and communication expectations.",
      },
      {
        stepNumber: 2,
        title: "Candidate Matching & Interview Selection",
        description:
          "We present pre-screened, hand-picked candidate profiles matching your exact criteria for your direct interview and technical assessment.",
      },
      {
        stepNumber: 3,
        title: "Onboarding & Integration",
        description:
          "Selected staff are onboarded into your company's Slack/Teams, project management software (Jira, Linear, Asana), and repository tools.",
      },
      {
        stepNumber: 4,
        title: "Ongoing Management & Support",
        description:
          "We handle administrative overhead, payroll, and performance monitoring to guarantee smooth long-term collaboration.",
      },
    ],
    deliverables: [
      "Dedicated pre-vetted tech professionals matched to your exact job requirements",
      "Smooth onboarding into your internal tools, codebase, and team workflows",
      "Regular performance reviews, attendance tracking, and output management",
      "Flexible scaling options to expand or adjust team size as needed",
      "Zero administrative, payroll, or HR management overhead for your organization",
    ],
    whoItIsFor: [
      "Growing tech startups and digital agencies needing specialized developers quickly",
      "Established businesses seeking cost-effective technical staff augmentation",
      "Companies launching major software or marketing initiatives without internal hiring bandwith",
      "Professional practices requiring dedicated technical administrative support",
    ],
    faq: [
      {
        q: "How quickly can dedicated staff be onboarded to my team?",
        a: "We maintain a pre-vetted roster of tech professionals and can typically present matched candidate profiles within 48 to 72 hours, with onboarding completing within one week.",
      },
      {
        q: "Will the dedicated staff work directly under our company management?",
        a: "Yes. Dedicated staff communicate directly with you via your company Slack, Teams, email, and project management tools, following your daily workflow and priorities.",
      },
      {
        q: "What if a staff member is not a good fit for our team?",
        a: "We offer a zero-risk replacement guarantee. If a candidate does not meet your expectations within the first 14 days, we will replace them immediately at no extra cost.",
      },
    ],
  },
  {
    slug: "documentation",
    name: "Documentation & Business SOPs",
    tagline:
      "Standard Operating Procedures (SOPs), process maps, and technical documentation systems.",
    metaDescription:
      "Professional business process documentation and SOP services by The Skill Corner. We document operations, build standard operating procedures, and create AI-ready knowledge bases.",
    description:
      "Transform disorganized operational knowledge into clear, structured Standard Operating Procedures (SOPs), technical manuals, and machine-readable knowledge bases. We document your business workflows so your team operates with precision and your custom AI tools have verified data to run on.",
    category: "operations",
    categoryLabel: "OPERATIONAL SCALE & INFRASTRUCTURE",
    categoryIndex: "03",
    primaryMetric: "AI-Ready Knowledge Engineering · 100% SOP Accuracy",
    techStack: [
      "Notion & Confluence Wikis",
      "Mermaid Process Diagrams",
      "Vector-Ready Markdown",
      "RACI Governance Matrices",
      "EHR & CRM Playbooks",
    ],
    architectureFlow: [
      {
        step: "01",
        title: "Workflow Observation & Interviews",
        description:
          "Structured observation of front-desk calls, case intake, and supplier handoffs to capture undocumented tribal knowledge.",
        nodeType: "trigger",
        latencyOrGuarantee: "Zero interruption to staff",
      },
      {
        step: "02",
        title: "Standardized SOP Drafting",
        description:
          "Authoring unambiguous, step-by-step procedures with explicit decision criteria, edge-case protocols, and screenshots.",
        nodeType: "processing",
        latencyOrGuarantee: "RACI accountability matrix",
      },
      {
        step: "03",
        title: "Visual Process Mapping",
        description:
          "Interactive visual flowcharts and Mermaid state diagrams showing exact trigger conditions and human approval checkpoints.",
        nodeType: "integration",
        latencyOrGuarantee: "Clarity across team handoffs",
      },
      {
        step: "04",
        title: "AI Knowledge Base & Wiki Publishing",
        description:
          "Deployment into your company wiki (Notion/Confluence) alongside vector-optimized markdown files ready for LLM ingestion.",
        nodeType: "output",
        latencyOrGuarantee: "LLM ingestion ready",
      },
    ],
    bullets: [
      "Standard Operating Procedures (SOPs) written in clear, step-by-step plain language",
      "Process mapping & workflow diagrams outlining operational bottlenecks",
      "AI Knowledge Base engineering: structured data formatted for LLM & chatbot ingestion",
      "Technical architecture documentation, API specs, and onboarding playbooks",
    ],
    overviewText: [
      "When business processes live only in key employees' heads, organizations suffer from operational bottlenecks, inconsistent service quality, and difficult employee onboarding. Furthermore, implementing AI tools or automation requires clear, structured documentation to train AI models accurately.",
      "At The Skill Corner, our Documentation & Business SOP service systemizes your company's operations. We interview your team, analyze your daily workflows, and produce thorough, step-by-step operating procedures, interactive process diagrams, and AI-ready knowledge bases.",
    ],
    features: [
      {
        title: "Standard Operating Procedures (SOP) Creation",
        description:
          "Comprehensive, easy-to-follow documentation for front-desk procedures, customer service playbooks, billing workflows, and operational routines.",
      },
      {
        title: "AI Knowledge Base Engineering",
        description:
          "We structure your company policies, product sheets, and service guides into markdown and vector-ready formats optimized for direct AI agent ingestion.",
      },
      {
        title: "Visual Process Mapping & Workflow Charts",
        description:
          "Clear visual diagrams (Mermaid, Figma, Miro) mapping your end-to-end customer journey, handoff points, and automated triggers.",
      },
      {
        title: "Technical & API System Documentation",
        description:
          "Developer-grade documentation for custom software, internal API endpoints, database structures, and IT system architecture.",
      },
    ],
    process: [
      {
        stepNumber: 1,
        title: "Workflow Audit & Stakeholder Interviews",
        description:
          "We conduct structured interviews with key team members and observe daily business operations to capture undocumented processes.",
      },
      {
        stepNumber: 2,
        title: "Drafting & Standardized Formatting",
        description:
          "We write clean, step-by-step documentation with screenshots, decision matrices, checklist items, and responsibility matrices (RACI).",
      },
      {
        stepNumber: 3,
        title: "Review & Team Refinement",
        description:
          "We test the documentation with your staff to verify step accuracy, eliminate ambiguities, and ensure seamless clarity.",
      },
      {
        stepNumber: 4,
        title: "Digital Publishing & AI Vector Conversion",
        description:
          "We publish the SOPs into your central wiki (Notion, Confluence, Google Workspace) and convert them into AI knowledge bases.",
      },
    ],
    deliverables: [
      "Complete library of customized Standard Operating Procedures (SOPs) for your business",
      "Visual workflow diagrams mapping operational handoffs and automation touchpoints",
      "AI-ready Markdown & JSON Knowledge Base files ready for LLM vector database training",
      "New employee onboarding manual and quick-reference training guides",
      "Centralized Notion/Confluence wiki structure organized for instant staff search",
    ],
    whoItIsFor: [
      "Scaling businesses preparing for rapid expansion or multi-location franchising",
      "Companies implementing AI agents requiring structured knowledge base inputs",
      "Professional practices needing standardized compliance and client intake procedures",
      "Business owners preparing their company for acquisition or passive management",
    ],
    faq: [
      {
        q: "Why is professional documentation essential before implementing AI agents?",
        a: "AI agents require structured, accurate, and unambiguous ground truth data. Documenting your processes into clear SOPs provides the foundation that prevents AI hallucinations and ensures high agent accuracy.",
      },
      {
        q: "Where will our business documentation be stored?",
        a: "We format and publish your documentation directly inside your company's preferred knowledge management tool, such as Notion, Confluence, Google Docs, or a custom intranet.",
      },
      {
        q: "How often should SOPs be updated?",
        a: "We structure documentation modularly so updating a step or policy takes seconds. We recommend reviewing core SOPs semi-annually or whenever software systems change.",
      },
    ],
  },
] as const;

export function getDigitalServiceBySlug(slug: string): DigitalService | undefined {
  return digitalServices.find((s) => s.slug === slug);
}
