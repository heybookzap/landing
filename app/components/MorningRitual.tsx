"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CONDITIONS = ["피곤함", "보통", "아주 좋음"] as const;
type Condition = (typeof CONDITIONS)[number];

// 📌 가짜 과업을 제거하고, 시스템의 지침 체계로 카피를 정제했습니다.
const DIRECTIVES: Record<Condition, string> = {
  "피곤함": "시스템이 하향 조정한 '1분 수동 과업'만 완수하십시오. 그 외의 모든 결정은 금지됩니다.",
  "보통": "배정된 '2분 핵심 과업'을 즉시 실행하십시오. 현재 뇌 리소스는 표준 상태입니다.",
  "아주 좋음": "최상위 전략 과업을 처리할 적기입니다. 시스템이 제안하는 3분 딥워크에 진입하십시오.",
};

function SyncIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#C2A35D" strokeWidth={1.2}>
      <circle cx="8" cy="8" r="6" strokeDasharray="2 2" />
      <path d="M8 4v4l2 2" strokeLinecap="round" />
    </svg>
  );
}

export default function MorningRitual() {
  const [selected, setSelected] = useState<Condition | null>(null);

  return (
    <section className="w-full flex flex-col gap-8 px-8 py-10 bg-[#080808] border border-zinc-900 rounded-[32px] font-pretendard">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SyncIcon />
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C2A35D] font-bold font-serif italic">
            Cognitive Sync
          </p>
        </div>
        {selected && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] text-zinc-600 tracking-widest uppercase">
            동기화 완료
          </motion.span>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-light text-white tracking-tight">오늘의 뇌 컨디션을 선택해 주십시오.</h3>
        <p className="text-zinc-600 text-xs font-light">상태에 따라 최적의 인지 부하가 배정됩니다.</p>
      </div>

      <div className="flex gap-3">
        {CONDITIONS.map((c) => {
          const active = selected === c;
          return (
            <button
              key={c}
              onClick={() => setSelected(c)}
              className="flex-1 py-4 text-[11px] font-bold tracking-widest transition-all duration-500 rounded-xl border uppercase"
              style={{
                background: active ? "#C2A35D" : "transparent",
                color: active ? "#000" : "#555",
                borderColor: active ? "#C2A35D" : "#1A1A1A",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-6 border-t border-zinc-900 space-y-4"
          >
            <p className="text-[#C2A35D] text-[10px] tracking-widest font-bold uppercase">Today&apos;s Directive</p>
            <p className="text-md text-zinc-200 leading-relaxed font-light break-keep">
              {DIRECTIVES[selected]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 pt-2">
        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
        <p className="text-[9px] tracking-widest text-zinc-800 uppercase font-medium">
          Authorized Sessions Active
        </p>
      </div>
    </section>
  );
}
