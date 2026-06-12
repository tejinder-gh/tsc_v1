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
import { booking } from "@/content/site";

export const metadata: Metadata = {
  title: "Book a Free AI Automation Audit",
  description:
    "30 minutes, no pitch deck. You leave with 3 automation ideas for your business whether you hire us or not.",
  alternates: { canonical: "/book" },
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
        <div className="hidden lg:block space-y-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-slate">
            Typical outcomes we build:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-ledger/20 bg-ledger/5 p-5">
              <span className="block font-display text-2xl font-bold text-ledger">~12 min</span>
              <p className="mt-1 text-sm font-semibold text-ink">Saved per patient</p>
              <p className="mt-1 text-xs text-slate">Medical clinic, North York</p>
            </div>
            <div className="rounded-xl border border-ledger/20 bg-ledger/5 p-5">
              <span className="block font-display text-2xl font-bold text-ledger">30+ calls</span>
              <p className="mt-1 text-sm font-semibold text-ink">Captured per month</p>
              <p className="mt-1 text-xs text-slate">Restaurant, Mississauga</p>
            </div>
            <div className="rounded-xl border border-ledger/20 bg-ledger/5 p-5">
              <span className="block font-display text-2xl font-bold text-ledger">Cut by 50%</span>
              <p className="mt-1 text-sm font-semibold text-ink">No-shows down half</p>
              <p className="mt-1 text-xs text-slate">Hair salon, two locations</p>
            </div>
            <div className="rounded-xl border border-ledger/20 bg-ledger/5 p-5">
              <span className="block font-display text-2xl font-bold text-ledger">&lt; 2 mins</span>
              <p className="mt-1 text-sm font-semibold text-ink">First response time</p>
              <p className="mt-1 text-xs text-slate">Law firm, Downtown Toronto</p>
            </div>
          </div>
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
