"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * [초6 수준의 나노 세뇌 카피]
 * 타겟의 무의식에 '통제권'과 '안도감'을 동시에 주입합니다.
 */
const NANO_COPY = [
  "당신의 생각할 힘을 아끼기 위해 엘리트 시스템을 정렬하고 있습니다...",
  "어제의 기록은 모두 지웠습니다. 오늘을 위한 방패를 가동합니다...",
  "시스템이 당신의 오늘치 복잡한 생각들을 대신 처리하고 있습니다...",
  "가장 명료한 상태에서 행동하실 수 있도록 환경을 조율합니다...",
  "상위 0.1%의 압도적인 실행력을 당신의 뇌에 동기화합니다..."
];

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [copy, setCopy] = useState("");

  useEffect(() => {
    // 랜덤 카피 선택 및 2초 후 메인 화면으로 이동
    setCopy(NANO_COPY[Math.floor(Math.random() * NANO_COPY.length)]);
    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[1000] bg-[#0A0A0A] flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* 5% 골드 법칙: 은은한 배경 아우라 */}
      <div className="orb-wrapper" aria-hidden>
        <div className="glowing-orb" />
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center gap-16 text-center"
      >
        {/* 명품 폰트와 넉넉한 여백 적용 */}
        <div className="space-y-4">
          <p className="text-[10px] tracking-[0.8em] font-bold text-[#D4AF37] uppercase opacity-80">
            ONE BLANK
          </p>
          <h2 className="text-xl sm:text-2xl font-light tracking-widest text-white serif">
            ELITE SYSTEM
          </h2>
        </div>
        
        <div className="h-10 flex items-center justify-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-[11px] text-gray-500 tracking-wider font-light leading-relaxed"
          >
            {copy}
          </motion.p>
        </div>
      </motion.div>

      {/* 하단 브랜드 태그 */}
      <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-20">
        <div className="w-px h-8 bg-[#D4AF37]" />
        <p className="text-[8px] tracking-[0.4em] text-white uppercase">
          Empire Clarity Framework
        </p>
      </div>
    </motion.div>
  );
}
