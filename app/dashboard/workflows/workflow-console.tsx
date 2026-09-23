"use client";

import {
  AlertCircle,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Layers,
  Library,
  MessageSquare,
  Play,
  PlayCircle,
  RefreshCw,
  Search,
  Send,
  Shield,
  ShieldAlert,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
  type ClientMatrixItem,
  triggerCatalogDiagnostic,
  triggerManualSchedulerTick,
  triggerSecondBrainContextSearch,
  triggerSimulatedInboundSms,
  triggerSimulatedLead,
} from "../actions";

interface WorkflowConsoleProps {
  clients: ClientMatrixItem[];
}

type TabType = "scheduler" | "inbound" | "lead" | "second-brain" | "catalog";

export function WorkflowConsole({ clients }: WorkflowConsoleProps) {
  const [activeTab, setActiveTab] = useState<TabType>("scheduler");
  const [isPending, startTransition] = useTransition();
  const [executionResult, setExecutionResult] = useState<Record<string, unknown> | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Form states:
  // 1. Scheduler
  const [selectedSchedulerClient, setSelectedSchedulerClient] = useState<string>("all");

  // 2. Inbound SMS
  const [selectedInboundClient, setSelectedInboundClient] = useState<string>(
    clients[0]?.id || "brightsmile-dental",
  );
  const [inboundFromPhone, setInboundFromPhone] = useState<string>("+14165550114");
  const [inboundMessageBody, setInboundMessageBody] = useState<string>("CONFIRM");

  // 3. Lead Capture
  const [leadName, setLeadName] = useState<string>("Alex Morgan");
  const [leadEmail, setLeadEmail] = useState<string>("alex@enterprise-partner.ca");
  const [leadCompany, setLeadCompany] = useState<string>("Morgan Health Solutions");
  const [leadNotes, setLeadNotes] = useState<string>(
    "Requesting evaluation for automated intake & review generation",
  );
  const [isHoneypot, setIsHoneypot] = useState<boolean>(false);

  // 4. Second Brain RAG
  const [ragDomain, setRagDomain] = useState<string>("strategy");
  const [ragSubdomain, setRagSubdomain] = useState<string>("acquisition");
  const [ragKeywords, setRagKeywords] = useState<string>("diligence, financial, valuation");

  const copyTelemetry = () => {
    if (!executionResult) return;
    navigator.clipboard.writeText(JSON.stringify(executionResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunScheduler = () => {
    setExecutionError(null);
    startTransition(async () => {
      try {
        const clientTarget =
          selectedSchedulerClient === "all" ? undefined : selectedSchedulerClient;
        const res = await triggerManualSchedulerTick(clientTarget);
        setExecutionResult(res);
      } catch (err: unknown) {
        setExecutionError(err instanceof Error ? err.message : String(err));
      }
    });
  };

  const handleRunInbound = () => {
    setExecutionError(null);
    startTransition(async () => {
      try {
        const res = await triggerSimulatedInboundSms({
          clientId: selectedInboundClient,
          fromPhone: inboundFromPhone,
          messageBody: inboundMessageBody,
        });
        setExecutionResult(res);
      } catch (err: unknown) {
        setExecutionError(err instanceof Error ? err.message : String(err));
      }
    });
  };

  const handleRunLead = () => {
    setExecutionError(null);
    startTransition(async () => {
      try {
        const res = await triggerSimulatedLead({
          name: leadName,
          email: leadEmail,
          company: leadCompany,
          notes: leadNotes,
          isHoneypot,
        });
        setExecutionResult(res);
      } catch (err: unknown) {
        setExecutionError(err instanceof Error ? err.message : String(err));
      }
    });
  };

  const handleRunSecondBrain = () => {
    setExecutionError(null);
    startTransition(async () => {
      try {
        const keywordsArray = ragKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean);
        const res = await triggerSecondBrainContextSearch({
          domain: ragDomain,
          subdomain: ragSubdomain,
          keywords: keywordsArray,
        });
        setExecutionResult(res);
      } catch (err: unknown) {
        setExecutionError(err instanceof Error ? err.message : String(err));
      }
    });
  };

  const handleRunCatalog = () => {
    setExecutionError(null);
    startTransition(async () => {
      try {
        const res = await triggerCatalogDiagnostic();
        setExecutionResult(res);
      } catch (err: unknown) {
        setExecutionError(err instanceof Error ? err.message : String(err));
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Workflow Tabs Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 text-sm font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("scheduler")}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "scheduler"
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
          role="tab"
          aria-selected={activeTab === "scheduler"}
        >
          <Workflow size={16} />
          <span>1. Scheduler Pass</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("inbound")}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "inbound"
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
          role="tab"
          aria-selected={activeTab === "inbound"}
        >
          <MessageSquare size={16} />
          <span>2. Inbound SMS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("lead")}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "lead"
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
          role="tab"
          aria-selected={activeTab === "lead"}
        >
          <Send size={16} />
          <span>3. Lead Intake</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("second-brain")}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "second-brain"
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
          role="tab"
          aria-selected={activeTab === "second-brain"}
        >
          <Sparkles size={16} />
          <span>4. Second Brain RAG</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "catalog"
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
          role="tab"
          aria-selected={activeTab === "catalog"}
        >
          <Library size={16} />
          <span>5. Catalog Diagnostic</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Trigger Panel */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          {/* TAB 1: SCHEDULER TICK */}
          {activeTab === "scheduler" && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 mb-2">
                  <Clock size={12} />
                  Engine: runTick()
                </div>
                <h3 className="text-lg font-bold text-slate-900">Trigger Scheduler Tick</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Runs one sequential pass of the automation engine. Evaluates active recipes
                  (booking reminders, invoice dunning, review boosters), reads file-backed
                  suppression/idempotency stores, and dispatches actions.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="scheduler-target"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                >
                  Target Workspace
                </label>
                <select
                  id="scheduler-target"
                  value={selectedSchedulerClient}
                  onChange={(e) => setSelectedSchedulerClient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Configured Workspaces ({clients.length} Clients)</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRunScheduler}
                  disabled={isPending}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  {isPending ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Executing Scheduler Pass...</span>
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      <span>Execute Scheduler Pass Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INBOUND SMS SIMULATOR */}
          {activeTab === "inbound" && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 mb-2">
                  <Bot size={12} />
                  Engine: processInbound()
                </div>
                <h3 className="text-lg font-bold text-slate-900">Simulate Customer Inbound SMS</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Injects an inbound SMS payload into the Twilio closed-loop pipeline. Tests intent
                  classification (opt-out, confirm, reschedule, question) and generates automated
                  replies or human review drafts.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="inbound-client"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    Receiving Client Workspace
                  </label>
                  <select
                    id="inbound-client"
                    value={selectedInboundClient}
                    onChange={(e) => setSelectedInboundClient(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="inbound-phone"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    Customer Phone Number
                  </label>
                  <input
                    id="inbound-phone"
                    type="text"
                    value={inboundFromPhone}
                    onChange={(e) => setInboundFromPhone(e.target.value)}
                    placeholder="+14165550114"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="inbound-body"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    Message Body Content
                  </label>
                  <textarea
                    id="inbound-body"
                    rows={3}
                    value={inboundMessageBody}
                    onChange={(e) => setInboundMessageBody(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 self-center mr-1">Presets:</span>
                    <button
                      type="button"
                      onClick={() => setInboundMessageBody("CONFIRM")}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                    >
                      CONFIRM
                    </button>
                    <button
                      type="button"
                      onClick={() => setInboundMessageBody("RESCHEDULE")}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                    >
                      RESCHEDULE
                    </button>
                    <button
                      type="button"
                      onClick={() => setInboundMessageBody("STOP")}
                      className="px-2 py-0.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium cursor-pointer"
                    >
                      STOP (Opt-Out)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setInboundMessageBody("Can I whiten my teeth before my dental cleaning?")
                      }
                      className="px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium cursor-pointer"
                    >
                      Inquiry (Review Draft)
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRunInbound}
                  disabled={isPending || !inboundMessageBody.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  {isPending ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Ingesting Inbound Message...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare size={16} />
                      <span>Simulate Inbound SMS Message</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: LEAD CAPTURE & HONEYPOT TEST */}
          {activeTab === "lead" && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 mb-2">
                  <Shield size={12} />
                  Engine: POST /api/lead & Honeypot Filter
                </div>
                <h3 className="text-lg font-bold text-slate-900">Lead Ingestion & Security Test</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Dispatches a controlled lead payload through the capture pipeline. Supports
                  testing both genuine delivery to the HMAC relay webhook and silent honeypot
                  rejection of spam bots.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label
                      htmlFor="lead-name"
                      className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                    >
                      Contact Name
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="lead-email"
                      className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                    >
                      Work Email
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="lead-company"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    Company / Organization
                  </label>
                  <input
                    id="lead-company"
                    type="text"
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="lead-notes"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    Inquiry Notes
                  </label>
                  <textarea
                    id="lead-notes"
                    rows={2}
                    value={leadNotes}
                    onChange={(e) => setLeadNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <input
                    id="honeypot-toggle"
                    type="checkbox"
                    checked={isHoneypot}
                    onChange={(e) => setIsHoneypot(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <label
                    htmlFor="honeypot-toggle"
                    className="text-xs text-slate-700 cursor-pointer"
                  >
                    <span className="font-semibold block">Simulate Bot Honeypot Submission</span>
                    <span className="text-slate-500 block">
                      When checked, simulates a spam bot filling the hidden honeypot input,
                      verifying silent drop.
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRunLead}
                  disabled={isPending}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  {isPending ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Dispatching Test Lead...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>
                        {isHoneypot ? "Test Honeypot Bot Trap" : "Dispatch Test Lead Webhook"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SECOND BRAIN RAG QUERY */}
          {activeTab === "second-brain" && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 mb-2">
                  <Sparkles size={12} />
                  Engine: ContextRepository.searchContext()
                </div>
                <h3 className="text-lg font-bold text-slate-900">Query Second Brain Context RAG</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Queries the hierarchical canonical knowledge index. Tests ranking by domain,
                  subdomain, priority, and keyword fit across registered resources.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label
                      htmlFor="rag-domain"
                      className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                    >
                      Domain
                    </label>
                    <input
                      id="rag-domain"
                      type="text"
                      value={ragDomain}
                      onChange={(e) => setRagDomain(e.target.value)}
                      placeholder="strategy"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="rag-subdomain"
                      className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                    >
                      Subdomain
                    </label>
                    <input
                      id="rag-subdomain"
                      type="text"
                      value={ragSubdomain}
                      onChange={(e) => setRagSubdomain(e.target.value)}
                      placeholder="acquisition"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="rag-keywords"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    Keywords (comma-separated)
                  </label>
                  <input
                    id="rag-keywords"
                    type="text"
                    value={ragKeywords}
                    onChange={(e) => setRagKeywords(e.target.value)}
                    placeholder="diligence, financial, valuation"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRunSecondBrain}
                  disabled={isPending}
                  className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  {isPending ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Querying Knowledge RAG...</span>
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      <span>Execute Semantic Context Query</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: CATALOG INTEGRITY DIAGNOSTIC */}
          {activeTab === "catalog" && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 mb-2">
                  <Library size={12} />
                  Engine: getAllOfferings() Diagnostic
                </div>
                <h3 className="text-lg font-bold text-slate-900">Run Catalog Integrity Audit</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Validates all 34 canonical offerings (18 automations, 13 services, 3 newsletters).
                  Checks strict ID uniqueness, canonical URL integrity, and schema compliance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="font-semibold text-slate-800">Invariants Verified:</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>34 total canonical entities (18 automations, 13 services, 3 newsletters)</li>
                  <li>Zero duplicate slugs or canonical URLs across any catalog kind</li>
                  <li>Proper pricing structure, deliverables, and category taxonomies</li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRunCatalog}
                  disabled={isPending}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  {isPending ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Running Catalog Audit...</span>
                    </>
                  ) : (
                    <>
                      <Shield size={16} />
                      <span>Execute Catalog Integrity Diagnostic</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Telemetry Output Console */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100 flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-emerald-400" />
              <span className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
                Live Execution Telemetry
              </span>
            </div>
            {executionResult && (
              <button
                type="button"
                onClick={copyTelemetry}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 cursor-pointer font-mono px-2 py-1 rounded bg-slate-800"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? "Copied" : "Copy JSON"}</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-auto mt-4 font-mono text-xs text-slate-300">
            {isPending ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                <RefreshCw size={24} className="animate-spin text-blue-400" />
                <p>Executing workflow server action...</p>
              </div>
            ) : executionError ? (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-400">
                  <ShieldAlert size={16} />
                  <span>Execution Fault</span>
                </div>
                <p className="text-xs">{executionError}</p>
              </div>
            ) : executionResult ? (
              <div className="space-y-4">
                {/* Result Status Banner */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  <span>Workflow Execution Succeeded (200 OK)</span>
                </div>

                {/* Preformatted JSON */}
                <pre className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 overflow-x-auto text-[11px] leading-relaxed text-emerald-300/90 whitespace-pre">
                  {JSON.stringify(executionResult, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 text-center p-6">
                <PlayCircle size={32} className="text-slate-600" />
                <p className="text-slate-400 font-medium">Ready for Execution</p>
                <p className="text-[11px] max-w-xs text-slate-500">
                  Select a workflow on the left and trigger it to inspect live runtime telemetry and
                  side effects.
                </p>
              </div>
            )}
          </div>

          {executionResult && (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Timestamp: {new Date().toLocaleTimeString()}</span>
              <Link
                href="/dashboard"
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-sans"
              >
                <span>Command Center</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
