"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';

export default function StartPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");

  useEffect(() => {
    const registerUser = async () => {
      const email = localStorage.getItem('customerEmail');
      const password = localStorage.getItem('customerPassword');
      const name = localStorage.getItem('customerName');

      if (email && password) {
        const { error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: { full_name: name }
          }
        });

        if (error && error.message.includes('already registered')) {
          await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });
        }

        localStorage.removeItem('customerPassword');
      }
    };

    registerUser();
  }, []);

  const nextStep = () => setStep((prev) => prev + 1);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden font-pretendard selection:bg-[#C2A35D] selection:text-black">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.03)_0%,_transparent_70%)] pointer-events-none z-0"></div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.section
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex flex-col items-center justify-center relative z-10 px-6 text-center"
          >
            <div className="space-y-12">
              <div className="space-y-4">
                <p className="text-zinc-200 text-lg font-light tracking-tight">입장이 허가되었습니다.</p>
                <p className="text-zinc-200 text-lg font-light tracking-tight">까다로운 심사를 통과하신 것을 환영합니다.</p>
              </div>
              <button 
                onClick={nextStep}
                className="px-24 py-5 border border-white text-white text-sm font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all"
              >
                다음
              </button>
              <p className="text-zinc-400 text-sm font-light leading-relaxed pt-4">
                지금 이 순간부터, 대표님의 뇌를 갉아먹던 모든 <br />
                <span className="font-serif italic font-bold text-[#C2A35D] text-lg">'의사결정 피로'</span>는 시스템이 온전히 대신 짊어집니다.
              </p>
            </div>
          </motion.section>
        )}

        {step === 2 && (
          <motion.section
            key="goal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex flex-col items-center justify-center relative z-10 px-6 text-center"
          >
            <div className="space-y-16 w-full max-w-2xl">
              <div className="space-y-4">
                <p className="text-zinc-200 text-lg font-light">시스템에 위임할 단 하나의</p>
                <h2 className="font-serif italic font-bold text-[#C2A35D] text-3xl tracking-tight uppercase">
                  '거대 목표(Dream Outcome)'
                </h2>
                <p className="text-zinc-200 text-lg font-light">를 입력하십시오.</p>
                <p className="text-zinc-600 text-xs font-light pt-2">(예: 6개월 내 월 매출 1억 돌파, 두 번째 브랜드 성공적 런칭 등)</p>
              </div>
              <textarea 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="결과만 적으십시오. 과정은 시스템이 쪼갭니다."
                rows={1}
                className="w-full py-6 text-2xl text-zinc-100 bg-transparent border-b border-zinc-800 focus:border-[#C2A35D] outline-none transition-colors text-center font-light placeholder:text-zinc-800"
              />
              <div className="space-y-8">
                <p className="text-zinc-500 text-xs font-light leading-relaxed max-w-md mx-auto">
                  이 목표를 기준으로 시스템이 대표님만의 맞춤형 실행 경로를 학습합니다. 목표 변경 시 재설정 기간이 소요되니 신중히 입력해 주십시오.
                </p>
                <button 
                  onClick={nextStep}
                  disabled={!goal.trim()}
                  className="w-full py-6 bg-zinc-900 text-zinc-500 text-sm font-bold tracking-[0.2em] uppercase disabled:opacity-50 hover:bg-[#C2A35D] hover:text-black transition-all"
                >
                  내 뇌의 통제권 위임하기
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {step === 3 && (
          <motion.section
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen flex flex-col items-center justify-center relative z-10 px-6 text-center"
          >
            <div className="space-y-16">
              <div className="w-20 h-20 border border-[#C2A35D] rounded-full flex items-center justify-center bg-white/5 mx-auto">
                <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
                  <path d="M12 2L3 6V14C3 19.5 6.8 24.7 12 26C17.2 24.7 21 19.5 21 14V6L12 2Z" stroke="#C2A35D" strokeWidth="2" />
                </svg>
              </div>
              <div className="space-y-6">
                <p className="text-zinc-200 text-lg font-light">목표가 시스템에 성공적으로 <span className="font-serif italic font-bold text-[#C2A35D]">이식</span>되었습니다.</p>
                <p className="text-zinc-200 text-lg font-light">대표님의 역할은 끝났습니다. 이제 <span className="font-serif italic font-bold text-[#C2A35D]">뇌를 끄십시오.</span></p>
              </div>
              <p className="text-zinc-400 text-base font-light leading-relaxed">
                시스템이 <span className="font-serif italic font-bold text-[#C2A35D]">1,250만</span> 개의 상위 1% 데이터를 기반으로 <br />
                이 목표를 분해<span className="text-[#C2A35D] font-bold ml-1">(Slicing)</span>하기 시작합니다.
              </p>
              <p className="text-zinc-200 text-lg font-light">
                <span className="font-serif italic font-bold text-[#C2A35D]">내일 05:00 AM</span>, 첫 번째 단일 지침서와 함께 찾아뵙겠습니다.
              </p>
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-zinc-600 text-xs tracking-widest uppercase hover:text-white transition-colors"
              >
                [ 시스템 대기 모드 진입 ]
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
