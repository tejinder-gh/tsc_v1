"use client";

import { ArrowUpRight, Bot, Cpu, FileText, Sparkles, Workflow } from "lucide-react";
import Link from "next/link";
import type { Offering } from "../domain/types";

export interface OfferingCardProps {
  offering: Offering;
  reasonText?: string;
}

function getKindIcon(kind: Offering["kind"], deliveryModel: Offering["deliveryModel"]) {
  if (kind === "newsletter") {
    return <FileText className="w-5 h-5 text-blue" strokeWidth={1.7} />;
  }
  if (kind === "automation") {
    return <Workflow className="w-5 h-5 text-blue" strokeWidth={1.7} />;
  }
  if (deliveryModel === "ai") {
    return <Bot className="w-5 h-5 text-blue" strokeWidth={1.7} />;
  }
  return <Cpu className="w-5 h-5 text-blue" strokeWidth={1.7} />;
}

function getKindBadge(kind: Offering["kind"]) {
  switch (kind) {
    case "automation":
      return "Automation";
    case "service":
      return "Digital Service";
    case "newsletter":
      return "Newsletter";
    case "resource":
      return "Resource";
    case "tool":
      return "Tool";
    default:
      return "Offering";
  }
}

export function OfferingCard({ offering, reasonText }: OfferingCardProps) {
  const deliveryKicker = `${offering.deliveryModel.toUpperCase()} · ${getKindBadge(offering.kind).toUpperCase()}`;

  return (
    <article className="group relative flex flex-col justify-between bg-white rounded-xl border-2 border-navy/10 hover:border-blue transition-all duration-200 p-6 shadow-xs hover:shadow-md">
      <div>
        {/* Top bar: icon, kind badge, and optional status */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-tint flex items-center justify-center">
            {getKindIcon(offering.kind, offering.deliveryModel)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {getKindBadge(offering.kind)}
            </span>
            {offering.status === "beta" && (
              <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Beta
              </span>
            )}
            {offering.featured && (
              <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-blue-tint text-blue">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Kicker & Title */}
        <p className="text-[12px] font-bold tracking-wider uppercase text-blue mb-1">
          {deliveryKicker}
        </p>
        <h3 className="font-display font-semibold text-xl text-navy group-hover:text-blue transition-colors line-clamp-1">
          <Link href={offering.canonicalUrl} className="focus:outline-none">
            {offering.title}
          </Link>
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5 mb-3 line-clamp-1">
          {offering.tagline}
        </p>

        {/* Description */}
        <p className="text-sm text-slate leading-relaxed mb-4 line-clamp-3">
          {offering.shortDescription}
        </p>

        {/* Structured recommendation reason badge */}
        {reasonText && (
          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-tint/70 text-blue text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{reasonText}</span>
          </div>
        )}

        {/* Tags preview */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {offering.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer: Price / CTA */}
      <div className="pt-4 border-t border-line flex items-center justify-between mt-auto">
        <div>
          <span className="text-xs text-muted block">Pricing</span>
          <span className="text-sm font-semibold text-navy tabular-nums">
            {offering.priceDisplay}
          </span>
        </div>
        <Link
          href={offering.canonicalUrl}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-navy group-hover:bg-blue text-white transition-colors"
        >
          <span>{offering.cta.label}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
