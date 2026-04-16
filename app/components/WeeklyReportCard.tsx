"use client";

import { motion } from "framer-motion";

type Props = {
  userName: string;
  insight: string;
  appliedFrom: string;
  generatedAt: string;
};

export default function WeeklyReportCard({ userName, insight, appliedFrom, generatedAt }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="w-full relative bg-[#0c0c0c] border border-zinc-800/80 rounded-[24px] overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-[1.5px] h-full bg-gradient-to-b from-[#D4AF37]/70 via-[#D4AF37]/20 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#D4AF37]/40 via-[#D4AF37]/10 to-transparent" />

      <div className="pl-7 pr-7 pt-6 pb-7 flex flex-col gap-5">

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <p className="text-[9px] font-bold tracking-[0.45em] text-[#D4AF37]/50 uppercase">
              From: ONE BLANK System
            </p>
            <p className="text-[9px] font-medium tracking-widest text-zinc-700 uppercase">
              To: {userName || "대표님"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-0.5 shrink-0">
            <p className="text-[9px] font-bold tracking-widest text-zinc-700 uppercase">
              Weekly Signal
            </p>
            <p className="text-[9px] text-zinc-800 font-medium">{generatedAt}</p>
          </div>
        </div>

        <div className="w-full flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-900" />
          <div className="w-1 h-1 rounded-full bg-[#D4AF37]/40" />
          <div className="h-px flex-1 bg-zinc-900" />
        </div>

        <p className="text-zinc-200 text-[15px] font-semibold leading-[1.75] tracking-tight pl-0.5">
          {insight}
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60" />
            <p className="text-[10px] text-zinc-600 font-medium">
              {appliedFrom}부터 자동 적용됨
            </p>
          </div>
          <div className="px-3 py-1 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5">
            <p className="text-[9px] font-bold text-[#D4AF37]/70 tracking-widest uppercase">
              배정 완료
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
