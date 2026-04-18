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
      const { error } = await supabase.from('pending_users').insert([{ 
        name: info.name, 
        email: info.email,
        plan_type: plan,
        order_id: generatedOrderId,
        status: 'PENDING'
      }])
      
      if (error) throw error

      setTimeout(() => {
        router.push('/dashboard/setup')
      }, 3000)

    } catch (err) {
      console.error(err)
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-4 md:px-6 font-pretendard overflow-hidden relative">
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#C2A35D] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.04] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-white rounded-full mix-blend-screen filter blur-[200px] opacity-[0.02] pointer-events-none"></div>

      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8 z-10 w-full max-w-md">
            <div className="relative w-24 h-24 mx-auto mb-10 flex items-center justify-center">
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute w-12 h-12 bg-[#C2A35D] blur-xl rounded-full"></motion.div>
              <div className="absolute inset-0 border-[1px] border-white/5 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.02)]"></div>
              <motion.div animate={{ rotate: 360, rotateX: 15, rotateY: 15 }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-[1.5px] border-[#C2A35D] border-t-transparent border-r-transparent rounded-full" />
            </div>
            <p className="text-[#C2A35D] text-[10px] tracking-[0.5em] font-bold uppercase drop-shadow-[0_0_10px_rgba(194,163,93,0.5)]">비밀 통로 만드는 중...</p>
            <p className="text-zinc-500 text-xs font-extralight tracking-widest leading-relaxed">
              대표님만 들어올 수 있는 <br />안전한 공간을 만들고 있습니다.
            </p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl z-10">
            <div className="border border-white/10 bg-white/[0.02] backdrop-blur-2xl rounded-3xl p-8 md:p-14 shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C2A35D]/30 to-transparent"></div>

              {step === 1 ? (
                <div className="space-y-12 text-center relative z-10">
                  <div className="space-y-4">
                    <h1 className="text-2xl font-light tracking-tight text-white drop-shadow-md">고민을 넘기기 위해 필요한 정보</h1>
                    <p className="text-zinc-400 text-xs font-extralight tracking-widest leading-relaxed">
                      입력하신 이메일로 매일 아침 09:00 할 일이 발송됩니다. <br />
                      안전을 위해 비밀번호 없이 바로 들어올 수 있는 링크를 보내드립니다.
                    </p>
                  </div>
                  <div className="space-y-5">
                    <input type="text" placeholder="대표님 성함" className="w-full bg-black/40 border border-white/5 rounded-xl py-5 text-center focus:outline-none focus:border-[#C2A35D]/50 focus:bg-black/60 focus:shadow-[0_0_20px_rgba(194,163,93,0.1)] transition-all font-light text-zinc-200 placeholder:text-zinc-600" onChange={(e) => setInfo({...info, name: e.target.value})} />
                    <input type="email" placeholder="이메일 주소" className="w-full bg-black/40 border border-white/5 rounded-xl py-5 text-center focus:outline-none focus:border-[#C2A35D]/50 focus:bg-black/60 focus:shadow-[0_0_20px_rgba(194,163,93,0.1)] transition-all font-light text-zinc-200 placeholder:text-zinc-600" onChange={(e) => setInfo({...info, email: e.target.value})} />
                    <button onClick={() => setStep(2)} disabled={!info.name || !info.email} className="w-full py-6 mt-4 bg-white text-black text-[11px] tracking-[0.4em] font-bold rounded-xl hover:bg-[#C2A35D] hover:shadow-[0_0_30px_rgba(194,163,93,0.4)] transition-all duration-500 uppercase disabled:opacity-20 disabled:hover:bg-white disabled:hover:shadow-none">
                      다음 단계로
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-12 relative z-10">
                  <div className="text-center space-y-4">
                    <h1 className="text-2xl font-light tracking-tight text-white drop-shadow-md">결제 방식 선택</h1>
                  </div>
                  <div className="space-y-5">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPlan('MONTHLY')} 
                      className={`w-full p-8 border rounded-2xl text-left transition-all duration-500 relative overflow-hidden group ${plan === 'MONTHLY' ? 'border-[#C2A35D]/60 bg-[#C2A35D]/10 shadow-[0_0_20px_rgba(194,163,93,0.15)]' : 'border-white/10 bg-black/40 hover:border-white/30'}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-center relative z-10">
                        <span className={`text-sm font-light ${plan === 'MONTHLY' ? 'text-white' : 'text-zinc-400'}`}>매월 결제하기</span>
                        <span className={`text-sm font-mono ${plan === 'MONTHLY' ? 'text-[#C2A35D]' : 'text-zinc-500'}`}>₩ 390,000</span>
                      </div>
                    </motion.button>
                    
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPlan('YEARLY')} 
                      className={`w-full p-8 border rounded-2xl text-left transition-all duration-500 relative overflow-hidden group ${plan === 'YEARLY' ? 'border-[#C2A35D]/60 bg-[#C2A35D]/10 shadow-[0_0_30px_rgba(194,163,93,0.2)]' : 'border-white/10 bg-black/40 hover:border-white/30'}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-0 right-0 bg-[#C2A35D] text-black text-[9px] font-bold px-4 py-1.5 text-center uppercase tracking-widest shadow-[0_5px_15px_rgba(194,163,93,0.4)]">가장 좋음</div>
                      <div className="space-y-3 relative z-10">
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-light ${plan === 'YEARLY' ? 'text-white' : 'text-zinc-400'}`}>1년 치 한 번에 결제하기</span>
                          <span className={`text-sm font-mono ${plan === 'YEARLY' ? 'text-[#C2A35D]' : 'text-zinc-500'}`}>₩ 3,900,000</span>
                        </div>
                        <p className={`text-[10px] font-extralight break-keep leading-relaxed ${plan === 'YEARLY' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          대표님의 귀한 에너지를 매월 결제하는 데 낭비하지 마세요.
                        </p>
                      </div>
                    </motion.button>
                  </div>
                  <button onClick={handleStartPayment} className="w-full py-6 bg-[#C2A35D] text-black text-[11px] tracking-[0.4em] font-bold rounded-xl hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(194,163,93,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                    시스템에 모든 고민 맡기기
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
