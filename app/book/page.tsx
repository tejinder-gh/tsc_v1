/**
 * What: Booking page - the no-pitch promise above a full Cal.com inline embed.
 * Why: Top rung of the conversion ladder; the promise line lowers the perceived risk of
 *      booking ("you leave with 3 ideas whether you hire us or not").
 * How: Server page wrapping the client BookingEmbed; secondary rung (quick query) sits
 *      below so the page never dead-ends.
 * From Where: TheSkillCorner marketing site build brief (booking spec), 2026-06.
 * When: 2026-06.
 */

import type { Metadata } from "next";
import { BookingEmbed } from "@/components/BookingEmbed";
import { CtaLink } from "@/components/CtaLink";
import { AbstractVisual } from "@/components/AbstractVisual";
import { booking } from "@/content/site";

export const metadata: Metadata = {
  title: "Book a free automation audit",
  description:
    "30 minutes, no pitch deck. You leave with 3 automation ideas for your business whether you hire us or not.",
};

export default function BookPage() {
  return (
    <div className="mx-auto max-w-site px-4 py-14 sm:px-6">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div>
          <h1 className="max-w-3xl font-display text-4xl font-bold tracking-[-0.02em] text-ink sm:text-5xl">
            Book your free automation audit
          </h1>
          <p className="mt-4 text-lg text-slate">{booking.promise}</p>
        </div>
        <div className="hidden lg:flex justify-end">
          <AbstractVisual variant="book" />
        </div>
      </div>
      <div className="mt-9">
        <BookingEmbed />
      </div>
      <p className="mt-8 text-center">
        Rather not book a call yet?{" "}
        <CtaLink href="/contact" location="book_page" variant="text">
          Send a quick query
        </CtaLink>{" "}
        or{" "}
        <CtaLink href="/checklist" location="book_page" variant="text">
          grab the free checklist
        </CtaLink>
        .
      </p>
    </div>
  );
}
