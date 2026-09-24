/**
 * What: Root layout - fonts, global metadata/OG defaults, JSON-LD LocalBusiness schema,
 *       analytics scripts, segment provider, header/footer, and the three capture surfaces
 *       (floating widget, exit-intent modal, mobile sticky bar).
 * Why: Capture surfaces and segment state must exist on every page so each page surfaces
 *      at least two rungs of the conversion ladder.
 * How: Geist and Geist Mono load via next/font/google (--font-geist-sans and
 *      --font-geist-mono variables). Plausible or GA4 loads only when its env var is set.
 * From Where: TheSkillCorner marketing site build brief, 2026-06.
 * When: 2026-06.
 */

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import { TelemetryClient } from "@/components/telemetry/TelemetryClient";
import { site } from "@/content/site";
import { BUSINESS_ID } from "@/lib/structured-data";
import { getTelemetryConfig } from "@/lib/telemetry/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} - AI automation for local businesses and professional practices`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} - AI automation for local businesses and professional practices`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  icons: {
    icon: [
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#12130f",
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": BUSINESS_ID,
  name: site.name,
  slogan: site.tagline,
  knowsAbout: [
    "AI agent development",
    "Autonomous AI voice and chat agents",
    "Custom website development",
    "High-performance Next.js and React web development",
    "Digital marketing and Generative Engine Optimization (GEO)",
    "AI Search Engine Optimization (AIO)",
    "Dedicated tech staffing and staff augmentation",
    "Business process documentation and SOP creation",
    "AI knowledge base engineering",
    "Custom software application development",
    "Brand design and corporate rebranding",
    "AI automations and workflow integration",
    "Appointment booking and reminders",
    "Document and intake processing",
    "Review and reputation management",
  ],
  legalName: site.legalName,
  description: site.description,
  url: site.url,
  email: site.email,
  telephone: site.phone,
  founder: {
    "@type": "Person",
    name: site.principal.name,
    jobTitle: site.principal.title,
  },
  address: site.offices.map((office) => ({
    "@type": "PostalAddress",
    addressLocality: office.city,
    ...(office.region ? { addressRegion: office.region } : {}),
    addressCountry: office.country,
  })),
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: site.phone,
      areaServed: ["CA", "US"],
      email: site.email,
    },
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: site.phoneIndia,
      areaServed: "IN",
      email: site.email,
    },
  ],
  priceRange: "$$",
  ...(site.sameAs && site.sameAs.length > 0 ? { sameAs: site.sameAs } : {}),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const { analytics, ga } = getTelemetryConfig();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Flags JS availability before first paint so scroll-reveal hidden states
            never apply for no-JS visitors or crawlers. */}
        <script
          id="js-flag"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static inline script to detect JS before paint
          dangerouslySetInnerHTML={{
            __html: 'document.documentElement.classList.add("js");',
          }}
        />
      </head>
      <body className="font-geist bg-[var(--tsc-paper)] text-[var(--tsc-ink)] antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[4px] focus:bg-[var(--tsc-surface)] focus:px-4 focus:py-3 focus:font-geist focus:text-sm focus:font-medium focus:text-[var(--tsc-ink)] focus:shadow-md focus:border focus:border-[var(--tsc-line-strong)] focus:outline focus:outline-2 focus:outline-[var(--tsc-action)]"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          // JSON-LD must be embedded as a raw script tag for crawlers.
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static, locally-defined JSON
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {analytics.enabled && analytics.domain && analytics.scriptUrl ? (
          <Script
            defer
            data-domain={analytics.domain}
            src={analytics.scriptUrl}
            {...(analytics.apiHost ? { "data-api": `${analytics.apiHost}/api/event` } : {})}
            strategy="afterInteractive"
          />
        ) : null}
        {ga.enabled && ga.measurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga.measurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ga.measurementId}');`}
            </Script>
          </>
        ) : null}
        <TelemetryClient />
        {children}
      </body>
    </html>
  );
}
