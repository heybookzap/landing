'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardPage() {
  const router = useRouter()
  const [vvipCount, setVvipCount] = useState(0)
  const [view, setView] = useState<'LOADING' | 'WEEKEND_PAUSED' | 'WEEKLY' | 'MONDAY_INTRO' | 'WELCOME_BACK' | 'SLICING' | 'CONDITION' | 'REPORT' | 'VALUE' | 'DONE' | 'UPSELL' | 'ROI_RECEIPT'>('LOADING')
  const [condition, setCondition] = useState('')
  const [hourlyWage, setHourlyWage] = useState(0) 
  const [dayCount, setDayCount] = useState(0)
  const [showNotify, setShowNotify] = useState(false)
  const [activeTab, setActiveTab] = useState('SESSION')

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/checkout')
          return
        }

        // 📌 1. [연동 로직] 홈페이지에서 선택한 시급 포스트잇이 있는지 확인
        const pendingWage = localStorage.getItem('pending_hourly_wage');
        
        if (pendingWage) {
          // 포스트잇이 있다면 즉시 DB 업데이트
          const wageValue = parseInt(pendingWage);
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ hourly_wage: wageValue })
            .eq('id', user.id);

          if (!updateError) {
            // 업데이트 성공 시 포스트잇 제거 (노이즈 제로)
            localStorage.removeItem('pending_hourly_wage');
            console.log(`[System] 시급 ${wageValue}원이 프로필에 동기화되었습니다.`);
          }
        }

        // 📌 2. profiles에서 데이터 가져오기
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*, hourly_wage') 
          .eq('id', user.id)
          .maybeSingle()

        if (!profile || profileError) {
          // 데이터가 없어도 무한 로딩에 빠지지 않게 기본값 처리
          setHourlyWage(100000) 
        } else {
          setHourlyWage(profile.hourly_wage || 100000)
          const joinDate = new Date(profile.created_at)
          const diffTime = Math.abs(new Date().getTime() - joinDate.getTime())
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          setDayCount(diffDays)
        }

        const now = new Date()
        const day = now.getDay()
        const hours = now.getHours()
        const todayStr = now.toISOString().split('T')[0]
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        // 📌 3. 오늘 리포트 작성 여부 확인
        const { data: todayReport } = await supabase
          .from('daily_reports')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', todayStr)
          .maybeSingle()

        if (todayReport) {
          if (dayCount >= 30) setView('ROI_RECEIPT')
          else if (dayCount >= 14) setView('UPSELL')
          else setView('DONE')
          return
        }

        // 📌 4. 시스템 작동 로직 (주말/부재/정상 진입)
        if (profile?.weekend_rest && (day === 0 || day === 6)) { setView('WEEKEND_PAUSED'); return }
        
        const { data: yesterdayReport } = await supabase
          .from('daily_reports')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', yesterdayStr)
          .lt('created_at', todayStr)
          .maybeSingle()

        if (!yesterdayReport && day !== 1 && day !== 0) { setView('WELCOME_BACK'); return }

        if (hours < 9) {
          setView('SLICING')
        } else { 
          setView('CONDITION')
          setTimeout(() => setShowNotify(true), 1000)
          setTimeout(() => setShowNotify(false), 6000) 
        }

      } catch (err) {
        console.error("Dashboard Init Error:", err)
        setView('CONDITION')
      }
    }
    
    initDashboard()

    const fetchVvipCount = async () => {
      const { count } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ACTIVE')
      if (count) setVvipCount(count)
    }
    fetchVvipCount()
  }, [dayCount, router])

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('daily_reports').insert([{ user_id: user.id, status: 'COMPLETED' }])
      
      if (dayCount >= 30) setView('ROI_RECEIPT')
      else if (dayCount >= 14) setView('UPSELL')
      else { 
        setView('VALUE')
        setTimeout(() => { setView('DONE') }, 3000) 
      }
    } catch (err) { 
      alert('데이터를 저장하는 중 문제가 발생했습니다.') 
    }
  }

  const handleConditionSelect = async (status: string) => {
    setCondition(status)
    setView('LOADING') 
    try {
      const { data: { session } } = await supabase.auth.getSession()
      await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-daily-report`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ user_id: session?.user?.id, condition: status }),
        }
      )
      setView('REPORT') 
    } catch (err) { 
      setView('REPORT')
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 font-pretendard overflow-hidden text-center relative selection:bg-[#C2A35D] selection:text-black">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.03)_0%,_transparent_70%)] pointer-events-none z-0"></div>

      <header className="absolute top-0 left-0 w-full px-8 py-10 z-40 flex justify-between items-center">
        <div className="text-[#C2A35D] font-serif italic font-bold text-xl tracking-tight">ONE BLANK</div>
        <div className="hidden md:flex bg-white/5 backdrop-blur-xl rounded-full p-1 border border-white/5 text-[9px] tracking-[0.2em] uppercase">
          {['SESSION', 'DIRECTIVE', 'REPORT', 'SETTINGS'].map(tab => (
            <button key={tab} onClick={() => tab === 'SETTINGS' ? router.push('/dashboard/billing') : setActiveTab(tab)} className={`px-6 py-2.5 rounded-full transition-all duration-500 ${activeTab === tab ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-300'}`}>{tab}</button>
          ))}
        </div>
        <button onClick={() => router.push('/')} className="text-zinc-500 hover:text-white text-[10px] tracking-widest uppercase transition-colors">[ 로그아웃 ]</button>
      </header>

      <AnimatePresence>
        {showNotify && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-32 z-50 w-full max-w-[360px] left-1/2 -translate-x-1/2">
            <div className="bg-[#0a0a0a]/95 backdrop-blur-2xl border border-[#C2A35D]/20 rounded-3xl p-8 shadow-2xl text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C2A35D]/50 to-transparent"></div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#C2A35D] w-1.5 h-1.5 rounded-full animate-pulse"></div>
                  <span className="text-[#C2A35D] text-[10px] tracking-[0.4em] font-bold uppercase font-serif italic">AUTHORIZED SIGNAL</span>
                </div>
                <span className="text-zinc-600 text-[9px] font-medium uppercase">Just Now</span>
              </div>
              <p className="text-white text-md font-light mb-2 break-keep">오늘의 지침이 정렬되었습니다.</p>
              <p className="text-zinc-500 text-xs font-light break-keep">지금 바로 확인하고 뇌의 통제권을 시스템에 위임하십시오.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'LOADING' && (
          <motion.div key="l" className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-2 border-[#C2A35D]/20 border-t-[#C2A35D] rounded-full animate-spin"></div>
            <p className="text-[#C2A35D] tracking-[0.5em] text-[10px] uppercase font-bold animate-pulse">Connecting System...</p>
          </motion.div>
        )}
        
        {view === 'CONDITION' && (
          <motion.div key="c" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full flex flex-col items-center max-w-4xl">
            <p className="text-[#C2A35D] text-[11px] tracking-[0.5em] font-medium uppercase mb-8 font-serif italic">Cognitive Sync</p>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-24 leading-tight break-keep">대표님, 오늘 뇌의 컨디션을<br /><span className="text-[#C2A35D] font-serif italic font-bold">솔직하게</span> 알려주십시오.</h2>
            <div className="flex flex-col md:flex-row gap-5 mb-20 w-full max-w-2xl px-4">
              {['피곤함', '보통', '아주 좋음'].map((status) => (
                <button key={status} onClick={() => handleConditionSelect(status)} className="flex-1 py-10 border border-zinc-900 bg-white/[0.01] hover:bg-white/[0.03] hover:border-[#C2A35D]/50 transition-all duration-500 rounded-2xl text-zinc-500 hover:text-white text-[13px] tracking-widest font-bold uppercase">{status}</button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-700 tracking-[0.3em] uppercase">현재 <span className="text-zinc-400">{vvipCount}명</span>의 VVIP가 실시간 보호를 받고 있습니다.</p>
          </motion.div>
        )}

        {view === 'REPORT' && (
          <motion.div key="r" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="z-10 w-full max-w-2xl px-4">
            <div className="bg-[#080808] border border-zinc-900 rounded-[40px] p-12 md:p-16 space-y-14 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C2A35D]/30 to-transparent"></div>
              <div className="space-y-6 text-left">
                <p className="text-[#C2A35D] text-[11px] tracking-[0.4em] font-bold uppercase font-serif italic">Today&apos;s Directive</p>
                <h3 className="text-3xl md:text-4xl font-light leading-tight text-white break-keep">{condition === '피곤함' ? '모든 결정을 중단하십시오. 오늘은 바탕화면의 폴더 하나만 정리하고 즉시 뇌를 휴식 상태로 전환하십시오.' : '최상의 인지 효율 상태입니다. 지금 바로 핵심 사업의 실행 계획 3가지만 물리적 동사로 확정하십시오.'}</h3>
              </div>
              <button onClick={handleComplete} className="w-full py-6 bg-white text-black text-[13px] font-bold tracking-[0.3em] uppercase hover:bg-[#C2A35D] transition-all duration-500 rounded-xl shadow-xl">지침 완수 및 세션 종료</button>
            </div>
          </motion.div>
        )}

        {view === 'DONE' && (
          <motion.div key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10 text-center space-y-10">
              <div className="w-20 h-[1px] bg-[#C2A35D] mx-auto opacity-30"></div>
              <h2 className="text-5xl md:text-7xl font-serif italic font-bold text-white leading-tight tracking-tighter">완벽한 하루였습니다.</h2>
              <p className="text-zinc-500 text-sm font-light tracking-[0.4em] leading-relaxed uppercase">오늘의 모든 결정 권한 행사가 종료되었습니다.<br />이제 뇌를 완전히 비우고 본질에 몰입하십시오.</p>
              <div className="w-20 h-[1px] bg-[#C2A35D] mx-auto opacity-30"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
