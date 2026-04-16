"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldAlert, ShieldCheck, ArrowRight, RefreshCcw, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tier = searchParams.get("tier") || "Starter";
  const condition = searchParams.get("condition") || "normal";

  const [isSuccess, setIsSuccess] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 md:p-12 flex flex-col items-center font-sans selection:bg-[#D4AF37] selection:text-black">

      <div className="w-full max-w-2xl flex justify-center gap-4 mb-16">
        <button
          onClick={() => setIsSuccess(true)}
          className={`px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${isSuccess ? "bg-zinc-800 text-zinc-100 border border-zinc-700" : "bg-transparent text-zinc-600 border border-zinc-900 hover:text-zinc-400"}`}
        >
          TEST: 달성 성공
        </button>
        <button
          onClick={() => setIsSuccess(false)}
          className={`px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${!isSuccess ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-transparent text-zinc-600 border border-zinc-900 hover:text-zinc-400"}`}
        >
          TEST: 중도 포기
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl w-full flex flex-col gap-10"
      >
        <div className="text-center flex flex-col gap-4">
          <p className="text-[10px] font-bold text-zinc-500 tracking-[0.4em] uppercase">
            Session Terminated
          </p>
          <h1 className="serif text-5xl md:text-6xl font-bold tracking-tight text-zinc-100 italic">
            {isSuccess ? "방어 성공." : "한계 도달."}
          </h1>
        </div>

        <div className={`p-10 md:p-12 border rounded-[40px] relative overflow-hidden transition-colors ${isSuccess ? "bg-zinc-900/30 border-zinc-800" : "bg-[#D4AF37]/5 border-[#D4AF37]/20"}`}>

          {!isSuccess ? (
            <div className="flex flex-col gap-10">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                  <ShieldAlert className="text-[#D4AF37]" size={32} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-2xl font-black text-zinc-100 tracking-tight">실패가 아닙니다.</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                    오늘 뇌의 과부하 임계점에 도달했을 뿐입니다.<br/>
                    시스템이 당신의 컨디션을 재조정하여 내일의 안전망을 구축합니다.
                  </p>
                </div>
              </div>

              <div className="bg-[#050505]/50 rounded-[24px] p-8 border border-[#D4AF37]/10 flex flex-col gap-4">
                <div className="text-[10px] font-bold text-[#D4AF37] tracking-widest uppercase flex items-center gap-2">
                  <RefreshCcw size={14} strokeWidth={2} /> Auto-Recovery Plan
                </div>
                <div className="serif text-2xl font-bold italic text-zinc-100">"내일은 10%만 실행합니다."</div>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                  시스템이 내일 아침 목표를 <span className="text-zinc-100 font-bold">단 1분</span>으로 자동 하향 조정했습니다.
                  우리는 당신을 포기하지 않습니다.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-zinc-100" size={32} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-2xl font-black text-zinc-100 tracking-tight">정체성 리듬 복구 완료</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                    완벽주의를 이겨내고 실행을 증명했습니다. 당신의 성취가 기록되었습니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 pt-10 border-t border-zinc-800/50">
            {tier === "Starter" ? (
              <div className="flex flex-col items-center gap-6 text-center">
                <Lock className="text-zinc-600" size={24} strokeWidth={1.5} />
                <div className="flex flex-col gap-2">
                  <p className="text-red-400 font-bold text-xs tracking-widest uppercase">데이터 휘발 경고</p>
                  <p className="text-zinc-500 text-xs font-medium max-w-sm leading-relaxed">
                    이 기록은 24시간 뒤 소멸됩니다. 영구적인 자동 복귀 플랜과 정밀 분석을 원한다면 통제 수준을 높이십시오.
                  </p>
                </div>
                <button onClick={() => router.push('/pricing')} className="w-full max-w-sm py-4 bg-zinc-100 text-[#050505] font-black tracking-wide rounded-xl text-sm hover:bg-white transition-colors">
                  엘리트 시스템 (Core) 가동하기
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-[10px] font-bold text-[#D4AF37] tracking-widest uppercase">Elite Analysis Report</p>
                <div className="border-l-2 border-[#D4AF37]/50 pl-5 py-1">
                  <p className="text-zinc-300 text-sm font-medium leading-relaxed">
                    "당신은 기준이 높아 쉽게 지치는 구조입니다. 하지만 오늘 시스템의 통제에 따라 과부하를 막아냈습니다. 엘리트 자산이 안전하게 서버에 보존되었습니다."
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <button onClick={() => router.push('/')} className="mx-auto flex items-center gap-3 text-zinc-500 hover:text-zinc-300 transition-colors text-[10px] font-bold tracking-widest uppercase mt-4">
          Return to Base <ArrowRight size={14} strokeWidth={2} />
        </button>

      </motion.div>
    </div>
  );
}
