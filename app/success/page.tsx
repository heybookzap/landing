'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const [step, setStep] = useState('GOAL')
  const [goal, setGoal] = useState('')
  const router = useRouter()

  const handleConfirm = () => {
    if (confirm("경고: 목표 변경 시 시스템 재설정에 2주의 인지 비용이 발생합니다. 확정하시겠습니까?")) {
      setStep('UPSELL')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      {step === 'GOAL' && (
        <div className="max-w-2xl w-full space-y-12">
          <h1 className="text-3xl font-bold tracking-tight">거대 목표(Dream Outcome) 설정</h1>
          <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="이루고 싶은 단 하나의 결과" className="w-full bg-transparent border-b-2 border-zinc-800 py-6 text-2xl text-center outline-none focus:border-[#C2A35D] transition-all" />
          <button onClick={handleConfirm} className="bg-[#C2A35D] text-black px-12 py-4 rounded-full font-bold">시스템 위임하기</button>
        </div>
      )}

      {step === 'UPSELL' && (
        <div className="max-w-md w-full p-10 border-2 border-[#C2A35D] rounded-3xl bg-zinc-950 space-y-8 animate-in zoom-in">
          <h2 className="text-xl font-bold text-[#C2A35D]">PREMIUM 1:1 CONCIERGE</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">30명 한정 밀착 케어 플랜으로 목표 달성 속도를 3배 앞당기시겠습니까?</p>
          <button className="w-full bg-white text-black py-4 rounded-xl font-bold">월 1,500,000원에 업그레이드</button>
          <button onClick={() => router.push('/dashboard')} className="text-zinc-600 text-xs underline">대시보드로 이동</button>
        </div>
      )}
    </div>
  )
}
