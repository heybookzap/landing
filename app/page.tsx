'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function LandingPage() {
  const router = useRouter()
  const [selectedVal, setSelectedVal] = useState<number | null>(null)
  const [loss, setLoss] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden font-pretendard">
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

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
          {!selectedVal ? (
            <motion.div 
              key="selection" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0, y: -20 }}
              className="w-full text-center space-y-16"
            >
              <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-[1.4] break-keep">
                당신의 1시간은 <br />얼마짜리인가요?
              </h2>
              <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl mx-auto">
                {[30000, 50000, 100000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setSelectedVal(val)}
                    className="flex-1 border border-zinc-900 bg-[#0a0a0a] py-8 text-sm tracking-[0.2em] font-light text-zinc-500 hover:border-[#C2A35D] hover:text-[#C2A35D] transition-all duration-700"
                  >
                    ₩ {val.toLocaleString()}
                  </button>
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
              <div className="text-center space-y-6">
                <p className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase">한 달 동안 길바닥에 버리는 돈</p>
                <p className="text-5xl md:text-7xl font-light tracking-tighter text-[#8B0000]">
                  - ₩ {loss.toLocaleString()}
                </p>
                <div className="space-y-2 pt-6">
                  <p className="text-zinc-400 text-sm font-extralight leading-relaxed break-keep">
                    매일 아침 무엇을 할지 고민하고 미루는 4시간. <br />
                    그 시간 동안 대표님의 자산은 조용히 사라지고 있습니다.
                  </p>
                  <p className="text-zinc-400 text-sm font-extralight leading-relaxed break-keep pt-4">
                    생각이 너무 많아 스스로를 갉아먹고 있다면, <br />
                    이제 그 고민을 저희 시스템에 모두 넘기십시오.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col w-full max-w-md space-y-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/checkout')}
                  className="w-full py-6 bg-white text-black text-[11px] tracking-[0.4em] font-bold hover:bg-[#C2A35D] transition-colors duration-700"
                >
                  월 39만 원에 내 머릿속 고민 모두 맡기기
                </motion.button>
                
                <button 
                  onClick={() => setIsMenuOpen(true)}
                  className="w-full py-5 border border-zinc-900 bg-transparent text-zinc-500 text-[10px] tracking-[0.3em] hover:text-white hover:border-zinc-700 transition-colors duration-500"
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
            className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center px-6 overflow-y-auto pt-20 pb-20"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-10 right-10 text-zinc-500 text-xs tracking-widest hover:text-white transition-colors"
            >
              [ 닫기 ]
            </button>

            <div className="w-full max-w-2xl space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-light tracking-tight text-[#C2A35D]">우리가 39만 원을 받고 해드리는 일</h2>
                <p className="text-zinc-500 text-xs font-extralight tracking-widest">초등학생도 이해할 수 있도록 솔직하게 말씀드립니다.</p>
              </div>

              <div className="space-y-12">
                <div className="bg-[#0a0a0a] border border-zinc-900 p-10 space-y-4">
                  <h3 className="text-lg font-medium">1. 골치 아픈 계획은 저희가 짭니다.</h3>
                  <p className="text-zinc-400 text-sm font-light leading-relaxed break-keep">
                    "이번 달에 천만 원 벌기" 같은 목표만 던져주세요. 뭘 해야 할지 과정과 계획은 시스템이 알아서 분석해서 짜드립니다. 대표님은 머리 아프게 고민할 필요가 없습니다.
                  </p>
                </div>
                <div className="bg-[#0a0a0a] border border-zinc-900 p-10 space-y-4">
                  <h3 className="text-lg font-medium">2. 매일 아침 9시, 딱 하나만 시킵니다.</h3>
                  <p className="text-zinc-400 text-sm font-light leading-relaxed break-keep">
                    오늘은 이거 할까, 저거 할까 방황하지 마세요. 매일 아침 대표님의 컨디션을 묻고, 그날 당장 해야 할 '딱 하나의 행동'만 콕 집어서 알려드립니다.
                  </p>
                </div>
                <div className="bg-[#0a0a0a] border border-zinc-900 p-10 space-y-4">
                  <h3 className="text-lg font-medium">3. 피곤하면 강제로 쉬게 만듭니다.</h3>
                  <p className="text-zinc-400 text-sm font-light leading-relaxed break-keep">
                    컨디션이 안 좋은 날에는 "오늘은 폴더만 정리하고 무조건 쉬세요"라고 명령합니다. 해야 할 일을 못 했다고 자책하지 마세요. 쉬는 것도 저희가 시킨 임무입니다.
                  </p>
                </div>
                <div className="bg-[#0a0a0a] border border-zinc-900 p-10 space-y-4">
                  <h3 className="text-lg font-medium">4. 주말엔 사이트 접속을 막아버립니다.</h3>
                  <p className="text-zinc-400 text-sm font-light leading-relaxed break-keep">
                    뇌를 완전히 꺼야 월요일에 돈을 벌 수 있습니다. 원하시면 주말에는 아예 접속조차 못 하게 막아드립니다. 진짜배기 휴식을 책임집니다.
                  </p>
                </div>
              </div>

              <div className="text-center pt-8">
                <button 
                  onClick={() => router.push('/checkout')}
                  className="px-12 py-5 bg-[#C2A35D] text-black text-[11px] tracking-[0.4em] font-bold hover:bg-white transition-colors duration-500"
                >
                  이해했습니다. 결제하러 가겠습니다.
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-10 text-center w-full z-0 pointer-events-none">
        <p className="text-zinc-800 text-[9px] tracking-widest uppercase font-extralight">Strictly By Invitation Or Approval Only.</p>
      </div>
      
    </main>
  )
}
