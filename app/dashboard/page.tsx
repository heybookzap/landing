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
    } catch (err) { alert('Error saving record.') }
  }

  const defendedAssets = hourlyRate * 31
  const roiPercent = Math.round((defendedAssets / 390000) * 100)

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 font-pretendard overflow-hidden text-center relative">
      <AnimatePresence>
        {showNotify && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="absolute top-10 z-50 w-full max-w-md px-4">
            <div className="bg-[#111] border border-zinc-800 rounded-2xl p-6 shadow-2xl flex items-start gap-4 text-left">
              <div className="bg-[#C2A35D] p-2 rounded-lg text-black text-[10px] font-bold uppercase">Auth</div>
              <div className="space-y-1">
                <p className="text-zinc-200 text-sm font-medium tracking-tight">대표님의 가치를 증명할 지침이 준비되었습니다.</p>
                <p className="text-zinc-500 text-xs font-light">지금 즉시 확인하고 실행력을 행사하십시오.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'LOADING' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-zinc-800 tracking-[0.5em] text-[10px] animate-pulse">SYSTEM SYNCHRONIZING...</p>
          </motion.div>
        )}

        {view === 'WEEKEND_PAUSED' && (
          <motion.div key="weekend" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h1 className="text-[#C2A35D] text-xs tracking-[0.6em] font-light uppercase italic">[Cognitive Rest Authorized]</h1>
            <div className="space-y-6">
              <p className="text-2xl md:text-3xl font-light tracking-tight leading-snug break-keep">
                대표님, 주말입니다. <br />격렬한 몰입 끝에 얻는 완벽한 고요함은 <br />상위 0.1%만이 누리는 정당한 권리입니다.
              </p>
              <p className="text-zinc-500 text-sm font-extralight tracking-widest">안심하고 화면을 닫고 뇌를 보호하십시오.</p>
            </div>
          </motion.div>
        )}

        {view === 'WEEKLY' && (
          <motion.div key="weekly" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl space-y-12 text-left">
            <p className="text-[#C2A35D] text-[10px] tracking-[0.4em] font-light uppercase text-center">Weekly Strategy Report</p>
            <div className="bg-[#0a0a0a] border border-zinc-900 p-12 space-y-8">
              <h2 className="text-xl md:text-2xl font-medium tracking-tight leading-snug">
                이번 주 대표님은 <span className="text-[#C2A35D]">&apos;화요일&apos;</span>과 <span className="text-[#C2A35D]">&apos;수요일&apos;</span>에 피로를 보고하하셨고, <br />
                &apos;마케팅 기획&apos; 미션에서 실행 지연이 발생했습니다.
              </h2>
              <div className="h-[1px] w-full bg-zinc-800 my-8 opacity-30"></div>
              <p className="text-zinc-400 text-sm font-light leading-relaxed break-keep">
                다음 주 화/수요일에는 뇌 에너지가 가장 적게 드는 단순 리서치 업무만 강제로 배정하여 인지 부하를 낮추겠습니다.
              </p>
            </div>
            <p className="text-center text-zinc-600 text-[10px] font-extralight tracking-widest mt-8">
              오늘은 일요일입니다. 시스템의 통제에 따라 완전히 쉬고 내일 뵙겠습니다.
            </p>
          </motion.div>
        )}

        {view === 'MONDAY_INTRO' && (
          <motion.div key="monday" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl space-y-12">
            <p className="text-[#C2A35D] text-[10px] tracking-[0.5em] font-light uppercase italic">[Engine Reassembled]</p>
            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight leading-snug break-keep">
                주말 동안 시스템의 지시에 따른 완벽한 휴식으로 <br />대표님의 인지 엔진이 다시 조립되었습니다.
              </h2>
              <p className="text-zinc-400 text-sm font-light leading-relaxed tracking-widest break-keep">
                누구보다 날카로워진 직관을 믿으십시오. <br />이번 주 첫 번째 임무를 개시합니다.
              </p>
            </div>
            <button onClick={() => setView('CONDITION')} className="px-12 py-5 bg-white text-black text-[10px] tracking-[0.5em] font-bold hover:bg-[#C2A35D] transition-all duration-700">임무 개시</button>
          </motion.div>
        )}

        {view === 'WELCOME_BACK' && (
          <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
            <div className="w-12 h-12 border border-[#C2A35D] rounded-full mx-auto flex items-center justify-center text-[#C2A35D]">✓</div>
            <h1 className="text-2xl font-light tracking-tight">시스템 복귀를 환영합니다.</h1>
            <div className="bg-[#0a0a0a] border border-zinc-900 p-12 max-w-md mx-auto space-y-8">
              <p className="text-zinc-500 text-xs font-extralight leading-relaxed tracking-widest break-keep">
                어제의 기록은 자산 방어 비용으로 소멸 처리되었습니다. 자책하지 마십시오. <br />과거가 아닌 현재의 단 하나에만 집중하십시오.
              </p>
            </div>
            <button onClick={handleStartToday} className="px-10 py-4 border border-[#C2A35D] text-[#C2A35D] text-xs tracking-[0.3em] font-bold hover:bg-[#C2A35D] hover:text-black transition-all duration-700">오늘의 설계 시작하기</button>
          </motion.div>
        )}

        {view === 'SLICING' && (
          <motion.div key="slicing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
             <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-[1px] border-[#C2A35D]/10 rounded-full"></div>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-[1px] border-[#C2A35D] border-t-transparent rounded-full" />
            </div>
            <h1 className="text-2xl tracking-[0.5em] font-light italic text-[#C2A35D]">SYSTEM SLICING</h1>
            <p className="text-zinc-500 font-extralight tracking-widest text-sm leading-relaxed">대표님이 주무시는 동안, 시스템이 상위 1% 데이터를 분석하여<br />오늘의 최적 실행 경로를 도출하고 있습니다.</p>
            <p className="text-[#C2A35D]/80 text-[10px] tracking-[0.4em] font-extralight animate-pulse italic">오전 9시에 지침이 활성화됩니다.</p>
          </motion.div>
        )}

        {view === 'CONDITION' && (
          <motion.div key="condition" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-4xl space-y-24">
            <div className="space-y-4">
              <p className="text-[#C2A35D] text-[10px] tracking-[0.5em] font-light mb-4 italic">IDENTIFICATION</p>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight leading-snug">대표님, 현재 <span className="font-serif italic text-zinc-300">인지 컨디션</span>을 <br />가감 없이 보고하십시오.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto w-full px-4">
              {['피곤함', '보통', '최상'].map((status) => (
                <button key={status} onClick={() => { setCondition(status); setView('REPORT'); }} className="group py-12 border border-zinc-900 bg-[#080808] hover:border-[#C2A35D]/30 transition-all duration-700">
                  <span className="text-zinc-500 group-hover:text-[#C2A35D] transition-colors duration-700 font-extralight tracking-[0.4em] text-xs uppercase">{status}</span>
                </button>
              ))}
            </div>
            {vvipCount > 0 && (
              <p className="text-[9px] text-zinc-600 tracking-[0.2em] font-light opacity-40 uppercase">Protecting {vvipCount} VVIP Intelligence Units.</p>
            )}
          </motion.div>
        )}

        {view === 'REPORT' && (
          <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-xl space-y-12">
            <p className="text-[#C2A35D] text-[10px] tracking-[0.4em] font-light uppercase italic">Single Command</p>
            <div className="bg-[#0a0a0a] border border-zinc-900 p-12 space-y-10 shadow-2xl">
              <h3 className="text-2xl font-medium tracking-tighter leading-tight break-keep text-zinc-200">
                {condition === '피곤함' 
                  ? "대표님의 가치를 보호하기 위해, 오늘은 관련 폴더만 생성하고 즉시 휴식하십시오." 
                  : "현재 컨디션은 최상입니다. 지금 즉시 핵심 지침 하나를 완수하여 시장을 지배하십시오."}
              </h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed break-keep tracking-wide">
                시스템이 분석한 오늘 대표님께 가장 필요한 조치입니다. <br />이 지침 외의 모든 인지적 노이즈를 차단하십시오.
              </p>
              <button onClick={handleComplete} className="w-full py-5 bg-white text-black text-[10px] tracking-[0.5em] font-bold hover:bg-[#C2A35D] transition-colors duration-500">수행 완료</button>
            </div>
          </motion.div>
        )}

        {view === 'VALUE' && (
          <motion.div key="value" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="w-12 h-12 border border-[#C2A35D] rounded-full mx-auto flex items-center justify-center text-[#C2A35D]">✓</div>
            <h2 className="text-2xl font-light tracking-tight break-keep text-zinc-200">훌륭합니다. 오늘의 몰입으로 <br />누수되던 15%의 자산을 완벽히 방어하셨습니다.</h2>
            <div className="bg-[#0a0a0a] border border-zinc-900 py-16 px-20 shadow-xl">
              <p className="text-zinc-500 text-[10px] tracking-widest mb-4 italic font-light uppercase">Expected Annual ROI</p>
              <p className="text-4xl md:text-5xl font-medium tracking-tight text-white">₩ {(hourlyRate * 2 * 365).toLocaleString()}</p>
              <p className="text-[#C2A35D] text-[10px] mt-6 tracking-[0.2em] font-light">대표님의 시간은 그 자체로 거대한 자본입니다.</p>
            </div>
          </motion.div>
        )}

        {view === 'UPSELL' && (
          <motion.div key="upsell" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl space-y-12 text-left">
            <p className="text-[#C2A35D] text-[10px] tracking-[0.4em] font-light uppercase text-center italic">Authorization for Full Governance</p>
            <div className="bg-[#0a0a0a] border border-[#C2A35D] p-12 space-y-8 shadow-2xl">
              <p className="text-zinc-200 text-lg font-light leading-relaxed break-keep">
                대표님, 14일간의 규율을 완벽히 증명하셨습니다. <br />현재 대표님의 인지 효율성은 상위 0.1% 수준으로 수립되고 있습니다.
              </p>
              <div className="space-y-4">
                <p className="text-zinc-400 text-sm font-light leading-relaxed break-keep">
                  이제 더 큰 성장을 위해 &apos;1년 치 통제권(연 구독)&apos;으로 업그레이드를 제안합니다. 이미 결제하신 첫 달 요금 39만 원은 전액 시스템이 공제하겠습니다.
                </p>
                <p className="text-zinc-200 text-sm font-medium pt-4 break-keep">
                  매달의 결제 고민조차 뇌 에너지 낭비입니다. <br />남은 11개월의 자유를 지금 확정하시겠습니까?
                </p>
              </div>
            </div>
            <div className="space-y-6 flex flex-col items-center">
              <button onClick={() => setView('DONE')} className="w-full py-5 bg-[#C2A35D] text-black text-[11px] tracking-[0.2em] font-bold transition-all duration-700 hover:bg-white">
                11개월 통제권 일시 위임 (₩ 3,510,000 결제)
              </button>
              <button onClick={() => setView('DONE')} className="text-[10px] text-zinc-600 tracking-[0.1em] hover:text-zinc-400">시스템의 제안을 보류하고 월 구독 유지</button>
            </div>
          </motion.div>
        )}

        {view === 'ROI_RECEIPT' && (
          <motion.div key="roi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl space-y-10 text-left">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-light tracking-widest text-[#C2A35D] uppercase">Audit Report</h2>
              <p className="text-zinc-400 text-sm font-light italic">ONE BLANK와 함께한 첫 30일간의 가치 보고서</p>
            </div>
            <div className="bg-[#0a0a0a] border border-zinc-900 p-10 space-y-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-serif italic text-4xl uppercase">Audit</div>
              <p className="text-xs tracking-[0.3em] text-zinc-600 border-b border-zinc-900 pb-4 uppercase">Monthly ROI Analysis</p>
              <div className="space-y-6">
                <div className="flex justify-between items-center text-zinc-500 text-xs uppercase tracking-widest font-light">
                  <span>Authorized Decisions</span>
                  <span className="text-zinc-200">42 Units</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500 text-xs uppercase tracking-widest font-light">
                  <span>Protected Brain Energy</span>
                  <span className="text-zinc-200">31 Hours</span>
                </div>
                <div className="flex justify-between items-center border-t border-zinc-900 pt-6">
                  <span className="text-zinc-400 text-sm font-light">Defended Asset Value</span>
                  <span className="text-[#C2A35D] text-2xl font-medium tracking-tight">₩ {defendedAssets.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-zinc-600 text-right italic font-extralight tracking-widest">
                  구독료 대비 약 {roiPercent}%의 자산 방어 수익 달성
                </p>
              </div>
            </div>
            <button onClick={() => setView('DONE')} className="w-full py-5 bg-[#C2A35D] text-black text-[11px] tracking-[0.1em] font-bold transition-all hover:bg-white uppercase">연 구독 업그레이드 및 39만 원 환급</button>
          </motion.div>
        )}

        {view === 'DONE' && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="w-12 h-12 border border-[#C2A35D] rounded-full mx-auto flex items-center justify-center text-[#C2A35D]">✓</div>
            <h2 className="text-2xl font-medium tracking-tight text-zinc-200">압도적인 하루였습니다.</h2>
            <p className="text-zinc-500 text-xs font-extralight tracking-[0.3em]">이미 오늘 부여된 통제권을 완벽히 행사하셨습니다. <br />이제 평온하게 뇌의 스위치를 끄십시오.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
