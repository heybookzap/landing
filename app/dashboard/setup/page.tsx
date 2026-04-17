'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SetupPage() {
  const router = useRouter()
  const [goal, setGoal] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleComplete = async () => {
    if (!goal) return
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('user_goals')
        .insert([{ dream_outcome: goal, status: 'active' }])

      if (error) throw error
      
      router.push('/dashboard')
    } catch (error) {
      console.error('System Error:', error)
      alert('시스템 기록 중 오류가 발생했습니다. 다시 시도해주십시오.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center h-screen px-6 animate-in fade-in duration-1000">
      <div className="w-full max-w-3xl text-center space-y-16">
        <h1 className="text-2xl md:text-3xl font-light tracking-tight leading-relaxed">
          우리에게 맡길<br />
          <span className="text-[#C2A35D] font-medium">'단 하나의 진짜 목표'를 적어주세요.</span>
        </h1>
        
        <input 
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          disabled={isSubmitting}
          className="w-full bg-transparent border-b border-[#1A1A1A] py-8 text-center text-2xl outline-none focus:border-[#C2A35D] transition-colors font-light text-white tracking-tight disabled:opacity-50"
        />

        <p className="text-zinc-600 text-sm font-light tracking-tight">
          원하는 결과만 적어주세요. 어떻게 할지는 우리가 다 쪼개줍니다.
        </p>

        <button 
          onClick={handleComplete}
          disabled={!goal || isSubmitting}
          className={`px-12 py-5 text-xs tracking-[0.2em] transition-all duration-500 ${
            goal && !isSubmitting ? 'bg-white text-black hover:bg-[#C2A35D]' : 'bg-[#0A0A0A] text-zinc-700 cursor-not-allowed border border-[#1A1A1A]'
          }`}
        >
          {isSubmitting ? '목표 이식 중...' : '내 목표 맡기기'}
        </button>
      </div>
    </main>
  )
}
