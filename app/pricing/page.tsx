"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";

type Tier = "starter" | "core" | "premium";

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lostAsset = searchParams.get("lost_asset") || "";

  const [loading, setLoading] = useState<Tier | null>(null);
  const [done, setDone] = useState<Tier | null>(null);

  async function handleSelectTier(tier: Tier) {
    if (loading || tier === "premium") return;
    setLoading(tier);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({ tier }).eq("id", user.id);
      }
      localStorage.setItem("userTier", tier);
      setDone(tier);
      router.push("/dashboard");
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center px-6 pt-24 pb-20 font-sans selection:bg-[#D4AF37] selection:text-black">

      {/* --- 헤더 영역 (가독성과 여백 극대화) --- */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-4 text-center mb-20">
        <p className="text-[10px] font-bold tracking-[0.4em] text-[#D4AF37]/60 uppercase">
          Identity Access
        </p>

        {lostAsset && (
          <div className="mb-4 px-5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-full">
            <p className="text-xs font-medium text-zinc-300 tracking-wide">
              당신이 보호하지 못해 휘발된 자산: <span className="text-red-400 font-bold">₩{Number(lostAsset).toLocaleString()}</span>
            </p>
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-100 leading-tight">
          당신의 정체성 수준을<br />
          <span className="serif italic text-[#D4AF37] font-medium tracking-normal mt-2 block">결정하십시오.</span>
        </h1>
        <p className="text-sm text-zinc-400 mt-4 max-w-md leading-relaxed font-medium">
          시스템은 철저히 통제된 소수에게만 허락됩니다. 지금 가장 알맞은 통제 수준을 선택하십시오.
        </p>
      </div>

      {/* --- 플랜 그리드 영역 --- */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

        {/* 1. PREMIUM (앵커링 - 투명도와 위계로 깊이감 형성) */}
        <div className="order-2 md:order-1 flex flex-col p-8 bg-zinc-900/30 border border-zinc-800 rounded-[32px] opacity-60">
          <div className="mb-8">
            <p className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase mb-2">The Anchor</p>
            <h2 className="serif text-xl text-zinc-100 italic">Inner Circle OS</h2>
          </div>
          <div className="mb-8">
            <span className="text-3xl font-bold font-mono tracking-tighter text-zinc-100">₩1,500,000</span>
            <span className="text-xs text-zinc-600 font-medium"> / 월</span>
          </div>
          <ul className="space-y-4 text-xs text-zinc-400 font-medium leading-relaxed flex-1">
            <li>상위 0.1% 폐쇄형 네트워크</li>
            <li>1:1 정체성 설계 컨설팅</li>
            <li>오프라인 시크릿 밋업</li>
          </ul>
          <button disabled className="mt-8 w-full py-4 rounded-xl text-[10px] font-bold tracking-widest text-zinc-600 border border-zinc-800 uppercase">
            정원 마감 (대기자 등록)
          </button>
        </div>

        {/* 2. CORE (가장 돋보이는 딥 블랙 & 골드 하이라이트) */}
        <motion.div
          whileHover={{ y: -4 }}
          className="order-1 md:order-2 relative flex flex-col p-10 bg-zinc-900/60 border border-[#D4AF37]/40 rounded-[40px] shadow-[0_20px_60px_rgba(212,175,55,0.06)] transform md:-translate-y-4"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black px-4 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">
            Recommended
          </div>
          <div className="mb-8">
            <p className="text-[9px] font-bold tracking-widest text-[#D4AF37] uppercase mb-2">The Empire Shield</p>
            <h2 className="text-2xl font-black text-zinc-100 tracking-tight">Core System</h2>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-black font-mono tracking-tighter text-[#D4AF37]">₩390,000</span>
            <span className="text-xs text-zinc-500 font-medium"> / 월</span>
          </div>
          <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-6">
            제국의 모든 자산 방어 시스템이 가동되는 완전한 통제 구역입니다.
          </p>
          <ul className="space-y-4 text-sm text-zinc-300 font-medium flex-1">
            <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" /> 모든 데이터 영구 보존</li>
            <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" /> 정밀 심리 분석 해제</li>
            <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" /> 엘리트 정체성 부여</li>
          </ul>
          <button
            onClick={() => handleSelectTier("core")}
            disabled={!!loading}
            className="mt-10 w-full py-5 rounded-2xl text-sm font-black tracking-wide bg-[#D4AF37] text-black hover:brightness-110 transition-all"
          >
            {loading === "core" ? "가동 준비 중..." : done === "core" ? "선택 완료" : "시스템 영구 가동하기"}
          </button>
        </motion.div>

        {/* 3. STARTER (차갑고 이성적인 느낌) */}
        <div className="order-3 flex flex-col p-8 bg-zinc-900/30 border border-zinc-800 rounded-[32px]">
          <div className="mb-8">
            <p className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase mb-2">The Foundation</p>
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Starter</h2>
          </div>
          <div className="mb-8">
            <span className="text-3xl font-bold font-mono tracking-tighter text-zinc-300">₩149,000</span>
            <span className="text-xs text-zinc-600 font-medium"> / 월</span>
          </div>
          <ul className="space-y-4 text-xs text-zinc-500 font-medium leading-relaxed flex-1">
            <li>기본 25분 방어 타이머</li>
            <li>24시간 후 성취 자동 소멸</li>
            <li>정밀 심리 분석 제한</li>
          </ul>
          <button
            onClick={() => handleSelectTier("starter")}
            disabled={!!loading}
            className="mt-8 w-full py-4 rounded-xl text-xs font-bold tracking-wide text-zinc-300 border border-zinc-700 hover:bg-zinc-800 transition-all"
          >
            {loading === "starter" ? "처리 중..." : "제한적 시스템 가동"}
          </button>
        </div>

      </div>

      {/* --- 푸터 경고 영역 --- */}
      <div className="mt-16 text-center border-t border-zinc-900 pt-8 w-full max-w-2xl">
        <p className="text-xs text-red-500/70 font-semibold tracking-wide">
          모든 결제는 최종적이며, 부여된 정체성은 취소가 불가능합니다.
        </p>
      </div>
    </main>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#D4AF37] text-xs tracking-widest font-bold">LOADING...</div>}>
      <PricingContent />
    </Suspense>
  );
}
