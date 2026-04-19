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
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full relative bg-[#080808] border border-zinc-900 rounded-[28px] overflow-hidden font-pretendard"
    >
      {/* 📌 하이엔드 디테일: 좌측 골드 포인트 라인 */}
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-[#C2A35D] via-[#C2A35D]/20 to-transparent opacity-60" />
      
      <div className="px-8 pt-7 pb-8 flex flex-col gap-6">

        {/* 헤더: 문서 형식의 레이아웃 */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-[9px] font-bold tracking-[0.5em] text-[#C2A35D] uppercase font-serif italic">
              From: ONE BLANK System
            </p>
            <p className="text-[9px] font-medium tracking-[0.2em] text-zinc-600 uppercase">
              To: {userName || "Authorized Member"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <p className="text-[9px] font-bold tracking-[0.3em] text-zinc-500 uppercase">
              Weekly Signal
            </p>
            <p className="text-[9px] text-zinc-800 font-medium tabular-nums">{generatedAt}</p>
          </div>
        </div>

        <div className="w-full flex items-center gap-4">
          <div className="h-px flex-1 bg-zinc-900/50" />
          <div className="w-1 h-1 rounded-full bg-[#C2A35D]/30" />
          <div className="h-px flex-1 bg-zinc-900/50" />
        </div>

        {/* 통찰 문구: Serif Italic으로 권위 부여 */}
        <p className="text-zinc-200 text-[16px] font-light leading-relaxed tracking-tight break-keep">
          <span className="text-[#C2A35D] font-serif italic font-bold text-lg mr-1">&ldquo;</span>
          {insight}
          <span className="text-[#C2A35D] font-serif italic font-bold text-lg ml-1">&rdquo;</span>
        </p>

        {/* 푸터: 상태 정보 */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#C2A35D] animate-pulse" />
            <p className="text-[10px] text-zinc-600 font-light">
              {appliedFrom}부터 알고리즘 자동 적용됨
            </p>
          </div>
          <div className="px-4 py-1.5 rounded-full border border-[#C2A35D]/20 bg-[#C2A35D]/5">
            <p className="text-[9px] font-bold text-[#C2A35D] tracking-[0.2em] uppercase">
              배정 완료
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
