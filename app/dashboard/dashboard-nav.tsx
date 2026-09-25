"use client";

import {
  Code2,
  ExternalLink,
  Globe,
  Inbox,
  LayoutDashboard,
  Library,
  Newspaper,
  PlayCircle,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardNavProps {
  onNavigate?: () => void;
}

export function DashboardNav({ onNavigate }: DashboardNavProps) {
  const pathname = usePathname();

  const primarySections = [
    {
      heading: "Command Center",
      items: [
        {
          href: "/dashboard",
          label: "Metrics & Overview",
          icon: LayoutDashboard,
          isActive: pathname === "/dashboard",
        },
        {
          href: "/dashboard/workflows",
          label: "Feature Triggers",
          icon: PlayCircle,
          isActive: pathname.startsWith("/dashboard/workflows"),
        },
      ],
    },
    {
      heading: "Automation Operations",
      items: [
        {
          href: "/dashboard/flows",
          label: "Client Flows",
          icon: Workflow,
          isActive: pathname.startsWith("/dashboard/flows"),
        },
        {
          href: "/dashboard/drafts",
          label: "Review Queue",
          icon: Inbox,
          isActive: pathname.startsWith("/dashboard/drafts"),
        },
      ],
    },
    {
      heading: "Offerings & Content",
      items: [
        {
          href: "/dashboard/catalog",
          label: "Catalog Management",
          icon: Library,
          isActive: pathname.startsWith("/dashboard/catalog"),
        },
        {
          href: "/dashboard/newsletters",
          label: "Newsletters & Radar",
          icon: Newspaper,
          isActive: pathname.startsWith("/dashboard/newsletters"),
        },
      ],
    },
  ];

  return (
    <nav className="space-y-6 font-geist" aria-label="Dashboard Navigation">
      {primarySections.map((section) => (
        <div key={section.heading}>
          <p className="px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--tsc-muted)] mb-2">
            {section.heading}
          </p>
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={item.isActive ? "page" : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-mono transition-colors select-none ${
                    item.isActive
                      ? "bg-[var(--tsc-ink)] text-[var(--tsc-paper)] font-semibold"
                      : "text-[var(--tsc-muted)] hover:bg-[var(--tsc-surface)] hover:text-[var(--tsc-ink)]"
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      <div className="pt-4 border-t border-[var(--tsc-line)]">
        <p className="px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--tsc-muted)] mb-2">
          External &amp; Studio
        </p>
        <div className="space-y-1">
          <Link
            href="/"
            onClick={onNavigate}
            className="flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-mono text-[var(--tsc-muted)] hover:bg-[var(--tsc-surface)] hover:text-[var(--tsc-ink)] transition-colors select-none"
          >
            <div className="flex items-center gap-3">
              <Globe size={16} aria-hidden="true" />
              <span>Public Website</span>
            </div>
            <ExternalLink size={12} className="text-slate-400" />
          </Link>
          <Link
            href="/dev/components"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-mono text-[var(--tsc-muted)] hover:bg-[var(--tsc-surface)] hover:text-[var(--tsc-ink)] transition-colors select-none"
          >
            <Code2 size={16} aria-hidden="true" />
            <span>Design Studio</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
