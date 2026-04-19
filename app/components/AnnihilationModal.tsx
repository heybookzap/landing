"use client";

import { motion } from "framer-motion";

const DAILY_BASE = 12_000;
const COMPOUND = 1.08;

function assetValue(days: number): number {
  let acc = 0;
  for (let d = 1; d <= days; d++) acc += DAILY_BASE * Math.pow(COMPOUND, d);
  return Math.round(acc);
}

function krw(n: number): string {
  return n.toLocaleString("ko-KR");
}

interface Props {
  hoursLeft: number;
  effortDays?: number;
  onConvert: () => void;
  onAcceptDestruction: () => void;
}

export default function AnnihilationModal({
  hoursLeft,
  effortDays = 3,
  onConvert,
  onAcceptDestruction,
}: Props) {
  const total = assetValue(effortDays);

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center font-pretendard">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ background: "rgba(5,5,5,0.98)" }} // 더 깊은 블랙으로 몰입감 강화
      />

      <motion.div
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md mx-auto overflow-hidden rounded-[32px]"
        style={{
          background: "#0A0A0A",
          border: "1px solid rgba(194,163,93,0.2)",
        }}
      >
        {/* 상단 텍스트 로고 영역 */}
        <div
          className="flex items-center justify-between px-8 py-4"
          style={{
            borderBottom: "1px solid rgba(194,163,93,0.1)",
            background: "rgba(194,163,93,0.03)",
          }}
        >
          <p className="text-[9px] tracking-[0.5em] font-bold uppercase font-serif italic" style={{ color: "#C2A35D" }}>
            ONE BLANK SYSTEM
          </p>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_red]"></div>
            <p className="text-[9px] tracking-widest font-bold text-red-500 uppercase">
              {hoursLeft}H BEFORE ANNIHILATION
            </p>
          </motion.div>
        </div>

        <div className="px-8 pt-10 pb-12 flex flex-col gap-10">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-light leading-snug text-white break-keep">
              지금 Core 플랜으로 전환하여 <br/>
              지난 <span className="text-[#C2A35D] font-serif italic font-bold">{effortDays}일간의 기록</span>을 보존하십시오.
            </h2>
            <p className="text-zinc-500 text-sm font-light leading-relaxed break-keep">
              결정하지 않으시면 {hoursLeft}시간 후, 대표님이 공들여 쌓은 모든 데이터는 시스템에서 영구 소멸됩니다.
            </p>
          </div>

          <div
            className="flex flex-col items-center gap-4 py-10 rounded-2xl"
            style={{
              border: "1px solid rgba(194,163,93,0.1)",
              background: "rgba(194,163,93,0.02)",
            }}
          >
            <p className="text-[9px] tracking-[0.4em] uppercase text-zinc-600 font-medium">현재 복리 자산 환산액</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl md:text-6xl font-serif italic font-bold tabular-nums text-white tracking-tighter">
                {krw(total)}
              </span>
              <span className="text-zinc-500 text-sm font-light">원</span>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <motion.button
              onClick={onConvert}
              whileHover={{ scale: 1.02, backgroundColor: "#C2A35D" }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-6 text-[11px] font-bold tracking-[0.3em] uppercase transition-all duration-500 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              style={{ background: "#C2A35D", color: "#000" }}
            >
              내 노력을 자산으로 보존하기
            </motion.button>

            <button
              onClick={onAcceptDestruction}
              className="w-full py-2 text-[10px] tracking-[0.2em] text-zinc-800 hover:text-zinc-500 transition-colors duration-300 uppercase underline underline-offset-8 decoration-zinc-900"
            >
              기록의 영구 소멸을 수용합니다
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}