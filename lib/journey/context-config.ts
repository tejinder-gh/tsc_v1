/**
 * What: Configuration-driven context questions and options for guided problem narrowing.
 * Why: Separates business copy and intent routing logic from UI components (Ticket 002 §5).
 * How: Strongly typed options and per-intent configs ensuring progressive disclosure.
 */

import type { ContextFocus, ContextSituation, PrimaryIntent } from "./types";

export interface ContextOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export interface IntentContextConfig {
  question1: {
    eyebrow: string;
    heading: string;
    supporting?: string;
    options: ContextOption<ContextFocus>[];
  };
  question2: {
    eyebrow: string;
    heading: string;
    supporting?: string;
    options: ContextOption<ContextSituation>[];
  };
}

export const INTENT_CONTEXT_CONFIG: Record<PrimaryIntent, IntentContextConfig> = {
  "save-time": {
    question1: {
      eyebrow: "LET'S FIND THE FRICTION",
      heading: "Where does work keep\nstealing your attention?",
      supporting: "Pick the area you notice most often. We can deal with the rest later.",
      options: [
        {
          value: "customer-communication",
          label: "Customer communication",
          description: "Calls, messages, enquiries, updates.",
        },
        {
          value: "admin-data-entry",
          label: "Admin & data entry",
          description: "Copying, updating, filing, reconciling.",
        },
        {
          value: "scheduling-coordination",
          label: "Scheduling & coordination",
          description: "Bookings, reminders, handoffs, calendars.",
        },
        {
          value: "reporting-analysis",
          label: "Reporting & analysis",
          description: "Collecting numbers, reports, recurring checks.",
        },
        {
          value: "internal-workflows",
          label: "Internal workflows",
          description: "Tasks moving between people and systems.",
        },
      ],
    },
    question2: {
      eyebrow: "ONE MORE THING",
      heading: "What makes it frustrating today?",
      options: [
        {
          value: "mostly-manual",
          label: "Mostly manual",
          description: "People repeatedly do work software could handle.",
        },
        {
          value: "fragmented-tools",
          label: "Too many disconnected tools",
          description: "The work exists, but information keeps moving between systems.",
        },
        {
          value: "works-but-slow",
          label: "It works, but it's slow",
          description: "The process is functional but consumes unnecessary time.",
        },
        {
          value: "frequent-errors",
          label: "Mistakes or missed steps happen",
          description: "Manual handoffs create inconsistency or things get forgotten.",
        },
      ],
    },
  },

  grow: {
    question1: {
      eyebrow: "LET'S FIND THE LEAK",
      heading: "Where are opportunities\nbeing lost?",
      supporting: "Choose the part of the customer journey that feels weakest.",
      options: [
        {
          value: "find-more-leads",
          label: "Finding enough prospects",
          description: "Not enough of the right people discover the business.",
        },
        {
          value: "respond-faster",
          label: "Responding quickly",
          description: "Calls, forms, messages, or enquiries wait too long.",
        },
        {
          value: "follow-up",
          label: "Following up",
          description: "Interested people disappear after the first interaction.",
        },
        {
          value: "convert-more",
          label: "Converting interest",
          description: "Traffic or leads exist, but too few become customers.",
        },
        {
          value: "retain-customers",
          label: "Bringing customers back",
          description: "Repeat business, reviews, referrals, or retention are weak.",
        },
      ],
    },
    question2: {
      eyebrow: "WHAT HAPPENS TODAY?",
      heading: "Which description is closest?",
      options: [
        {
          value: "not-enough-demand",
          label: "We need more demand",
          description: "The pipeline starts too small.",
        },
        {
          value: "leads-go-cold",
          label: "Leads often go cold",
          description: "Interest exists but momentum disappears.",
        },
        {
          value: "slow-response",
          label: "Response is too slow",
          description: "Customers often wait before hearing back.",
        },
        {
          value: "low-conversion",
          label: "Conversion is lower than it should be",
          description: "People engage but do not take the next step.",
        },
        {
          value: "weak-retention",
          label: "Customers rarely come back",
          description: "Retention, repeat purchase, or referrals are underdeveloped.",
        },
      ],
    },
  },

  build: {
    question1: {
      eyebrow: "LET'S DEFINE THE THING",
      heading: "What are you trying\nto build?",
      options: [
        {
          value: "customer-experience",
          label: "Customer-facing experience",
          description: "Website, portal, application, booking or commerce experience.",
        },
        {
          value: "internal-tool",
          label: "Internal tool",
          description: "Software used by your own team to run the business.",
        },
        {
          value: "automation-integration",
          label: "Automation or integration",
          description: "Connect systems and remove repetitive workflow steps.",
        },
        {
          value: "ai-product",
          label: "AI-powered product or feature",
          description: "AI is part of the actual product behavior.",
        },
        {
          value: "existing-product",
          label: "Improve an existing product",
          description: "Modernize, simplify, repair, or extend something already running.",
        },
      ],
    },
    question2: {
      eyebrow: "WHERE IS IT TODAY?",
      heading: "How far along are you?",
      options: [
        {
          value: "idea",
          label: "Just an idea",
          description: "The problem is understood, but nothing has been built.",
        },
        {
          value: "prototype",
          label: "Prototype",
          description: "Something exists, but it is not production-ready.",
        },
        {
          value: "existing-system",
          label: "Existing system",
          description: "Real users or operations already depend on it.",
        },
        {
          value: "scaling",
          label: "Scaling",
          description: "The product works; architecture, reliability, or throughput now matter.",
        },
      ],
    },
  },

  learn: {
    question1: {
      eyebrow: "WHAT ARE YOU EXPLORING?",
      heading: "What do you want\nto understand better?",
      options: [
        {
          value: "ai-automation",
          label: "AI & automation",
          description: "Agents, workflows, AI tools, and practical automation.",
        },
        {
          value: "software-product",
          label: "Software & product",
          description: "Engineering, architecture, product building, and systems.",
        },
        {
          value: "growth-marketing",
          label: "Growth & marketing",
          description: "Acquisition, conversion, content, and digital growth.",
        },
        {
          value: "operations-systems",
          label: "Operations & systems",
          description: "Processes, workflows, productivity, and operational design.",
        },
      ],
    },
    question2: {
      eyebrow: "HOW DO YOU WANT IT?",
      heading: "What would be most useful right now?",
      options: [
        {
          value: "quick-answer",
          label: "A quick answer",
          description: "Get oriented without going deep.",
        },
        {
          value: "practical-guide",
          label: "A practical guide",
          description: "Understand the topic well enough to apply it.",
        },
        {
          value: "templates-tools",
          label: "Templates or tools",
          description: "Start with something usable rather than more theory.",
        },
        {
          value: "ongoing-briefings",
          label: "Ongoing briefings",
          description: "Keep up with useful developments over time.",
        },
      ],
    },
  },
};

export const CONTEXT_COMPLETION_COPY = {
  eyebrow: "ENOUGH TO START",
  heading: "We have the shape\nof the problem.",
  supporting:
    "Next, we'll show you where the strongest opportunity appears to be — not everything we could sell you.",
  primaryAction: "Show me →",
  secondaryAction: "Review answers",
} as const;

export const OPPORTUNITY_TRANSITIONAL_COPY = {
  eyebrow: "OPPORTUNITY",
  heading: "We're ready to narrow the options.",
  body: "Your context is saved. The opportunity view is the next part of this experience.",
} as const;

export function getContextConfig(intent: PrimaryIntent): IntentContextConfig {
  return INTENT_CONTEXT_CONFIG[intent];
}
