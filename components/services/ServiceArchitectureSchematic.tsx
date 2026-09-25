"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Cpu, Layers, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import type { ArchitectureFlowNode } from "@/content/digital-services";

interface ServiceArchitectureSchematicProps {
  readonly serviceName: string;
  readonly primaryMetric: string;
  readonly techStack: readonly string[];
  readonly flow: readonly ArchitectureFlowNode[];
}

export function ServiceArchitectureSchematic({
  serviceName,
  primaryMetric,
  techStack,
  flow,
}: ServiceArchitectureSchematicProps) {
  const [activeStep, setActiveStep] = useState<number>(0);

  const getNodeIcon = (type: ArchitectureFlowNode["nodeType"]) => {
    switch (type) {
      case "trigger":
        return <Zap className="h-3.5 w-3.5 text-[var(--tsc-action)]" strokeWidth={1.7} />;
      case "processing":
        return <Cpu className="h-3.5 w-3.5 text-blue-600" strokeWidth={1.7} />;
      case "integration":
        return <Layers className="h-3.5 w-3.5 text-purple-600" strokeWidth={1.7} />;
      case "output":
        return <ShieldCheck className="h-3.5 w-3.5 text-[var(--tsc-positive)]" strokeWidth={1.7} />;
    }
  };

  const getNodeBadgeClass = (type: ArchitectureFlowNode["nodeType"]) => {
    switch (type) {
      case "trigger":
        return "bg-amber-500/10 text-amber-800 border-amber-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-800 border-blue-500/20";
      case "integration":
        return "bg-purple-500/10 text-purple-800 border-purple-500/20";
      case "output":
        return "bg-emerald-500/10 text-emerald-800 border-emerald-500/20";
    }
  };

  return (
    <div className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-6 sm:p-8 lg:p-10 shadow-[var(--shadow-warm-sm)] font-geist">
      {/* Schematic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--tsc-line)] pb-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--tsc-action)]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--tsc-action)]">
              SYSTEM ARCHITECTURE SPECIFICATION
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]">
            {serviceName} &middot; Event &amp; Data Pipeline
          </h3>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] font-mono text-xs font-semibold text-[var(--tsc-ink)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--tsc-positive)]" />
            {primaryMetric}
          </span>
        </div>
      </div>

      {/* 4-Node Flow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {flow.map((node, idx) => {
          const isSelected = activeStep === idx;
          return (
            <motion.div
              key={node.step}
              onClick={() => setActiveStep(idx)}
              onMouseEnter={() => setActiveStep(idx)}
              className={`group relative rounded-[8px] border p-5 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? "border-[var(--tsc-action)] bg-[var(--tsc-surface)]/80 ring-2 ring-[var(--tsc-action)]/20 shadow-[var(--shadow-warm-sm)]"
                  : "border-[var(--tsc-line)] bg-white hover:border-[var(--tsc-line-strong)] hover:bg-[var(--tsc-surface)]/30"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {getNodeIcon(node.nodeType)}
                    <span className="font-mono text-xs font-bold text-[var(--tsc-muted)]">
                      NODE {node.step}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded-[4px] border ${getNodeBadgeClass(
                      node.nodeType,
                    )}`}
                  >
                    {node.nodeType}
                  </span>
                </div>

                <h4 className="font-semibold text-sm sm:text-base text-[var(--tsc-ink)] leading-snug group-hover:text-[var(--tsc-action)] transition-colors">
                  {node.title}
                </h4>

                <p className="text-xs text-[var(--tsc-muted)] leading-relaxed">
                  {node.description}
                </p>
              </div>

              {node.latencyOrGuarantee && (
                <div className="pt-3 border-t border-[var(--tsc-line)] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[var(--tsc-muted)]">Specification:</span>
                  <span className="font-semibold text-[var(--tsc-ink)] flex items-center gap-1">
                    <CheckCircle2
                      className="h-3 w-3 text-[var(--tsc-positive)]"
                      strokeWidth={1.7}
                    />
                    {node.latencyOrGuarantee}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Technical Stack Bar */}
      <div className="mt-8 pt-6 border-t border-[var(--tsc-line)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--tsc-muted)] block">
            Engineered Software &amp; Integration Stack:
          </span>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-xs px-2.5 py-1 rounded-[6px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[var(--tsc-ink)] font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="text-right self-start lg:self-auto shrink-0">
          <span className="font-mono text-[11px] text-[var(--tsc-muted)]">
            All codebases deployed to private customer repositories with 100% IP ownership.
          </span>
        </div>
      </div>
    </div>
  );
}
