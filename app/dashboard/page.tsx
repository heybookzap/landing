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

  const defendedAssets = hourlyRate * 31
  const roiPercent = Math.round((defendedAssets / 390000) * 100)

  const GoldCheckMark = () => (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-16 h-16 mx-auto mb-10 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-[#C2A35D] blur-xl opacity-20 rounded-full"></div>
      <div className="relative w-full h-full border border-[#C2A35D]/60 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm shadow-[inset_0_0_15px_rgba(194,163,93,0.2)]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C2A35D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    </motion.div>
  )

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 font-pretendard overflow-hidden text-center relative">
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#C2A35D] rounded-full mix-blend-screen filter blur-[150px] opacity-5 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-white rounded-full mix-blend-screen filter blur-[200px] opacity-[0.02] pointer-events-none"></div>

      <AnimatePresence>
        {showNotify && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="absolute top-10 z-50 w-full max-w-md px-4">
            <div className="bg-white/[0.05] border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-start gap-4 text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C2A35D]/50 to-transparent"></div>
              <div className="bg-[#C2A35D] p-2 rounded-lg text-black text-[10px] font-bold uppercase shadow-[0_0_10px_rgba(194,163,93,0.3)]">확인</div>
              <div className="space-y-1">
                <p className="text-zinc-200 text-sm font-medium tracking-tight">오늘 대표님이 해야 할 일이 준비되었습니다.</p>
                <p className="text-zinc-500 text-xs font-light">지금 바로 확인하고 끝내버리세요.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'LOADING' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10">
            <p className="text-[#C2A35D] tracking-[0.5em] text-[10px] animate-pulse drop-shadow-[0_0_10px_rgba(194,163,93,0.5)]">시스템 접속 중...</p>
          </motion.div>
        )}

        {view === 'WEEKEND_PAUSED' && (
          <motion.div key="weekend" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-2xl text-center px-4">
            <h1 className="text-[#C2A35D] text-xs tracking-[0.6em] font-light mb-10 drop-shadow-md">[ 주말 휴식 중 ]</h1>
            <div className="bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-3xl p-10 md:p-14 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-8">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C2A35D]/30 to-transparent"></div>
              <p className="text-2xl md:text-3xl font-light tracking-tight leading-snug break-keep text-white drop-shadow-md">
                대표님, 주말입니다. <br />열심히 일한 만큼 완벽하게 쉬는 것도 <br />돈을 버는 사람들의 권리입니다.
              </p>
              <div className="w-12 h-[1px] bg-zinc-800 mx-auto"></div>
              <p className="text-zinc-500 text-sm font-extralight tracking-widest">안심하고 화면을 닫고 푹 쉬세요.</p>
            </div>
          </motion.div>
        )}

        {view === 'WEEKLY' && (
          <motion.div key="weekly" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-2xl text-left px-4">
            <p className="text-[#C2A35D] text-[10px] tracking-[0.4em] font-light text-center mb-10 drop-shadow-md">이번 주 보고서</p>
            <div className="bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-3xl p-10 md:p-14 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-8">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C2A35D]/30 to-transparent"></div>
              <h2 className="text-xl md:text-2xl font-light tracking-tight leading-relaxed text-zinc-200">
                이번 주 대표님은 <span className="text-[#C2A35D] font-medium">&apos;화요일&apos;</span>과 <span className="text-[#C2A35D] font-medium">&apos;수요일&apos;</span>에 피곤하다고 하셨고, <br />
                &apos;마케팅 기획&apos; 일에서 시간이 오래 걸렸습니다.
              </h2>
              <div className="h-[1px] w-full bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 opacity-50 my-8"></div>
              <p className="text-zinc-400 text-sm font-light leading-relaxed break-keep">
                다음 주 화요일과 수요일에는 머리를 안 써도 되는 쉬운 일만 강제로 드리겠습니다. 그래야 대표님이 덜 지칩니다.
              </p>
            </div>
            <p className="text-center text-zinc-600 text-[10px] font-extralight tracking-widest mt-10">
              오늘은 일요일입니다. 아무것도 하지 말고 쉬다가 내일 뵙겠습니다.
            </p>
          </motion.div>
        )}

        {view === 'MONDAY_INTRO' && (
          <motion.div key="monday" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-2xl px-4 text-center">
            <p className="text-[#C2A35D] text-[10px] tracking-[0.5em] font-light mb-10 drop-shadow-md">[ 에너지 100% 충전 완료 ]</p>
            <div className="bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-3xl p-10 md:p-14 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-10">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C2A35D]/30 to-transparent"></div>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight leading-snug break-keep text-zinc-200 drop-shadow-sm">
                주말 동안 시스템의 말대로 푹 쉬었기 때문에 <br />대표님의 머리가 다시 맑아졌습니다.
              </h2>
              <p className="text-zinc-400 text-sm font-light leading-relaxed tracking-widest break-keep">
                가장 맑은 상태에서 <br />이번 주 첫 번째 일을 시작해 볼까요?
              </p>
              <button onClick={() => setView('CONDITION')} className="w-full max-w-sm mx-auto py-5 bg-white text-black text-[11px] tracking-[0.4em] font-bold rounded-xl hover:bg-[#C2A35D] hover:shadow-[0_0_30px_rgba(194,163,93,0.4)] transition-all duration-500">
                시작하기
              </button>
            </div>
          </motion.div>
        )}

        {view === 'WELCOME_BACK' && (
          <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="z-10 w-full max-w-lg text-center px-4">
            <GoldCheckMark />
            <h1 className="text-3xl font-light tracking-tight text-white mb-10 drop-shadow-md">다시 오셨군요, 환영합니다.</h1>
            <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-3xl p-10 mb-10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C2A35D]/30 to-transparent"></div>
              <p className="text-zinc-400 text-sm font-extralight leading-relaxed tracking-widest break-keep mb-6">
                어제 못한 일들은 시스템이 알아서 지웠습니다. 자책하지 마세요.
              </p>
              <div className="space-y-2">
                <p className="text-zinc-200 text-sm font-medium tracking-wide">지나간 어제는 잊고,</p>
                <p className="text-zinc-200 text-sm font-medium tracking-wide">오늘 해야 할 딱 하나만 집중하세요.</p>
              </div>
            </div>
            <button onClick={handleStartToday} className="px-12 py-5 bg-[#C2A35D]/10 border border-[#C2A35D]/50 text-[#C2A35D] text-[11px] tracking-widest font-bold hover:bg-[#C2A35D] hover:text-black transition-all duration-500 rounded-xl shadow-[0_0_20px_rgba(194,163,93,0.1)] hover:shadow-[0_0_30px_rgba(194,163,93,0.3)]">
              오늘 할 일 확인하기
            </button>
          </motion.div>
        )}

        {view === 'SLICING' && (
          <motion.div key="slicing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10 text-center flex flex-col items-center">
            <div className="relative w-24 h-24 mb-16 flex items-center justify-center">
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute w-12 h-12 bg-[#C2A35D] blur-2xl rounded-full"></motion.div>
              <div className="absolute inset-0 border-[1px] border-white/5 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.02)]"></div>
              <motion.div animate={{ rotate: 360, rotateX: 10, rotateY: 10 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-[1.5px] border-[#C2A35D] border-t-transparent border-r-transparent rounded-full" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif tracking-[0.3em] text-white mb-8 drop-shadow-2xl">시스템 생각 중</h1>
            <p className="text-zinc-500 font-extralight tracking-widest text-sm leading-relaxed mb-10 max-w-md mx-auto px-4">
              대표님이 주무시는 동안, 가장 똑똑한 사람들의 행동 방식을 분석해서 <br />오늘 대표님이 가장 빨리 돈을 벌 수 있는 행동을 찾고 있습니다.
            </p>
            <div className="inline-block px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <p className="text-[#C2A35D] text-xs tracking-[0.3em] font-light">아침 9시에 알려드릴게요.</p>
            </div>
          </motion.div>
        )}

        {view === 'CONDITION' && (
          <motion.div key="condition" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="z-10 w-full flex flex-col items-center px-4">
            <motion.div animate={{ y: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="border border-[#C2A35D]/40 bg-[#C2A35D]/5 backdrop-blur-md px-6 py-2 rounded-full text-[#C2A35D] text-[10px] tracking-widest font-light mb-16 shadow-[0_0_15px_rgba(194,163,93,0.1)]">
              현재 상태 파악
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-20 text-center leading-snug drop-shadow-md">
              대표님, 오늘 <span className="font-serif italic text-zinc-300">머리 상태</span>가 <br className="hidden md:block"/>어떤지 솔직하게 알려주세요.
            </h2>
            <div className="flex flex-col md:flex-row gap-6 mb-20 w-full max-w-2xl justify-center">
              {['피곤함', '보통', '아주 좋음'].map((status) => (
                <motion.button 
                  key={status}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setCondition(status); setView('REPORT'); }} 
                  className="flex-1 py-8 border border-white/10 bg-white/[0.03] backdrop-blur-sm hover:bg-white/10 hover:border-[#C2A35D]/60 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-all duration-300 rounded-2xl text-zinc-400 hover:text-white text-sm tracking-widest font-light relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10">{status}</span>
                </motion.button>
              ))}
            </div>
            {vvipCount > 0 && (
              <p className="text-[11px] text-zinc-600 font-extralight tracking-widest flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C2A35D] opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C2A35D]"></span>
                </span>
                현재 <span className="text-zinc-300 font-medium mx-1">{vvipCount}</span> 명의 VVIP 회원들이 보호받고 있습니다.
              </p>
            )}
          </motion.div>
        )}

        {view === 'REPORT' && (
          <motion.div key="report" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="z-10 w-full max-w-4xl px-4">
            <div className="flex justify-between items-center mb-8 px-2">
              <h2 className="text-2xl font-light tracking-tight text-white drop-shadow-md">오늘의 행동 지침서</h2>
              <div className="bg-[#C2A35D]/10 border border-[#C2A35D]/40 backdrop-blur-md px-5 py-2 rounded-full text-[#C2A35D] text-[11px] font-medium tracking-widest shadow-[0_0_10px_rgba(194,163,93,0.1)]">
                상태: {condition}
              </div>
            </div>
            
            <div className="border border-white/10 bg-white/[0.02] backdrop-blur-2xl rounded-3xl p-8 md:p-14 space-y-12 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden text-left">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C2A35D]/50 to-transparent"></div>
              
              <div className="space-y-5">
                <h3 className="text-[#C2A35D] text-[11px] font-bold tracking-[0.3em] flex items-center gap-2">
                  <div className="w-1 h-3 bg-[#C2A35D] rounded-full"></div> 1. 지금 당장 할 일
                </h3>
                <div className="bg-black/40 border border-white/5 rounded-2xl p-8 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
                  <p className="text-zinc-100 text-lg md:text-xl font-light leading-relaxed break-keep relative z-10 text-center">
                    {condition === '피곤함' 
                      ? '"대표님이 쓰러지면 안 됩니다. 오늘은 컴퓨터에 빈 폴더만 하나 만들고 즉시 쉬세요."' 
                      : '"현재 상태가 아주 좋습니다. 지금 즉시 핵심 계획서의 목차 3개만 바로 적어보세요."'}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="text-[#C2A35D] text-[11px] font-bold tracking-[0.3em] flex items-center gap-2">
                  <div className="w-1 h-3 bg-[#C2A35D] rounded-full"></div> 2. 행동의 결과
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-black/60 to-black/20 border border-white/5 rounded-2xl p-8 space-y-5 relative">
                    <div className="text-zinc-400 text-xs font-medium tracking-widest flex items-center gap-3">
                      <span className="text-[#C2A35D] border border-[#C2A35D] rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-[0_0_10px_rgba(194,163,93,0.3)]">O</span>
                      이대로 하면 얻는 것
                    </div>
                    <p className="text-zinc-200 text-base font-light">뭘 할지 고민하는 스트레스 <strong className="font-medium text-white">30% 줄어듦</strong></p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-black/60 to-black/20 border border-white/5 rounded-2xl p-8 space-y-5 relative">
                    <div className="text-zinc-400 text-xs font-medium tracking-widest flex items-center gap-3">
                      <span className="text-red-500/80 border border-red-500/50 rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-[0_0_10px_rgba(239,68,68,0.2)]">X</span>
                      안 하고 미루면 잃는 것
                    </div>
                    <p className="text-zinc-200 text-base font-light">완벽하게 하려다 <strong className="font-medium text-red-400">이틀(48시간) 동안 아무것도 못 함</strong></p>
                  </motion.div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[#C2A35D] text-[11px] font-bold tracking-[0.3em] flex items-center gap-2">
                  <div className="w-1 h-3 bg-[#C2A35D] rounded-full"></div> 3. 생각 뒤집기
                </h3>
                <p className="text-zinc-400 text-sm font-light italic leading-relaxed break-keep px-4 border-l border-zinc-800">
                  시스템이 분석한 가장 필요한 일입니다. 다른 걱정은 모두 끄고 이것만 끝내세요.
                </p>
              </div>

              <button onClick={handleComplete} className="w-full py-6 mt-8 bg-white text-black text-[11px] tracking-[0.4em] font-bold rounded-xl hover:bg-[#C2A35D] hover:shadow-[0_0_30px_rgba(194,163,93,0.4)] transition-all duration-500">
                오늘 할 일 완료
              </button>
            </div>
          </motion.div>
        )}

        {view === 'VALUE' && (
          <motion.div key="value" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10 w-full max-w-3xl text-center px-4">
            <GoldCheckMark />
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-6 drop-shadow-lg">훌륭합니다.</h2>
            <p className="text-zinc-400 text-sm font-extralight tracking-widest mb-16 break-keep leading-relaxed">
              버려질 뻔했던 대표님의 귀한 시간과 돈을 지켜냈습니다.
            </p>
            
            <motion.div 
              animate={{ y: [-8, 8, -8] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="border border-white/20 bg-gradient-to-b from-white/[0.08] to-transparent backdrop-blur-2xl rounded-3xl py-20 px-10 mb-12 shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#C2A35D] rounded-full opacity-10 blur-3xl pointer-events-none"></div>
              
              <p className="text-zinc-400 text-[11px] tracking-[0.4em] mb-8 font-light relative z-10">올해 지켜낸 실제 돈</p>
              <div className="flex items-baseline justify-center gap-3 mb-6 relative z-10">
                <span className="text-[#C2A35D] text-2xl md:text-3xl font-light">₩</span>
                <span className="text-6xl md:text-8xl font-medium text-white tracking-tighter drop-shadow-2xl">{(hourlyRate * 2 * 365).toLocaleString()}</span>
              </div>
              <div className="inline-block px-4 py-1.5 bg-[#C2A35D]/10 border border-[#C2A35D]/30 rounded-full relative z-10">
                <p className="text-[#C2A35D] text-[10px] font-medium tracking-widest">대표님의 시간은 그 자체로 돈입니다.</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {view === 'UPSELL' && (
          <motion.div key="upsell" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-3xl text-left px-4">
            <p className="text-[#C2A35D] text-[10px] tracking-[0.4em] font-light text-center italic mb-10 drop-shadow-md">1년 동안 고민 완벽하게 없애기</p>
            <div className="bg-white/[0.02] border border-[#C2A35D]/40 backdrop-blur-2xl rounded-3xl p-10 md:p-14 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-10">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C2A35D]/60 to-transparent"></div>
              <p className="text-zinc-200 text-xl font-light leading-relaxed break-keep">
                대표님, 14일 동안 매일 지시를 완벽히 따르셨습니다. <br />대표님의 실행력은 이제 상위 0.1%입니다.
              </p>
              <div className="space-y-6">
                <p className="text-zinc-400 text-base font-light leading-relaxed break-keep">
                  이제 더 크게 돈을 벌기 위해 &apos;1년 치 한 번에 결제(연 구독)&apos;를 제안합니다. 제안을 받아들이시면 처음에 내셨던 39만 원은 시스템이 깎아드립니다.
                </p>
                <div className="bg-black/30 border border-white/5 rounded-xl p-6">
                  <p className="text-zinc-200 text-sm font-medium leading-relaxed break-keep">
                    매달 결제일에 고민하는 것조차 낭비입니다. <br />남은 11개월 동안 편하게 일만 하시겠습니까?
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6 flex flex-col items-center mt-12">
              <button onClick={() => setView('DONE')} className="w-full max-w-md py-6 bg-[#C2A35D] text-black text-[11px] tracking-[0.3em] font-bold rounded-xl shadow-[0_0_20px_rgba(194,163,93,0.3)] hover:shadow-[0_0_40px_rgba(194,163,93,0.6)] hover:bg-white transition-all duration-500">
                11개월 고민 한 번에 없애기 (₩ 3,510,000 결제)
              </button>
              <button onClick={() => setView('DONE')} className="text-[10px] text-zinc-500 tracking-[0.1em] hover:text-white transition-colors">
                아니요, 그냥 매월 39만 원씩 내겠습니다
              </button>
            </div>
          </motion.div>
        )}

        {view === 'ROI_RECEIPT' && (
          <motion.div key="roi" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-3xl text-left px-4">
            <div className="text-center space-y-4 mb-10">
              <h2 className="text-2xl font-light tracking-widest text-[#C2A35D] drop-shadow-md">첫 달 성과 보고서</h2>
              <p className="text-zinc-400 text-sm font-light italic">ONE BLANK와 함께한 첫 30일간의 기록</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-3xl p-10 md:p-14 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-10">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C2A35D]/30 to-transparent"></div>
              
              <p className="text-xs tracking-[0.3em] text-zinc-500 border-b border-white/10 pb-6 font-light">우리가 지켜낸 것들</p>
              
              <div className="space-y-8">
                <div className="flex justify-between items-center text-zinc-400 text-sm tracking-widest font-light">
                  <span>시스템이 대신 결정해 준 횟수</span>
                  <span className="text-white font-medium">42 번</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400 text-sm tracking-widest font-light">
                  <span>보호받은 대표님의 시간</span>
                  <span className="text-white font-medium">31 시간</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-8">
                  <span className="text-zinc-300 text-base font-light">지켜낸 돈의 가치</span>
                  <span className="text-[#C2A35D] text-3xl md:text-4xl font-medium tracking-tight drop-shadow-[0_0_15px_rgba(194,163,93,0.3)]">₩ {defendedAssets.toLocaleString()}</span>
                </div>
                <div className="bg-[#C2A35D]/10 border border-[#C2A35D]/30 rounded-xl p-4 text-center mt-4">
                  <p className="text-[#C2A35D] text-xs italic font-light tracking-widest">
                    결제하신 금액 대비 약 {roiPercent}% 이득을 보셨습니다.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-12 w-full flex justify-center">
              <button onClick={() => setView('DONE')} className="w-full max-w-md py-6 bg-[#C2A35D] text-black text-[11px] tracking-[0.2em] font-bold rounded-xl shadow-[0_0_20px_rgba(194,163,93,0.3)] hover:shadow-[0_0_40px_rgba(194,163,93,0.6)] hover:bg-white transition-all duration-500">
                1년 치 결제하고 39만 원 돌려받기
              </button>
            </div>
          </motion.div>
        )}

        {view === 'DONE' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="z-10 text-center flex flex-col items-center px-4">
            <GoldCheckMark />
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-8 drop-shadow-md">수고하셨습니다.</h2>
            <p className="text-zinc-400 text-sm font-extralight tracking-[0.3em] leading-relaxed break-keep">
              오늘 해야 할 일을 모두 끝냈습니다. <br />이제 편안하게 화면을 끄세요.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
