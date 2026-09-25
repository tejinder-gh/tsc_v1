"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Cpu,
  FileText,
  Layers,
  Search,
  Sliders,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { digitalServices } from "@/content/digital-services";
import { industries } from "@/content/industries";
import { services as automationServices } from "@/content/services";

export interface CommandItem {
  id: string;
  category: "ACTION" | "CAPABILITY" | "INDUSTRY" | "BRIEFING";
  title: string;
  description: string;
  href?: string;
  action?: () => void;
  badge?: string;
  icon: typeof Search;
}

export function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global open / close event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd + K or Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // '/' to search when not in an input
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsOpen(true);
      }
      // Escape to close
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Build searchable index
  const allItems: CommandItem[] = useMemo(() => {
    const items: CommandItem[] = [
      // Primary Actions
      {
        id: "act-problem",
        category: "ACTION",
        title: "Start with a problem",
        description: "Frame your operational drag and enter the diagnostic journey",
        href: "/#start",
        badge: "JOURNEY",
        icon: Workflow,
      },
      {
        id: "act-book",
        category: "ACTION",
        title: "Book an engineering discovery audit",
        description: "30 minutes, 3 scoped automation architectures, zero sales decks",
        href: "/book",
        badge: "30 MIN",
        icon: Calendar,
      },
      {
        id: "act-simulate",
        category: "ACTION",
        title: "Simulate Pipeline Execution",
        description: "Watch live event triggers, ASR transcription, and latency metrics",
        href: "/#system-studies",
        badge: "INTERACTIVE",
        icon: Cpu,
      },
      {
        id: "act-architecture",
        category: "ACTION",
        title: "Architecture Visualizer (Live Trace)",
        description: "Compare Automated Event Relay vs Legacy Manual Path",
        href: "/digital-services#architecture-visualizer",
        badge: "TELEMETRY",
        icon: Sliders,
      },
      {
        id: "act-diagnostic",
        category: "ACTION",
        title: "Automation Opportunities Checklist",
        description: "25-task diagnostic to identify repetitive operational drag",
        href: "/library",
        badge: "AUDIT",
        icon: CheckCircle2,
      },
      // Digital Capabilities
      ...digitalServices.map((ds) => ({
        id: `cap-${ds.slug}`,
        category: "CAPABILITY" as const,
        title: ds.name,
        description: ds.tagline,
        href: `/digital-services/${ds.slug}`,
        badge: "SYSTEM",
        icon: Layers,
      })),
      // Automation Offerings
      ...automationServices.map((srv) => ({
        id: `auto-${srv.slug}`,
        category: "CAPABILITY" as const,
        title: srv.name,
        description: srv.excerpt,
        href: `/what-we-automate/${srv.slug}`,
        badge: "AUTOMATION",
        icon: Workflow,
      })),
      // Industry Playbooks
      ...industries.map((ind) => ({
        id: `ind-${ind.slug}`,
        category: "INDUSTRY" as const,
        title: ind.name,
        description: ind.cardLine,
        href: `/industries/${ind.slug}`,
        badge: "PLAYBOOK",
        icon: Sparkles,
      })),
      // Briefings & Publications
      {
        id: "pub-founder",
        category: "BRIEFING",
        title: "Tech Founder Briefing",
        description: "Actionable AI and engineering shifts for CTOs and technical operators",
        href: "/newsletters/tech-founder-briefing",
        badge: "WEEKLY",
        icon: BookOpen,
      },
      {
        id: "pub-library",
        category: "BRIEFING",
        title: "The Skill Corner Library",
        description: "30+ productized automations, blueprints, and field notes",
        href: "/library",
        badge: "INDEX",
        icon: FileText,
      },
    ];

    return items;
  }, []);

  // Filter items by query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems.slice(0, 14); // Default suggested items

    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.badge?.toLowerCase().includes(q),
      )
      .slice(0, 18);
  }, [allItems, query]);

  // Adjust selectedIndex when list shrinks
  useEffect(() => {
    setSelectedIndex((prev) => (prev >= filteredItems.length ? 0 : prev));
  }, [filteredItems.length]);

  const selectItem = useCallback(
    (item: CommandItem) => {
      setIsOpen(false);
      if (item.action) {
        item.action();
      } else if (item.href) {
        router.push(item.href);
      }
    },
    [router],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev === 0 ? Math.max(0, filteredItems.length - 1) : prev - 1));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      selectItem(filteredItems[selectedIndex]);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`);
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Studio Command Palette"
          className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 lg:p-20 font-geist"
        >
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[var(--tsc-ink)]/50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -12 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-2xl z-10"
          >
            {/* Header & Search Input */}
            <div className="flex items-center border-b border-[var(--tsc-line)] px-4 py-3.5 bg-[var(--tsc-surface)]">
              <Search className="h-5 w-5 text-[var(--tsc-muted)] shrink-0 mr-3" strokeWidth={1.7} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search capabilities, 24 industry playbooks, live tools, or type..."
                className="w-full bg-transparent text-sm sm:text-base text-[var(--tsc-ink)] placeholder:text-[var(--tsc-muted)]/70 focus:outline-none"
              />
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="hidden sm:inline-flex items-center rounded border border-[var(--tsc-line)] bg-white px-1.5 py-0.5 text-[10px] font-mono font-medium text-[var(--tsc-muted)]">
                  ESC
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded p-1 text-[var(--tsc-muted)] hover:bg-[var(--tsc-line)]/50 hover:text-[var(--tsc-ink)] transition-colors"
                >
                  <X className="h-4 w-4" strokeWidth={1.7} />
                </button>
              </div>
            </div>

            {/* Results List */}
            <div
              ref={listRef}
              role="listbox"
              className="max-h-[380px] overflow-y-auto divide-y divide-[var(--tsc-line)]/40 p-2"
            >
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm font-medium text-[var(--tsc-ink)]">
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-[var(--tsc-muted)]">
                    Try searching for &ldquo;dental&rdquo;, &ldquo;receptionist&rdquo;,
                    &ldquo;intake&rdquo;, or &ldquo;audit&rdquo;.
                  </p>
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-index={index}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => selectItem(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between gap-3 rounded-[6px] px-3.5 py-2.5 text-left transition-colors ${
                        isSelected
                          ? "bg-[var(--tsc-ink)] text-[var(--tsc-paper)]"
                          : "text-[var(--tsc-ink)] hover:bg-[var(--tsc-surface)]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`grid h-8 w-8 place-items-center rounded-[4px] shrink-0 ${
                            isSelected
                              ? "bg-white/10 text-white"
                              : "bg-[var(--tsc-surface)] text-[var(--tsc-muted)] border border-[var(--tsc-line)]"
                          }`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.7} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold truncate tracking-tight">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span
                                className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-[3px] ${
                                  isSelected
                                    ? "bg-[var(--tsc-signal)] text-[var(--tsc-ink)] font-semibold"
                                    : "bg-[var(--tsc-line)]/50 text-[var(--tsc-muted)]"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-xs truncate max-w-md ${
                              isSelected ? "text-white/70" : "text-[var(--tsc-muted)]"
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-mono uppercase tracking-widest hidden sm:inline ${
                            isSelected ? "text-white/50" : "text-[var(--tsc-muted)]/60"
                          }`}
                        >
                          {item.category}
                        </span>
                        <ArrowRight
                          className={`h-4 w-4 transition-transform ${
                            isSelected
                              ? "text-[var(--tsc-signal)] translate-x-0.5"
                              : "text-[var(--tsc-muted)]/40"
                          }`}
                          strokeWidth={1.7}
                        />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Telemetry & Quick Keys */}
            <div className="flex items-center justify-between border-t border-[var(--tsc-line)] bg-[var(--tsc-surface)] px-4 py-2 text-[11px] font-mono text-[var(--tsc-muted)]">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="rounded border border-[var(--tsc-line)] bg-white px-1 py-0.5 font-medium text-[var(--tsc-ink)]">
                    ↑
                  </kbd>{" "}
                  <kbd className="rounded border border-[var(--tsc-line)] bg-white px-1 py-0.5 font-medium text-[var(--tsc-ink)]">
                    ↓
                  </kbd>{" "}
                  Navigate
                </span>
                <span>
                  <kbd className="rounded border border-[var(--tsc-line)] bg-white px-1.5 py-0.5 font-medium text-[var(--tsc-ink)]">
                    ↵
                  </kbd>{" "}
                  Select
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--tsc-action)]" />
                <span className="uppercase tracking-wider">INDEXED STUDIO REPOSITORY</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
