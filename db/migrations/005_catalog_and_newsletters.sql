-- Migration 005: Catalog & Newsletters Isolated Application Schemas
-- Date: 2026-09-22
-- Purpose: Provide isolated persistence for catalog offerings, search demand capture,
--          newsletter publications, generated drafts, and email subscribers without
--          touching second_brain_security or automation OS tables.

BEGIN;

-- ==========================================
-- 1. Catalog Schema & Tables
-- ==========================================

CREATE SCHEMA IF NOT EXISTS catalog;

-- Dynamic offering attributes, overrides, and commercial states
CREATE TABLE IF NOT EXISTS catalog.offerings (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  kind text NOT NULL CHECK (kind IN ('service', 'automation', 'newsletter', 'resource', 'tool', 'agent', 'template')),
  title text NOT NULL,
  tagline text,
  short_description text NOT NULL,
  long_description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'experimental', 'beta', 'paused', 'archived', 'draft')),
  visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'private', 'hidden')),
  commerce_status text NOT NULL DEFAULT 'request_only' CHECK (commerce_status IN ('free', 'purchasable', 'request_only', 'waitlist', 'unavailable')),
  featured boolean NOT NULL DEFAULT false,
  priority integer NOT NULL DEFAULT 0,
  categories jsonb NOT NULL DEFAULT '[]'::jsonb,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  goals jsonb NOT NULL DEFAULT '[]'::jsonb,
  problems_solved jsonb NOT NULL DEFAULT '[]'::jsonb,
  industries jsonb NOT NULL DEFAULT '["all"]'::jsonb,
  audiences jsonb NOT NULL DEFAULT '[]'::jsonb,
  delivery_model text NOT NULL CHECK (delivery_model IN ('ai', 'human', 'hybrid', 'automation')),
  automation_level text NOT NULL CHECK (automation_level IN ('manual', 'assisted', 'mostly_automated', 'fully_automated')),
  pricing_model text NOT NULL DEFAULT 'custom' CHECK (pricing_model IN ('free', 'one_time', 'subscription', 'custom', 'included')),
  price_display text NOT NULL DEFAULT 'Custom',
  price_amount_cents bigint CHECK (price_amount_cents >= 0),
  currency text NOT NULL DEFAULT 'CAD',
  billing_cadence text CHECK (billing_cadence IN ('one_time', 'weekly', 'monthly', 'annual')),
  canonical_url text NOT NULL,
  source text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_catalog_offerings_kind ON catalog.offerings(kind);
CREATE INDEX IF NOT EXISTS idx_catalog_offerings_visibility ON catalog.offerings(visibility);
CREATE INDEX IF NOT EXISTS idx_catalog_offerings_featured ON catalog.offerings(featured, priority DESC);

-- Natural language search demand capture for unmet customer needs
CREATE TABLE IF NOT EXISTS catalog.unmet_demands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  inferred_intent text,
  category_id text,
  user_type text,
  session_id text,
  source_context text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_catalog_unmet_demands_created ON catalog.unmet_demands(created_at DESC);

-- ==========================================
-- 2. Newsletters Schema & Tables
-- ==========================================

CREATE SCHEMA IF NOT EXISTS newsletters;

-- Publication definitions and scheduling
CREATE TABLE IF NOT EXISTS newsletters.publications (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  description text NOT NULL,
  topic text NOT NULL,
  audience text NOT NULL,
  categories jsonb NOT NULL DEFAULT '[]'::jsonb,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  generation_mode text NOT NULL CHECK (generation_mode IN ('ai', 'manual', 'hybrid')),
  cadence text NOT NULL CHECK (cadence IN ('daily', 'weekly', 'biweekly', 'monthly', 'on_demand')),
  delivery_channel text NOT NULL DEFAULT 'email' CHECK (delivery_channel IN ('email', 'rss', 'web', 'all')),
  subscription_model text NOT NULL DEFAULT 'free' CHECK (subscription_model IN ('free', 'paid', 'freemium')),
  price_display text NOT NULL DEFAULT 'Free',
  editorial_owner text NOT NULL DEFAULT 'The Skill Corner',
  source_inputs jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'paused', 'archived')),
  visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'private')),
  subscriber_count integer NOT NULL DEFAULT 0,
  last_published_at timestamptz,
  next_scheduled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Individual newsletter issues (both AI-compiled drafts and published editions)
CREATE TABLE IF NOT EXISTS newsletters.issues (
  id text PRIMARY KEY,
  newsletter_slug text NOT NULL REFERENCES newsletters.publications(slug) ON DELETE CASCADE,
  issue_number integer NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  summary text NOT NULL,
  content_markdown text NOT NULL,
  content_html text,
  key_takeaways jsonb NOT NULL DEFAULT '[]'::jsonb,
  generated_by text NOT NULL CHECK (generated_by IN ('ai', 'manual', 'hybrid')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published', 'delivered')),
  scheduled_for timestamptz,
  published_at timestamptz,
  delivered_at timestamptz,
  source_item_count integer DEFAULT 0,
  curator_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(newsletter_slug, issue_number),
  UNIQUE(newsletter_slug, slug)
);

CREATE INDEX IF NOT EXISTS idx_newsletters_issues_pub_status ON newsletters.issues(newsletter_slug, status);

-- Newsletter subscribers with double-optin and suppression support
CREATE TABLE IF NOT EXISTS newsletters.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (length(email) <= 254),
  newsletter_slug text NOT NULL REFERENCES newsletters.publications(slug) ON DELETE CASCADE,
  source text DEFAULT 'web',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending_confirmation', 'unsubscribed', 'suppressed')),
  suppressed_reason text,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(lower(email), newsletter_slug)
);

CREATE INDEX IF NOT EXISTS idx_newsletters_subscribers_lookup ON newsletters.subscribers(newsletter_slug, status);

COMMIT;
