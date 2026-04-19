'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardPage() {
  const [vvipCount, setVvipCount] = useState(0)
  const [view, setView] = useState<'LOADING' | 'WEEKEND_PAUSED' | 'WEEKLY' | 'MONDAY_INTRO' | 'WELCOME_BACK' | 'SLICING' | 'CONDITION' | 'REPORT' | 'VALUE' | 'DONE' | 'UPSELL' | 'ROI_RECEIPT'>('LOADING')
  const [condition, setCondition] = useState('')
  const [hourlyRate, setHourlyRate] = useState(0)
  const [dayCount, setDayCount] = useState(0)
  const [showNotify, setShowNotify] = useState(false)
  const [activeTab, setActiveTab] = useState('COMPLETED DAY')

  useEffect(() => {
    const initDashboard = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profile) {
        setHourlyRate(profile.hourly_rate)
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

      const { data: todayReport } = await supabase.from('daily_reports').select('*').eq('user_id', user.id).gte('created_at', todayStr).single()
      if (todayReport) {
        if (dayCount === 14) setView('UPSELL')
        else if (dayCount === 30) setView('ROI_RECEIPT')
        else setView('DONE')
        return
      }

      if (profile?.weekend_rest && (day === 0 || day === 6)) { setView('WEEKEND_PAUSED'); return }
      if (!profile?.weekend_rest && day === 0) { setView('WEEKLY'); return }

      const { data: yesterdayReport } = await supabase.from('daily_reports').select('*').eq('user_id', user.id).gte('created_at', yesterdayStr).lt('created_at', todayStr).single()
      if (!yesterdayReport && day !== 1) { setView('WELCOME_BACK'); return }
      if (profile?.weekend_rest && day === 1 && hours >= 9) { setView('MONDAY_INTRO'); return }

      if (hours < 9) setView('SLICING')
      else { setView('CONDITION'); setTimeout(() => setShowNotify(true), 1000); setTimeout(() => setShowNotify(false), 6000); }
    }
    initDashboard()

    const fetchVvipCount = async () => {
      const { count } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE')
      if (count) setVvipCount(count)
    }
    fetchVvipCount()
  }, [dayCount])

  const handleStartToday = () => {
    const hours = new Date().getHours()
    if (hours < 9) setView('SLICING')
    else { setView('CONDITION'); setTimeout(() => setShowNotify(true), 500); setTimeout(() => setShowNotify(false), 5500); }
  }

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('daily_reports').insert([{ user_id: user.id, status: 'COMPLETED' }])
      if (dayCount === 14) setView('UPSELL')
      else if (dayCount === 30) setView('ROI_RECEIPT')
      else { setView('VALUE'); setTimeout(() => { setView('DONE') }, 4000) }
    } catch (err) { alert('데이터를 저장하는 중 문제가 발생했습니다.') }
  }

  const handleConditionSelect = async (status: string) => {
    setCondition(status);
    setView('LOADING'); 

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-daily-report`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ 
            user_id: session?.user?.id, 
            condition: status 
          }),
        }
      );

      if (response.ok) { setView('REPORT'); } 
      else { alert('시스템 연결 실패'); setView('CONDITION'); }
    } catch (err) { setView('CONDITION'); }
  }

  const defendedAssets = hourlyRate * 31
  const roiPercent = Math.round((defendedAssets / 390000) * 100)

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 font-pretendard overflow-hidden text-center relative selection:bg-[#C2A35D] selection:text-black">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.03)_0%,_transparent_70%)] pointer-events-none z-0"></div>

      <header className="absolute top-0 left-0 w-full px-8 py-8 z-40 flex justify-between items-center">
        <div className="text-[#C2A35D] text-[9px] tracking-[0.4em] font-medium uppercase">ONE BLANK CONTROL</div>
        <div className="hidden md:flex bg-white/5 backdrop-blur-xl rounded-full p-1 border border-white/5 text-[9px] tracking-[0.2em] uppercase">
          {['SESSION', 'DIRECTIVE', 'REPORT', 'GHOST RESET', 'SETTINGS'].map(tab => (
            <button key={tab} onClick={() => tab === 'SETTINGS' ? router.push('/dashboard/billing') : setActiveTab(tab)} className={`px-5 py-2.5 rounded-full transition-all ${activeTab === tab ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-300'}`}>{tab}</button>
          ))}
        </div>
        <button onClick={() => router.push('/')} className="text-zinc-500 hover:text-white text-[10px] tracking-widest uppercase transition-colors">[ 로그아웃 ]</button>
      </header>

      <AnimatePresence>
        {showNotify && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-28 z-50 w-full max-w-[340px] left-1/2 -translate-x-1/2">
            <div className="bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-[20px] p-6 shadow-2xl text-left relative overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#C2A35D] w-[20px] h-[20px] rounded-full"></div>
                  <span className="text-[#C2A35D] text-[9px] tracking-[0.25em] font-medium uppercase font-serif italic font-bold">ONE BLANK</span>
                </div>
                <span className="text-zinc-600 text-[10px]">지금</span>
              </div>
              <p className="text-zinc-100 text-sm font-medium mb-1">오늘의 지침이 도착했습니다.</p>
              <p className="text-zinc-400 text-xs font-light">지금 바로 확인하고 뇌를 해방시키세요.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'LOADING' && <motion.p key="l" className="text-[#C2A35D] tracking-[0.5em] text-[10px] animate-pulse">CONNECTING SYSTEM...</motion.p>}
        
        {view === 'CONDITION' && (
          <motion.div key="c" className="z-10 w-full flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-20 leading-tight">대표님, 오늘 뇌의 컨디션을<br />솔직하게 알려주십시오.</h2>
            <div className="flex flex-col md:flex-row gap-5 mb-16 w-full max-w-2xl">
              {['피곤함', '보통', '아주 좋음'].map((status) => (
                <button key={status} onClick={() => handleConditionSelect(status)} className="flex-1 py-8 border border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-[#C2A35D]/50 transition-all rounded-2xl text-zinc-400 hover:text-white text-sm tracking-widest font-light">{status}</button>
              ))}
            </div>
            <p className="text-[11px] text-zinc-600 tracking-widest">현재 <span className="text-zinc-300">{vvipCount}명</span>의 VVIP가 보호받고 있습니다.</p>
          </motion.div>
        )}

        {view === 'REPORT' && (
          <motion.div key="r" className="z-10 w-full max-w-3xl px-4 text-left">
            <div className="bg-[#080808] border border-white/10 rounded-[32px] p-10 md:p-16 space-y-12 shadow-2xl">
              <div className="space-y-4">
                <p className="text-[#C2A35D] text-[11px] tracking-[0.5em] font-medium uppercase">Today&apos;s Directive</p>
                <h3 className="text-2xl md:text-4xl font-light leading-tight text-white">{condition === '피곤함' ? '오늘은 모든 계획을 멈추고 빈 폴더만 하나 만든 뒤 즉시 퇴근하십시오.' : '최상의 컨디션입니다. 지금 바로 핵심 사업의 목차 3개만 작성하십시오.'}</h3>
              </div>
              <button onClick={handleComplete} className="w-full py-6 bg-white text-black text-[13px] font-bold tracking-widest uppercase hover:bg-[#C2A35D] transition-all rounded-xl">임무 완료 및 세션 종료</button>
            </div>
          </motion.div>
        )}

        {view === 'DONE' && (
          <motion.div key="d" className="z-10 text-center space-y-8">
             <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-tight">완벽한 하루였습니다.</h2>
             <p className="text-zinc-500 text-sm font-light tracking-[0.3em]">오늘의 모든 결정 권한 행사가 종료되었습니다.<br />이제 뇌를 완전히 비우십시오.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
