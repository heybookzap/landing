'use client'

import Footer from '@/components/Footer'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-sm w-full space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold tracking-tighter uppercase text-[#C2A35D]">Admission Process</h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              ONE BLANK는 아무나 받지 않습니다. 대표님의 현재 상황과 고민을 분석해, 저희가 진짜로 도와드릴 수 있는 분만 모십니다.
            </p>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <input type="text" placeholder="NAME" className="w-full bg-transparent border-b border-zinc-800 py-3 outline-none focus:border-[#C2A35D] transition-all font-light tracking-widest text-sm" />
              <input type="email" placeholder="EMAIL" className="w-full bg-transparent border-b border-zinc-800 py-3 outline-none focus:border-[#C2A35D] transition-all font-light tracking-widest text-sm" />
              <input type="tel" placeholder="CONTACT" className="w-full bg-transparent border-b border-zinc-800 py-3 outline-none focus:border-[#C2A35D] transition-all font-light tracking-widest text-sm" />
            </div>
            <button className="w-full bg-[#C2A35D] text-black py-4 rounded-sm font-bold text-xs tracking-[0.2em] hover:bg-[#D4B56F] transition-all">
              지원서 제출하기
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
