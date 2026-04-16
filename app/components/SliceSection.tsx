"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function SliceIcon() {
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
      <line x1="3" y1="13" x2="13" y2="3" />
      <circle cx="3.5" cy="12.5" r="1.5" />
      <circle cx="6.5" cy="9.5" r="1.5" />
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

export default function SliceSection({ wage }: { wage: string }) {
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ action: string; contribution: string } | null>(null);

  async function handleSubmit() {
    if (!task.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/slice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, wage }),
      });
      const data = await res.json();
      if (data.action && data.contribution) setResult(data);
    } catch {
      alert("시스템 연결이 잠시 원활하지 않습니다. 다시 시도해 주십시오.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full flex flex-col gap-6 px-6 py-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SliceIcon />
          <p
            className="text-[9px] tracking-[0.45em] uppercase"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Action Slice
          </p>
        </div>
        <AnimatePresence>
          {result && <DoneBadge key="badge" text="분석 완료" />}
        </AnimatePresence>
      </div>

      <textarea
        placeholder="지금 머릿속을 복잡하게 만드는 일을 입력해 주십시오."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="w-full py-3 text-sm text-white resize-none focus:outline-none leading-relaxed placeholder:text-white/20"
        style={{
          background: "transparent",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
        rows={2}
        onFocus={(e) => {
          (e.currentTarget as HTMLTextAreaElement).style.borderBottomColor = "rgba(255,255,255,0.25)";
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLTextAreaElement).style.borderBottomColor = "rgba(255,255,255,0.08)";
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={!task.trim() || loading}
        className="w-full py-4 text-xs font-bold tracking-[0.15em] uppercase transition-opacity duration-200 disabled:opacity-25"
        style={{ background: "#FFFFFF", color: "#000000" }}
      >
        {loading ? "분석하고 있습니다..." : "행동을 쪼개 드립니다"}
      </button>

      <AnimatePresence>
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-3 pt-2"
          >
            <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <p className="text-xl font-bold text-white leading-snug tracking-tight">
              {result.action}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              {result.contribution}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
