/**
 * What: Home page - the full conversion narrative: hero, segment router, problems,
 *       services, process, ROI calculator, proof, pricing, FAQ, final CTA.
 * Why: Home is the center of all marketing; it must give every intent level a next step
 *      (book / query / checklist / ROI report) within one scroll path.
 * How: Server component composing section components; segment-aware sections are client
 *      components reading the shared context.
 * From Where: TheSkillCorner marketing site build brief (page spec), 2026-06.
 * When: 2026-06.
 */

import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ProblemStrip } from "@/components/home/ProblemStrip";
import { ProofSection } from "@/components/home/ProofSection";
import { RoiCalculator } from "@/components/home/RoiCalculator";
import { SegmentRouter } from "@/components/home/SegmentRouter";
import { PricingAnchor } from "@/components/PricingAnchor";
import { ServicesGrid } from "@/components/ServicesGrid";
import { homeFaq } from "@/content/faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SegmentRouter />
      <ProblemStrip />
      <ServicesGrid id="what-we-automate" />
      <HowItWorks />
      <RoiCalculator />
      <ProofSection />
      <PricingAnchor location="home" />
      <Faq items={homeFaq} />
      <FinalCta location="home" />
    </>
  );
}
