"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

function KineticSlash() {
  return (
    <div className="relative w-full h-14 flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ clipPath: "inset(0 0 50% 0)" }}
        animate={{ y: -18, opacity: 0 }}
        transition={{ delay: 0.85, duration: 0.3 }}
      >
        <span className="text-lg font-light text-gray-400 whitespace-nowrap">무겁고 복잡한 결정 피로</span>
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ clipPath: "inset(50% 0 0 0)" }}
        animate={{ y: 18, opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <span className="text-lg font-light text-gray-400 whitespace-nowrap">무겁고 복잡한 결정 피로</span>
      </motion.div>

      <motion.div
        className="absolute pointer-events-none"
        style={{
          height: "1.5px",
          width: "110%",
          background: "#C2A35D",
          rotate: "-6deg",
          transformOrigin: "left center",
          left: "-5%",
          boxShadow: "0 0 10px rgba(194,163,93,0.5)",
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0, duration: 0.35, ease: "easeOut" }}
      />

      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <span className="text-lg font-bold text-white tracking-tight whitespace-nowrap">단 1개의 2분 스텝</span>
      </motion.div>
    </div>
  );
}

export default function LeadMagnetPage() {
  const router = useRouter();
  const [wage, setWage] = useState("");
  const [wastedTime, setWastedTime] = useState("");
  const [showResult, setShowResult] = useState(false);

  const wageNum = parseFloat(wage.replace(/,/g, ""));
  const timeNum = parseFloat(wastedTime);

  const annualLoss =
    !isNaN(wageNum) && !isNaN(timeNum) && wageNum >= 10000 && timeNum > 0
      ? Math.floor(wageNum * timeNum * 365)
      : null;

  const isHighRisk = annualLoss !== null && annualLoss >= 30000000;
  const formattedLoss = annualLoss !== null ? annualLoss.toLocaleString("ko-KR") : null;

  function handleCalculate() {
    // 📌 2. 입력값 검증 (최소 시급 10,000원 미만 차단)
    if (wageNum < 10000) {
      alert("하이엔드 리소스를 측정하기 위해 시급은 10,000원 이상으로 입력해 주십시오.");
      return;
    }
    if (annualLoss) {
      // 📌 1. 데이터 단일화 (LocalStorage를 마스터 DB로 사용)
      localStorage.setItem("user_wage", wageNum.toString());
      localStorage.setItem("last_calculated_loss", annualLoss.toString());
      setShowResult(true);
    }
  }

  function handleNextStep() {
    // URL 파라미터는 최소화하고, 다음 페이지에서 로컬스토리지를 참조하게 합니다.
    router.push(`/result?risk=${isHighRisk ? 'high' : 'normal'}`);
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#050505] text-[#ededed] font-pretendard">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.03)_0%,_transparent_70%)] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center gap-10 text-center">
        <p className="text-[10px] tracking-[0.5em] font-bold uppercase text-[#C2A35D] opacity-80">ONE BLANK 2.0</p>

        <h1 className="text-4xl sm:text-5xl font-light leading-tight tracking-tighter break-keep">
          당신이 고민만 하던 시간, <br />
          <span className="font-bold text-[#C2A35D]">실제로는 얼마의 돈이었을까요?</span>
        </h1>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full mt-4 space-y-12">
              <div className="space-y-4 text-left">
                <label className="text-[11px] tracking-widest uppercase text-zinc-500 font-medium">당신의 1시간 가치는? (KRW)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={wage}
                  onChange={(e) => setWage(e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-800 py-4 text-3xl text-white focus:outline-none focus:border-[#C2A35D] transition-colors placeholder-zinc-900"
                />
              </div>

              {wage.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-10 text-left">
                  <div className="space-y-4">
                    <label className="text-[11px] tracking-widest uppercase text-zinc-500 font-medium">하루 평균 의미 없이 낭비되는 시간 (hours)</label>
                    <input
                      type="number"
                      placeholder="0.0"
                      step="0.5"
                      value={wastedTime}
                      onChange={(e) => setWastedTime(e.target.value)}
                      className="w-full bg-transparent border-b border-zinc-800 py-4 text-2xl text-white focus:outline-none focus:border-[#C2A35D] transition-colors placeholder-zinc-900"
                    />
                  </div>
                  <button
                    onClick={handleCalculate}
                    disabled={!annualLoss}
                    className="w-full bg-white text-black font-bold py-6 rounded-xl text-[12px] uppercase tracking-[0.3em] disabled:opacity-10 hover:bg-[#C2A35D] transition-all duration-500"
                  >
                    손실액 데이터 산출하기
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex flex-col items-center gap-12 mt-4">
              <div className="space-y-4">
                <p className="text-zinc-500 text-xs tracking-widest uppercase">Annual Cognitive Loss</p>
                <p className="text-5xl sm:text-7xl font-bold tracking-tighter text-white tabular-nums">
                  <span className="text-[#C2A35D]">-</span> {formattedLoss}원
                </p>
              </div>

              <div className="w-12 h-[1px] bg-zinc-900"></div>

              <KineticSlash />

              <div className="space-y-4 bg-zinc-950/50 border border-zinc-900 p-8 w-full text-left rounded-2xl">
                <p className="text-[#C2A35D] text-[10px] tracking-[0.3em] font-bold uppercase">
                  {isHighRisk ? "⚠️ 고위험군 인지 보호 대상자" : "시스템 처방 제안"}
                </p>
                <p className="text-sm leading-relaxed text-zinc-400 break-keep">
                  {isHighRisk 
                    ? "당신의 결정 피로도가 임계점을 넘었습니다. 지금 즉시 '2분 스텝'을 통한 인지 방어막 형성이 시급합니다."
                    : "이 엄청난 손실을 멈출 수 있는 가장 현실적인 방법. 복잡한 고민 대신, 시스템이 정해주는 '2분짜리 행동' 하나에만 집중하십시오."
                  }
                </p>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full bg-[#C2A35D] text-black font-bold py-6 text-[12px] uppercase tracking-[0.2em] rounded-xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(194,163,93,0.15)]"
              >
                {/* 📌 3. 연동성 강화 (2분 스텝 문구 포함) */}
                {isHighRisk ? "정밀 진단 및 2분 스텝 처방받기" : "내 돈 지키는 2분 스텝 확인하기"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="absolute bottom-10 w-full text-center">
        <p className="text-[9px] tracking-[0.4em] uppercase text-zinc-800 font-light">ONE BLANK — PERMANENT COGNITIVE PROTECTION</p>
      </footer>
    </main>
  );
}
