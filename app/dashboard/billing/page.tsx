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
          {/* 📌 1B 제거 후 ONE BLANK 적용 */}
          <span className="text-[#C2A35D] font-serif italic text-xl font-bold uppercase">ONE BLANK</span>
          <span className="text-white text-[10px] tracking-[0.5em] font-light uppercase">Settings</span>
        </div>
        <button onClick={() => router.push('/dashboard')} className="text-zinc-500 hover:text-white text-[9px] tracking-[0.4em] font-light uppercase transition-colors">[ Back to Dashboard ]</button>
      </header>

      {/* 이하 내용은 대표님이 주신 BillingPage 코드와 동일하게 구성하되, 스타일만 하이엔드로 유지합니다 */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-3xl px-6 flex flex-col mt-10 pb-32">
        <div className="mb-16 border-b border-zinc-900 pb-8">
          <p className="text-[#C2A35D] text-[10px] tracking-[0.4em] font-medium uppercase mb-4">Subscription Management</p>
          <h1 className="text-3xl font-light tracking-tight text-white">구독 및 결제 관리</h1>
        </div>
        {/* ... (생략된 섹션들은 기존 코드 유지) ... */}
      </motion.div>
    </main>
  )
}
