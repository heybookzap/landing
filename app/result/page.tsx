"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, ArrowRight, Loader2 } from "lucide-react";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [prescription, setPrescription] = useState<{action: string, contribution: string} | null>(null);
  const [annualLoss, setAnnualLoss] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // 1. 저장된 데이터 호출
      const wage = localStorage.getItem("user_wage");
      const loss = localStorage.getItem("last_calculated_loss");
      
      if (!wage || !loss) {
        router.push("/lead");
        return;
      }
      setAnnualLoss(parseInt(loss).toLocaleString());

      // 2. AI 슬라이서 엔진 호출 (api/route.ts)
      try {
        const res = await fetch("/api", {
          method: "POST",
          body: JSON.stringify({ 
            task: "현재 내 비즈니스에서 가장 병목이 되는 업무를 해결하고 싶다", // 기본 페르소나 적용
            wage: parseInt(wage) 
          }),
        });
        const data = await res.json();
        setPrescription(data);
      } catch (err) {
        console.error("AI 처방 실패");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-6">
        <Loader2 className="text-[#C2A35D] animate-spin" size={40} />
        <p className="text-[#C2A35D] text-[10px] tracking-[0.5em] uppercase animate-pulse">Analyzing Cognitive Assets...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-20 px-6 font-pretendard relative">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.03)_0%,_transparent_70%)] pointer-events-none"></div>

      <header className="absolute top-0 w-full p-10 flex justify-center">
        <span className="text-[#C2A35D] font-serif italic text-xl font-bold uppercase tracking-widest">ONE BLANK</span>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-2xl space-y-16">
        {/* 섹션 1: 손실 리포트 */}
        <div className="text-center space-y-4">
          <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase">Diagnostic Report</p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-tight">
            매년 <span className="text-red-500 font-bold">{annualLoss}원</span>이<br />
            대표님의 머릿속에서 증발하고 있습니다.
          </h1>
        </div>

        {/* 섹션 2: AI 처방전 (Prescription) */}
        <div className="bg-[#080808] border border-[#C2A35D]/20 rounded-[32px] p-10 md:p-14 space-y-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C2A35D]/50 to-transparent"></div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#C2A35D]">
              <Zap size={18} />
              <p className="text-[11px] tracking-[0.3em] font-bold uppercase">Immediate 2-Minute Step</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-white leading-tight break-keep">
              &quot;{prescription?.action}&quot;
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed font-light border-l border-zinc-800 pl-6">
              {prescription?.contribution}
            </p>
          </div>

          <div className="pt-10 border-t border-zinc-900 flex flex-col gap-6">
            <p className="text-zinc-500 text-xs leading-relaxed text-center">
              이 2분짜리 행동조차 결정하기 힘들다면, <br />
              이미 대표님의 뇌는 통제권을 상실한 상태입니다.
            </p>
            <button 
              onClick={() => router.push('/checkout')}
              className="w-full py-6 bg-white text-black text-[12px] font-bold tracking-[0.2em] uppercase rounded-xl hover:bg-[#C2A35D] transition-all duration-500"
            >
              전담 방어 시스템(VVIP) 도입하기
            </button>
          </div>
        </div>

        <button onClick={() => router.push('/')} className="mx-auto flex items-center gap-2 text-zinc-600 hover:text-white transition-colors text-[10px] tracking-widest uppercase">
          Back to base <ArrowRight size={12} />
        </button>
      </motion.div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense>
      <ResultContent />
    </Suspense>
  );
}
