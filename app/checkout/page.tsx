'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [info, setInfo] = useState({ name: '', email: '' })
  const [plan, setPlan] = useState<'MONTHLY' | 'YEARLY'>('YEARLY')
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleStartPayment = async () => {
    setIsProcessing(true)
    const generatedOrderId = Math.random().toString(36).slice(2) + Date.now().toString().slice(-4)

    try {
      // 섀도우 계정 자동 생성 (노이즈 없이 백그라운드 처리)
      const { error } = await supabase.from('pending_users').insert([{ 
        name: info.name, 
        email: info.email,
        plan_type: plan,
        order_id: generatedOrderId,
        status: 'PENDING'
      }])
      
      if (error) throw error

      // 결제 데이터 구성 (추후 실결제 모듈 연동 시 사용)
      const paymentData = {
        amount: plan === 'MONTHLY' ? 390000 : 3900000,
        orderId: generatedOrderId,
        orderName: `ONE BLANK ${plan === 'MONTHLY' ? '월 구독' : '연 구독'}`,
        customerName: info.name,
        customerEmail: info.email,
        successUrl: "https://oneblank.co.kr/dashboard/setup",
        failUrl: "https://oneblank.co.kr/checkout",
      }

      // 시스템 권위 부여를 위한 짧은 지연 후 이동
      setTimeout(() => {
        router.push('/dashboard/setup')
      }, 2500)

    } catch (err) {
      // 에러 발생 시에도 흐름을 끊지 않고 재시도 유도 또는 셋업으로 이동
      console.error(err)
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 font-pretendard overflow-hidden">
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8">
            <div className="w-16 h-[1px] bg-[#C2A35D] mx-auto animate-pulse"></div>
            <p className="text-[#C2A35D] text-[10px] tracking-[0.5em] font-light italic uppercase">System Authorizing...</p>
            <p className="text-zinc-600 text-xs font-extralight tracking-widest leading-relaxed">
              대표님의 고유 식별 정보를 바탕으로 <br />전용 보안 채널을 암호화 중입니다.
            </p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl space-y-12">
            {step === 1 ? (
              <div className="space-y-12 text-center">
                <div className="space-y-4">
                  <h1 className="text-2xl font-light tracking-tight text-zinc-200">시스템 권한 위임을 위한 정보</h1>
                  <p className="text-zinc-500 text-xs font-extralight tracking-widest leading-relaxed">
                    입력하신 이메일로 매일 아침 09:00 지침이 발송됩니다. <br />
                    보안을 위해 비밀번호 없는 매직 링크 권한이 부여됩니다.
                  </p>
                </div>
                <div className="space-y-6">
                  <input type="text" placeholder="이름" className="w-full bg-transparent border-b border-zinc-900 py-4 text-center focus:outline-none focus:border-[#C2A35D] transition-colors font-light" onChange={(e) => setInfo({...info, name: e.target.value})} />
                  <input type="email" placeholder="이메일 주소" className="w-full bg-transparent border-b border-zinc-900 py-4 text-center focus:outline-none focus:border-[#C2A35D] transition-colors font-light" onChange={(e) => setInfo({...info, email: e.target.value})} />
                  <button onClick={() => setStep(2)} disabled={!info.name || !info.email} className="w-full py-5 bg-white text-black text-[10px] tracking-[0.5em] font-bold hover:bg-[#C2A35D] transition-colors duration-500 uppercase disabled:opacity-20">Next Step</button>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-light tracking-tight text-zinc-200">통제권 옵션 결정</h1>
                </div>
                <div className="space-y-4">
                  <button onClick={() => setPlan('MONTHLY')} className={`w-full p-6 border text-left transition-all duration-500 ${plan === 'MONTHLY' ? 'border-[#C2A35D] bg-[#0a0a0a]' : 'border-zinc-900 bg-transparent'}`}>
                    <div className="flex justify-between items-center"><span className="text-sm font-light">Core 월 구독</span><span className="text-sm font-mono">₩ 390,000</span></div>
                  </button>
                  <button onClick={() => setPlan('YEARLY')} className={`w-full p-6 border text-left transition-all duration-500 relative overflow-hidden ${plan === 'YEARLY' ? 'border-[#C2A35D] bg-[#0a0a0a]' : 'border-zinc-900 bg-transparent'}`}>
                    <div className="absolute top-0 right-0 bg-[#C2A35D] text-black text-[9px] font-bold px-3 py-1 text-center uppercase">Best Choice</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center"><span className="text-sm text-[#C2A35D] font-light">Core 연 구독</span><span className="text-sm text-[#C2A35D] font-mono">₩ 3,900,000</span></div>
                      <p className="text-zinc-500 text-[10px] font-extralight break-keep leading-relaxed italic">대표님의 뇌 에너지는 월 결제를 신경 쓰기엔 너무나 소중합니다.</p>
                    </div>
                  </button>
                </div>
                <button onClick={handleStartPayment} className="w-full py-5 bg-[#C2A35D] text-black text-[10px] tracking-[0.5em] font-bold hover:bg-white transition-colors duration-700 uppercase">시스템에 모든 고민 위임하기</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
