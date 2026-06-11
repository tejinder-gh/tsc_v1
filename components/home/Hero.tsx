import { AbstractVisual } from "@/components/AbstractVisual";
import { CtaLink } from "@/components/CtaLink";
import { hero } from "@/content/home";

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

export function Hero() {
  return (
    <section className="mx-auto max-w-site px-4 pb-10 pt-16 sm:px-6 sm:pt-24 lg:pt-32">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left Column: Copy & CTAs */}
        <div className="max-w-2xl">
          <p
            className="hero-reveal font-mono text-sm font-semibold uppercase tracking-widest text-ledger"
            style={{ animationDelay: "0ms" }}
          >
            {hero.eyebrow}
          </p>
          <h1
            className="hero-reveal mt-4 font-display text-4xl font-bold leading-tight tracking-[-0.02em] text-ink sm:text-5xl md:text-6xl"
            style={{ animationDelay: "90ms" }}
          >
            {hero.headline}
          </h1>
          <p
            className="hero-reveal mt-5 text-lg leading-relaxed text-slate sm:text-xl"
            style={{ animationDelay: "180ms" }}
          >
            {hero.subhead}
          </p>
          <div
            className="hero-reveal mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: "270ms" }}
          >
            <CtaLink href={hero.primaryCta.href} location="hero">
              {hero.primaryCta.label}
            </CtaLink>
            <CtaLink href={hero.secondaryCta.href} location="hero" variant="secondary">
              {hero.secondaryCta.label}
            </CtaLink>
          </div>
          <p className="hero-reveal mt-6 text-sm text-slate/70" style={{ animationDelay: "360ms" }}>
            {hero.trustLine}
          </p>
        </div>

        {/* Right Column: Abstract Automation Visual */}
        <div className="hidden lg:block h-full">
          <AbstractVisual variant="home" />
        </div>
      </div>
    </section>
  );
}
