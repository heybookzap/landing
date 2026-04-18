'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function LandingPage() {
  const router = useRouter()
  const [showHero, setShowHero] = useState(true)
  const [selectedVal, setSelectedVal] = useState<number | null>(null)
  const [loss, setLoss] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // 시급 계산 롤링 (시인성을 위한 타이밍 최적화)
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
      alert('시스템 접속 중 문제가 발생했습니다.')
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden font-pretendard selection:bg-[#C2A35D] selection:text-black">
      
      {/* 3D 공간: 노이즈와 심연의 코어 라이트 */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C2A35D] rounded-full mix-blend-screen filter blur-[200px] opacity-[0.025] pointer-events-none"></div>

      {/* 스플릿 헤더 (자간 확장으로 여백 극대화) */}
      <header className="absolute top-0 left-0 w-full px-8 md:px-12 py-10 z-20 flex justify-between items-center mix-blend-difference">
        <div className="flex items-center gap-4">
          <div className="w-[1px] h-3 bg-[#C2A35D]"></div>
          <span className="text-[#C2A35D] text-[9px] tracking-[0.8em] font-medium uppercase">One Blank</span>
        </div>
        <button onClick={() => setIsMenuOpen(true)} className="text-zinc-500 hover:text-white text-[9px] tracking-[0.4em] font-medium uppercase transition-colors duration-500">
          메뉴 보기
        </button>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="z-10 flex flex-col items-center w-full max-w-4xl px-6 py-20"
      >
        <AnimatePresence mode="wait">
          
          {/* 화면 A: 결제 진입 (비밀 통로) */}
          {isProcessing ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-10 z-10 w-full">
              <div className="relative w-24 h-24 mx-auto mb-10 flex items-center justify-center">
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute w-12 h-12 bg-[#C2A35D] blur-2xl rounded-full"></motion.div>
                <div className="absolute inset-0 border-[1px] border-white/5 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.03)]"></div>
                <motion.div animate={{ rotate: 360, rotateX: 10, rotateY: 10 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-[1.5px] border-[#C2A35D] border-t-transparent border-r-transparent rounded-full" />
              </div>
              <p className="text-[#C2A35D] text-[10px] tracking-[0.6em] font-medium uppercase drop-shadow-[0_0_15px_rgba(194,163,93,0.4)]">비밀 통로 생성 중</p>
              <p className="text-zinc-500 text-xs font-extralight tracking-widest leading-relaxed break-keep">
                대표님만 들어올 수 있는 <br className="md:hidden" />안전한 공간을 열고 있습니다.
              </p>
            </motion.div>

          // 화면 B: 첫인상 Hero (타이포그래피의 쫀쫀한 자간과 꽉 찬 줄간)
          ) : showHero ? (
            <motion.div 
              key="hero" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
              className="text-center space-y-12 w-full max-w-2xl mx-auto"
            >
              <h1 className="text-5xl md:text-[80px] font-light tracking-tighter text-white break-keep leading-[1.15] drop-shadow-md">
                아무나 들어올 수<br />없습니다.
              </h1>
              <div className="space-y-5">
                <h2 className="text-base md:text-xl font-light text-[#C2A35D] tracking-widest break-keep">
                  생각이 많아 머리가 아픈 분들을 위한 비밀 공간
                </h2>
                <p className="text-zinc-400 text-xs md:text-sm font-extralight leading-relaxed break-keep tracking-wide px-4">
                  매일 아침 무엇을 할지 시스템이 대신 결정해 드립니다.<br className="hidden md:block" />
                  대표님은 마음 편히 쉬거나 돈 버는 데만 집중하세요.
                </p>
              </div>
              <div className="pt-10">
                <button 
                  onClick={() => setShowHero(false)} 
                  className="px-10 py-5 bg-white text-black text-[10px] md:text-[11px] font-bold tracking-[0.3em] hover:bg-[#C2A35D] hover:shadow-[0_0_30px_rgba(194,163,93,0.4)] transition-all duration-500 rounded-[4px] uppercase"
                >
                  얼마나 손해 보고 있는지 확인하기
                </button>
              </div>
            </motion.div>

          // 화면 C: 시급 선택 (3D 내부 반사 효과 극대화)
          ) : !selectedVal ? (
            <motion.div 
              key="selection" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="w-full text-center space-y-16"
            >
              <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-[1.3] break-keep text-zinc-100 drop-shadow-sm">
                당신의 1시간은 <br className="md:hidden" />얼마짜리인가요?
              </h2>
              <div className="flex flex-col w-full max-w-[320px] mx-auto space-y-5">
                {[30000, 50000, 100000].map((val) => (
                  <motion.button
                    key={val}
                    whileHover={{ scale: 1.02, y: -2, backgroundColor: "rgba(255,255,255,0.03)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedVal(val)}
                    // 3D Glassmorphism: 테두리와 내부 빛 반사(inset) 동시 적용
                    className="w-full py-7 border border-white/10 bg-white/[0.01] backdrop-blur-md rounded-2xl text-sm tracking-[0.3em] font-light text-zinc-400 hover:border-[#C2A35D]/60 hover:text-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-500 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10 font-medium">₩ {val.toLocaleString()}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

          // 화면 D: 손실 확인 및 결제 (빨간색 3D 글로우와 단호한 동선)
          ) : (
            <motion.div 
              key="result" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full flex flex-col items-center space-y-16"
            >
              <div className="text-center w-full space-y-6">
                <p className="text-zinc-500 text-[10px] tracking-[0.4em] font-medium mb-6">한 달 동안 길바닥에 버리는 돈</p>
                
                {/* 3D 깊이감이 느껴지는 손실 패널 */}
                <div className="bg-[#050505]/80 border border-red-900/30 backdrop-blur-2xl rounded-[32px] py-16 px-8 shadow-[0_30px_60px_rgba(139,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden max-w-lg mx-auto">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-red-600/10 blur-3xl pointer-events-none"></div>
                  <p className="text-5xl md:text-7xl font-medium tracking-tighter text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.3)] relative z-10">
                    - ₩ {loss.toLocaleString()}
                  </p>
                </div>
                
                <div className="space-y-4 pt-4 px-4">
                  <p className="text-zinc-400 text-xs md:text-sm font-light leading-relaxed break-keep tracking-wide">
                    매일 아침 무엇을 할지 고민하고 미루는 4시간. <br className="hidden md:block" />
                    그 시간 동안 대표님의 진짜 돈이 조용히 사라지고 있습니다.
                  </p>
                  <p className="text-zinc-300 text-xs md:text-sm font-medium leading-relaxed break-keep pt-2">
                    생각이 너무 많아 머리가 아프다면, <br className="md:hidden" />이제 그 고민을 저희 시스템에 모두 넘기십시오.
                  </p>
                </div>
              </div>
              
              <div className="w-full max-w-[340px] px-4 space-y-5">
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartPayment}
                  className="w-full py-6 bg-white text-black text-[11px] tracking-[0.2em] font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_40px_rgba(194,163,93,0.4),inset_0_1px_0_rgba(255,255,255,0.5)] hover:bg-[#C2A35D] transition-all duration-500"
                >
                  월 39만 원에 고민 모두 맡기기
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 오버레이 메뉴 (거대 타이포그래피 + 여백 최적화) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-[#050505]/95 flex flex-col justify-center px-8 md:px-24"
          >
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-8 md:right-12 text-zinc-500 hover:text-white text-[9px] tracking-[0.4em] font-medium uppercase transition-colors duration-500">
              닫기 [X]
            </button>
            
            <nav className="flex flex-col space-y-8 md:space-y-12 text-left w-full max-w-5xl mx-auto">
              {/* 거대한 메뉴 텍스트: 자간을 좁혀 덩어리감 형성 */}
              <Link href="/learn-more" onClick={() => setIsMenuOpen(false)} className="text-4xl md:text-[80px] font-light tracking-tighter text-zinc-300 hover:text-[#C2A35D] hover:translate-x-4 transition-all duration-500 block leading-none break-keep">
                우리가 하는 일
              </Link>
              <Link href="/learn-more" onClick={() => setIsMenuOpen(false)} className="text-4xl md:text-[80px] font-light tracking-tighter text-zinc-300 hover:text-[#C2A35D] hover:translate-x-4 transition-all duration-500 block leading-none break-keep">
                어떻게 돕나요?
              </Link>
              <button onClick={() => {setIsMenuOpen(false); handleStartPayment();}} className="text-4xl md:text-[80px] font-light tracking-tighter text-zinc-600 hover:text-white hover:translate-x-4 transition-all duration-500 text-left mt-8 md:mt-16 block leading-none break-keep">
                고민 넘기고 시작하기
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-10 text-center w-full z-0 pointer-events-none">
        <p className="text-zinc-700 text-[8px] md:text-[9px] tracking-[0.4em] font-extralight uppercase break-keep px-4">
          시스템의 허락을 받은 분만 들어올 수 있습니다.
        </p>
      </div>
      
    </main>
  )
}
