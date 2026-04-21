'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase' // 📌 [추가] Supabase 경비원 호출

export default function LoginPage() {
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // 📌 [수정] 실제 데이터베이스와 비밀번호를 대조하는 비동기 함수로 변경
  const handleLoginSubmit = async () => {
    if (!email || !password) {
      alert('등록된 이메일과 비밀번호를 입력해 주십시오.')
      return
    }
    
    setIsProcessing(true)

    try {
      // 1. Supabase에 로그인 요청
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      // 2. 로그인 실패 시 (비밀번호 틀림 등)
      if (error) {
        alert('이메일 또는 비밀번호가 일치하지 않습니다. 다시 확인해 주십시오.')
        setIsProcessing(false) // 버튼 다시 활성화
        return
      }

      // 3. 로그인 성공 시 대시보드로 당당하게 입장
      router.push('/dashboard')
      
    } catch (err) {
      alert('접속 중 일시적인 오류가 발생했습니다.')
      setIsProcessing(false)
    }
  }

  const handleForgotPassword = () => {
    if (!email) {
      alert('비밀번호를 찾을 이메일 주소를 먼저 입력해 주십시오.')
      return
    }
    alert(`'${email}'(으)로 비밀번호 재설정 안내를 발송했습니다.`)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center font-pretendard relative selection:bg-[#C2A35D] selection:text-black overflow-y-auto">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.03)_0%,_transparent_70%)] pointer-events-none z-0"></div>

      <header className="w-full px-8 md:px-16 py-10 z-40 flex justify-between items-center max-w-7xl mx-auto border-b border-zinc-900/50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <span className="text-[#C2A35D] font-serif italic text-2xl font-bold uppercase">ONE BLANK</span>
          <span className="text-white text-[11px] tracking-[0.4em] font-light uppercase">Member Login</span>
        </div>
        <button onClick={() => router.push('/')} className="text-zinc-500 hover:text-white text-[11px] tracking-widest uppercase transition-colors">[ 나가기 ]</button>
      </header>

      <div className="w-full max-w-xl px-6 z-10 flex-1 flex flex-col justify-center pb-32">
        <div className="text-center mb-16 mt-12">
          <p className="text-[#C2A35D] text-[11px] tracking-[0.4em] font-medium uppercase mb-3">Welcome Back</p>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
            멤버 로그인
          </h1>
        </div>

        <form 
          className="space-y-10" 
          onSubmit={(e) => {
            e.preventDefault(); 
            handleLoginSubmit();
          }}
        >
          <div className="space-y-8">
            <input 
              type="email" 
              name="email"
              id="email"
              autoComplete="username email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="등록된 이메일 주소" 
              className="w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder-zinc-600 text-lg font-light focus:outline-none focus:border-[#C2A35D] transition-colors" 
            />
            <div className="relative">
              <input 
                type="password" 
                name="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호" 
                className="w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder-zinc-600 text-lg font-light focus:outline-none focus:border-[#C2A35D] transition-colors" 
              />
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 text-xs tracking-wide transition-colors"
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full py-6 bg-[#C2A35D] text-black text-[14px] font-bold tracking-[0.1em] uppercase rounded-xl shadow-xl transition-all ${isProcessing ? 'opacity-50' : 'hover:bg-[#d4b97a]'}`}
            >
              {isProcessing ? "신분 확인 중..." : "로그인"}
            </button>
            
            <div className="text-center">
              <span className="text-zinc-600 text-[13px] font-light">아직 ONE BLANK의 멤버가 아니신가요?</span>
              <button 
                type="button" 
                onClick={() => router.push('/checkout')} 
                className="text-zinc-400 hover:text-white text-[13px] font-light ml-2 underline underline-offset-4 transition-colors"
              >
                지금 합류하기
              </button>
            </div>
          </div>
        </form>
      </div>

      <footer className="w-full border-t border-zinc-900 py-10 text-center mt-auto">
        <p className="text-zinc-700 text-[11px] tracking-[0.3em] uppercase font-light">ONE BLANK · Permanent Cognitive Protection.</p>
      </footer>
    </main>
  )
}
