import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { BriefingsCatalogView } from "@/features/briefings/components/BriefingsCatalogView";
import {
  getAllBundles,
  getPairingRules,
  getSingleBriefings,
} from "@/features/catalog/domain/bundles";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "The Briefings & Commercial Automation Catalog | The Skill Corner",
  description:
    "Explore our commercial hierarchy of autonomous AI systems: Single Automations ($29–149/mo), Purpose-Built Bundles ($99–299/mo), Vertical OS ($299–749/mo), and Complete Operating Stacks ($749–2,999/mo). Every offer features explicit AI roles, unified deliverables, and expansion pairing synergy.",
  alternates: { canonical: "/briefings" },
  openGraph: {
    title: "The Briefings & Commercial Automation Catalog | The Skill Corner",
    description:
      "Single Automation → Purpose-Built Bundle → Vertical OS → Complete Automation Stack. Coordinated AI workers delivering unified executive memos.",
    url: "https://www.theskillcorner.com/briefings",
  },
};

export default function BriefingsCatalogPage() {
  const bundles = getAllBundles();
  const pairings = getPairingRules();
  const singleBriefings = getSingleBriefings();

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Briefings Catalog", path: "/briefings" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <BriefingsCatalogView
        bundles={bundles}
        pairings={pairings}
        singleBriefings={singleBriefings}
      />
    </>
  );
}
