"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL = 72 * 60 * 60;
const WARN = 12 * 60 * 60;

function secondsLeft(from: Date): number {
  return Math.max(TOTAL - Math.floor((Date.now() - from.getTime()) / 1000), 0);
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function statusCopy(total: number): string {
  if (total <= 0) return "모든 기록이 소멸 절차에 진입하였습니다.";
  if (total <= 3600) return "1시간 이내에 모든 기록이 영구 소멸됩니다.";
  if (total <= WARN) return "데이터 소멸이 임박하였습니다. 지금 결정하십시오.";
  if (total <= TOTAL / 2) return "절반 이상이 경과하였습니다. 집중 상태를 유지하십시오.";
  return "72시간 초기화 주기가 진행 중입니다.";
}

const vibrateVariant = {
  idle: { x: 0 },
  active: (i: number) => ({
    x: [0, -1.5, 1.5, -1, 1, 0],
    transition: {
      duration: 0.4,
      delay: i * 0.12,
      repeat: Infinity,
      repeatDelay: 2,
      ease: "easeInOut" as const,
    },
  }),
};

interface Props {
  trialStartedAt: string;
  onExpire?: () => void;
}

export default function ResetTimer({ trialStartedAt, onExpire }: Props) {
  const origin = useRef(new Date(trialStartedAt));
  const [total, setTotal] = useState(() => secondsLeft(origin.current));
  const [expired, setExpired] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (expired) return;
    const id = setInterval(() => {
      const next = secondsLeft(origin.current);
      setTotal(next);
      if (next === 0 && !firedRef.current) {
        firedRef.current = true;
        setExpired(true);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [expired, onExpire]);

  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  const progress = 1 - total / TOTAL;
  const isWarning = total > 0 && total <= WARN;
  const accentColor = isWarning ? "#C0392B" : "#D4AF37";

  const digits = [
    { value: h, label: "시간" },
    { value: m, label: "분" },
    { value: s, label: "초" },
  ];

  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      <AnimatePresence>
        {expired && (
          <motion.div
            key="expired"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center gap-6"
            style={{ background: "rgba(10,10,10,0.96)" }}
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.45em" }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-[9px] font-semibold uppercase"
              style={{ color: "#C0392B" }}
            >
              DATA EXTINCTION MODE
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="text-base font-light text-white leading-relaxed"
            >
              72시간이 경과하였습니다.
              <br />
              모든 기록이 소멸 절차에 진입합니다.
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="w-full h-px origin-left"
              style={{ background: "#C0392B" }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.7 }}
              className="text-xs leading-relaxed"
              style={{ color: "rgba(237,237,237,0.35)" }}
            >
              새로운 주기를 시작하여 기록을 보존하십시오.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: expired ? 0.12 : 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-8 px-6 flex flex-col gap-7"
      >
        <div className="flex items-center justify-between">
          <p
            className="text-[9px] tracking-[0.45em] uppercase font-medium"
            style={{ color: "#D4AF37" }}
          >
            RESET TIMER
          </p>
          <AnimatePresence>
            {isWarning && (
              <motion.p
                key="warn-badge"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="text-[9px] tracking-widest uppercase font-semibold"
                style={{ color: "#C0392B" }}
              >
                소멸 임박
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-end justify-center gap-1">
          {digits.map(({ value, label }, i) => (
            <div key={label} className="flex items-end gap-1">
              <motion.div
                custom={i}
                variants={vibrateVariant}
                animate={isWarning ? "active" : "idle"}
                className="flex flex-col items-center"
              >
                <span
                  className="font-light tabular-nums leading-none"
                  style={{
                    fontSize: "clamp(2.8rem, 10vw, 3.8rem)",
                    color: isWarning ? "#C0392B" : "#FFFFFF",
                    letterSpacing: "-0.02em",
                    transition: "color 0.6s ease",
                  }}
                >
                  {pad(value)}
                </span>
                <span
                  className="text-[9px] tracking-[0.25em] mt-1.5 uppercase"
                  style={{ color: "#D4AF37", opacity: 0.65 }}
                >
                  {label}
                </span>
              </motion.div>

              {i < 2 && (
                <span
                  className="pb-7 font-extralight text-2xl leading-none"
                  style={{ color: "#D4AF37", opacity: 0.3 }}
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        <div
          className="w-full h-px"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <motion.div
            className="h-full"
            animate={{
              scaleX: progress,
              backgroundColor: accentColor,
            }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ transformOrigin: "left", opacity: 0.7 }}
          />
        </div>

        <motion.p
          key={statusCopy(total)}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-[11px] tracking-wide leading-relaxed"
          style={{
            color: isWarning
              ? "rgba(192,57,43,0.75)"
              : "rgba(237,237,237,0.3)",
          }}
        >
          {statusCopy(total)}
        </motion.p>
      </motion.div>
    </div>
  );
}
