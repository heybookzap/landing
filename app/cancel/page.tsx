'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 font-pretendard relative selection:bg-[#C2A35D] selection:text-black">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.03)_0%,_transparent_70%)] pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center space-y-12 z-10 max-w-xl"
      >
        <div className="space-y-6">
          <p className="text-[#C2A35D] text-[11px] tracking-[0.5em] font-medium uppercase italic">Session Interrupted</p>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight leading-tight">
            결제가 중단되었습니다.
          </h1>
          <p className="text-zinc-500 text-lg font-light leading-relaxed break-keep">
            인지 리소스를 방어할 준비가 아직 되지 않으셨나요?<br />
            ONE BLANK의 문은 대표님이 준비되었을 때 언제든 다시 열려 있습니다.
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-8">
          <button 
            onClick={() => router.push('/checkout')} 
            className="w-full py-5 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-[#C2A35D] transition-all rounded-xl shadow-2xl"
          >
            다시 시도하기
          </button>
          <button 
            onClick={() => router.push('/')} 
            className="text-zinc-600 hover:text-white text-[11px] tracking-widest uppercase transition-colors"
          >
            메인화면으로 돌아가기
          </button>
        </div>
      </motion.div>

      <footer className="absolute bottom-10 w-full text-center">
        <p className="text-zinc-800 text-[9px] tracking-[0.4em] uppercase font-light italic">Permanent Protection Awaits.</p>
      </footer>
    </main>
  )
}
