/**
 * What: Home hero - positioning headline/subhead, primary and secondary CTAs, with the
 *       site's single orchestrated reveal animation.
 * Why: The brand name does not say "automation", so the subhead must position the company
 *      in the first two lines; the reveal is the one place motion is spent.
 * How: Staggered .hero-reveal animation via inline animation-delay; disabled entirely
 *      under prefers-reduced-motion in globals.css.
 * From Where: TheSkillCorner marketing site build brief (hero + motion spec), 2026-06.
 * When: 2026-06.
 */

import { CtaLink } from "@/components/CtaLink";
import { hero } from "@/content/home";

export function Hero() {
  return (
    <section className="mx-auto max-w-site px-4 pb-10 pt-16 sm:px-6 sm:pt-24">
      <p
        className="hero-reveal text-sm font-semibold uppercase tracking-widest text-ledger"
        style={{ animationDelay: "0ms" }}
      >
        {hero.eyebrow}
      </p>
      <h1
        className="hero-reveal mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl"
        style={{ animationDelay: "90ms" }}
      >
        {hero.headline}
      </h1>
      <p
        className="hero-reveal mt-5 max-w-2xl text-lg leading-relaxed sm:text-xl"
        style={{ animationDelay: "180ms" }}
      >
        {hero.subhead}
      </p>
      <div className="hero-reveal mt-8 flex flex-wrap gap-3" style={{ animationDelay: "270ms" }}>
        <CtaLink href={hero.primaryCta.href} location="hero">
          {hero.primaryCta.label}
        </CtaLink>
        <CtaLink href={hero.secondaryCta.href} location="hero" variant="secondary">
          {hero.secondaryCta.label}
        </CtaLink>
      </div>
      <p className="hero-reveal mt-6 text-sm text-slate" style={{ animationDelay: "360ms" }}>
        {hero.trustLine}
      </p>
    </section>
  );
}
