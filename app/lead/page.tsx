"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

function KineticSlash() {

  return (
    <div className="relative w-full h-14 flex items-center justify-center overflow-hidden">
      {/* 원본 텍스트 - 위쪽 절반 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ clipPath: "inset(0 0 50% 0)" }}
        animate={{ y: -18, opacity: 0 }}
        transition={{ delay: 0.85, duration: 0.3 }}
      >
        <span className="text-lg font-light text-gray-400 whitespace-nowrap">
          무겁고 복잡한 결정 피로
        </span>
      </motion.div>

      {/* 원본 텍스트 - 아래쪽 절반 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ clipPath: "inset(50% 0 0 0)" }}
        animate={{ y: 18, opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <span className="text-lg font-light text-gray-400 whitespace-nowrap">
          무겁고 복잡한 결정 피로
        </span>
      </motion.div>

      {/* 골드 대각선 슬래시 */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          height: "1.5px",
          width: "110%",
          background: "#B8860B",
          rotate: "-6deg",
          transformOrigin: "left center",
          left: "-5%",
          boxShadow: "0 0 6px rgba(184,134,11,0.7)",
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0, duration: 0.35, ease: "easeOut" }}
      />

      {/* 새 텍스트 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <span className="text-lg font-bold text-white tracking-tight whitespace-nowrap">
          단 1개의 2분 스텝
        </span>
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
    !isNaN(wageNum) && !isNaN(timeNum) && wageNum > 0 && timeNum > 0
      ? Math.floor(wageNum * timeNum * 365)
      : null;

  const isHighRisk = annualLoss !== null && annualLoss >= 30000000;
  const formattedLoss = annualLoss !== null ? annualLoss.toLocaleString("ko-KR") : null;

  const showExpanded = wage.trim().length > 0;

  function handleCalculate() {
    if (annualLoss) {
      localStorage.setItem("userWage", wageNum.toString());
      setShowResult(true);
    }
  }

  function handleNextStep() {
    router.push('/result?lost_asset=' + annualLoss + '&fast_track=' + isHighRisk);
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#050505] text-[#ededed]">

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center gap-10 text-center">
        <p className="text-[10px] tracking-[0.5em] font-bold uppercase text-[#B8860B] opacity-80">
          ONE BLANK 2.0
        </p>

        <h1 className="text-4xl sm:text-5xl font-light leading-tight tracking-tighter">
          당신이 고민만 하던 시간, <br />
          <span className="font-bold text-[#B8860B]">실제로는 얼마의 돈이었을까요?</span>
        </h1>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="input-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="w-full mt-4"
            >
              <div className="space-y-2 text-left">
                <label className="text-sm font-bold text-gray-300">당신의 1시간 가치는? (원)</label>
                <input
                  type="number"
                  placeholder="예: 100000"
                  value={wage}
                  onChange={(e) => setWage(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-800 py-3 text-2xl text-white focus:outline-none focus:border-[#B8860B] transition-colors"
                />
              </div>

              <AnimatePresence>
                {showExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: "2rem" }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8 overflow-hidden text-left"
                  >
                    <p className="text-sm text-[#B8860B] font-medium">
                      당신의 손실을 정확히 계산하려면 2가지가 더 필요합니다.
                    </p>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] tracking-widest uppercase text-gray-500">하루에 의미 없이 낭비하는 시간 (시간)</label>
                        <input
                          type="number"
                          placeholder="예: 2.5"
                          step="0.5"
                          value={wastedTime}
                          onChange={(e) => setWastedTime(e.target.value)}
                          className="w-full bg-transparent border-b border-gray-800 py-3 text-xl text-white focus:outline-none focus:border-[#B8860B] transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleCalculate}
                      disabled={!annualLoss}
                      className="w-full bg-white text-black font-bold py-5 mt-4 rounded-none text-sm uppercase tracking-[0.3em] disabled:opacity-20 transition-all hover:bg-[#B8860B]"
                    >
                      내 돈이 얼마나 새는지 확인하기
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="result-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col items-center gap-10 mt-4"
            >
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">당신이 1년 동안 허공에 날린 금액</p>
                <p className="text-6xl sm:text-7xl font-bold tracking-tighter text-white tabular-nums">
                  <span className="text-[#B8860B]">-</span> {formattedLoss}원
                </p>
              </div>

              <div className="w-16 h-[1px] bg-gray-800 my-4"></div>

              <KineticSlash />

              <div className="space-y-3 bg-[#0a0a0a] border border-[#B8860B]/20 p-6 w-full text-left">
                <p className="text-[#B8860B] text-[10px] tracking-widest font-bold uppercase">
                  {isHighRisk ? "⚠️ 상위 5% 위험군 정밀 진단 자격 부여" : "해결책 제안"}
                </p>
                <p className="text-sm leading-relaxed text-gray-300">
                  {isHighRisk ? (
                    <>
                      당신의 결정 피로도가 매우 위험한 수준입니다. 특별히{" "}
                      <strong className="text-white">ONE BLANK 2.0 제국 정밀 진단</strong>을 받을 자격(Fast Track)을 부여합니다.
                    </>
                  ) : (
                    <>
                      이 엄청난 손실을 지금 멈추세요. <br />
                      복잡한 고민은 빼고, 당장 시작할 수 있는 <strong className="text-white">&apos;2분짜리 행동&apos;</strong> 하나만 딱 정해드립니다.
                    </>
                  )}
                </p>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full bg-[#B8860B] text-black font-bold py-6 text-sm uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_0_40px_rgba(184,134,11,0.2)]"
              >
                {isHighRisk ? "제국 정밀 진단 시스템 입장하기" : "내 돈 지키는 2분 습관 만들기 (심사 신청)"}
              </button>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="absolute bottom-8 left-0 right-0 text-center z-10">
        <p className="text-[9px] tracking-[0.4em] uppercase text-gray-700">
          ONE BLANK — EMPIRE CLARITY SYSTEM
        </p>
      </footer>
    </main>
  );
}
