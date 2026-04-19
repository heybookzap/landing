'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // 로그인 처리 후 대시보드 이동
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 font-pretendard relative overflow-hidden selection:bg-[#C2A35D] selection:text-black">
      
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.04)_0%,_transparent_60%)] pointer-events-none z-0"></div>

      <header className="absolute top-0 left-0 w-full px-8 md:px-16 py-12 z-40 flex justify-between items-start">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <span className="text-[#C2A35D] font-serif italic text-xl font-bold">1B</span>
        </div>
        <button onClick={() => router.push('/')} className="text-zinc-500 hover:text-white text-[9px] tracking-[0.4em] font-light uppercase transition-colors">
          [ Back to Home ]
        </button>
      </header>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-[#C2A35D] to-transparent z-0 opacity-50"></div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="z-10 w-full max-w-[340px] flex flex-col items-center mt-10"
      >
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-3xl md:text-4xl font-serif italic font-bold tracking-tight text-white">
            Members Only
          </h1>
          <p className="text-zinc-500 text-[10px] tracking-[0.4em] font-medium uppercase">시스템 통제권 확인</p>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-10">
          <div className="space-y-8">
            <div>
              <input 
                type="email" 
                placeholder="ID (Email)" 
                required
                className="w-full bg-transparent border-b border-zinc-800 py-4 text-white placeholder-zinc-700 text-sm font-light focus:outline-none focus:border-[#C2A35D] transition-colors" 
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                required
                className="w-full bg-transparent border-b border-zinc-800 py-4 text-white placeholder-zinc-700 text-sm font-light focus:outline-none focus:border-[#C2A35D] transition-colors" 
              />
            </div>
          </div>

          <div className="flex justify-between items-center px-1">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="hidden" />
              <div className="w-3 h-3 border border-zinc-700 group-hover:border-[#C2A35D] flex items-center justify-center transition-colors">
                {/* 체크 로직 추가 가능 */}
              </div>
              <span className="text-zinc-500 text-[10px] tracking-widest font-light">로그인 유지</span>
            </label>
            <button type="button" className="text-zinc-600 hover:text-zinc-300 text-[10px] tracking-widest font-light transition-colors">
              비밀번호 재설정
            </button>
          </div>

          <button 
            type="submit"
            className="w-full py-6 mt-4 bg-white text-black text-[11px] tracking-[0.3em] font-bold hover:bg-zinc-200 transition-colors duration-500 uppercase rounded-none"
          >
            시스템 접속하기
          </button>
        </form>
        
        <div className="mt-12 pt-8 border-t border-zinc-900 w-full text-center">
          <button onClick={() => router.push('/checkout')} className="text-[#C2A35D] hover:text-white text-[10px] tracking-[0.2em] font-light uppercase transition-colors">
            아직 권한이 없으신가요? (Join)
          </button>
        </div>
      </motion.div>
    </main>
  )
}
