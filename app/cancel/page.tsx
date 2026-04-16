"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Database, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CancelPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: 질문, 2: 경고, 3: 제안

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center font-sans">
      <div className="max-w-md w-full">

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                <ArrowLeft size={14} /> 돌아가기
              </button>
              <div className="space-y-4">
                <h1 className="text-3xl font-black italic tracking-tighter">잠시만요, <br/>정말 중단하시겠습니까?</h1>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  취소하시면 더 이상 시스템이 당신의 결정지연을 통제해 주지 않습니다. 아침 90분의 고민 시간이 다시 시작될 수 있습니다.
                </p>
              </div>
              <div className="space-y-3">
                <button onClick={() => setStep(2)} className="w-full py-4 border border-white/10 text-zinc-500 rounded-2xl text-xs font-bold hover:bg-white/5 transition-all">
                  네, 서비스를 중단합니다
                </button>
                <button onClick={() => router.back()} className="w-full py-4 bg-white text-black rounded-2xl font-black">
                  계속 자산 보호하기
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 bg-red-500/5 border border-red-500/20 p-8 rounded-[40px]"
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <ShieldAlert className="text-red-500" size={32} />
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-black text-red-500 uppercase tracking-tighter italic">Warning: Data Reset</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  지금 취소하시면 지난 2주간 쌓아온 <span className="text-white font-bold text-lg">엘리트 리듬 94.2%</span>가 즉시 초기화됩니다. ₩91,250,000의 자산 보호 장벽이 사라집니다.
                </p>
              </div>
              <div className="space-y-3">
                <button onClick={() => setStep(3)} className="w-full py-4 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold hover:bg-red-500/10 transition-all flex items-center justify-center gap-2">
                  <Trash2 size={14} /> 모든 기록 삭제 및 취소
                </button>
                <button onClick={() => router.back()} className="w-full py-4 bg-white text-black rounded-2xl font-black">
                  아니요, 데이터를 지키겠습니다
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 bg-[#D4AF37]/5 border border-[#D4AF37]/30 p-10 rounded-[48px] shadow-[0_0_50px_rgba(212,175,55,0.1)]"
            >
              <div className="text-center space-y-4">
                <div className="text-[#D4AF37] text-[10px] font-black tracking-[0.4em] uppercase">Special Offer</div>
                <h2 className="text-2xl font-black italic">데이터는 보존하고 싶다면.</h2>
                <p className="text-zinc-400 text-sm">
                  완전 이탈 대신, 쌓아온 정체성과 리포트 데이터만 유지하는 <span className="text-white font-bold">자산 보존 플랜</span>을 제안합니다.
                </p>
              </div>

              <div className="bg-black/40 rounded-3xl p-6 border border-[#D4AF37]/20 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-zinc-500 mb-1">Data-Only Plan</div>
                  <div className="text-2xl font-black text-[#D4AF37]">₩9,900<span className="text-[10px] font-normal text-zinc-600"> / 월</span></div>
                </div>
                <Database className="text-[#D4AF37]/40" size={32} />
              </div>

              <div className="space-y-3">
                <button onClick={() => router.push('/dashboard')} className="w-full py-5 bg-[#D4AF37] text-black rounded-2xl font-black flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
                  <CheckCircle2 size={18} /> 보존 플랜으로 전환 (권장)
                </button>
                <button className="w-full py-4 text-zinc-600 text-[10px] font-bold uppercase tracking-widest hover:text-red-500 transition-colors">
                  그럼에도 불구하고 완전히 삭제하기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
