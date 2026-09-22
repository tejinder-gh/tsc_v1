/**
 * First-Class Newsletter Domain Types for TheSkillCorner
 *
 * Defines the separation between recurring newsletter publications (definitions,
 * schedules, audiences, generation policies) and individual issues/editions
 * (content, state, review, delivery).
 */

export type NewsletterGenerationMode = "ai" | "manual" | "hybrid";

export type NewsletterCadence = "daily" | "weekly" | "biweekly" | "monthly" | "on_demand";

export type NewsletterStatus = "active" | "draft" | "paused" | "archived";

export type NewsletterVisibility = "public" | "unlisted" | "private";

export type NewsletterIssueStatus = "draft" | "review" | "approved" | "published" | "delivered";

export interface NewsletterIssue {
  id: string;
  newsletterSlug: string;
  issueNumber: number;
  title: string;
  slug: string;
  summary: string;
  contentMarkdown: string;
  contentHtml?: string;
  generatedBy: NewsletterGenerationMode;
  status: NewsletterIssueStatus;
  scheduledFor?: string;
  publishedAt?: string;
  deliveredAt?: string;
  sourceItemCount?: number;
  curatorNotes?: string;
  keyTakeaways: string[];
  isSample?: boolean;
}

export interface Newsletter {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  topic: string;
  audience: string;
  categories: string[];
  tags: string[];
  generationMode: NewsletterGenerationMode;
  cadence: NewsletterCadence;
  deliveryChannel: "email" | "rss" | "web" | "all";
  subscriptionModel: "free" | "paid" | "freemium";
  priceDisplay: string;
  priceAmountCents?: number;
  currency?: string;
  editorialOwner: string;
  sourceInputs: string[];
  status: NewsletterStatus;
  visibility: NewsletterVisibility;
  subscriberCount: number;
  sampleIssueSnippet?: string;
  lastPublishedAt?: string;
  nextScheduledAt?: string;
  issues: NewsletterIssue[];
  ctaText?: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  newsletterSlug: string;
  subscribedAt: string;
  confirmedAt?: string;
  source?: string;
  status: "active" | "pending_confirmation" | "unsubscribed";
}
