"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CONDITIONS = ["피곤합니다", "보통입니다", "좋습니다"] as const;
type Condition = (typeof CONDITIONS)[number];

const ACTIONS: Record<Condition, string> = {
  피곤합니다: "오늘 1분 행동: 커피 한 모금 마시고 노션 1분만 열어둡니다.",
  보통입니다:  "오늘 2분 행동: 노션 첫 문장을 작성합니다.",
  좋습니다:    "오늘 3분 행동: 오늘 할 일의 순서를 정합니다.",
};

function CheckIcon() {
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
      <circle cx="8" cy="8" r="6" />
      <line x1="8" y1="5" x2="8" y2="8.2" />
      <line x1="8" y1="8.2" x2="10.2" y2="10.4" />
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

export default function MorningRitual() {
  const [selected, setSelected] = useState<Condition | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(Math.floor(Math.random() * 51) + 300);
  }, []);

  return (
    <section className="w-full flex flex-col gap-6 px-6 py-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckIcon />
          <p
            className="text-[9px] tracking-[0.45em] uppercase"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Morning Check
          </p>
        </div>
        <AnimatePresence>
          {selected && <DoneBadge key="badge" text="체크 완료" />}
        </AnimatePresence>
      </div>

      <p className="text-sm text-white leading-relaxed">
        오늘의 몸 상태는 어떠십니까?
      </p>

      <div className="flex gap-2">
        {CONDITIONS.map((c) => {
          const active = selected === c;
          return (
            <button
              key={c}
              onClick={() => setSelected(c)}
              className="flex-1 py-3 text-xs font-medium tracking-wide transition-all duration-200"
              style={{
                background: active ? "#FFFFFF" : "transparent",
                color: active ? "#000000" : "rgba(255,255,255,0.35)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.25)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                }
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-3 pt-1"
          >
            <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <p className="text-sm text-white leading-relaxed">{ACTIONS[selected]}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <p
        className="text-[9px] tracking-widest uppercase"
        style={{ color: "rgba(255,255,255,0.1)" }}
      >
        현재 {count}명이 행동을 시작했습니다.
      </p>
    </section>
  );
}
