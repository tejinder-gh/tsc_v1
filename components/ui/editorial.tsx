import type { HTMLAttributes, ReactNode } from "react";

interface SectionLabelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  dark?: boolean;
}

/**
 * Editorial section label / eyebrow: Monospace, uppercase, tracked, muted ink or muted paper.
 */
export function SectionLabel({
  children,
  dark = false,
  className = "",
  ...props
}: SectionLabelProps) {
  return (
    <div
      className={`text-[11px] sm:text-xs font-mono font-medium tracking-[0.14em] uppercase ${
        dark ? "text-white/60" : "text-[var(--tsc-muted)]"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface EditorialDividerProps extends HTMLAttributes<HTMLHRElement> {
  dark?: boolean;
}

/**
 * 1px hairline divider line separating editorial rows or sections.
 */
export function EditorialDivider({
  dark = false,
  className = "",
  ...props
}: EditorialDividerProps) {
  return (
    <hr
      className={`border-0 border-t ${
        dark ? "border-white/10" : "border-[var(--tsc-line)]"
      } ${className}`}
      {...props}
    />
  );
}
