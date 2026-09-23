"use client";

export function LiveSystemExample() {
  return (
    <div className="w-full font-geist">
      {/* Observed System Artifact: Deliberately art-directed console */}
      <div className="rounded-[14px] border border-white/10 bg-[var(--tsc-ink)] text-white p-5 sm:p-6 lg:p-7 shadow-[0_12px_32px_rgba(18,19,15,0.18)]">
        {/* Terminal / System Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono tracking-wider text-white/50 uppercase">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full bg-[var(--tsc-signal)] ring-4 ring-[var(--tsc-signal)]/20"
              aria-hidden="true"
            />
            <span className="font-semibold text-white tracking-widest text-[11px]">
              OBSERVED SYSTEM
            </span>
          </div>
          <div className="text-[11px] text-white/60">RESTAURANT / 19:42</div>
        </div>

        {/* Narrative Headline */}
        <div className="mt-4 text-[19px] sm:text-[21px] lg:text-[22px] font-medium leading-[1.25] tracking-tight text-white">
          A missed call becomes
          <br className="hidden sm:inline" /> a confirmed table.
        </div>

        {/* Event Timeline / Stream */}
        <div className="mt-5 space-y-3 font-geist">
          {/* Step 1: Ingest */}
          <div className="rounded-[6px] border border-white/10 bg-white/5 p-3.5">
            <div className="text-[10px] font-mono tracking-wider text-white/40 uppercase">
              19:42:03 &middot; INCOMING CALL
            </div>
            <div className="mt-1.5 text-xs sm:text-[13px] font-mono text-white/90 leading-relaxed italic">
              &ldquo;Table for four around 8:30 — do you have anything?&rdquo;
            </div>
          </div>

          {/* Transition Annotation */}
          <div className="pl-3 border-l border-white/15 py-1 text-[11px] font-mono text-white/60 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--tsc-signal)] font-bold">&darr;</span>
              <span className="tracking-tight text-white/70">
                19:42:07 &middot; intent recognized &middot; availability checked
              </span>
            </div>
          </div>

          {/* Step 2: Action Executed */}
          <div className="rounded-[6px] border border-white/10 bg-white/5 p-3.5">
            <div className="text-[10px] font-mono tracking-wider text-white/40 uppercase flex items-center justify-between">
              <span>19:42:11 &middot; ACTION EXECUTION</span>
              <span className="text-[9px] text-[var(--tsc-signal)] font-semibold uppercase tracking-widest border border-[var(--tsc-signal)]/30 px-1.5 py-0.5 rounded">
                COMMITTED
              </span>
            </div>
            <div className="mt-1.5 text-xs sm:text-[13px] font-medium text-white/95 leading-relaxed">
              Reservation created for 4 at 8:30 PM.
              <br />
              <span className="text-xs font-normal text-white/60 font-mono">
                SMS confirmation dispatched to guest.
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 font-mono">
          <div>
            <div className="text-xl lg:text-2xl font-bold tracking-tight text-white">11 sec</div>
            <div className="mt-0.5 text-[10px] tracking-wider text-white/50 uppercase">
              CALL &rarr; BOOKING
            </div>
          </div>
          <div>
            <div className="text-xl lg:text-2xl font-bold tracking-tight text-white">0</div>
            <div className="mt-0.5 text-[10px] tracking-wider text-white/50 uppercase">
              STAFF INTERRUPTIONS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
