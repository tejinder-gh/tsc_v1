"use client";

import { Bot, Clock, Send, Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import type { DraftAction } from "../../../automations/core/types";
import { approveDraft, rejectDraft } from "./actions";

export function DraftEditor({ drafts, clientId }: { drafts: DraftAction[]; clientId: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editedBody, setEditedBody] = useState("");
  const [isPending, startTransition] = useTransition();

  // If drafts change, bounds check selectedIndex
  useEffect(() => {
    if (selectedIndex >= drafts.length) {
      setSelectedIndex(Math.max(0, drafts.length - 1));
    }
  }, [drafts, selectedIndex]);

  const selectedDraft = drafts[selectedIndex];

  // When selection changes, reset the edited body
  useEffect(() => {
    if (selectedDraft) {
      setEditedBody(selectedDraft.content.body);
    }
  }, [selectedDraft]);

  const handleApprove = () => {
    if (!selectedDraft) return;
    startTransition(async () => {
      try {
        await approveDraft(clientId, selectedDraft.meta.idempotencyKey, editedBody);
        // Automatically selects the next draft since the current one is removed
        setSelectedIndex(0);
      } catch (err) {
        console.error("Failed to approve draft", err);
        alert(err instanceof Error ? err.message : String(err));
      }
    });
  };

  const handleReject = () => {
    if (!selectedDraft) return;
    startTransition(async () => {
      try {
        await rejectDraft(clientId, selectedDraft.meta.idempotencyKey);
        setSelectedIndex(0);
      } catch (err) {
        console.error("Failed to reject draft", err);
        alert(err instanceof Error ? err.message : String(err));
      }
    });
  };

  if (!selectedDraft) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-16rem)] min-h-[500px]">
      {/* Draft List Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm overflow-y-auto">
        <h3 className="font-semibold text-slate-900 px-2 pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>Needs Review</span>
          <span className="bg-blue-100 text-blue-700 text-xs py-0.5 px-2 rounded-full font-medium">
            {drafts.length}
          </span>
        </h3>
        {drafts.map((draft, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={draft.meta.idempotencyKey}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`text-left p-4 rounded-xl transition-all border ${
                isSelected
                  ? "bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-500/20"
                  : "bg-white border-transparent hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isSelected ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {draft.purpose}
                </span>
              </div>
              <p
                className={`text-sm line-clamp-2 ${isSelected ? "text-blue-900 font-medium" : "text-slate-600"}`}
              >
                {draft.content.body}
              </p>
              <div className="mt-3 flex items-center text-xs text-slate-400 gap-1.5">
                <Bot size={14} />
                <span>AI Drafted</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Editor Panel */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Review Draft</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-sm">
                To:{" "}
                <span className="font-medium text-slate-700">
                  {selectedDraft.onApproval?.to || "Unknown"}
                </span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-sm uppercase text-xs font-bold text-slate-400 tracking-wider">
                {selectedDraft.onApproval?.channel || "Unknown Channel"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col bg-slate-50/30">
          <label htmlFor="draft-body" className="text-sm font-medium text-slate-700 mb-2 block">
            Message Content
          </label>
          <textarea
            id="draft-body"
            value={editedBody}
            onChange={(e) => setEditedBody(e.target.value)}
            disabled={isPending}
            className="flex-1 w-full p-4 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-shadow text-slate-700 text-base leading-relaxed bg-white"
            placeholder="Edit the message..."
          />
        </div>

        <div className="p-5 border-t border-slate-100 bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={handleReject}
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium disabled:opacity-50"
          >
            <Trash2 size={18} />
            Discard
          </button>
          <button
            type="button"
            onClick={handleApprove}
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm shadow-blue-500/20 transition-all font-medium disabled:opacity-50 hover:shadow-md"
          >
            {isPending ? <Clock size={18} className="animate-spin" /> : <Send size={18} />}
            Approve & Send
          </button>
        </div>
      </div>
    </div>
  );
}
