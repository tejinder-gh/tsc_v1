import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { NewslettersHubView } from "@/features/newsletters/components/NewslettersHubView";
import { getAllNewsletters } from "@/features/newsletters/data/newsletters";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Executive Briefings & Market Intelligence | The Skill Corner",
  description:
    "High-density field intelligence and market radars scanning 14+ official registries, applied AI shifts, and municipal procurement. Published for operators with zero promotional fluff.",
  alternates: { canonical: "/newsletters" },
  openGraph: {
    title: "Executive Briefings & Market Intelligence | The Skill Corner",
    description:
      "Signal, without the feed. Actionable AI engineering shifts, regional asset radars, and public tenders.",
    url: "https://theskillcorner.com/newsletters",
  },
};

export default function NewslettersHubPage() {
  const newsletters = getAllNewsletters();

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Executive Briefings", path: "/newsletters" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <NewslettersHubView newsletters={newsletters} />
    </>
  );
}

