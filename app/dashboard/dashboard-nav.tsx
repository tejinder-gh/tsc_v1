"use client";

import { Inbox, Workflow } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard/flows",
      label: "Flows",
      icon: Workflow,
      isActive: pathname === "/dashboard/flows" || pathname === "/dashboard",
    },
    {
      href: "/dashboard/drafts",
      label: "Drafts",
      icon: Inbox,
      isActive: pathname === "/dashboard/drafts",
    },
  ];

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              item.isActive
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
            }`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
