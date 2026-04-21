'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export default function GoalSetupPage() {
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkExistingSetup = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data: goalData } = await supabase.from('goals').select('id').eq('user_id', user.id).single()
      const { data: profileData } = await supabase.from('profiles').select('hourly_rate, weekend_rest').eq('id', user.id).single()

      if (goalData && profileData?.hourly_rate && profileData?.weekend_rest !== null) {
        router.push('/dashboard')
      } else {
        setStep(1)
      }
    }
    checkExistingSetup()
  }, [router])

  const handleFinalSubmit = async (isWeekendRest: boolean) => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error: goalError } = await supabase
        .from('goals')
        .insert([{ user_id: user.id, content: goal, status: 'ACTIVE' }])
      if (goalError) throw goalError
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          hourly_rate: Number(hourlyRate),
          weekend_rest: isWeekendRest
        })
        .eq('id', user.id)
      if (profileError) throw profileError

      setStep(5)
    } catch (err) {
      alert('Error saving settings.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 0) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <p className="text-zinc-800 tracking-[0.5em] text-[10px] animate-pulse">IDENTIFYING...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 font-pretendard overflow-hidden relative selection:bg-[#C2A35D] selection:text-black">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.025)_0%,_transparent_60%)] pointer-events-none z-0"></div>

      <AnimatePresence mode="wait">
        
        {step === 1 && (
          <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="z-10 text-center space-y-12">
            <div className="space-y-6">
              <h1 className="text-xl md:text-2xl font-light tracking-widest leading-relaxed">
                반갑습니다. <br />
                <span className="text-zinc-400 font-extralight text-sm">심사를 통과한 분들만 들어올 수 있는 공간입니다.</span>
              </h1>
              <p className="text-zinc-500 text-xs md:text-sm font-extralight leading-loose tracking-widest">
                이제부터 힘든 고민은 시스템이 대신 합니다. <br />
                대표님은 시키는 일에만 집중하세요.
              </p>
            </div>
            <button onClick={() => setStep(2)} className="px-12 py-4 border border-zinc-800 text-zinc-400 text-[10px] tracking-[0.3em] font-light hover:bg-white hover:text-black transition-all duration-700">시작하기</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="z-10 w-full max-w-2xl text-center space-y-16">
            <div className="space-y-6">
              <h2 className="text-2xl font-medium tracking-tight leading-snug">
                저희에게 맡길 <br />
                <span className="text-[#C2A35D]">딱 하나의 가장 큰 목표</span>를 적어주세요.
              </h2>
              <p className="text-zinc-400 text-sm font-light tracking-widest">결과만 적으시면 과정은 저희가 짜드립니다.</p>
            </div>
            <div className="border-b border-zinc-800 focus-within:border-[#C2A35D] transition-colors duration-1000">
              <input 
                type="text" 
                value={goal} 
                onChange={(e) => setGoal(e.target.value)} 
                placeholder="(예: 6개월 내 월 매출 1억 돌파, 신규 앱 런칭 등)"
                className="w-full bg-transparent py-6 text-center text-xl font-light focus:outline-none placeholder:text-zinc-500 text-white transition-colors"
                autoFocus
              />
            </div>
            <div className="space-y-10">
              <p className="text-zinc-400 text-[13px] font-light leading-[1.8] tracking-widest max-w-md mx-auto text-left break-keep">
                시스템은 대표님의 고유한 인지 경로를 학습합니다.<br />
                목표 변경 시 재설정 기간이 소요되니 신중히 입력해 주십시오.
              </p>
              <button onClick={() => setStep(3)} disabled={!goal.trim()} className="w-full py-5 bg-[#111] text-zinc-400 hover:bg-[#C2A35D] hover:text-black text-xs tracking-[0.4em] transition-all duration-700">다음으로</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="z-10 w-full max-w-2xl text-center space-y-16">
            <div className="space-y-4 text-center">
              <h2 className="text-2xl font-medium tracking-tight leading-snug">
                대표님의 <span className="text-[#C2A35D]">1시간은 얼마</span>인가요?
              </h2>
              <p className="text-zinc-500 text-[10px] font-extralight tracking-widest leading-relaxed">
                이 숫자를 알려주시면 시스템이 대표님의 시간을 아껴서 <br />
                돈을 얼마나 벌어줬는지 계산해 드릴게요.
              </p>
            </div>
            <div className="relative border-b border-zinc-800 focus-within:border-[#C2A35D] transition-colors duration-1000">
              <input 
                type="number" 
                value={hourlyRate} 
                onChange={(e) => setHourlyRate(e.target.value)} 
                className="w-full bg-transparent py-6 text-center text-4xl font-light focus:outline-none text-white"
                placeholder="0"
                autoFocus
              />
              <span className="absolute right-0 bottom-6 text-zinc-600 font-extralight text-sm">원</span>
            </div>
            <button onClick={() => setStep(4)} disabled={!hourlyRate} className="w-full py-5 bg-[#111] text-zinc-400 hover:bg-[#C2A35D] hover:text-black text-xs tracking-[0.4em] transition-all duration-700">다음 단계로</button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="z-10 w-full max-w-2xl text-center space-y-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-medium tracking-tight leading-snug break-keep">
                VVIP의 뇌 에너지는 <span className="text-[#C2A35D]">휴식할 때 가장 크게 증폭</span>됩니다.
              </h2>
              <p className="text-zinc-500 text-xs font-extralight tracking-widest leading-relaxed break-keep">
                주말(토, 일)에는 시스템의 모든 지시를 멈추고 완벽한 '인지적 단절'을 제공해 드릴까요?
              </p>
            </div>
            <div className="space-y-4 max-w-md mx-auto w-full">
              <button onClick={() => handleFinalSubmit(true)} disabled={loading} className="w-full py-6 border border-zinc-800 bg-[#0a0a0a] hover:border-[#C2A35D] transition-all duration-700 text-left px-8 group">
                <p className="text-zinc-400 group-hover:text-white text-sm font-light">네, 주말에는 뇌를 완전히 끄겠습니다.</p>
                <p className="text-zinc-600 text-[10px] mt-1">(상위 0.1%의 80%가 선택)</p>
              </button>
              <button onClick={() => handleFinalSubmit(false)} disabled={loading} className="w-full py-6 border border-zinc-800 bg-[#050505] hover:border-zinc-400 transition-all duration-700 text-left px-8 group">
                <p className="text-zinc-500 group-hover:text-zinc-300 text-sm font-light">아니요, 주말에도 성장을 위한 지침을 받겠습니다.</p>
              </button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="z-10 text-center space-y-10 w-full max-w-2xl mx-auto">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 rounded-full bg-[#C2A35D]/5 flex items-center justify-center shadow-[0_0_40px_rgba(194,163,93,0.3)] animate-pulse border border-[#C2A35D]/30 relative mx-auto mb-8">
              <svg className="w-10 h-10 text-[#C2A35D] drop-shadow-[0_0_8px_rgba(194,163,93,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </motion.div>

            <div className="space-y-5">
              <h2 className="text-[20px] md:text-[22px] text-white break-keep tracking-tight font-medium">
                목표가 시스템에 성공적으로 이식되었습니다.
              </h2>
              <p className="text-[18px] md:text-[20px] text-white font-bold break-keep tracking-tight">
                대표님의 역할은 끝났습니다. 이제 뇌를 끄십시오.
              </p>
              <p className="text-[14px] md:text-[15px] text-zinc-400 leading-relaxed break-keep font-light pt-2">
                시스템이 1,250만 개의 상위 1% 데이터를 기반으로<br />
                최적의 실행 경로를 분석합니다.
              </p>
            </div>

            <div className="pt-10 border-t border-zinc-800/80 w-full max-w-sm mx-auto mt-8">
              <p className="text-zinc-400 text-[15px] font-medium tracking-wide">
                내일 <span className="text-[#C2A35D] font-bold tracking-widest">05:00 AM</span>에 뵙겠습니다.
              </p>
            </div>

            <button onClick={() => router.push('/dashboard')} className="text-[10px] text-zinc-600 tracking-[0.5em] pt-8 hover:text-white transition-colors uppercase">대시보드로 이동</button>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  )
}
