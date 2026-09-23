"use client";

import { Inbox, LayoutDashboard, Library, Newspaper, PlayCircle, Workflow } from "lucide-react";
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
    <nav className="space-y-6" aria-label="Dashboard Navigation">
      {primarySections.map((section) => (
        <div key={section.heading}>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    item.isActive
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
