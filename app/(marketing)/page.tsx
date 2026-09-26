import type { Metadata } from "next";
import { BriefingsSection } from "@/components/home/BriefingsSection";
import { FounderPOV } from "@/components/home/FounderPOV";
import { HowWeDecide } from "@/components/home/HowWeDecide";
import { OpenPrompt } from "@/components/home/OpenPrompt";
import { SystemStudies } from "@/components/home/SystemStudies";
import { JourneyHero } from "@/components/journey";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* 01. Intent Router / Journey Entry */}
      <JourneyHero />

      {/* 02. How We Decide */}
      <HowWeDecide />

      {/* 03. System Studies */}
      <SystemStudies />

      {/* 04. Executive Briefings & Intelligence Radar */}
      <BriefingsSection />

      {/* 05. Founder Point of View */}
      <FounderPOV />

      {/* 06. Open Prompt / Closing Interaction */}
      <OpenPrompt />

      {/* ÷      <TestimonialsSection /> */}
    </>
  );
}
