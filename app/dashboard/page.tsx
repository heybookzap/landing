'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export default function CustomerDashboardPage() {
  const router = useRouter()
  const [vvipCount, setVvipCount] = useState(0)
  const [view, setView] = useState<'LOADING' | 'WEEKEND_PAUSED' | 'WEEKLY' | 'MONDAY_INTRO' | 'WELCOME_BACK' | 'SLICING' | 'CONDITION' | 'REPORT' | 'VALUE' | 'DONE' | 'UPSELL' | 'ROI_RECEIPT'>('LOADING')
  const [condition, setCondition] = useState('')
  const [hourlyWage, setHourlyWage] = useState(0) 
  const [dayCount, setDayCount] = useState(0)
  const [showNotify, setShowNotify] = useState(false)
  const [activeTab, setActiveTab] = useState('SESSION')
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  // 📌 실시간 시계 동기화 로직
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }))
    }
    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (view === 'VALUE') {
      const timer = setTimeout(() => {
        setView('DONE')
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [view])

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/checkout')
          return
        }

        const pendingWage = localStorage.getItem('pending_hourly_wage')
        if (pendingWage) {
          const wageValue = parseInt(pendingWage)
          await supabase.from('profiles').update({ hourly_wage: wageValue }).eq('id', user.id)
          localStorage.removeItem('pending_hourly_wage')
        }

        const { data: profile } = await supabase.from('profiles').select('*, hourly_wage').eq('id', user.id).maybeSingle()

        if (!profile) {
          setHourlyWage(100000) 
        } else {
          setHourlyWage(profile.hourly_wage || 100000)
          const joinDate = new Date(profile.created_at)
          const diffTime = Math.abs(new Date().getTime() - joinDate.getTime())
          setDayCount(Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
        }

        const now = new Date()
        const day = now.getDay()
        const hours = now.getHours()
        const todayStr = now.toISOString().split('T')[0]
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        // 가입 당일 철벽 방어 (온보딩 우회를 위해 이 로직이 대시보드 진입을 막고 있을 수 있습니다)
        if (new Date(profile?.created_at || now).toDateString() === now.toDateString()) {
          setView('SLICING')
          return
        }

        const { data: todayReport } = await supabase.from('daily_reports').select('*').eq('user_id', user.id).gte('created_at', todayStr).maybeSingle()

        if (todayReport) {
          if (dayCount >= 30) setView('ROI_RECEIPT')
          else if (dayCount >= 14) setView('UPSELL')
          else setView('DONE')
          return
        }

        if (profile?.weekend_rest && (day === 0 || day === 6)) { setView('WEEKEND_PAUSED'); return }
        
        if (hours >= 23 || hours < 5) {
          setView('SLICING')
          return
        }

        const { data: yesterdayReport } = await supabase.from('daily_reports').select('*').eq('user_id', user.id).gte('created_at', yesterdayStr).lt('created_at', todayStr).maybeSingle()

        if (!yesterdayReport && day !== 1 && day !== 0) { 
          setView('WELCOME_BACK')
          return 
        }

        setView('CONDITION')
        setTimeout(() => setShowNotify(true), 1000)
        setTimeout(() => setShowNotify(false), 6000) 

      } catch (err) {
        setView('CONDITION')
      }
    }
    
    initDashboard()

    const fetchVvipCount = async () => {
      const { count } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE')
      if (count) setVvipCount(count)
    }
    fetchVvipCount()
  }, [dayCount, router])

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

  const handleComplete = async () => {
    setIsCheckingIn(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) await supabase.from('daily_reports').insert([{ user_id: user.id, status: 'COMPLETED' }])
      
      if (dayCount >= 30) setView('ROI_RECEIPT')
      else if (dayCount >= 14) setView('UPSELL')
      else setView('VALUE')
    } catch (err) { 
      alert('시스템 동기화 오류') 
    } finally {
      setIsCheckingIn(false)
    }
  }

  const startAfterWelcomeBack = () => {
    setView('CONDITION')
    setTimeout(() => setShowNotify(true), 1000)
    setTimeout(() => setShowNotify(false), 6000)
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 font-pretendard overflow-hidden text-center relative selection:bg-[#C2A35D] selection:text-black">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.025)_0%,_transparent_60%)] pointer-events-none z-0"></div>

      {view !== 'SLICING' && view !== 'CONDITION' && view !== 'VALUE' && view !== 'DONE' && view !== 'WELCOME_BACK' && (
        <header className="absolute top-0 left-0 w-full px-8 py-10 z-40 flex justify-between items-center">
          <div className="text-[#C2A35D] font-serif italic font-bold text-xl tracking-tight">ONE BLANK</div>
          <div className="hidden md:flex bg-white/5 backdrop-blur-xl rounded-full p-1 border border-white/5 text-[9px] tracking-[0.2em] uppercase">
            {['SESSION', 'DIRECTIVE', 'REPORT', 'SETTINGS'].map(tab => (
              <button key={tab} onClick={() => tab === 'SETTINGS' ? router.push('/dashboard/billing') : setActiveTab(tab)} className={`px-6 py-2.5 rounded-full transition-all duration-500 ${activeTab === tab ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-300'}`}>{tab}</button>
            ))}
          </div>
          <button onClick={() => router.push('/')} className="text-zinc-500 hover:text-white text-[10px] tracking-widest uppercase transition-colors">[ 로그아웃 ]</button>
        </header>
      )}

      <AnimatePresence>
        {showNotify && view === 'CONDITION' && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-12 z-50 w-full max-w-[360px] left-1/2 -translate-x-1/2">
            <div className="bg-[#0A0A0A]/95 backdrop-blur-3xl border border-[#C2A35D]/20 rounded-3xl p-8 shadow-2xl text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C2A35D]/50 to-transparent"></div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#C2A35D] w-1.5 h-1.5 rounded-full animate-pulse"></div>
                  <span className="text-[#C2A35D] text-[10px] tracking-[0.4em] font-bold uppercase font-serif italic">AUTHORIZED SIGNAL</span>
                </div>
                <span className="text-zinc-600 text-[9px] font-medium uppercase tracking-widest">Just Now</span>
              </div>
              <p className="text-white text-[16px] font-medium mb-3 tracking-wide break-keep">오늘의 지침이 정렬되었습니다.</p>
              <p className="text-zinc-400 text-[13px] font-light leading-relaxed tracking-wide break-keep">지금 바로 확인하고 뇌의 통제권을 시스템에 위임하십시오.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex items-center justify-center relative overflow-hidden text-center z-10 w-full">
        <AnimatePresence mode="wait">
          
          {view === 'SLICING' && (
            <motion.div key="p-slicing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center z-10 w-full h-full relative overflow-hidden">
              <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [transform:perspective(1000px)_rotateX(60deg)] [transform-origin:top]"></div>
                <motion.div animate={{ rotate: 360, x: [0, 20, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute top-1/4 -left-16 w-[400px] h-[400px] border-[0.5px] border-white/10 rounded-full" style={{ transform: "perspective(1000px) rotateY(70deg)" }} />
                <motion.div animate={{ y: [0, -30, 0], x: [0, -10, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 right-1/4 w-[320px] h-[320px] bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(1000px)_rotateX(50deg)_rotateZ(20deg)]" />
                <motion.div animate={{ rotateY: 360, y: [0, 15, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute bottom-1/3 left-1/3 w-[280px] h-[280px] border-[0.5px] border-white/10 rounded-full" style={{ transform: "perspective(1000px) rotateX(10deg)" }} />
              </div>
              <div className="space-y-12 flex flex-col items-center z-10">
                <div className="relative w-[76px] h-[76px] flex items-center justify-center mb-6">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-t border-r border-[#C2A35D] opacity-70" />
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }} className="absolute inset-2 rounded-full border-b border-l border-zinc-600 opacity-50" />
                </div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-[0.2em] uppercase">SYSTEM SLICING</h1>
                <div className="space-y-8 max-w-xl text-center">
                  <p className="text-zinc-400 text-[15px] font-light leading-[1.9] tracking-wide break-keep px-6">전 세계 상위 1% 성취자들의 검증된 의사결정 데이터 1,250만 개를 바탕으로 최적의 실행 경로를 분석 중입니다.</p>
                  <p className="text-zinc-400 text-[15px] font-light pt-2"><span className="font-bold text-white tracking-[0.15em] mx-2">05:00 AM</span>에 뵙겠습니다.</p>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'WELCOME_BACK' && (
            <motion.div key="p-wb" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-2xl px-6 flex flex-col items-center justify-center flex-1">
              <div className="w-16 h-16 border border-[#C2A35D] rounded-full flex items-center justify-center mb-8 bg-[#C2A35D]/5 shadow-[0_0_30px_rgba(194,163,93,0.1)]"><span className="text-[#C2A35D] text-2xl font-light">✓</span></div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8 tracking-tight break-keep">환영합니다.</h2>
              <div className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-3xl p-10 md:p-12 flex flex-col items-center text-center space-y-8 shadow-2xl mb-10">
                <p className="text-zinc-400 text-[15px] md:text-[16px] font-light leading-[1.9] tracking-wide break-keep px-4">지연된 과거 로그를 자산 방어 비용으로 처리하여 소멸시켰습니다.</p>
                <div className="space-y-3">
                  <p className="text-white text-[16px] md:text-[17px] font-medium tracking-wide break-keep">어제의 공백은 이제 없습니다.</p>
                  <p className="text-white text-[16px] md:text-[17px] font-medium tracking-wide break-keep">오늘의 단 하나만 실행하십시오.</p>
                </div>
              </div>
              <button onClick={startAfterWelcomeBack} className="px-14 py-5 border border-[#C2A35D] text-[#C2A35D] text-[14px] font-bold tracking-[0.25em] uppercase hover:bg-[#C2A35D] hover:text-black transition-all duration-500 rounded-xl">오늘의 설계 시작하기</button>
            </motion.div>
          )}

          {view === 'CONDITION' && (
            <motion.div key="p-c" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full flex flex-col items-center justify-center max-w-4xl flex-1 px-6">
              <div className="border border-[#C2A35D]/40 text-[#C2A35D] px-10 py-3 rounded-full text-[12px] font-bold tracking-[0.25em] mb-12 uppercase bg-[#C2A35D]/5">{currentTime || '05:00 AM'}</div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-10 leading-tight tracking-tight break-keep">대표님, 오늘의 컨디션은 어떠십니까?</h2>
              <div className="flex flex-col md:flex-row gap-4 mb-20 w-full max-w-2xl">
                {['피곤함', '보통', '아주 좋음'].map((status) => (
                  <button key={status} onClick={() => handleConditionSelect(status)} className="flex-1 py-10 border border-zinc-800 bg-[#0A0A0A] hover:border-[#C2A35D]/60 hover:bg-white/[0.03] transition-all duration-500 rounded-2xl text-zinc-300 hover:text-white text-[16px] font-medium tracking-wide shadow-xl hover:shadow-[0_0_20px_rgba(194,163,93,0.1)]">{status}</button>
                ))}
              </div>
              {vvipCount > 0 && (
                <div className="flex items-center gap-3 opacity-70">
                  <span className="text-[#C2A35D] text-[9px]">●</span>
                  <p className="text-zinc-500 text-[11px] font-light tracking-wide break-keep">현재 <span className="text-zinc-300 font-medium mx-1">{vvipCount}명</span>의 VVIP가 ONE BLANK 시스템의 영구적인 인지 보호를 받고 있습니다.</p>
                </div>
              )}
            </motion.div>
          )}

          {view === 'LOADING' && (
            <motion.div key="l" className="flex flex-col items-center gap-8">
              <div className="w-14 h-14 border-2 border-[#C2A35D]/20 border-t-[#C2A35D] rounded-full animate-spin"></div>
              <p className="text-[#C2A35D] tracking-[0.5em] text-[11px] uppercase font-bold animate-pulse">Connecting System...</p>
            </motion.div>
          )}

          {view === 'REPORT' && (
            <motion.div key="p-r" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="z-10 w-full max-w-3xl px-6 pb-24 pt-8">
              <div className="bg-[#080808] border border-zinc-800 rounded-3xl p-10 md:p-14 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C2A35D]/40 to-transparent"></div>
                <div className="flex justify-between items-center border-b border-zinc-800/60 pb-6">
                  <h2 className="text-xl font-medium text-white tracking-wide">오늘의 증거 리포트</h2>
                  <div className="border border-[#C2A35D]/30 text-[#C2A35D] px-6 py-2.5 rounded-md text-[13px] font-bold tracking-widest bg-[#C2A35D]/5">C: {condition}</div>
                </div>
                <div className="space-y-8 text-left">
                  <div className="space-y-4">
                    <h3 className="text-[#C2A35D] text-[13px] font-bold tracking-[0.15em] uppercase">▮ 1. 지금 당장 할 일</h3>
                    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-8 md:p-10">
                      <p className="text-[14px] md:text-[15px] font-light leading-[1.8] text-zinc-100 tracking-wide break-keep">
                        {condition === '피곤함' ? '"오늘은 뇌를 쉬게 하십시오. 관련 폴더만 바탕화면에 생성하고 즉시 종료하십시오. (1분 소요)"' : '"최상의 인지 효율 상태입니다. 지금 바로 핵심 사업의 실행 계획 3가지만 물리적 동사로 확정하십시오."'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-[#C2A35D] text-[13px] font-bold tracking-[0.15em] uppercase">▮ 2. 행동의 결과</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-8 space-y-4">
                        <p className="text-zinc-400 text-[13px] flex items-center gap-3 tracking-wide">
                          <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-[12px] font-extrabold shadow-[0_0_10px_rgba(255,255,255,0.4)]">O</span> 하면 얻는 것
                        </p>
                        <p className="text-white text-[15px] font-medium tracking-wide break-keep leading-relaxed">{condition === '피곤함' ? '의사결정 피로도 30% 즉시 감소' : '목표 달성 가속도 200% 증가'}</p>
                      </div>
                      <div className="bg-[#111111] border border-[#5A1515]/30 rounded-2xl p-8 space-y-4 shadow-[0_0_15px_rgba(90,21,21,0.1)]">
                        <p className="text-zinc-400 text-[13px] flex items-center gap-3 tracking-wide">
                          <span className="bg-[#6B1C1C] text-white border border-[#8B2222] rounded-full w-6 h-6 flex items-center justify-center text-[12px] font-extrabold shadow-[0_0_12px_rgba(180,30,30,0.4)]">X</span> 미루면 잃는 것
                        </p>
                        <p className="text-zinc-300 text-[15px] font-medium tracking-wide break-keep leading-relaxed">{condition === '피곤함' ? '완벽주의 발동으로 인한 48시간 지연' : '최적의 인지 효율 구간 영구 증발'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-[#C2A35D] text-[13px] font-bold tracking-[0.15em] uppercase">▮ 3. 생각 뒤집기</h3>
                    <p className="text-zinc-400 text-[14px] font-light leading-[1.8] italic tracking-wide break-keep pr-4">
                      {condition === '피곤함' ? '"지금 버리지 못하는 그 한 가지가, 고객이 아닌 당신의 불안감을 채우기 위한 방어기제는 아닙니까?"' : '"당신의 1시간은 수십만 원입니다. 지금 고민하는 그 일이 그 이상의 가치를 창출합니까?"'}
                    </p>
                  </div>
                </div>
                
                <motion.button 
                  onClick={handleComplete} 
                  disabled={isCheckingIn} 
                  whileTap={{ scale: 0.96, backgroundColor: '#050505', color: '#C2A35D', borderColor: '#C2A35D' }} 
                  className="w-full py-6 mt-6 bg-white text-black text-[15px] font-bold tracking-wide border border-transparent hover:bg-[#C2A35D] transition-colors duration-200 rounded-xl shadow-xl flex justify-center items-center gap-3 relative overflow-hidden cursor-pointer"
                >
                  {isCheckingIn ? <><div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div><span className="tracking-[0.2em] font-pretendard">SYSTEM SYNCING...</span></> : <span>10초 퀵 체크인</span>}
                </motion.button>
              </div>
            </motion.div>
          )}

          {view === 'VALUE' && (
            <motion.div key="p-v" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="z-10 w-full max-w-2xl px-6 flex flex-col items-center">
              <div className="w-16 h-16 border border-[#C2A35D] rounded-full flex items-center justify-center mb-8 bg-[#C2A35D]/5 shadow-[0_0_30px_rgba(194,163,93,0.1)]"><span className="text-[#C2A35D] text-2xl font-light">✓</span></div>
              <div className="text-center space-y-4 mb-8">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight break-keep">올해의 가치를 벌었습니다.</h2>
                <p className="text-zinc-400 text-[15px] font-light tracking-wide break-keep">대표님이 2분간 실행하여 당장 아낀 올해의 실제 돈입니다.</p>
              </div>
              <div className="w-full bg-[#080808] border border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center space-y-8 relative overflow-hidden shadow-2xl mb-8">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C2A35D]/50 to-transparent"></div>
                <p className="text-[#C2A35D] text-[13px] tracking-[0.4em] uppercase font-bold drop-shadow-[0_0_8px_rgba(194,163,93,0.4)]">1-Year ROI</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-zinc-500 text-3xl font-light">₩</span>
                  <span className="text-5xl md:text-6xl font-bold tracking-[-0.05em] text-white">{(hourlyWage * 150).toLocaleString()}</span>
                </div>
                <p className="text-[#C2A35D] text-[15px] font-medium tracking-[0.1em]">↑ {(hourlyWage * 1.5).toLocaleString()} (Today)</p>
              </div>
              <div className="w-full bg-[#0A0A0A] border border-zinc-900 rounded-2xl p-8 text-center"><p className="text-zinc-400 text-[14px] font-light tracking-wide break-keep leading-relaxed">가장 힘든 2분이 끝났습니다. 이제 고민 없이, 남은 일들을 처리하십시오.</p></div>
            </motion.div>
          )}

          {view === 'DONE' && (
            <motion.div key="p-d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10 text-center flex flex-col items-center justify-center w-full max-w-3xl px-6">
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="w-24 h-24 border border-[#C2A35D] rounded-full flex items-center justify-center mb-12 bg-[#C2A35D]/5 shadow-[0_0_40px_rgba(194,163,93,0.15)]">
                <svg className="w-10 h-10 text-[#C2A35D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth="1.2"/>
                  <path d="M8 11V7a4 4 0 1 1 8 0v4" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="space-y-8 w-full">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight break-keep">오늘의 전략적 셧다운을 승인합니다.</h2>
                <div className="text-zinc-400 text-[15px] md:text-[16px] font-light leading-[1.7] tracking-wide break-keep space-y-1">
                  <p>대표님은 방금 가장 핵심적인 과업을 해치웠습니다.</p>
                  <p>지금부터 머릿속에 떠오르는 '더 해야 하지 않을까?'라는 생각은,</p>
                  <p>완벽주의가 만들어낸 가짜 불안이자 내일의 에너지를 갉아먹는 '과잉'입니다.</p>
                  <div className="pt-16 mt-16 border-t border-zinc-800/80">
                    <p className="text-white text-[17px] md:text-[18px] font-medium tracking-wide">더 이상의 실행을 통제하십시오.</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  )
}
