/**
 * What: Root layout - fonts, global metadata/OG defaults, JSON-LD LocalBusiness schema,
 *       analytics scripts, segment provider, header/footer, and the three capture surfaces
 *       (floating widget, exit-intent modal, mobile sticky bar).
 * Why: Capture surfaces and segment state must exist on every page so each page surfaces
 *      at least two rungs of the conversion ladder.
 * How: Poppins + DM Sans are self-hosted woff2 files (@font-face in globals.css, brief
 *      §4/§5.2); the two files used above the fold are preloaded here. Plausible or GA4
 *      loads only when its env var is set.
 * From Where: TheSkillCorner marketing site build brief, 2026-06.
 * When: 2026-06.
 */

import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import { ExitIntentModal } from "@/components/capture/ExitIntentModal";
import { MobileStickyBar } from "@/components/capture/MobileStickyBar";
import { QuickActions } from "@/components/capture/QuickActions";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/content/site";
import { SegmentProvider } from "@/lib/segment-context";
import { BUSINESS_ID } from "@/lib/structured-data";
import "./globals.css";

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
  themeColor: "#08215B",
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": BUSINESS_ID,
  name: site.name,
  slogan: site.tagline,
  knowsAbout: [
    "AI automation",
    "AI receptionists",
    "Appointment booking and reminders",
    "Document and intake processing",
    "Review and reputation management",
    "Lead follow-up automation",
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
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/poppins-600-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/dm-sans-400-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-body antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-white focus:px-4 focus:py-3 focus:font-display focus:text-sm focus:font-medium focus:text-navy-700 focus:shadow-lg focus:outline focus:outline-2 focus:outline-blue-500"
        >
          Skip to content
        </a>
        {/* Flags JS availability before first paint so scroll-reveal hidden states
            never apply for no-JS visitors or crawlers. */}
        <Script id="js-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.add("js");`}
        </Script>
        <script
          type="application/ld+json"
          // JSON-LD must be embedded as a raw script tag for crawlers.
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static, locally-defined JSON
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
        {!plausibleDomain && gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        ) : null}
        <SegmentProvider>
          <Header />
          <main id="main" tabIndex={-1} className="focus:outline-none">
            {children}
          </main>
          <Footer />
          <QuickActions />
          <ExitIntentModal />
          <MobileStickyBar />
          {/* Spacer so the mobile sticky bar never covers footer content. */}
          <div aria-hidden="true" className="h-14 md:hidden" />
        </SegmentProvider>
      </body>
    </html>
  );
}
