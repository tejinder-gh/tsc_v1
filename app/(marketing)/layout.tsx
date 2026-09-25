import type { ReactNode } from "react";
import { ExitIntentModal, MobileStickyBar } from "@/components/capture";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JourneyProvider } from "@/lib/journey";
import { SegmentProvider } from "@/lib/segment-context";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <SegmentProvider>
      <JourneyProvider>
        <Header />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <Footer />
        <ExitIntentModal />
        <MobileStickyBar />
        {/* Spacer so the mobile sticky bar never covers footer content. */}
        <div aria-hidden="true" className="h-14 md:hidden" />
      </JourneyProvider>
    </SegmentProvider>
  );
}
