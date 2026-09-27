import type { Metadata } from "next";
import { BriefingsSection } from "@/components/home/BriefingsSection";
import { FounderPOV } from "@/components/home/FounderPOV";
import { HowWeDecide } from "@/components/home/HowWeDecide";
import { OpenPrompt } from "@/components/home/OpenPrompt";
import { PutAiToWork } from "@/components/home/PutAiToWork";
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

      {/* 04. Put AI to Work — Autonomous Workers & Coordinated Systems */}
      <PutAiToWork />

      {/* 05. Executive Briefings & Intelligence Radar */}
      <BriefingsSection />

      {/* 06. Founder Point of View */}
      <FounderPOV />

      {/* 07. Open Prompt / Closing Interaction */}
      <OpenPrompt />

      {/* ÷      <TestimonialsSection /> */}
    </>
  );
}
