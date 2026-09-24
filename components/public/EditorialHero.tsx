import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "@/components/ui/MagneticButton";
import { PageEyebrow } from "./PageEyebrow";

export interface MetadataItem {
  label: string;
  value: string;
}

interface EditorialHeroProps {
  eyebrow: string;
  headline: string;
  supportingCopy?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  metadata?: MetadataItem[];
  breadcrumbs?: { label: string; href: string }[];
  children?: ReactNode;
}

export function EditorialHero({
  eyebrow,
  headline,
  supportingCopy,
  primaryAction,
  secondaryAction,
  metadata,
  breadcrumbs,
  children,
}: EditorialHeroProps) {
  return (
    <section className="bg-[var(--tsc-paper)] border-b border-[var(--tsc-line)] pt-12 sm:pt-16 pb-12 sm:pb-16 font-geist">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        {/* Optional Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6 text-xs font-mono text-[var(--tsc-muted)]">
            <ol className="flex items-center gap-2 flex-wrap">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <li key={crumb.href} className="flex items-center gap-2">
                    {idx > 0 && (
                      <span aria-hidden="true" className="text-[var(--tsc-line)]">
                        /
                      </span>
                    )}
                    {isLast ? (
                      <span className="text-[var(--tsc-ink)] font-medium">{crumb.label}</span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="hover:text-[var(--tsc-ink)] transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        <div className="max-w-4xl space-y-4 sm:space-y-6">
          <PageEyebrow>{eyebrow}</PageEyebrow>

          <h1 className="text-[34px] sm:text-[46px] lg:text-[54px] font-bold tracking-[-0.03em] leading-[1.06] text-[var(--tsc-ink)]">
            {headline}
          </h1>

          {supportingCopy && (
            <p className="text-base sm:text-lg text-[var(--tsc-muted)] leading-relaxed max-w-2xl">
              {supportingCopy}
            </p>
          )}

          {/* Primary / Secondary Actions */}
          {(primaryAction || secondaryAction) && (
            <div className="pt-2 flex flex-wrap items-center gap-4">
              {primaryAction && (
                <Magnetic pullFactor={0.16}>
                  <Link
                    href={primaryAction.href}
                    className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--tsc-ink)] px-5 py-2.5 text-sm font-medium text-[var(--tsc-paper)] transition-all hover:bg-[var(--tsc-ink)]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
                  >
                    {primaryAction.label}
                  </Link>
                </Magnetic>
              )}
              {secondaryAction && (
                <Link
                  href={secondaryAction.href}
                  className="inline-flex items-center gap-2 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/60 px-5 py-2.5 text-sm font-medium text-[var(--tsc-ink)] transition-all hover:border-[var(--tsc-ink)]/40 hover:bg-[var(--tsc-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
                >
                  {secondaryAction.label}
                </Link>
              )}
            </div>
          )}

          {/* Optional Metadata Bar (Rendered only if metadata items exist per Amendment 6) */}
          {metadata && metadata.length > 0 && (
            <div className="pt-6 border-t border-[var(--tsc-line)] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {metadata.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase">
                    {item.label}
                  </div>
                  <div className="text-sm font-medium text-[var(--tsc-ink)]">{item.value}</div>
                </div>
              ))}
            </div>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
