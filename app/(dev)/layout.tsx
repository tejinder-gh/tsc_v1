import type { ReactNode } from "react";

export default function DevLayout({ children }: { children: ReactNode }) {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="min-h-screen bg-[var(--tsc-paper)] text-[var(--tsc-ink)] font-geist focus:outline-none"
    >
      {children}
    </main>
  );
}
