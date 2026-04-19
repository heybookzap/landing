"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function SliceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#C2A35D" strokeWidth={1.2}>
      <line x1="3" y1="13" x2="13" y2="3" />
      <circle cx="3.5" cy="12.5" r="1.5" />
      <circle cx="6.5" cy="9.5" r="1.5" />
    </svg>
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
      const res = await fetch("/api", { // 📌 엔드포인트 경로 수정
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
    <section className="w-full flex flex-col gap-6 px-8 py-10 bg-[#080808] border border-zinc-900 rounded-[32px] font-pretendard">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SliceIcon />
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C2A35D] font-bold font-serif italic">
            Action Slice
          </p>
        </div>
        <AnimatePresence>
          {result && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] text-zinc-600 tracking-widest uppercase">
              분석 완료
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2 text-left">
        <h3 className="text-lg font-light text-white tracking-tight">지금 머릿속을 복잡하게 만드는 일은 무엇입니까?</h3>
        <textarea
          placeholder="여기에 입력하십시오."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full py-4 text-md text-zinc-100 bg-transparent border-b border-zinc-900 focus:border-[#C2A35D] outline-none transition-colors resize-none placeholder:text-zinc-800"
          rows={1}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!task.trim() || loading}
        className="w-full py-6 bg-white text-black text-[12px] font-bold tracking-[0.2em] uppercase rounded-xl hover:bg-[#C2A35D] transition-all duration-500 disabled:opacity-10"
      >
        {loading ? "분석 중..." : "행동 쪼개기"}
      </button>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-8 border-t border-zinc-900 space-y-4"
          >
            <p className="text-[#C2A35D] text-[10px] tracking-widest font-bold uppercase italic font-serif">Today&apos;s 2-Min Action</p>
            <p className="text-2xl font-bold text-white leading-tight tracking-tight break-keep">
              {result.action}
            </p>
            <p className="text-zinc-500 text-sm font-light leading-relaxed border-l border-zinc-800 pl-6">
              {result.contribution}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
