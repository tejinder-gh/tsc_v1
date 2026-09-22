import type { ReactNode } from "react";

export default function DevLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-mist/50 focus:outline-none">
      {children}
    </main>
  );
}
