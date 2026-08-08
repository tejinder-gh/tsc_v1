import { AbstractVisual } from "@/components/AbstractVisual";
import { CtaLink } from "@/components/CtaLink";
import { hero } from "@/content/home";

/**
 * What: Home hero - positioning headline/subhead, primary and secondary CTAs.
 * Why: The brand name does not say "automation", so the subhead must position the company
 *      in the first two lines. Renders immediately, no entrance animation.
 * How: Plain static markup - the brief explicitly excludes the hero from scroll/entrance
 *      reveals (§8.14: "never on the hero") and caps motion at 300ms (§5.3); the previous
 *      550ms staggered fade-in violated both and was the page's LCP element render delay
 *      (the subhead paragraph, at a 180ms animation-delay, was measured as the Largest
 *      Contentful Paint candidate - removing the animation let it paint immediately).
 * From Where: TheSkillCorner marketing site build brief (hero + motion spec), 2026-06;
 *             reveal removed per §8.14/§5.3 and the performance pass, 2026-08.
 * When: 2026-08.
 */

export function Hero() {
  return (
    <section className="mx-auto max-w-site px-4 pb-10 pt-16 sm:px-6 sm:pt-24 lg:pt-32">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left Column: Copy & CTAs */}
        <div className="max-w-2xl">
          <p className="font-body font-bold text-sm uppercase tracking-widest text-blue">
            {hero.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-[-0.02em] text-navy sm:text-5xl md:text-6xl">
            {hero.headline}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate sm:text-xl">{hero.subhead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink href={hero.primaryCta.href} location="hero">
              {hero.primaryCta.label}
            </CtaLink>
            <CtaLink href={hero.secondaryCta.href} location="hero" variant="secondary">
              {hero.secondaryCta.label}
            </CtaLink>
          </div>
          <p className="mt-6 text-sm text-slate">{hero.trustLine}</p>
        </div>

        {/* Right Column: Abstract Automation Visual */}
        <div className="hidden lg:block h-full">
          <AbstractVisual variant="home" />
        </div>
      </div>
    </section>
  );
}
