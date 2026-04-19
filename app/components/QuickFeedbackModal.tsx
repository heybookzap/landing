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
  { score: 1, label: "가벼움", sub: "기계적 실행" },
  { score: 2, label: "보통", sub: "약간 집중" },
  { score: 3, label: "몰입", sub: "평균적 소모" },
  { score: 4, label: "무거움", sub: "뇌 리소스 소모" },
  { score: 5, label: "한계", sub: "에너지 소진" },
] as const;

// 📌 브랜드 시그니처 골드(#C2A35D)를 마스터 컬러로 적용
const SCORE_STYLES: Record<number, { idle: string; active: string; bar: string }> = {
  1: { idle: "border-zinc-900 text-zinc-600", active: "border-[#C2A35D] bg-[#C2A35D]/5 text-[#C2A35D]", bar: "bg-zinc-600" },
  2: { idle: "border-zinc-900 text-zinc-600", active: "border-[#C2A35D] bg-[#C2A35D]/5 text-[#C2A35D]", bar: "bg-[#C2A35D]/40" },
  3: { idle: "border-zinc-900 text-zinc-600", active: "border-[#C2A35D] bg-[#C2A35D]/10 text-[#C2A35D]", bar: "bg-[#C2A35D]" },
  4: { idle: "border-zinc-900 text-zinc-600", active: "border-orange-500/50 bg-orange-500/5 text-orange-400", bar: "bg-orange-500" },
  5: { idle: "border-zinc-900 text-zinc-600", active: "border-red-500/50 bg-red-500/5 text-red-400", bar: "bg-red-500" },
};

export default function QuickFeedbackModal({ isOpen, missionTitle, onSubmit, onClose }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (score: number) => {
    if (submitted) return;
    setSelected(score);
    setSubmitted(true);
    // 📌 유저가 결과를 인지할 수 있도록 짧은 딜레이 후 콜백 실행
    setTimeout(() => {
      onSubmit(score);
      setSelected(null);
      setSubmitted(false);
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={(e) => { if (e.target === e.currentTarget && !submitted) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm bg-[#080808] border border-zinc-900 rounded-[32px] overflow-hidden shadow-2xl font-pretendard"
          >
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#C2A35D]/50 to-transparent" />

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div key="question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 space-y-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold tracking-[0.4em] text-[#C2A35D] uppercase font-serif italic">Mission Report</p>
                    <h2 className="text-xl font-light text-white leading-tight tracking-tight break-keep">
                      방금 하신 일은 <br /><span className="text-[#C2A35D] font-bold">얼마나 머리를 쓰셨나요?</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {LEVELS.map(({ score, label }) => {
                      const styles = SCORE_STYLES[score];
                      const isActive = selected === score;
                      return (
                        <button
                          key={score}
                          onClick={() => handleSelect(score)}
                          className={`flex flex-col items-center gap-3 py-4 rounded-xl border transition-all duration-500 ${isActive ? styles.active : styles.idle}`}
                        >
                          <div className="flex items-end gap-[1px] h-4">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div
                                key={i}
                                className={`w-[2px] rounded-full transition-all ${i < score ? (isActive ? styles.bar : "bg-zinc-700") : "bg-zinc-900"}`}
                                style={{ height: `${40 + i * 15}%` }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold">{label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[9px] text-zinc-700 text-center tracking-widest uppercase">
                    Tap to sync with system
                  </p>
                </motion.div>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-12 flex flex-col items-center gap-4 text-center">
                  <div className="w-12 h-12 rounded-full border border-[#C2A35D]/20 flex items-center justify-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-[#C2A35D]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">동기화 완료</p>
                    <p className="text-xs text-zinc-600">내일 지침의 강도에 반영됩니다.</p>
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
