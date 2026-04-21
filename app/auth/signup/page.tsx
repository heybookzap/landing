'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SignUpPage() {
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSignUpSubmit = async () => {
    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력해 주십시오.')
      return
    }
    
    setIsProcessing(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      })

      if (authError) {
        alert(authError.message)
        setIsProcessing(false)
        return
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
          { 
            id: authData.user.id, 
            email: email,
            hourly_wage: 100000,
            weekend_rest: true 
          }
        ])

        if (profileError) {
          alert('프로필 생성 중 오류가 발생했습니다.')
          setIsProcessing(false)
          return
        }

        alert('회원가입이 완료되었습니다. 로그인을 진행해 주십시오.')
        router.push('/auth/login')
      }
      
    } catch (err) {
      alert('가입 중 일시적인 오류가 발생했습니다.')
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center font-pretendard relative selection:bg-[#C2A35D] selection:text-black overflow-y-auto">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.03)_0%,_transparent_70%)] pointer-events-none z-0"></div>

      <header className="w-full px-8 md:px-16 py-10 z-40 flex justify-between items-center max-w-7xl mx-auto border-b border-zinc-900/50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <span className="text-[#C2A35D] font-serif italic text-2xl font-bold uppercase">ONE BLANK</span>
          <span className="text-white text-[11px] tracking-[0.4em] font-light uppercase">Member Join</span>
        </div>
        <button onClick={() => router.push('/')} className="text-zinc-500 hover:text-white text-[11px] tracking-widest uppercase transition-colors">[ 나가기 ]</button>
      </header>

      <div className="w-full max-w-xl px-6 z-10 flex-1 flex flex-col justify-center pb-32">
        <div className="text-center mb-16 mt-12">
          <p className="text-[#C2A35D] text-[11px] tracking-[0.4em] font-medium uppercase mb-3">Join the System</p>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
            멤버십 가입
          </h1>
        </div>

        <form 
          className="space-y-10" 
          onSubmit={(e) => {
            e.preventDefault(); 
            handleSignUpSubmit();
          }}
        >
          <div className="space-y-8">
            <input 
              type="email" 
              name="email"
              autoComplete="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소" 
              className="w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder-zinc-600 text-lg font-light focus:outline-none focus:border-[#C2A35D] transition-colors" 
            />
            <input 
              type="password" 
              name="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 (6자 이상)" 
              className="w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder-zinc-600 text-lg font-light focus:outline-none focus:border-[#C2A35D] transition-colors" 
            />
          </div>

          <div className="space-y-6 pt-6">
            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full py-6 bg-white text-black text-[14px] font-bold tracking-[0.1em] uppercase rounded-xl shadow-xl transition-all ${isProcessing ? 'opacity-50' : 'hover:bg-[#C2A35D]'}`}
            >
              {isProcessing ? "신분 등록 중..." : "가입하기"}
            </button>
            
            <div className="text-center">
              <span className="text-zinc-600 text-[13px] font-light">이미 멤버이신가요?</span>
              <button 
                type="button" 
                onClick={() => router.push('/auth/login')} 
                className="text-zinc-400 hover:text-white text-[13px] font-light ml-2 underline underline-offset-4 transition-colors"
              >
                로그인하기
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
