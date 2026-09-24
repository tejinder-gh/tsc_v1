"use client";

import { ArrowLeft, CheckCircle2, ExternalLink, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NewsletterDeliveryPreview } from "@/features/newsletters/components/NewsletterDeliveryPreview";
import type { Newsletter, NewsletterIssue } from "@/features/newsletters/domain/types";

export function NewsletterManageClient({ newsletter }: { newsletter: Newsletter }) {
  const [issues, setIssues] = useState<NewsletterIssue[]>(newsletter.issues);
  const [selectedIssueId, setSelectedIssueId] = useState<string>(
    newsletter.issues[newsletter.issues.length - 1]?.id || "",
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const selectedIssue = issues.find((i) => i.id === selectedIssueId);

  const handleSimulateAiGeneration = () => {
    setIsGenerating(true);
    setActionSuccess(null);

    setTimeout(() => {
      const nextIssueNum = issues.length + 1;
      const newIssue: NewsletterIssue = {
        id: `${newsletter.slug}-draft-${Date.now()}`,
        newsletterSlug: newsletter.slug,
        issueNumber: nextIssueNum,
        title: `Edition #${nextIssueNum}: Emerging Agent Protocols & Production Hardening`,
        slug: `draft-edition-${nextIssueNum}`,
        summary:
          "Automated draft compilation from monitored source repositories and RSS feeds. Ready for human operator review.",
        keyTakeaways: [
          "State transition verification prevents cyclic execution in background jobs",
          "Scoped IAM roles mitigate blast radius of autonomous tool execution",
          "Deterministic test suites ensure zero regression across release cycles",
        ],
        contentMarkdown: `## Auto-Generated Draft Briefing\n\nThis edition was compiled by the automated intake worker scanning primary sources at 07:00 EST.\n\n### Key Highlights\n- Analysis of recent agent runtime vulnerabilities and mitigations\n- Standardized database access rules for unattended processes\n- Performance benchmarks across recent frontier and local model deployments\n\n*Review takeaways and edit before approving publication.*`,
        generatedBy: "ai",
        status: "review",
        scheduledFor: new Date(Date.now() + 86400000).toISOString(),
        sourceItemCount: 16,
        curatorNotes: "Pending operator review.",
      };

      setIssues([newIssue, ...issues]);
      setSelectedIssueId(newIssue.id);
      setIsGenerating(false);
      setActionSuccess(
        "Demo draft compiled in-memory (Simulation only · Neon persistence requires applying migration 005).",
      );
    }, 1200);
  };

  const handleApproveAndPublish = (issueId: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            status: "published",
            publishedAt: new Date().toISOString(),
            deliveredAt: new Date().toISOString(),
          };
        }
        return iss;
      }),
    );
    setActionSuccess(
      "Issue marked published in local state (Simulation only · Durable publish requires applying migration 005).",
    );
  };

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div>
        <Link
          href="/dashboard/newsletters"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Publications</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {newsletter.name}
              </h1>
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--tsc-surface)] text-[var(--tsc-ink)] border border-[var(--tsc-line)]">
                {newsletter.cadence}
              </span>
            </div>
            <p className="text-xs text-slate-500">{newsletter.tagline}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/newsletters/${newsletter.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs"
            >
              <span>View Public Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleSimulateAiGeneration}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[var(--tsc-action)] hover:opacity-90 rounded-lg transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Simulating Intake...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simulate Draft Generation (Demo Preview)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Grid: Issues Column & Preview Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issue selector */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Editions &amp; Drafts ({issues.length})
          </h2>

          <div className="space-y-2">
            {issues.map((issue) => {
              const isSelected = issue.id === selectedIssueId;
              const isPublished = issue.status === "published";
              const isReview = issue.status === "review";

              return (
                <button
                  key={issue.id}
                  type="button"
                  onClick={() => {
                    setSelectedIssueId(issue.id);
                    setActionSuccess(null);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-white border-[var(--tsc-action)] shadow-xs ring-1 ring-[var(--tsc-action)]"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-slate-900">
                      Issue #{issue.issueNumber}
                      {issue.isSample && (
                        <span className="ml-1.5 text-[10px] text-slate-400 font-normal">
                          (Sample)
                        </span>
                      )}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isPublished
                          ? "bg-emerald-50 text-emerald-700"
                          : isReview
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium line-clamp-1 mb-1">
                    {issue.title}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {issue.publishedAt
                      ? `Published ${new Date(issue.publishedAt).toLocaleDateString()}`
                      : "In Review"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Issue Preview & Controls */}
        <div className="lg:col-span-2 space-y-6">
          {selectedIssue ? (
            <NewsletterDeliveryPreview
              newsletter={newsletter}
              issue={selectedIssue}
              onApproveAndPublish={handleApproveAndPublish}
            />
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-20 text-center text-slate-400 text-sm shadow-2xs">
              Select an edition from the list to view and manage.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
