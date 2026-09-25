"use client";

import { Activity, CheckCircle2, Pause, Play, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function LiveSystemExample() {
  const [activeTab, setActiveTab] = useState<"trace" | "sms">("trace");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [traceStep, setTraceStep] = useState<1 | 2 | 3>(3);
  const [isSimulatingTrace, setIsSimulatingTrace] = useState(false);
  const [smsRescheduled, setSmsRescheduled] = useState(false);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Playback timer & simulated speech/audio
  useEffect(() => {
    if (isPlayingAudio) {
      const stepDuration = 100;
      const totalSteps = 100; // 10 seconds total (100 * 100ms)
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 1) {
            setIsPlayingAudio(false);
            if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
            return 1;
          }
          return prev + 1 / totalSteps;
        });
      }, stepDuration);
    } else {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    }

    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isPlayingAudio]);

  const toggleAudio = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      if (audioProgress >= 1) {
        setAudioProgress(0);
      }
      setIsPlayingAudio(true);

      // Play authentic synthesized voice if supported
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          "Table for four around 8:30 tonight — do you have anything?",
        );
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onend = () => {
          setIsPlayingAudio(false);
          setAudioProgress(1);
        };
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const runTraceSimulation = () => {
    if (isSimulatingTrace) return;
    setIsSimulatingTrace(true);
    setTraceStep(1);

    setTimeout(() => {
      setTraceStep(2);
    }, 1200);

    setTimeout(() => {
      setTraceStep(3);
      setIsSimulatingTrace(false);
    }, 2400);
  };

  const WAVEFORM_BARS = [
    30, 65, 45, 85, 100, 70, 50, 90, 80, 40, 75, 95, 60, 35, 80, 95, 55, 40, 70, 85, 50, 30,
  ].map((height, idx) => ({ id: `wave-node-${idx}`, height, index: idx }));

  return (
    <div className="w-full font-geist">
      {/* Observed System Artifact: Deliberately art-directed console */}
      <div className="rounded-[8px] border border-white/10 bg-[var(--tsc-ink)] text-white p-5 sm:p-6 lg:p-7 shadow-[0_16px_40px_rgba(18,19,15,0.22)] transition-all duration-300">
        {/* Terminal / System Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono tracking-wider text-white/50 uppercase">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full bg-[var(--tsc-signal)] ring-4 ring-[var(--tsc-signal)]/20 animate-pulse"
              aria-hidden="true"
            />
            <span className="font-semibold text-white tracking-widest text-[11px]">
              OBSERVED SYSTEM
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-[6px] border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab("trace")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[10px] font-mono tracking-wider uppercase transition-colors ${
                activeTab === "trace"
                  ? "bg-white/15 text-white font-semibold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Activity className="h-3 w-3" strokeWidth={1.7} />
              Trace
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sms")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[10px] font-mono tracking-wider uppercase transition-colors ${
                activeTab === "sms"
                  ? "bg-white/15 text-white font-semibold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Smartphone className="h-3 w-3" strokeWidth={1.7} />
              Customer SMS
            </button>
          </div>
        </div>

        {/* Narrative Headline */}
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <div className="text-[19px] sm:text-[21px] lg:text-[22px] font-medium leading-[1.25] tracking-tight text-white">
            A missed call becomes
            <br className="hidden sm:inline" /> a confirmed table.
          </div>
          {activeTab === "trace" && (
            <button
              type="button"
              onClick={runTraceSimulation}
              disabled={isSimulatingTrace}
              className="shrink-0 text-[10px] font-mono uppercase tracking-wider text-white/60 hover:text-[var(--tsc-signal)] transition-colors border border-white/15 px-2 py-1 rounded-[4px] hover:border-[var(--tsc-signal)]/40 disabled:opacity-50"
            >
              {isSimulatingTrace ? "Simulating…" : "Replay Trace"}
            </button>
          )}
        </div>

        {activeTab === "trace" ? (
          /* Event Timeline / Stream */
          <div className="mt-5 space-y-3 font-geist">
            {/* Step 1: Ingest with Audio Player */}
            <div
              className={`rounded-[8px] border transition-all duration-300 p-3.5 ${
                traceStep >= 1
                  ? "border-white/15 bg-white/5"
                  : "border-white/5 bg-white/[0.02] opacity-40"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-white/50 uppercase">
                <span>19:42:03 &middot; INCOMING CALL</span>
                <span className="text-[var(--tsc-signal)] font-semibold">VOICE INTAKE</span>
              </div>

              <div className="mt-2 text-xs sm:text-[13px] font-mono text-white/95 leading-relaxed italic">
                &ldquo;Table for four around 8:30 — do you have anything?&rdquo;
              </div>

              {/* Tactile Audio Player Bar */}
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleAudio}
                  aria-label={isPlayingAudio ? "Pause sample call audio" : "Play sample call audio"}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--tsc-signal)] text-[var(--tsc-ink)] transition-transform hover:scale-105 active:scale-95 shadow-[0_2px_8px_rgba(213,255,82,0.3)]"
                >
                  {isPlayingAudio ? (
                    <Pause className="h-3.5 w-3.5 fill-current" strokeWidth={1.7} />
                  ) : (
                    <Play className="h-3.5 w-3.5 fill-current ml-0.5" strokeWidth={1.7} />
                  )}
                </button>

                {/* Animated Waveform Visualizer */}
                <div className="flex-1 flex items-center gap-[2px] h-5 overflow-hidden">
                  {WAVEFORM_BARS.map((bar) => {
                    const isPassed = audioProgress >= bar.index / WAVEFORM_BARS.length;
                    const animatedHeight = isPlayingAudio
                      ? Math.max(
                          15,
                          bar.height *
                            ((bar.index % 3) + 1) *
                            (0.4 + Math.sin(audioProgress * 20 + bar.index) * 0.4),
                        )
                      : isPassed
                        ? bar.height
                        : 25;

                    return (
                      <span
                        key={bar.id}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isPassed || isPlayingAudio ? "bg-[var(--tsc-signal)]" : "bg-white/20"
                        }`}
                        style={{ height: `${Math.min(100, animatedHeight)}%` }}
                      />
                    );
                  })}
                </div>

                <span className="text-[10px] font-mono text-white/60 tracking-wider">
                  {isPlayingAudio ? "PLAYING" : "AUDIO DEMO"}
                </span>
              </div>
            </div>

            {/* Transition Annotation */}
            <div className="pl-3 border-l border-white/15 py-1 text-[11px] font-mono text-white/60 space-y-0.5">
              <div className="flex items-center gap-2">
                <span
                  className={`transition-colors font-bold ${
                    traceStep >= 2 ? "text-[var(--tsc-signal)]" : "text-white/30"
                  }`}
                >
                  &darr;
                </span>
                <span
                  className={`tracking-tight transition-colors ${
                    traceStep >= 2 ? "text-white/80" : "text-white/30"
                  }`}
                >
                  19:42:07 &middot; intent recognized &middot; availability checked
                </span>
              </div>
            </div>

            {/* Step 2: Action Executed */}
            <div
              className={`rounded-[8px] border transition-all duration-300 p-3.5 ${
                traceStep >= 3
                  ? "border-white/15 bg-white/5"
                  : "border-white/5 bg-white/[0.02] opacity-40"
              }`}
            >
              <div className="text-[10px] font-mono tracking-wider text-white/50 uppercase flex items-center justify-between">
                <span>19:42:11 &middot; ACTION EXECUTION</span>
                <span
                  className={`text-[9px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-[4px] border transition-all duration-300 ${
                    traceStep >= 3
                      ? "text-[var(--tsc-signal)] border-[var(--tsc-signal)]/40 bg-[var(--tsc-signal)]/10 shadow-[0_0_12px_rgba(213,255,82,0.15)]"
                      : "text-white/40 border-white/10"
                  }`}
                >
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
        ) : (
          /* Customer Device SMS View */
          <div className="mt-5 space-y-3 font-geist">
            <div className="rounded-[8px] border border-white/15 bg-black/40 p-4 space-y-3.5">
              {/* Phone Status Header */}
              <div className="flex items-center justify-between text-[10px] font-mono text-white/50 border-b border-white/10 pb-2">
                <span>MESSAGES</span>
                <span className="text-white/80 font-medium">La Trattoria Mississauga</span>
                <span>19:42</span>
              </div>

              {/* Incoming System SMS */}
              <div className="space-y-1">
                <div className="max-w-[85%] rounded-[8px] rounded-tl-sm bg-white/10 p-3 text-xs sm:text-[13px] text-white/95 leading-relaxed border border-white/10">
                  <p>
                    Hi Michael! Your reservation for{" "}
                    <strong className="text-[var(--tsc-signal)]">4 guests</strong> at La Trattoria
                    is confirmed for tonight at{" "}
                    <strong className="text-[var(--tsc-signal)]">8:30 PM</strong>.
                  </p>
                  <p className="mt-1.5 text-[11px] text-white/70">
                    Reply 1 to modify, or reply 9 to cancel.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/50 pl-1">
                  <CheckCircle2
                    className="h-2.5 w-2.5 text-[var(--tsc-signal)]"
                    strokeWidth={1.7}
                  />
                  <span>Delivered via Automated SMS Gateway &middot; 11s after call</span>
                </div>
              </div>

              {/* Simulated Customer Reply Interactive Toggle */}
              {smsRescheduled && (
                <>
                  <div className="flex justify-end">
                    <div className="max-w-[75%] rounded-[8px] rounded-tr-sm bg-[var(--tsc-action)] p-2.5 text-xs text-white leading-relaxed">
                      Can we make it 5 people instead?
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="max-w-[85%] rounded-[8px] rounded-tl-sm bg-white/10 p-3 text-xs text-white/95 leading-relaxed border border-white/10">
                      <p>
                        Table updated! We&apos;ve adjusted your reservation to{" "}
                        <strong className="text-[var(--tsc-signal)]">5 guests</strong> at 8:30 PM.
                        Floor manager alerted to add an extra setting.
                      </p>
                    </div>
                    <div className="text-[9px] font-mono text-white/50 pl-1">
                      Auto-handled &middot; No host intervention required
                    </div>
                  </div>
                </>
              )}

              {/* Interactive SMS Action Button */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
                  Interactive Simulator
                </span>
                <button
                  type="button"
                  onClick={() => setSmsRescheduled(!smsRescheduled)}
                  className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-[4px] border border-white/20 hover:border-[var(--tsc-signal)] text-white hover:text-[var(--tsc-signal)] transition-colors"
                >
                  {smsRescheduled ? "Reset Thread" : "Simulate Guest Reschedule →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 font-mono">
          <div>
            <div className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-baseline gap-1.5">
              <span>11</span>
              <span className="text-sm font-normal text-white/70">sec</span>
            </div>
            <div className="mt-0.5 text-[10px] tracking-wider text-white/50 uppercase">
              CALL &rarr; CONFIRMATION
            </div>
          </div>
          <div>
            <div className="text-xl lg:text-2xl font-bold tracking-tight text-[var(--tsc-signal)]">
              0
            </div>
            <div className="mt-0.5 text-[10px] tracking-wider text-white/50 uppercase">
              STAFF INTERRUPTIONS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
