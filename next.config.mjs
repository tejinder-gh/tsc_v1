/**
 * Content Security Policy (CSP) Definition.
 *
 * NOTE on 'unsafe-inline':
 * Next.js App Router performs client-side hydration, renders inline bootstrap scripts
 * (<script id="js-flag">, __NEXT_DATA__), and injects component styles at runtime.
 * Nonce-based CSP generation requires dynamic request-time proxy/middleware synthesis.
 * Until a server-side nonce pipeline is integrated across all static marketing routes,
 * 'unsafe-inline' is retained for script-src and style-src to prevent breaking page
 * hydration and styling.
 *
 * Approved third-party origins inventory:
 * - Clerk authentication & bot protection: https://challenges.cloudflare.com, https://*.clerk.accounts.dev,
 *   https://clerk.theskillcorner.com, https://api.clerk.com, https://clerk-telemetry.com, https://img.clerk.com
 * - Cal.com booking embeds: https://cal.com, https://app.cal.com, https://api.cal.com
 * - Telemetry & Analytics: https://stats.theskillcorner.com (Plausible), https://www.googletagmanager.com,
 *   https://www.google-analytics.com, https://*.google-analytics.com
 */
export const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self' https://*.clerk.accounts.dev https://api.clerk.com https://clerk.theskillcorner.com",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://*.clerk.accounts.dev https://clerk.theskillcorner.com https://app.cal.com https://stats.theskillcorner.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://img.clerk.com https://images.unsplash.com https://cal.com https://app.cal.com https://www.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.clerk.com https://*.clerk.accounts.dev https://clerk.theskillcorner.com https://clerk-telemetry.com https://challenges.cloudflare.com https://cal.com https://api.cal.com https://app.cal.com https://stats.theskillcorner.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://www.googletagmanager.com",
  "frame-src 'self' https://cal.com https://app.cal.com https://challenges.cloudflare.com https://*.clerk.accounts.dev https://clerk.theskillcorner.com",
  "worker-src 'self' blob:",
].join("; ");

export const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    // Brief §4: "Keep URLs stable. If you rename a route, add a redirect."
    return [
      { source: "/services", destination: "/what-we-automate", permanent: true },
      { source: "/services/:slug", destination: "/what-we-automate/:slug", permanent: true },
      { source: "/for", destination: "/industries", permanent: true },
      { source: "/for/:slug", destination: "/industries/:slug", permanent: true },
      { source: "/industry", destination: "/industries", permanent: true },
      { source: "/industry/:slug", destination: "/industries/:slug", permanent: true },
      { source: "/privacy", destination: "/legal/privacy", permanent: true },
      { source: "/terms", destination: "/legal/terms", permanent: true },
      {
        source: "/what-we-automate/feedback-and-reviews",
        destination: "/what-we-automate/reviews-and-reputation",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
