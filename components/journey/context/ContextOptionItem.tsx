"use client";

interface ContextOptionItemProps {
  name: string;
  value: string;
  index: number;
  label: string;
  description?: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function ContextOptionItem({
  name,
  value,
  index,
  label,
  description,
  isSelected,
  onSelect,
  disabled = false,
}: ContextOptionItemProps) {
  const indexStr = String(index + 1).padStart(2, "0");

  return (
    <label
      className={`group w-full text-left transition-colors border-b border-[var(--tsc-line)] py-3 sm:py-3.5 px-3 sm:px-4 flex items-start gap-3 sm:gap-4 rounded-[3px] cursor-pointer has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--tsc-ink)] has-[:focus-visible]:ring-offset-1 ${
        isSelected
          ? "bg-[var(--tsc-surface)] border-l-2 border-l-[var(--tsc-ink)]"
          : "hover:bg-[var(--tsc-surface)]/50"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={isSelected}
        onChange={onSelect}
        disabled={disabled}
        className="sr-only"
      />

      {/* Index Number */}
      <span
        className={`font-mono text-xs pt-0.5 select-none transition-colors ${
          isSelected
            ? "font-semibold text-[var(--tsc-ink)]"
            : "text-[var(--tsc-muted)] group-hover:text-[var(--tsc-ink)]/70"
        }`}
        aria-hidden="true"
      >
        {indexStr}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-sm sm:text-base transition-colors ${
              isSelected
                ? "font-semibold text-[var(--tsc-ink)]"
                : "font-medium text-[var(--tsc-ink)]/90 group-hover:text-[var(--tsc-ink)]"
            }`}
          >
            {label}
          </span>

          {/* Selection indicator pill/bullet */}
          <span
            className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
              isSelected
                ? "border-[var(--tsc-ink)] bg-[var(--tsc-ink)] text-white"
                : "border-[var(--tsc-line)] bg-white group-hover:border-[var(--tsc-muted)]"
            }`}
            aria-hidden="true"
          >
            {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
          </span>
        </div>

        {description && (
          <p
            className={`mt-0.5 text-xs sm:text-[13px] leading-relaxed transition-colors ${
              isSelected
                ? "text-[var(--tsc-ink)]/80"
                : "text-[var(--tsc-muted)] group-hover:text-[var(--tsc-muted)]/90"
            }`}
          >
            {description}
          </p>
        )}
      </div>
    </label>
  );
}
