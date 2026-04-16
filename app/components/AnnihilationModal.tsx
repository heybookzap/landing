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
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ background: "rgba(10,10,10,0.95)" }}
      />

      <motion.div
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md mx-auto"
        style={{
          background: "#0A0A0A",
          border: "1px solid rgba(212,175,55,0.15)",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-3"
          style={{
            borderBottom: "1px solid rgba(212,175,55,0.1)",
            background: "rgba(212,175,55,0.04)",
          }}
        >
          <p
            className="text-[9px] tracking-[0.4em] uppercase font-medium"
            style={{ color: "#D4AF37" }}
          >
            기록 삭제 및 자산 전환 안내
          </p>
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-[9px] tracking-widest font-semibold"
            style={{ color: "#C0392B" }}
          >
            {hoursLeft}H REMAINING
          </motion.p>
        </div>

        <div className="px-7 pt-7 pb-10 flex flex-col gap-7">
          <div className="flex flex-col gap-3">
            <p className="text-base font-light leading-relaxed text-white">
              지금 Core 플랜으로 승급하면 사라질{" "}
              <span className="font-semibold" style={{ color: "#D4AF37" }}>
                {effortDays}일치의 노력
              </span>
              을 복리 자산으로 환산해 대시보드에 즉시 예치해 드립니다.
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "rgba(237,237,237,0.35)" }}
            >
              아무 결정도 하지 않으시면 {hoursLeft}시간 후 모든 기록이 영구 삭제됩니다.
            </p>
          </div>

          <div
            className="flex flex-col items-center gap-4 py-8"
            style={{
              border: "1px solid rgba(212,175,55,0.18)",
              background: "rgba(212,175,55,0.025)",
            }}
          >
            <p
              className="text-[9px] tracking-[0.4em] uppercase"
              style={{ color: "rgba(212,175,55,0.5)" }}
            >
              복리 누적 최종 환산액
            </p>

            <div className="flex items-baseline gap-2">
              <span
                className="font-light leading-none tabular-nums"
                style={{ fontSize: "clamp(3rem, 14vw, 5rem)", color: "#D4AF37" }}
              >
                {krw(total)}
              </span>
              <span
                className="text-base font-light"
                style={{ color: "rgba(237,237,237,0.4)" }}
              >
                원
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <motion.button
              onClick={onConvert}
              whileHover={{ filter: "brightness(1.1)", y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-full py-4 text-sm font-bold tracking-[0.12em]"
              style={{
                background: "#B8860B",
                color: "#000000",
                boxShadow: "0 0 28px rgba(184,134,11,0.2)",
              }}
            >
              내 노력을 돈으로 바꿉니다
            </motion.button>

            <button
              onClick={onAcceptDestruction}
              className="w-full py-2 text-[11px] tracking-wide underline underline-offset-4 transition-colors duration-200"
              style={{ color: "rgba(237,237,237,0.18)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(237,237,237,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(237,237,237,0.18)";
              }}
            >
              내 기록이 지워지는 것을 받아들입니다
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
