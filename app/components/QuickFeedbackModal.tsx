"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  isOpen: boolean;
  missionTitle: string;
  onSubmit: (score: number) => void;
  onClose: () => void;
};

const LEVELS = [
  { score: 1, label: "전혀 없음", sub: "완전 기계적 실행" },
  { score: 2, label: "약간", sub: "가볍게 집중" },
  { score: 3, label: "보통", sub: "평균적 소모" },
  { score: 4, label: "무거움", sub: "뇌를 꽤 썼음" },
  { score: 5, label: "극심함", sub: "에너지 소진" },
] as const;

const SCORE_STYLES: Record<number, { idle: string; active: string; bar: string }> = {
  1: {
    idle: "border-zinc-800 text-zinc-500 hover:border-emerald-500/50 hover:text-emerald-400",
    active: "border-emerald-500/60 bg-emerald-500/8 text-emerald-400",
    bar: "bg-emerald-500",
  },
  2: {
    idle: "border-zinc-800 text-zinc-500 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]",
    active: "border-[#D4AF37]/60 bg-[#D4AF37]/8 text-[#D4AF37]",
    bar: "bg-[#D4AF37]",
  },
  3: {
    idle: "border-zinc-800 text-zinc-500 hover:border-zinc-500/60 hover:text-zinc-300",
    active: "border-zinc-500/60 bg-zinc-800/40 text-zinc-200",
    bar: "bg-zinc-400",
  },
  4: {
    idle: "border-zinc-800 text-zinc-500 hover:border-orange-500/50 hover:text-orange-400",
    active: "border-orange-500/60 bg-orange-500/8 text-orange-400",
    bar: "bg-orange-500",
  },
  5: {
    idle: "border-zinc-800 text-zinc-500 hover:border-red-500/50 hover:text-red-400",
    active: "border-red-500/60 bg-red-500/8 text-red-400",
    bar: "bg-red-500",
  },
};

export default function QuickFeedbackModal({ isOpen, missionTitle, onSubmit, onClose }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (score: number) => {
    if (submitted) return;
    setSelected(score);
    setSubmitted(true);
    setTimeout(() => {
      onSubmit(score);
      setSelected(null);
      setSubmitted(false);
    }, 900);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-4 sm:p-6"
          onClick={(e) => { if (e.target === e.currentTarget && !submitted) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="w-full max-w-md bg-[#0f0f0f] border border-zinc-800 rounded-[28px] overflow-hidden shadow-2xl"
          >
            <div className="h-[2px] w-full bg-[#D4AF37]/30" />

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="question"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-7 flex flex-col gap-7"
                >
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-bold tracking-[0.35em] text-[#D4AF37]/60 uppercase">
                      Mission Complete
                    </p>
                    <p className="text-xs text-zinc-600 font-medium leading-snug line-clamp-2">
                      {missionTitle}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h2 className="text-base font-black text-zinc-100 leading-snug tracking-tight">
                      방금 완료한 과업의<br />인지적 피로도는 어땠나요?
                    </h2>
                    <p className="text-[11px] text-zinc-600">
                      시스템이 다음 미션 강도를 자동 조정합니다.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {LEVELS.map(({ score, label, sub }) => {
                      const styles = SCORE_STYLES[score];
                      return (
                        <button
                          key={score}
                          onClick={() => handleSelect(score)}
                          className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all duration-200 ${
                            selected === score ? styles.active : styles.idle
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1.5 w-full px-1">
                            <div className="flex items-end gap-[2px] h-5">
                              {Array.from({ length: 5 }, (_, i) => (
                                <div
                                  key={i}
                                  className={`w-[3px] rounded-full transition-all ${
                                    i < score ? styles.bar : "bg-zinc-800"
                                  }`}
                                  style={{ height: `${40 + i * 12}%` }}
                                />
                              ))}
                            </div>
                            <span className="text-base font-black leading-none">{score}</span>
                          </div>
                          <span className="text-[9px] font-bold tracking-wide text-center leading-tight">
                            {label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[10px] text-zinc-700 text-center">
                    탭하면 즉시 기록됩니다. 생각할 필요 없습니다.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 flex flex-col items-center gap-4 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-black text-zinc-100">기록되었습니다.</p>
                    <p className="text-[11px] text-zinc-600">
                      시스템이 다음 배정에 반영합니다.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
