import Link from "next/link";
import { demoClients } from "@/automations/clients";
import { getPendingDrafts } from "./actions";
import { DraftEditor } from "./draft-editor";

export const metadata = {
  title: "Pending Drafts Review Queue | TheSkillCorner",
};

interface DraftsPageProps {
  searchParams?: Promise<{ client?: string }>;
}

export default async function DraftsPage({ searchParams }: DraftsPageProps) {
  const params = await searchParams;
  const requestedClient = params?.client;

  const validClients = demoClients.map((c) => ({
    id: c.config.id,
    name: c.config.business.name,
  }));

  const activeClient = validClients.find((c) => c.id === requestedClient) || validClients[0];

  const drafts = await getPendingDrafts(activeClient.id);

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
          Pending AI Review Queue
        </h1>
        <p className="text-sm text-slate-500">
          Review, edit, and approve AI-drafted messages before they are dispatched to customers.
        </p>
      </div>

      {/* Workspace Selector Tabs */}
      <div
        className="flex border-b border-slate-200 gap-2 overflow-x-auto"
        role="tablist"
        aria-label="Client Workspace Selector"
      >
        {validClients.map((client) => {
          const isSelected = client.id === activeClient.id;
          return (
            <Link
              key={client.id}
              href={`/dashboard/drafts?client=${client.id}`}
              role="tab"
              aria-selected={isSelected}
              className={`py-2.5 px-4 text-sm font-semibold rounded-t-xl border-b-2 transition-colors whitespace-nowrap ${
                isSelected
                  ? "border-[var(--tsc-ink)] text-[var(--tsc-ink)] bg-[var(--tsc-surface)]"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>{client.name}</span>
            </Link>
          );
        })}
      </div>

      {drafts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs max-w-2xl mx-auto w-full my-8">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              role="img"
              aria-labelledby="inbox-zero-icon-title"
            >
              <title id="inbox-zero-icon-title">All drafts reviewed for this workspace</title>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m9 11 3 3L22 4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Inbox Zero ({activeClient.name})
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            All AI-drafted messages for {activeClient.name} have been reviewed and processed.
          </p>
        </div>
      ) : (
        <DraftEditor drafts={drafts} clientId={activeClient.id} />
      )}
    </div>
  );
}
