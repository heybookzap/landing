'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ApplyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
    else router.push('/pricing')
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 w-full max-w-2xl mx-auto h-screen animate-in fade-in duration-1000">
      <p className="text-[#C2A35D] text-[10px] tracking-[0.3em] font-mono mb-12 uppercase">
        입장 테스트 : 질문 {step} / 3
      </p>

      {step === 1 && (
        <div className="w-full space-y-12 text-center animate-in slide-in-from-right-8">
          <h2 className="text-2xl font-light tracking-tight leading-relaxed">
            지금 당신을 가장 힘들게 하는<br />고민은 무엇인가요?
          </h2>
          <div className="space-y-4">
            {['너무 잘하려다 보니까 시작조차 못 해요', '생각과 정보가 너무 많아서 머리가 아파요', '뭘 먼저 해야 할지 몰라서 그냥 다 놓고 싶어요'].map((item) => (
              <button key={item} onClick={handleNext} className="w-full py-6 border border-[#1A1A1A] bg-[#0A0A0A] text-zinc-400 text-sm font-light hover:border-[#C2A35D] hover:text-white transition-all">
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="w-full space-y-12 text-center animate-in slide-in-from-right-8">
          <h2 className="text-2xl font-light tracking-tight leading-relaxed">
            성공하기 위해, 복잡한 생각은<br />우리에게 모두 맡길 준비가 되었나요?
          </h2>
          <div className="space-y-4">
            <button onClick={handleNext} className="w-full py-6 border border-[#1A1A1A] bg-[#0A0A0A] text-zinc-400 text-sm font-light hover:border-[#C2A35D] hover:text-white transition-all">
              네, 준비되었습니다. 저는 결과만 보겠습니다.
            </button>
            <button className="w-full py-6 border border-[#1A1A1A] bg-[#0A0A0A] text-[#8B0000] text-sm font-light opacity-50 cursor-not-allowed">
              아니오, 여전히 제가 하나부터 열까지 다 신경 쓸래요.
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="w-full space-y-12 text-center animate-in slide-in-from-right-8">
          <h2 className="text-2xl font-light tracking-tight leading-relaxed">
            마지막으로, 합격 소식을 받을<br />이름과 이메일을 적어주세요.
          </h2>
          <div className="space-y-6">
            <input type="text" placeholder="이름" className="w-full bg-transparent border-b border-[#1A1A1A] py-4 text-center text-sm outline-none focus:border-[#C2A35D] transition-all font-light tracking-widest text-white" />
            <input type="email" placeholder="이메일" className="w-full bg-transparent border-b border-[#1A1A1A] py-4 text-center text-sm outline-none focus:border-[#C2A35D] transition-all font-light tracking-widest text-white" />
          </div>
          <button onClick={handleNext} className="w-full bg-[#C2A35D] text-[#050505] py-5 font-bold text-xs tracking-[0.2em] mt-8 hover:bg-white transition-all">
            테스트 제출하고 결과 보기
          </button>
        </div>
      )}
    </main>
  )
}
