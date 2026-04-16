"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

function ShieldIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="#8B6914"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 1.5 L13.5 3.8 L13.5 8.5 Q13.5 13 8 14.8 Q2.5 13 2.5 8.5 L2.5 3.8 Z" />
      <line x1="8" y1="6" x2="8" y2="9" />
      <circle cx="8" cy="10.5" r="0.6" fill="#8B6914" />
    </svg>
  );
}

function DoneBadge({ text }: { text: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center px-2 py-0.5 text-[8px] tracking-[0.35em] uppercase"
      style={{
        border: "1px solid #B8860B",
        color: "rgba(255,255,255,0.4)",
      }}
    >
      {text}
    </motion.span>
  );
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

const TOTAL = 1500;

export default function ShieldSection({
  userTier,
  onFreeze,
}: {
  userTier: string;
  onFreeze?: () => void;
}) {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [secondsLeft, setSecondsLeft] = useState(TOTAL);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function recordFailure() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ last_failure_date: new Date().toISOString() })
        .eq("id", user.id);
    }
  }

  function startTimer() {
    setPhase("running");
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setPhase("done");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function failTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    onFreeze?.();
    await recordFailure();
  }

  return (
    <section className="w-full flex flex-col gap-6 px-6 py-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldIcon />
          <p
            className="text-[9px] tracking-[0.45em] uppercase"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Action Shield
          </p>
        </div>
        <AnimatePresence>
          {phase === "done" && <DoneBadge key="badge" text="방어 완료" />}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {phase !== "done" ? (
          <motion.div
            key="timer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-5"
          >
            <p
              className="tabular-nums font-bold leading-none tracking-tighter"
              style={{ fontSize: "clamp(3rem, 12vw, 4.5rem)", color: "#FFFFFF" }}
            >
              {pad(Math.floor(secondsLeft / 60))}:{pad(secondsLeft % 60)}
            </p>

            {phase === "idle" ? (
              <button
                onClick={startTimer}
                className="w-full py-4 text-xs font-bold tracking-[0.15em] uppercase"
                style={{ background: "#FFFFFF", color: "#000000" }}
              >
                지금부터 25분간 자산을 지킵니다
              </button>
            ) : (
              <button
                onClick={failTimer}
                className="text-[10px] tracking-widest uppercase underline underline-offset-4 transition-colors duration-200 text-left"
                style={{ color: "rgba(255,255,255,0.18)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.18)";
                }}
              >
                지금 포기하고 자산 손실을 받아들입니다
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-2 py-2"
          >
            <p className="text-sm font-bold text-white">방어에 성공했습니다.</p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              자산이 안전하게 보호되었습니다. 다음 세션을 준비하십시오.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
