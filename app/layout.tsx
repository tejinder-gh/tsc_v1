/**
 * What: Root layout - fonts, global metadata/OG defaults, JSON-LD LocalBusiness schema,
 *       analytics scripts, segment provider, header/footer, and the three capture surfaces
 *       (floating widget, exit-intent modal, mobile sticky bar).
 * Why: Capture surfaces and segment state must exist on every page so each page surfaces
 *      at least two rungs of the conversion ladder.
 * How: next/font loads Bricolage Grotesque + Public Sans as CSS variables consumed by the
 *      Tailwind theme; Plausible or GA4 loads only when its env var is set.
 * From Where: TheSkillCorner marketing site build brief, 2026-06.
 * When: 2026-06.
 */

import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import { ExitIntentModal } from "@/components/capture/ExitIntentModal";
import { MobileStickyBar } from "@/components/capture/MobileStickyBar";
import { QuickActions } from "@/components/capture/QuickActions";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/content/site";
import { SegmentProvider } from "@/lib/segment-context";
import "./globals.css";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const bodyFont = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
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
};

export const viewport: Viewport = {
  themeColor: "#FBFBFA",
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  legalName: site.legalName,
  description: site.description,
  url: site.url,
  email: site.email,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
  priceRange: "$$",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="font-body antialiased">
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
          <main id="main">{children}</main>
          <Footer />
          <QuickActions />
          <ExitIntentModal />
          <MobileStickyBar />
          {/* Spacer so the mobile sticky bar never covers footer content. */}
          <div aria-hidden="true" className="h-16 md:hidden" />
        </SegmentProvider>
      </body>
    </html>
  );
}
