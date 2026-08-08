"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock, HeartHandshake, MessageSquare, RefreshCw, Workflow, Zap } from "lucide-react";
import { useState, useTransition } from "react";
import { toggleFlow } from "./actions";

type ClientData = {
  id: string;
  name: string;
  automations: { id: string; recipe: string; enabled: boolean; config?: unknown }[];
};

// Map automation recipes to specific icons and colors for more visual flair
function getRecipeDetails(recipe: string) {
  switch (recipe) {
    case "booking-reminders":
      return {
        icon: Clock,
        color: "from-blue-500 to-cyan-500",
        bg: "bg-blue-50",
        text: "text-blue-600",
      };
    case "review-booster":
      return {
        icon: MessageSquare,
        color: "from-amber-400 to-orange-500",
        bg: "bg-amber-50",
        text: "text-amber-600",
      };
    case "no-show-rebook":
      return {
        icon: Zap,
        color: "from-purple-500 to-fuchsia-500",
        bg: "bg-purple-50",
        text: "text-purple-600",
      };
    case "win-back":
      return {
        icon: HeartHandshake,
        color: "from-emerald-400 to-teal-500",
        bg: "bg-emerald-50",
        text: "text-emerald-600",
      };
    default:
      return {
        icon: Workflow,
        color: "from-slate-400 to-slate-500",
        bg: "bg-slate-50",
        text: "text-slate-600",
      };
  }
}

export function FlowList({ clients }: { clients: ClientData[] }) {
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || "");
  const [isPending, startTransition] = useTransition();

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const handleToggle = (automationId: string, currentState: boolean) => {
    startTransition(async () => {
      try {
        await toggleFlow(selectedClientId, automationId, !currentState);
      } catch (err) {
        console.error("Failed to toggle flow", err);
        alert("Failed to save changes.");
      }
    });
  };

  if (!selectedClient) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Client Selector Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-72 flex flex-col gap-3"
      >
        <div className="px-2 mb-2">
          <h3 className="font-bold text-slate-900 text-sm tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-500 to-slate-400">
            Workspaces
          </h3>
        </div>
        {clients.map((client) => {
          const isSelected = client.id === selectedClientId;
          return (
            <motion.button
              key={client.id}
              onClick={() => setSelectedClientId(client.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative text-left px-5 py-4 rounded-2xl transition-all font-medium overflow-hidden ${
                isSelected
                  ? "bg-white shadow-lg shadow-blue-500/10 text-slate-900 ring-1 ring-slate-200/50"
                  : "bg-transparent text-slate-500 hover:bg-white/60 hover:text-slate-700"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="active-client-bg"
                  className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-transparent z-0"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative z-10 flex items-center justify-between">
                <span>{client.name}</span>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                )}
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Flows Panel */}
      <motion.div
        key={selectedClientId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-1 bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 lg:p-10 relative overflow-hidden"
      >
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100/60 relative z-10">
          <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              {selectedClient.name}
            </h2>
            <p className="text-slate-500 mt-1.5 font-medium">
              Configure active recipes for this workspace.
            </p>
          </div>
          {isPending && (
            <motion.div
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              className="bg-white p-2 rounded-full shadow-sm border border-slate-100"
            >
              <RefreshCw size={20} className="text-blue-500 animate-spin" />
            </motion.div>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 relative z-10">
          <AnimatePresence mode="popLayout">
            {selectedClient.automations.map((auto, idx) => {
              const details = getRecipeDetails(auto.recipe);
              const Icon = details.icon;

              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={auto.id}
                  className={`group relative p-6 rounded-3xl border transition-all duration-300 ${
                    auto.enabled
                      ? "border-transparent bg-white shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/60"
                      : "border-slate-200/60 bg-slate-50/50 opacity-80 grayscale-[20%]"
                  }`}
                >
                  {/* Active state gradient border effect */}
                  {auto.enabled && (
                    <div
                      className={`absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br ${details.color} opacity-20 -z-10`}
                    />
                  )}

                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3.5 rounded-2xl transition-colors duration-300 ${auto.enabled ? `${details.bg} ${details.text}` : "bg-slate-200/80 text-slate-500"}`}
                      >
                        <Icon size={22} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3
                          className={`font-bold text-lg tracking-tight transition-colors ${auto.enabled ? "text-slate-900" : "text-slate-600"}`}
                        >
                          {auto.id.charAt(0).toUpperCase() + auto.id.slice(1).replace("-", " ")}
                        </h3>
                        <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
                          {auto.recipe}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100/80">
                    <span
                      className={`text-sm font-semibold transition-colors ${auto.enabled ? details.text : "text-slate-400"}`}
                    >
                      {auto.enabled ? "Active" : "Disabled"}
                    </span>

                    {/* Custom Animated Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggle(auto.id, auto.enabled)}
                      disabled={isPending}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                        auto.enabled ? "bg-slate-800" : "bg-slate-200"
                      }`}
                    >
                      <motion.span
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm ${
                          auto.enabled ? "translate-x-[22px]" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
