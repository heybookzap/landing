'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // 토스 서버와의 보안 검증을 시뮬레이션하고 2.5초 뒤 대시보드로 자동 입장시킵니다.
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 2500)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-pretendard relative selection:bg-[#C2A35D] selection:text-black">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.03)_0%,_transparent_70%)] pointer-events-none z-0"></div>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-10 z-10">
        <p className="text-[#C2A35D] text-[11px] tracking-[0.5em] font-medium uppercase">Payment Verification</p>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white leading-snug">
          결제 정보를 안전하게 <span className="font-serif italic font-bold text-[#C2A35D]">승인 중</span>입니다
        </h1>
        <div className="flex justify-center gap-4 mt-12">
          {[0, 0.2, 0.4].map((d) => (
            <motion.div 
              key={d} 
              animate={{ opacity: [0.2, 1, 0.2] }} 
              transition={{ duration: 1.5, repeat: Infinity, delay: d }} 
              className="w-1.5 h-1.5 rounded-full bg-[#C2A35D]"
            />
          ))}
        </div>
        <p className="text-zinc-500 text-xs font-light tracking-widest uppercase mt-8">
          Do not close this page.
        </p>
      </motion.div>
    </main>
  )
}
