'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function BillingPage() {
  const router = useRouter()
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center font-pretendard relative selection:bg-[#C2A35D] selection:text-black">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.03)_0%,_transparent_70%)] pointer-events-none z-0"></div>

      <header className="w-full px-8 md:px-16 py-12 z-40 flex justify-between items-start max-w-6xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/dashboard')}>
          <span className="text-[#C2A35D] font-serif italic text-xl font-bold">1B</span>
          <span className="text-white text-[10px] tracking-[0.5em] font-light uppercase">Settings</span>
        </div>
        <button onClick={() => router.push('/dashboard')} className="text-zinc-500 hover:text-white text-[9px] tracking-[0.4em] font-light uppercase transition-colors">[ Back to Dashboard ]</button>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="z-10 w-full max-w-3xl px-6 flex flex-col mt-10 pb-32"
      >
        <div className="mb-16 border-b border-zinc-900 pb-8">
          <p className="text-[#C2A35D] text-[10px] tracking-[0.4em] font-medium uppercase mb-4">Subscription Management</p>
          <h1 className="text-3xl font-light tracking-tight text-white">구독 및 결제 관리</h1>
        </div>

        <div className="space-y-20">
          <section className="space-y-8">
            <p className="text-zinc-500 text-[10px] tracking-[0.3em] font-medium uppercase">현재 이용 중인 플랜</p>
            <div className="bg-zinc-950 border border-zinc-900 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-light tracking-tight">Core 월 구독 플랜</h2>
                <p className="text-zinc-400 text-sm font-light">매일 아침 9시, 대표님의 뇌를 대신해 오늘 할 일을 결정합니다.</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-serif italic font-bold text-[#C2A35D]">₩ 390,000</p>
                <p className="text-zinc-600 text-[10px] mt-2 tracking-widest uppercase">Next Billing: 2026. 05. 19</p>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <p className="text-zinc-500 text-[10px] tracking-[0.3em] font-medium uppercase">시스템 통제권 설정</p>
            <div className="border-t border-zinc-900 divide-y divide-zinc-900">
              <div className="py-8 flex justify-between items-center px-2">
                <div>
                  <p className="text-white text-sm font-medium mb-1">결제 카드 관리</p>
                  <p className="text-zinc-500 text-xs font-light">현대카드 **** 1234 (기본 결제 수단)</p>
                </div>
                <button className="text-zinc-400 hover:text-white text-[10px] tracking-widest transition-colors uppercase">[ Change ]</button>
              </div>
              
              <div className="py-8 flex justify-between items-center px-2">
                <div>
                  <p className="text-white text-sm font-medium mb-1">구독 해지</p>
                  <p className="text-zinc-500 text-xs font-light">다음 달부터 시스템의 도움을 받지 않습니다.</p>
                </div>
                <button onClick={() => setIsCancelModalOpen(true)} className="text-zinc-700 hover:text-zinc-300 text-[10px] tracking-widest transition-colors uppercase underline decoration-zinc-800 underline-offset-4">구독 해지하기</button>
              </div>
            </div>
          </section>

          <section className="pt-10 border-t border-zinc-900">
            <div className="bg-zinc-950/50 p-8 border border-zinc-900 space-y-4">
              <p className="text-[#C2A35D] text-[10px] tracking-[0.2em] font-bold uppercase">🛡️ 14일 인지 방어 보증</p>
              <p className="text-zinc-500 text-xs leading-relaxed font-light break-keep">
                결제 후 14일 동안 시스템 지침을 100% 완료했음에도 변화가 없다면, 고객센터 이메일(support@oneblank.co.kr)로 연락주십시오. 즉시 전액 환불해 드립니다.
              </p>
            </div>
          </section>
        </div>
      </motion.div>

      <AnimatePresence>
        {isCancelModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 backdrop-blur-md">
            <div className="w-full max-w-md bg-black border border-zinc-900 p-10 text-center space-y-8 shadow-2xl">
              <h2 className="text-xl font-light text-white break-keep">정말로 시스템의 도움을 <br />그만 받으시겠습니까?</h2>
              <p className="text-zinc-500 text-sm font-light leading-relaxed break-keep">해지하셔도 이번 달 남은 기간 동안은 <br />시스템이 대표님의 뇌를 계속 지켜드립니다.</p>
              <div className="flex flex-col gap-4 pt-4">
                <button onClick={() => setIsCancelModalOpen(false)} className="w-full py-4 bg-white text-black text-xs font-bold tracking-widest uppercase">계속 이용하기</button>
                <button onClick={() => {alert('해지 신청이 완료되었습니다.'); setIsCancelModalOpen(false);}} className="w-full py-4 border border-zinc-800 text-zinc-600 text-xs font-light tracking-widest hover:text-white transition-colors uppercase">네, 해지하겠습니다</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
