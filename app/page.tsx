'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export default function LandingPage() {
  const router = useRouter()
  const [selectedVal, setSelectedVal] = useState<number | null>(null)
  const [loss, setLoss] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

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

  const handleStartPayment = async () => {
    setIsProcessing(true)
    setIsMenuOpen(false) 
    const generatedOrderId = Math.random().toString(36).slice(2) + Date.now().toString().slice(-4)

    try {
      const { error } = await supabase.from('pending_users').insert([{ 
        name: 'GUEST',
        email: 'guest@oneblank.co.kr',
        plan_type: 'YEARLY',
        order_id: generatedOrderId,
        status: 'PENDING'
      }])
      
      if (error) throw error

      setTimeout(() => {
        router.push('/checkout')
      }, 3000)

    } catch (err) {
      alert('시스템에 들어가는 중 오류가 발생했습니다.')
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden font-pretendard">
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#C2A35D] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.03] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="z-10 flex flex-col items-center w-full max-w-3xl px-6 py-24"
      >
        <div className="mb-20 flex flex-col items-center">
          <motion.div 
            initial={{ height: 0 }} 
            animate={{ height: "40px" }} 
            transition={{ duration: 1.5, delay: 0.5 }}
            className="w-[1px] bg-[#C2A35D] mb-8"
          ></motion.div>
          <h1 className="text-[#C2A35D] text-[10px] tracking-[0.8em] font-light uppercase">One Blank</h1>
        </div>

        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8 z-10 w-full">
              <div className="relative w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute w-10 h-10 bg-[#C2A35D] blur-xl rounded-full"></motion.div>
                <div className="absolute inset-0 border-[1px] border-white/10 rounded-full"></div>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-[1px] border-[#C2A35D] border-t-transparent rounded-full" />
              </div>
              <p className="text-[#C2A35D] text-[10px] tracking-[0.5em] font-light uppercase">비밀 통로 만드는 중...</p>
              <p className="text-zinc-600 text-xs font-extralight tracking-widest leading-relaxed">
                대표님만 들어올 수 있는 <br />안전한 공간을 만들고 있습니다.
              </p>
            </motion.div>
          ) : !selectedVal ? (
            <motion.div 
              key="selection" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0, y: -20 }}
              className="w-full text-center space-y-16"
            >
              <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-[1.4] break-keep drop-shadow-md">
                당신의 1시간은 <br />얼마짜리인가요?
              </h2>
              <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl mx-auto px-4">
                {[30000, 50000, 100000].map((val) => (
                  <motion.button
                    key={val}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedVal(val)}
                    className="flex-1 py-8 border border-white/10 bg-white/[0.02] backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-xl text-sm tracking-[0.2em] font-light text-zinc-400 hover:border-[#C2A35D]/60 hover:text-white transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    ₩ {val.toLocaleString()}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full flex flex-col items-center space-y-16"
            >
              <div className="text-center space-y-6 w-full">
                <p className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase font-light">한 달 동안 길바닥에 버리는 돈</p>
                <div className="bg-gradient-to-b from-black/80 to-transparent border border-red-900/30 backdrop-blur-md rounded-3xl py-12 px-6 shadow-[0_20px_50px_rgba(139,0,0,0.1)] relative overflow-hidden max-w-xl mx-auto">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
                  <p className="text-5xl md:text-7xl font-light tracking-tighter text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                    - ₩ {loss.toLocaleString()}
                  </p>
                </div>
                
                <div className="space-y-2 pt-6">
                  <p className="text-zinc-400 text-sm font-extralight leading-relaxed break-keep">
                    매일 아침 무엇을 할지 고민하고 미루는 4시간. <br />
                    그 시간 동안 대표님의 진짜 돈이 조용히 사라지고 있습니다.
                  </p>
                  <p className="text-zinc-300 text-sm font-light leading-relaxed break-keep pt-4">
                    생각이 너무 많아 머리가 아프다면, <br />
                    이제 그 고민을 저희 시스템에 모두 넘기십시오.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col w-full max-w-md space-y-4 px-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartPayment}
                  className="w-full py-6 bg-white text-black text-[11px] tracking-[0.3em] font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(194,163,93,0.4)] hover:bg-[#C2A35D] transition-all duration-500"
                >
                  월 39만 원에 내 머릿속 고민 모두 맡기기
                </motion.button>
                
                <button 
                  onClick={() => setIsMenuOpen(true)}
                  className="w-full py-5 border border-white/10 bg-white/[0.02] backdrop-blur-sm rounded-xl text-zinc-500 text-[10px] tracking-[0.3em] hover:text-white hover:border-[#C2A35D]/50 transition-all duration-500"
                >
                  대체 무슨 서비스인지 확인하기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#050505]/90 backdrop-blur-xl flex flex-col items-center px-6 overflow-y-auto pt-24 pb-24"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-10 right-10 text-zinc-500 text-xs tracking-widest hover:text-white transition-colors"
            >
              [ 닫기 ]
            </button>

            <div className="w-full max-w-3xl space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[#C2A35D] drop-shadow-md">우리가 39만 원을 받고 해드리는 일</h2>
                <p className="text-zinc-400 text-xs font-extralight tracking-widest">초등학생도 이해할 수 있도록 솔직하게 말씀드립니다.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "1. 골치 아픈 계획은 저희가 짭니다.", desc: '"이번 달에 천만 원 벌기" 같은 목표만 던져주세요. 뭘 해야 할지 과정과 계획은 시스템이 알아서 짜드립니다. 머리 아프게 고민할 필요가 없습니다.' },
                  { title: "2. 매일 아침 9시, 딱 하나만 시킵니다.", desc: "오늘은 이거 할까, 저거 할까 방황하지 마세요. 매일 아침 대표님의 상태를 묻고, 그날 당장 해야 할 '딱 하나의 행동'만 콕 집어서 알려드립니다." },
                  { title: "3. 피곤하면 강제로 쉬게 만듭니다.", desc: '몸이 안 좋은 날에는 "오늘은 무조건 쉬세요"라고 명령합니다. 해야 할 일을 못 했다고 자책하지 마세요. 쉬는 것도 저희가 시킨 임무입니다.' },
                  { title: "4. 주말엔 사이트 접속을 막아버립니다.", desc: "뇌를 완전히 쉬게 해야 월요일에 돈을 벌 수 있습니다. 원하시면 주말에는 아예 들어오지 못하게 막아드립니다. 진짜배기 휴식을 책임집니다." }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/[0.03] border border-white/10 backdrop-blur-md p-8 rounded-2xl space-y-4 shadow-[0_15px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-base font-medium text-zinc-200">{item.title}</h3>
                    <p className="text-zinc-500 text-sm font-light leading-relaxed break-keep">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="text-center pt-8">
                <button 
                  onClick={handleStartPayment}
                  className="w-full max-w-sm py-6 bg-[#C2A35D] text-black text-[11px] tracking-[0.4em] font-bold rounded-xl hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(194,163,93,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                >
                  이해했습니다. 결제하러 가겠습니다.
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-10 text-center w-full z-0 pointer-events-none">
        <p className="text-zinc-800 text-[9px] tracking-widest font-extralight">시스템의 허락을 받은 분만 들어올 수 있습니다.</p>
      </div>
      
    </main>
  )
}
