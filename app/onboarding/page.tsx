"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { supabase } from "../../lib/supabase";

type Step = 1 | 2 | 3;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [weeklyHours, setWeeklyHours] = useState("");
  const [saving, setSaving] = useState(false);

  const revenue = parseInt(monthlyRevenue.replace(/,/g, ""), 10);
  const hours = parseFloat(weeklyHours);
  const hourlyValue =
    !isNaN(revenue) && !isNaN(hours) && hours > 0
      ? Math.floor(revenue / (hours * 4.3))
      : 0;

  const handleComplete = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          monthly_revenue: revenue,
          weekly_hours: hours,
          hourly_value: hourlyValue,
          onboarded_at: new Date().toISOString(),
        });
      }
      localStorage.setItem("hourlyValue", hourlyValue.toString());
      router.push("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  const fadeSlide: Variants = {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
    exit: { opacity: 0, x: -24, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md flex flex-col gap-10">

        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-bold tracking-[0.4em] text-[#D4AF37]/60 uppercase">
            System Calibration — {step} / 3
          </p>
          <div className="w-full h-px bg-zinc-900 relative">
            <div
              className="absolute top-0 left-0 h-px bg-[#D4AF37] transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={fadeSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-black tracking-tight leading-tight">
                  현재 월평균<br />
                  <span className="text-[#D4AF37]">순수익</span>을 입력하십시오.
                </h1>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  시스템이 대표님의 시간당 인지적 가치를 계산하여<br />
                  방어된 자산 규모를 실시간으로 추적합니다.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
                  월 순수익 (원)
                </label>
                <input
                  type="number"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(e.target.value)}
                  placeholder="예: 10000000"
                  autoFocus
                  className="luxury-input w-full px-0 py-4 text-2xl font-black text-zinc-100 placeholder:text-zinc-800 outline-none bg-transparent"
                />
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!revenue || revenue <= 0}
                className="w-full py-4 bg-[#D4AF37] text-[#0a0a0a] rounded-xl font-black text-sm tracking-wide disabled:opacity-20 hover:brightness-110 transition-all"
              >
                다음
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={fadeSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-black tracking-tight leading-tight">
                  주당<br />
                  <span className="text-[#D4AF37]">실제 근무시간</span>을 입력하십시오.
                </h1>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  회의, 이동, 단순 반복 업무를 모두 포함한<br />실제로 일하는 총 시간입니다.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
                  주당 근무시간 (시간)
                </label>
                <input
                  type="number"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(e.target.value)}
                  placeholder="예: 50"
                  min="1"
                  max="168"
                  autoFocus
                  className="luxury-input w-full px-0 py-4 text-2xl font-black text-zinc-100 placeholder:text-zinc-800 outline-none bg-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-4 border border-zinc-800 text-zinc-500 rounded-xl font-bold text-sm hover:border-zinc-700 transition-colors"
                >
                  이전
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!hours || hours <= 0}
                  className="flex-1 py-4 bg-[#D4AF37] text-[#0a0a0a] rounded-xl font-black text-sm tracking-wide disabled:opacity-20 hover:brightness-110 transition-all"
                >
                  계산하기
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={fadeSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
                  시간당 인지적 가치
                </p>
                <div className="text-5xl font-black font-mono text-[#D4AF37] tracking-tighter">
                  ₩{hourlyValue.toLocaleString()}
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  시스템이 결정 하나를 대신 내릴 때마다<br />이 금액에 비례한 자산이 실시간으로 회수됩니다.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">월 순수익</span>
                  <span className="text-sm font-bold text-zinc-200">₩{revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">주당 근무시간</span>
                  <span className="text-sm font-bold text-zinc-200">{hours}시간</span>
                </div>
                <div className="w-full h-px bg-zinc-800" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-300">시간당 가치 (월수익 ÷ 주시간 × 4.3)</span>
                  <span className="text-sm font-black text-[#D4AF37]">₩{hourlyValue.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleComplete}
                disabled={saving}
                className="w-full py-4 bg-[#D4AF37] text-[#0a0a0a] rounded-xl font-black text-sm tracking-wide disabled:opacity-40 hover:brightness-110 transition-all"
              >
                {saving ? "저장 중..." : "시스템 입장하기"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
