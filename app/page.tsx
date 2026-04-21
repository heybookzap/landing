'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function LandingPage() {
  const router = useRouter()
  const [showHero, setShowHero] = useState(true)
  const [selectedVal, setSelectedVal] = useState<number | null>(null)
  const [loss, setLoss] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [overlayType, setOverlayType] = useState<'terms' | 'privacy' | 'refund' | null>(null)

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

  const handleSelectWage = (val: number) => {
    setSelectedVal(val)
    localStorage.setItem('pending_hourly_wage', val.toString())
  }

  const handleStartPayment = async () => {
    setIsProcessing(true)
    setTimeout(() => {
      router.push('/checkout')
    }, 2000)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col font-pretendard relative selection:bg-[#C2A35D] selection:text-black overflow-x-hidden">
      
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.04)_0%,_transparent_70%)] pointer-events-none z-0"></div>

      <section className="min-h-screen flex flex-col items-center justify-center relative z-10 px-6 pt-16 pb-24">
        <header className="absolute top-0 left-0 w-full px-8 md:px-16 py-10 flex justify-between items-start">
          <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
            <span className="text-[#C2A35D] font-serif italic text-xl font-bold uppercase">ONE BLANK</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-[11px] tracking-[0.3em] font-light text-zinc-400">
            <button onClick={() => router.push('/about')} className="hover:text-white transition-colors uppercase">About</button>
            <span className="text-zinc-700">|</span>
            <button onClick={() => router.push('/how-it-works')} className="hover:text-white transition-colors uppercase">How it works</button>
            <span className="text-zinc-700">|</span>
            <button onClick={() => router.push('/checkout')} className="hover:text-[#C2A35D] transition-colors uppercase">Join</button>
            <span className="text-zinc-700">|</span>
            <button onClick={() => router.push('/auth/login')} className="hover:text-white transition-colors uppercase">Login</button>
          </nav>
        </header>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-[#C2A35D] to-transparent opacity-40"></div>

        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8">
              <p className="text-white text-3xl font-light tracking-tight">권한 확인 중</p>
              <div className="flex justify-center gap-3">
                {[0, 0.2, 0.4].map((d) => (
                  <motion.div key={d} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: d }} className="w-1.5 h-1.5 rounded-full bg-[#C2A35D]"></motion.div>
                ))}
              </div>
            </motion.div>
          ) : showHero ? (
            <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="text-center flex flex-col items-center mt-8">
              <h1 className="text-4xl md:text-[70px] font-light tracking-tight text-white leading-[1.2] mb-10 uppercase">
                아무나 들어올 수<br />없습니다.
              </h1>
              <div className="space-y-6 max-w-3xl mb-12 px-4">
                <h2 className="text-lg md:text-2xl font-light text-white tracking-widest leading-relaxed break-keep">
                  <span className="font-serif italic font-bold text-[#C2A35D]">월 1,000만 원</span>의 벽은 넘었지만,<br />
                  완벽주의와 &apos;결정 피로&apos;에 갇혀 혼자 모든 걸 짊어지고 있는<br />
                  창업가 전용 시스템입니다.
                </h2>
                <p className="text-zinc-300 text-sm md:text-base font-light tracking-wide leading-relaxed">
                  매일 아침 무엇을 할지, 시스템이 당신의 뇌를 대신해 결정해 드립니다.<br />
                  대표님은 마음 편히 쉬거나, 더 큰돈을 버는 데만 집중하십시오.
                </p>
              </div>
              <button onClick={() => setShowHero(false)} className="px-10 py-5 bg-white text-black text-[13px] font-bold tracking-[0.1em] hover:bg-[#C2A35D] transition-colors uppercase rounded-none shadow-2xl">
                내 결정 피로로 새어나가는 현금 손실액 확인하기
              </button>
            </motion.div>
          ) : !selectedVal ? (
            <motion.div key="selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full text-center space-y-16 max-w-[400px] mt-8">
              <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-snug">
                <span className="whitespace-nowrap">대표님의 <span className="font-serif italic font-bold text-[#C2A35D]">1시간</span> 가치를</span><br />
                선택해 주십시오.
              </h2>
              <div className="border-t border-zinc-800">
                {[30000, 50000, 100000].map((val) => (
                  <button 
                    key={val} 
                    onClick={() => handleSelectWage(val)}
                    className="w-full py-8 border-b border-zinc-800 flex justify-center items-center group hover:bg-white/[0.05] transition-colors"
                  >
                    <span className="text-zinc-500 group-hover:text-white mr-4 text-base font-light">₩</span>
                    <span className="text-3xl font-serif italic font-bold text-zinc-300 group-hover:text-[#C2A35D] tracking-widest transition-colors">{val.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center space-y-12 mt-8">
              <div className="text-center space-y-8">
                <p className="text-zinc-400 text-[11px] tracking-[0.4em] font-medium uppercase">매달 길바닥에 버려지는 현금 손실액</p>
                <h2 className="text-6xl md:text-[90px] font-serif italic font-bold tracking-tighter text-[#C2A35D] leading-none drop-shadow-2xl">
                  - ₩ {loss.toLocaleString()}
                </h2>
                <div className="w-[1px] h-10 bg-[#C2A35D]/30 mx-auto"></div>
                <div className="space-y-4 max-w-xl mx-auto px-4">
                  <p className="text-white text-base md:text-lg font-light leading-relaxed tracking-wide">
                    매일 아침 무엇을 할지 고민하고 미루는 <span className="font-serif italic font-bold text-[#C2A35D]">4시간.</span><br />
                    그 시간 동안 대표님의 진짜 돈이 조용히 사라지고 있습니다.
                  </p>
                </div>
              </div>
              <button onClick={handleStartPayment} className="w-full max-w-[400px] py-6 bg-white text-black text-[13px] tracking-[0.2em] font-bold hover:bg-[#C2A35D] transition-colors uppercase rounded-none shadow-2xl">
                월 39만 원 결제하고 현금 손실 막기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className="w-full border-t border-zinc-900 py-16 px-8 md:px-16 bg-[#050505] z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10 text-[11px] text-zinc-500 font-light tracking-wide leading-loose text-left">
          <div className="space-y-2">
            <p className="text-zinc-400 font-medium mb-3 uppercase tracking-[0.2em]">ONE BLANK</p>
            <p>상호명 : 주식회사 원블랭크 <span className="mx-2 text-zinc-700">|</span> 대표자명 : 김대표 <span className="mx-2 text-zinc-700">|</span> 사업자등록번호 : 123-45-67890</p>
            <p>통신판매업신고번호 : 2026-서울강남-0001 <span className="mx-2 text-zinc-700">|</span> 사업장주소 : 서울특별시 강남구 프라이빗로 1번길, 1층</p>
            <p>고객센터 : 010-0000-0000 <span className="mx-2 text-zinc-700">|</span> 이메일 : support@oneblank.co.kr</p>
            <p className="pt-3 text-zinc-600 tracking-wider">© 2026 ONE BLANK. ALL RIGHTS RESERVED.</p>
          </div>
          <div className="flex gap-6 md:justify-end items-end h-full">
            <button onClick={() => setOverlayType('terms')} className="hover:text-white transition-colors">이용약관</button>
            <button onClick={() => setOverlayType('refund')} className="hover:text-white transition-colors">환불규정</button>
            <button onClick={() => setOverlayType('privacy')} className="hover:text-white transition-colors">개인정보처리방침</button>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {overlayType && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-16 backdrop-blur-md">
            <div className="w-full max-w-3xl h-full max-h-[80vh] flex flex-col border border-zinc-800 bg-[#0A0A0A] p-8 md:p-12 relative shadow-2xl">
              <button onClick={() => setOverlayType(null)} className="absolute top-6 right-6 text-zinc-400 hover:text-white text-[11px] tracking-widest uppercase transition-colors">[ 닫기 ]</button>
              
              <div className="flex-1 overflow-y-auto pr-4 space-y-10 text-zinc-300 text-sm font-light leading-loose pt-8 scrollbar-hide text-left">
                {overlayType === 'terms' && (
                  <div className="space-y-10">
                    <h2 className="text-white text-2xl font-light tracking-tight border-b border-zinc-800 pb-4 font-serif italic">이용약관</h2>
                    <section className="space-y-4">
                      <h2 className="text-white text-lg font-bold">제 1조 (목적)</h2>
                      <p className="text-zinc-400 text-sm leading-relaxed break-keep">
                        ONE BLANK는 대표님의 복잡한 생각을 정리해주고 가장 핵심적인 목표 달성에만 집중할 수 있도록 고안된 VVIP 전용 인지 방어 시스템입니다. 본 약관은 회사와 회원 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
                      </p>
                    </section>
                  </div>
                )}
                {overlayType === 'refund' && (
                  <div className="space-y-10">
                    <h2 className="text-white text-2xl font-light tracking-tight border-b border-zinc-800 pb-4 font-serif italic">취소 및 환불 정책</h2>
                    <div className="bg-[#0A0A0A] border border-[#C2A35D]/30 p-10 rounded-3xl space-y-6">
                      <h2 className="text-[#C2A35D] text-lg font-bold">🛡️ [ 14일 인지 방어 보증 (Risk-Free) ]</h2>
                      <p className="text-zinc-200 text-[16px] leading-relaxed break-keep font-medium">
                        시스템 이용 후 14일 이내, 단 한 번이라도 서비스가 대표님의 인지 효율을 개선하지 못했다고 판단하신다면 그건 저희가 실패한 것입니다. 이유를 묻지 않고 즉시 100% 전액 환불해 드립니다.
                      </p>
                    </div>
                    <div className="space-y-10 pt-10 border-t border-zinc-900">
                      <section className="space-y-4">
                        <h2 className="text-white text-lg font-medium tracking-tight italic">⚖️ 법무/CS용 상세 환불 기준</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-zinc-400 leading-relaxed">
                          <div className="space-y-4 bg-zinc-900/30 p-6 rounded-2xl">
                            <p className="text-white font-bold">[ 14일 조건부 전액 환불 ]</p>
                            <p>- 결제 후 14일 이내 불만족 시 100% 환불 (최초 1회에 한함)</p>
                            <p>- 단, 14일 경과 후에는 잔여 일수 비례 환불 적용</p>
                          </div>
                          <div className="space-y-4 bg-zinc-900/30 p-6 rounded-2xl">
                            <p className="text-white font-bold">[ 월/연 구독 해지 안내 ]</p>
                            <p>- 월 구독: 차기 결제일 3일 전까지 해지 시 다음 달 결제 중단</p>
                            <p>- 연 구독: 중도 해지 시 (이용 기간 ÷ 12개월) 정산 후 잔액 반환</p>
                          </div>
                        </div>
                      </section>
                      <p className="text-zinc-600 text-xs text-center">환불 문의: support@oneblank.co.kr</p>
                    </div>
                  </div>
                )}
                {overlayType === 'privacy' && (
                  <div className="space-y-10">
                    <h2 className="text-white text-2xl font-light tracking-tight border-b border-zinc-800 pb-4 font-serif italic">개인정보처리방침</h2>
                    <div className="text-[16px] text-zinc-300 leading-[1.8] space-y-8 font-light tracking-wide break-keep italic">
                      "대표님의 모든 사업적 목표와 정보는 암호화되어 생명처럼 보호됩니다."
                    </div>
                    <div className="text-sm text-zinc-400 space-y-4 border-t border-zinc-800 pt-8">
                      <p>1. 수집 항목: 이메일, 결제 기록, 서비스 이용 로그.</p>
                      <p>2. 수집 목적: VVIP 회원 식별 및 맞춤형 지침 생성.</p>
                      <p>3. 보유 기간: 서비스 해지 시 혹은 관련 법령에 따른 보존 기간 종료 시까지 즉시 파기.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
