'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // 2초 뒤에 어제 구현한 메인 서비스(대시보드) 화면으로 이동합니다.
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-pretendard relative selection:bg-[#C2A35D] selection:text-black">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.03)_0%,_transparent_70%)] pointer-events-none z-0"></div>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-10 z-10">
        <p className="text-[#C2A35D] text-[11px] tracking-[0.5em] font-medium uppercase italic">Authorization</p>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white leading-snug">
          결제가 완료되었습니다.<br />
          곧 <span className="font-serif italic font-bold text-[#C2A35D]">프라이빗 세션</span>으로 입장합니다.
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
      </motion.div>
    </main>
  )
}
