import type { HTMLAttributes, ReactNode } from "react";

interface PageEyebrowProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  dark?: boolean;
}

/**
 * Editorial page eyebrow / category tag.
 * Monospace, tracked, uppercase, quiet ink/muted styling.
 */
export function PageEyebrow({
  children,
  dark = false,
  className = "",
  ...props
}: PageEyebrowProps) {
  return (
    <div
      className={`text-[11px] sm:text-xs font-mono font-medium tracking-[0.16em] uppercase ${
        dark ? "text-white/60" : "text-[var(--tsc-muted)]"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
