'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LeadMagnetPage() {
  const router = useRouter()
  const [selectedVal, setSelectedVal] = useState<number | null>(null)
  const [loss, setLoss] = useState(0)

  useEffect(() => {
    if (!selectedVal) return
    const targetLoss = selectedVal * 4 * 30 
    let current = 0
    const interval = setInterval(() => {
      current += targetLoss / 50
      if (current >= targetLoss) {
        setLoss(targetLoss)
        clearInterval(interval)
      } else {
        setLoss(Math.floor(current))
      }
    }, 20)
    return () => clearInterval(interval)
  }, [selectedVal])

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 w-full max-w-3xl mx-auto text-center animate-in fade-in duration-1000">
      <h1 className="text-4xl md:text-5xl font-light tracking-tighter leading-tight mb-16">
        당신의 1시간은<br />얼마짜리인가요?
      </h1>

      {!selectedVal ? (
        <div className="flex flex-col md:flex-row gap-6 w-full">
          {[30000, 50000, 100000].map((val) => (
            <button
              key={val}
              onClick={() => setSelectedVal(val)}
              className="flex-1 border border-[#1A1A1A] bg-[#0A0A0A] py-8 text-lg font-mono tracking-widest text-zinc-400 hover:border-[#C2A35D] hover:text-[#C2A35D] transition-all duration-500"
            >
              ₩{val.toLocaleString()}
            </button>
          ))}
        </div>
      ) : (
        <div className="w-full space-y-16 animate-in slide-in-from-bottom-8 duration-700">
          <div className="space-y-4">
            <p className="text-zinc-500 text-sm tracking-widest uppercase">한 달 동안 길바닥에 버리는 돈</p>
            <p className="text-6xl md:text-7xl font-mono tracking-tighter text-[#8B0000]">
              -₩{loss.toLocaleString()}
            </p>
            <p className="text-zinc-400 text-sm font-light mt-6 leading-relaxed">
              매일 아침 무엇을 할지 고민하고 미루는 4시간.<br />
              그 시간 동안 당신의 돈과 시간은 조용히 사라지고 있습니다.
            </p>
          </div>
          
          <button
            onClick={() => router.push('/apply')}
            className="border border-[#C2A35D] bg-transparent text-[#C2A35D] px-12 py-5 text-sm tracking-[0.2em] hover:bg-[#C2A35D] hover:text-black transition-all duration-500"
          >
            내 시간 지키기 테스트 시작
          </button>
        </div>
      )}
    </main>
  )
}
