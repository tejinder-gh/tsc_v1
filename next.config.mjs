/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
