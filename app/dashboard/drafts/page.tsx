import { getPendingDrafts } from "./actions";
import { DraftEditor } from "./draft-editor";

// Defaulting to "brightsmile-dental" for demo purposes as it has drafts.
const DEMO_CLIENT_ID = "brightsmile-dental";

export const metadata = {
  title: "Drafts | TheSkillCorner",
};

export default async function DraftsPage() {
  const drafts = await getPendingDrafts(DEMO_CLIENT_ID);

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Pending Drafts</h1>
        <p className="text-slate-500">
          Review and approve AI-drafted messages before they are sent to customers.
        </p>
      </div>

      {drafts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm max-w-2xl mx-auto w-full mt-12">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m9 11 3 3L22 4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Inbox Zero</h3>
          <p className="text-slate-500">All drafts have been reviewed and processed.</p>
        </div>
      ) : (
        <DraftEditor drafts={drafts} clientId={DEMO_CLIENT_ID} />
      )}
    </div>
  );
}
