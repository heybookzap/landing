'use client'

import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const router = useRouter()

  const handleCheckout = () => {
    if (confirm("주의: 결제하는 순간 바로 시스템이 당신의 일을 대신하기 시작합니다. 도중에 목표를 바꾸면 시스템이 다시 적응하는 데 2주가 걸립니다. 진짜로 내 시간을 아낄 준비가 되었나요?")) {
      router.push('/checkout')
    }
  }

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-screen animate-in fade-in duration-1000">
      <div className="text-center space-y-6 mb-24">
        <p className="text-[#C2A35D] text-xs tracking-[0.3em] font-mono uppercase">테스트 합격</p>
        <h1 className="text-3xl font-light tracking-tight leading-relaxed">
          축하합니다. 테스트를 통과했습니다.<br />1년에 딱 한 번만 결제하고, 앞으로는 아무것도 신경 쓰지 마세요.
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-center">
        <div className="border border-[#1A1A1A] bg-[#0A0A0A] p-10 opacity-50 flex flex-col items-center text-center">
          <span className="text-[10px] text-zinc-500 font-mono tracking-widest mb-4">한 달 특별 관리</span>
          <span className="text-2xl font-light mb-2">₩1,500,000</span>
          <span className="text-[10px] text-[#8B0000] font-bold tracking-widest mt-8">모두 매진 [30/30]</span>
        </div>

        <div className="border border-[#C2A35D] bg-[#050505] p-12 scale-105 z-10 flex flex-col items-center text-center shadow-[0_0_30px_rgba(194,163,93,0.1)] relative">
          <div className="absolute -top-3 bg-[#C2A35D] text-black text-[9px] font-bold px-4 py-1 tracking-widest uppercase">
            가장 많이 선택하는 요금
          </div>
          <span className="text-[10px] text-[#C2A35D] font-mono tracking-widest mb-4">1년 완벽 보호</span>
          <span className="text-4xl font-light mb-8 text-white">₩3,900,000</span>
          <p className="text-xs text-zinc-400 font-light leading-relaxed mb-10">
            매달 결제할지 말지 고민하는 시간도 아깝습니다.<br />365일 내내 우리 시스템이 당신의 시간을 지켜줍니다.
          </p>
          <button onClick={handleCheckout} className="w-full bg-[#C2A35D] text-black py-5 text-xs font-bold tracking-[0.2em] hover:bg-white transition-all">
            내 시간 지키기 시작
          </button>
        </div>

        <div className="border border-[#1A1A1A] bg-[#0A0A0A] p-10 flex flex-col items-center text-center">
          <span className="text-[10px] text-zinc-500 font-mono tracking-widest mb-4">한 달 기본 보호</span>
          <span className="text-2xl font-light mb-2">₩390,000</span>
          <span className="text-[10px] text-zinc-600 font-light mt-8 tracking-widest">기본 기능만 사용</span>
        </div>
      </div>
    </main>
  )
}
