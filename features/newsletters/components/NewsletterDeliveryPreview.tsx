"use client";

import { Check, CheckCircle2, Clock, Mail, ShieldCheck } from "lucide-react";
import type { Newsletter, NewsletterIssue } from "../domain/types";
import { NewsletterContentRenderer } from "./NewsletterContentRenderer";

export interface NewsletterDeliveryPreviewProps {
  newsletter: Newsletter;
  issue: NewsletterIssue;
  onApproveAndPublish?: (issueId: string) => void;
  className?: string;
}

export function NewsletterDeliveryPreview({
  newsletter,
  issue,
  onApproveAndPublish,
  className = "",
}: NewsletterDeliveryPreviewProps) {
  const isPublished = issue.status === "published" || issue.status === "delivered";
  const isReview = issue.status === "review";

  const displayDate = issue.publishedAt
    ? new Date(issue.publishedAt).toLocaleDateString("en-CA", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : issue.scheduledFor
      ? `Scheduled for ${new Date(issue.scheduledFor).toLocaleDateString("en-CA", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`
      : "Pending publication";

  return (
    <div
      className={`space-y-0 rounded-2xl overflow-hidden border border-slate-200 shadow-xs ${className}`}
    >
      {/* 1. Email Client Dispatch Envelope Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--tsc-surface)] border border-[var(--tsc-line)] flex items-center justify-center text-[var(--tsc-ink)]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                <span>Email Dispatch Preview</span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[var(--tsc-surface)] text-[var(--tsc-ink)] border border-[var(--tsc-line)]">
                  Direct Delivery
                </span>
              </span>
              <p className="text-[11px] text-slate-500">
                Exact rendering delivered to subscriber inboxes via SendGrid v3 API
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                isPublished
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : isReview
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {isPublished ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Delivered</span>
                </>
              ) : isReview ? (
                <>
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Ready for Delivery</span>
                </>
              ) : (
                <span>Draft Edition</span>
              )}
            </span>

            {onApproveAndPublish && !isPublished && (
              <button
                type="button"
                onClick={() => onApproveAndPublish(issue.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve &amp; Send</span>
              </button>
            )}
          </div>
        </div>

        {/* Email Header Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-2xs font-mono">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 font-medium w-16">Subject:</span>
              <span className="text-slate-800 font-semibold truncate">
                [{newsletter.name}] #{issue.issueNumber}: {issue.title}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 font-medium w-16">From:</span>
              <span className="text-slate-700 truncate">
                {newsletter.editorialOwner} &lt;briefings@theskillcorner.com&gt;
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 font-medium w-16">To:</span>
              <span className="text-slate-700 truncate">subscriber@enterprise-domain.com</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 font-medium w-16">Security:</span>
              <span className="text-emerald-700 inline-flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3 h-3" />
                <span>SPF / DKIM / DMARC PASS</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Delivered Newsletter Body (Direct feel of delivered email) */}
      <div className="bg-white p-6 sm:p-10 space-y-8">
        {/* Newsletter Masthead Header */}
        <div className="border-b border-slate-100 pb-5 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                TC
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {newsletter.name}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Issue #{issue.issueNumber}
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--tsc-positive)]">
                {newsletter.cadence}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-normal">{newsletter.tagline}</p>
        </div>

        {/* Lead Article Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{displayDate}</span>
            <span>•</span>
            <span className="capitalize">Compiled via {issue.generatedBy} pipeline</span>
            {issue.sourceItemCount && (
              <>
                <span>•</span>
                <span>{issue.sourceItemCount} monitored primary inputs</span>
              </>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
            {issue.title}
          </h2>
        </div>

        {/* Executive Summary */}
        {issue.summary && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border-l-4 border-[var(--tsc-positive)] text-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--tsc-positive)] block font-mono">
              Executive Briefing Summary
            </span>
            <p className="text-sm text-slate-700 leading-relaxed font-sans">{issue.summary}</p>
          </div>
        )}

        {/* Key Takeaways */}
        {issue.keyTakeaways && issue.keyTakeaways.length > 0 && (
          <div className="p-5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block font-mono">
              Key Signal Takeaways
            </span>
            <ul className="space-y-2">
              {issue.keyTakeaways.map((takeaway) => (
                <li
                  key={`takeaway-${takeaway.slice(0, 32)}`}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-[var(--tsc-positive)] flex-shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rendered Delivery Content (Semantic HTML, zero markup code) */}
        <div className="pt-2">
          <NewsletterContentRenderer content={issue.contentMarkdown} variant="email" />
        </div>

        {/* Email Footer (CASL / CAN-SPAM direct delivery style) */}
        <div className="border-t border-slate-100 pt-6 mt-10 space-y-3 text-center text-xs text-slate-400">
          <p className="max-w-md mx-auto leading-relaxed">
            You are receiving this intelligence briefing because you subscribed to{" "}
            <strong className="text-slate-600">{newsletter.name}</strong> via The Skill Corner.
            Direct email delivery with zero sponsored advertising.
          </p>

          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 font-medium">
            <span className="hover:text-slate-800 cursor-pointer underline underline-offset-2">
              Unsubscribe
            </span>
            <span>•</span>
            <span className="hover:text-slate-800 cursor-pointer underline underline-offset-2">
              Delivery Preferences
            </span>
            <span>•</span>
            <span className="hover:text-slate-800 cursor-pointer underline underline-offset-2">
              Web Archive
            </span>
          </div>

          <p className="text-[10px] text-slate-400">
            The Skill Corner Inc. · 100 King St W, Toronto, ON · Autonomous Systems &amp;
            Engineering Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}
