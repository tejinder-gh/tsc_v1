"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";

export interface NewsletterSubscribeFormProps {
  newsletterSlug: string;
  buttonLabel?: string;
  placeholder?: string;
  sourceContext?: string;
}

export function NewsletterSubscribeForm({
  newsletterSlug,
  buttonLabel = "Subscribe",
  placeholder = "Enter your work email...",
  sourceContext = "newsletter-page",
}: NewsletterSubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [botField, setBotField] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email?.includes("@")) {
      setErrorMessage("Please provide a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newsletterSlug,
          sourceContext,
          botField, // Honeypot
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Subscription request failed.");
      }

      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 p-4 rounded-[6px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-xs font-mono">
        <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[var(--tsc-positive)]" />
        <div>
          <p className="font-semibold text-sm text-[var(--tsc-ink)]">You are subscribed.</p>
          <p className="text-xs text-[var(--tsc-muted)] mt-0.5">
            The next edition will arrive directly in your inbox.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 font-geist">
      {/* Honeypot field */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="botField"
          value={botField}
          onChange={(e) => setBotField(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-white px-3.5 py-2.5 rounded-[6px] border border-[var(--tsc-line-strong)] text-[var(--tsc-ink)] text-sm placeholder-[var(--tsc-muted)] focus:outline-none focus:border-[var(--tsc-ink)] focus:ring-1 focus:ring-[var(--tsc-ink)]"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[6px] bg-[var(--tsc-ink)] hover:opacity-90 text-[var(--tsc-paper)] text-xs font-mono font-medium transition-all disabled:opacity-50 select-none cursor-pointer"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Joining...</span>
            </>
          ) : (
            <>
              <span>{buttonLabel}</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {status === "error" && <p className="text-xs font-mono text-red-600">{errorMessage}</p>}
      <p className="text-[11px] font-mono text-[var(--tsc-muted)]">
        No spam, ever. Unsubscribe anytime with one click.
      </p>
    </form>
  );
}
