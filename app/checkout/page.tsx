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
    try {
      const { error } = await supabase.from('pending_users').insert([{ 
        name: info.name, 
        email: info.email,
        plan_type: plan,
        status: 'PENDING'
      }])
      
      if (error) throw error

      const paymentData = {
        amount: plan === 'MONTHLY' ? 390000 : 3900000,
        orderId: Math.random().toString(36).slice(2),
        orderName: `ONE BLANK ${plan === 'MONTHLY' ? '월 구독' : '연 구독'}`,
        customerName: info.name,
        customerEmail: info.email,
        successUrl: "https://oneblank.co.kr/dashboard/setup",
        failUrl: "https://oneblank.co.kr/checkout",
      }

      setTimeout(() => {
        router.push('/dashboard/setup')
      }, 2500)

    } catch (err) {
      alert('결제 준비 중 오류가 발생했습니다.')
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 font-pretendard overflow-hidden">
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8">
            <div className="w-16 h-[1px] bg-[#C2A35D] mx-auto animate-pulse"></div>
            <p className="text-[#C2A35D] text-[10px] tracking-[0.5em] font-light italic">SYSTEM AUTHORIZING...</p>
            <p className="text-zinc-600 text-xs font-extralight tracking-widest">대표님의 정보를 바탕으로 전용 보안 채널을 생성 중입니다.</p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl space-y-12">
            {step === 1 ? (
              <div className="space-y-12 text-center">
                <div className="space-y-4">
                  <h1 className="text-2xl font-light tracking-tight">시스템 위임을 위한 기본 정보</h1>
                  <p className="text-zinc-500 text-xs font-extralight tracking-widest leading-relaxed">입력하신 이메일로 매일 아침 09:00 지침 발송 및 <br />비밀번호 없는 매직 링크 권한이 부여됩니다.</p>
                </div>
                <div className="space-y-6">
                  <input type="text" placeholder="이름" className="w-full bg-transparent border-b border-zinc-900 py-4 text-center focus:outline-none focus:border-[#C2A35D] transition-colors" onChange={(e) => setInfo({...info, name: e.target.value})} />
                  <input type="email" placeholder="이메일 주소" className="w-full bg-transparent border-b border-zinc-900 py-4 text-center focus:outline-none focus:border-[#C2A35D] transition-colors" onChange={(e) => setInfo({...info, email: e.target.value})} />
                  <button onClick={() => setStep(2)} disabled={!info.name || !info.email} className="w-full py-5 bg-white text-black text-[10px] tracking-[0.5em] font-bold">다음으로</button>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-light tracking-tight">결제 옵션 선택</h1>
                </div>
                <div className="space-y-4">
                  <button onClick={() => setPlan('MONTHLY')} className={`w-full p-6 border text-left transition-all ${plan === 'MONTHLY' ? 'border-[#C2A35D] bg-[#0a0a0a]' : 'border-zinc-900 bg-transparent'}`}>
                    <div className="flex justify-between items-center"><span className="text-sm">Core 월 구독</span><span className="text-sm">₩ 390,000</span></div>
                  </button>
                  <button onClick={() => setPlan('YEARLY')} className={`w-full p-6 border text-left transition-all relative overflow-hidden ${plan === 'YEARLY' ? 'border-[#C2A35D] bg-[#0a0a0a]' : 'border-zinc-900 bg-transparent'}`}>
                    <div className="absolute top-0 right-0 bg-[#C2A35D] text-black text-[9px] font-bold px-3 py-1 text-center">BEST CHOICE</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center"><span className="text-sm text-[#C2A35D]">Core 연 구독</span><span className="text-sm text-[#C2A35D]">₩ 3,900,000</span></div>
                      <p className="text-zinc-500 text-[10px] font-extralight break-keep leading-relaxed">매월 결제를 신경 쓰는 뇌 에너지조차 아깝다면, 1년에 단 한 번만 결정하십시오.</p>
                    </div>
                  </button>
                </div>
                <button onClick={handleStartPayment} className="w-full py-5 bg-[#C2A35D] text-black text-[10px] tracking-[0.5em] font-bold">내 머릿속 고민 모두 맡기기</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
