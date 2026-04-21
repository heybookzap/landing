'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminDashboardPage() {
  const router = useRouter()
  
  const [adminTab, setAdminTab] = useState<'ANALYTICS' | 'PREVIEW'>('PREVIEW')
  const [previewView, setPreviewView] = useState<'SLICING' | 'WELCOME_BACK' | 'CONDITION' | 'REPORT' | 'VALUE' | 'DONE'>('SLICING')
  const [condition, setCondition] = useState('보통')
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  const hourlyWage = 100000
  const vvipCount = 28

  const [editingUser, setEditingUser] = useState<any>(null)
  const [selectedConditionTab, setSelectedConditionTab] = useState<'아주 좋음' | '보통' | '피곤함'>('보통')
  const [reportDrafts, setReportDrafts] = useState<any>({
    '아주 좋음': { action: '', benefit: '', loss: '', mindset: '' },
    '보통': { action: '', benefit: '', loss: '', mindset: '' },
    '피곤함': { action: '', benefit: '', loss: '', mindset: '' }
  })

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
    if (previewView === 'VALUE') {
      const timer = setTimeout(() => {
        setPreviewView('DONE')
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [previewView])

  const handleTestCheckIn = async () => {
    setIsCheckingIn(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsCheckingIn(false)
    setPreviewView('VALUE')
  }

  const mockMetrics = {
    totalVVIP: 28,
    activeToday: 24,
    absentToday: 4,
    mrr: 10920000,
  }

  const mockUsers = [
    { 
      id: 1, name: "김대표", email: "ceo@company.com", plan: "연 구독 (VVIP)", status: "PENDING", condition: "-", streak: 12, lastLogin: "05:12 AM",
      preDrafts: {
        '아주 좋음': { action: "최상의 인지 효율 상태입니다. 지금 바로 핵심 사업의 실행 계획 3가지만 물리적 동사로 확정하십시오.", benefit: "목표 달성 가속도 200% 증가", loss: "최적의 인지 효율 구간 영구 증발", mindset: "당신의 1시간은 수십만 원입니다. 지금 고민하는 그 일이 그 이상의 가치를 창출합니까?" },
        '보통': { action: "감정에 휘둘리지 않는 최적의 상태입니다. 어제 세워둔 우선순위 1번 과제를 25분간 즉시 실행하십시오.", benefit: "안정적인 루틴 유지 및 복리 성과", loss: "평범한 하루로 전락하여 경쟁 우위 상실", mindset: "평범한 컨디션일 때 묵묵히 하는 실행이 진짜 실력을 만듭니다." },
        '피곤함': { action: "오늘은 뇌를 쉬게 하십시오. 관련 폴더만 바탕화면에 생성하고 즉시 종료하십시오. (1분 소요)", benefit: "의사결정 피로도 30% 즉시 감소", loss: "완벽주의 발동으로 인한 48시간 지연", mindset: "지금 버리지 못하는 그 한 가지가, 당신의 불안감을 채우기 위한 방어기제는 아닙니까?" }
      }
    },
    { 
      id: 2, name: "최임원", email: "choi@corp.com", plan: "월 구독", status: "PENDING", condition: "-", streak: 45, lastLogin: "어제",
      preDrafts: {
        '아주 좋음': { action: "가장 미루고 싶었던 그 전화를 지금 당장 거십시오.", benefit: "핵심 병목 현상 즉각 해소", loss: "심리적 부채감으로 인한 주간 효율 40% 하락", mindset: "어려운 일은 가장 에너지가 높을 때 가장 먼저 부숴야 합니다." },
        '보통': { action: "진행 중인 프로젝트의 다음 스텝을 3문장으로 요약하여 팀에 공유하십시오.", benefit: "업무 가시성 확보", loss: "커뮤니케이션 미스로 인한 리소스 낭비", mindset: "명확성은 속도를 만듭니다." },
        '피곤함': { action: "모든 알림을 끄고 15분간 눈을 감으십시오. 그 후 단순 메일 정리만 10분 진행합니다.", benefit: "신경계 안정화 및 최소한의 업무 방어", loss: "번아웃 누적으로 인한 주말 시간 증발", mindset: "전략적 휴식도 가장 강력한 실행 중 하나입니다." }
      }
    }
  ]

  const openReportModal = (user: any) => {
    setEditingUser(user)
    setSelectedConditionTab('보통')
    setReportDrafts({
      '아주 좋음': { ...user.preDrafts['아주 좋음'] },
      '보통': { ...user.preDrafts['보통'] },
      '피곤함': { ...user.preDrafts['피곤함'] }
    })
  }

  const handleDraftChange = (field: string, value: string) => {
    setReportDrafts((prev: any) => ({
      ...prev,
      [selectedConditionTab]: {
        ...prev[selectedConditionTab],
        [field]: value
      }
    }))
  }

  const saveReport = () => {
    alert(`[${editingUser.name}] 고객의 3가지 컨디션별 사전 데스킹이 완료되었습니다.`)
    setEditingUser(null)
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col font-pretendard relative selection:bg-[#C2A35D] selection:text-black overflow-y-auto">
      <div className="fixed top-0 left-0 w-full bg-black/95 border-b border-zinc-800 z-[100] backdrop-blur-2xl px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-[#C2A35D] font-serif italic text-xl font-bold tracking-tight">ONE BLANK</span>
          <span className="text-zinc-600 text-[10px] tracking-widest uppercase">/ Admin Console</span>
        </div>
        <div className="flex bg-zinc-900/50 p-1 rounded-md border border-zinc-800">
          <button onClick={() => setAdminTab('ANALYTICS')} className={`px-6 py-2 text-[11px] font-bold tracking-widest uppercase rounded-sm transition-all ${adminTab === 'ANALYTICS' ? 'bg-[#C2A35D] text-black' : 'text-zinc-500 hover:text-white'}`}>Data Analytics</button>
          <button onClick={() => setAdminTab('PREVIEW')} className={`px-6 py-2 text-[11px] font-bold tracking-widest uppercase rounded-sm transition-all ${adminTab === 'PREVIEW' ? 'bg-[#C2A35D] text-black' : 'text-zinc-500 hover:text-white'}`}>UI Preview</button>
        </div>
        <button onClick={() => router.push('/')} className="text-zinc-500 hover:text-white text-[10px] tracking-widest uppercase transition-colors">[ Exit ]</button>
      </div>

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(194,163,93,0.025)_0%,_transparent_60%)] pointer-events-none z-0"></div>

      <div className="pt-24 flex-1 flex flex-col z-10">
        
        {adminTab === 'ANALYTICS' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-7xl mx-auto w-full space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#0A0A0A] border border-zinc-800 p-8 rounded-2xl flex flex-col gap-3 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#C2A35D]/50"></div>
                <span className="text-zinc-500 text-[11px] font-bold tracking-widest uppercase">Total Active VVIPs</span>
                <span className="text-4xl font-light text-white tracking-tight">{mockMetrics.totalVVIP}명</span>
              </div>
              <div className="bg-[#0A0A0A] border border-zinc-800 p-8 rounded-2xl flex flex-col gap-3 shadow-xl">
                <span className="text-zinc-500 text-[11px] font-bold tracking-widest uppercase">Checked-In Today</span>
                <span className="text-4xl font-light text-[#C2A35D] tracking-tight">{mockMetrics.activeToday}명</span>
              </div>
              <div className="bg-[#0A0A0A] border border-red-900/30 p-8 rounded-2xl flex flex-col gap-3 shadow-xl">
                <span className="text-red-500/70 text-[11px] font-bold tracking-widest uppercase">Absent Warning</span>
                <span className="text-4xl font-light text-red-400 tracking-tight">{mockMetrics.absentToday}명</span>
              </div>
              <div className="bg-[#0A0A0A] border border-zinc-800 p-8 rounded-2xl flex flex-col gap-3 shadow-xl">
                <span className="text-zinc-500 text-[11px] font-bold tracking-widest uppercase">Est. Monthly Revenue</span>
                <span className="text-4xl font-light text-white tracking-tight">₩ {(mockMetrics.mrr / 10000).toLocaleString()}만</span>
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="px-10 py-8 border-b border-zinc-800 flex justify-between items-center bg-[#111111]/50">
                <h3 className="text-xl font-medium text-white tracking-wide">VVIP 행동 로깅 모니터</h3>
                <button className="text-[#C2A35D] text-[12px] font-bold uppercase tracking-[0.2em] border border-[#C2A35D]/30 px-5 py-2 rounded-full hover:bg-[#C2A35D]/10 transition-colors">Export CSV</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/50 text-zinc-500 text-[11px] tracking-widest uppercase font-bold">
                      <th className="px-10 py-5 font-medium">Name</th>
                      <th className="px-10 py-5 font-medium">Plan</th>
                      <th className="px-10 py-5 font-medium">Today Status</th>
                      <th className="px-10 py-5 font-medium">Condition</th>
                      <th className="px-10 py-5 font-medium">Streak</th>
                      <th className="px-10 py-5 font-medium">Last Login</th>
                      <th className="px-10 py-5 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] divide-y divide-zinc-900/50">
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-10 py-6">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-white font-medium tracking-wide text-[15px]">{user.name}</span>
                            <span className="text-zinc-600 text-[12px] tracking-wide">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-zinc-400 tracking-wide">{user.plan}</td>
                        <td className="px-10 py-6">
                          {user.status === 'PENDING' && <span className="text-zinc-400 text-[12px] border border-zinc-700 px-3 py-1.5 rounded-md tracking-wider font-medium">대기중</span>}
                        </td>
                        <td className="px-10 py-6 text-zinc-400 tracking-wide">{user.condition}</td>
                        <td className="px-10 py-6 text-white font-medium tracking-wide">{user.streak} Days</td>
                        <td className="px-10 py-6 text-zinc-500 tracking-wide">{user.lastLogin}</td>
                        <td className="px-10 py-6 text-right">
                          <button onClick={() => openReportModal(user)} className="text-[#C2A35D] font-bold hover:text-white text-[12px] border border-[#C2A35D]/40 px-4 py-2 rounded transition-colors tracking-widest uppercase hover:bg-[#C2A35D]/10">
                            사전 데스킹
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {adminTab === 'PREVIEW' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col relative">
            <div className="w-full bg-black border-b border-zinc-800 py-3 flex justify-center gap-2 overflow-x-auto px-4 z-50">
              <span className="text-zinc-600 text-[11px] font-bold tracking-[0.25em] uppercase mr-5 flex items-center">Flow Test</span>
              {['SLICING', 'WELCOME_BACK', 'CONDITION', 'REPORT', 'VALUE', 'DONE'].map((state) => (
                <button 
                  key={state}
                  onClick={() => setPreviewView(state as any)}
                  className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded border transition-all ${
                    previewView === state ? 'border-[#C2A35D] text-[#C2A35D] bg-[#C2A35D]/5' : 'border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'
                  }`}
                >
                  {state.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="flex-1 flex items-center justify-center relative overflow-hidden text-center">
              <AnimatePresence mode="wait">
                
                {previewView === 'SLICING' && (
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

                {previewView === 'WELCOME_BACK' && (
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
                    <button onClick={() => setPreviewView('CONDITION')} className="px-14 py-5 border border-[#C2A35D] text-[#C2A35D] text-[14px] font-bold tracking-[0.25em] uppercase hover:bg-[#C2A35D] hover:text-black transition-all duration-500 rounded-xl">오늘의 설계 시작하기</button>
                  </motion.div>
                )}

                {previewView === 'CONDITION' && (
                  <motion.div key="p-c" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full flex flex-col items-center justify-center max-w-4xl flex-1 px-6">
                    <div className="border border-[#C2A35D]/40 text-[#C2A35D] px-10 py-3 rounded-full text-[12px] font-bold tracking-[0.25em] mb-12 uppercase bg-[#C2A35D]/5">{currentTime || '05:00 AM'}</div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-10 leading-tight tracking-tight break-keep">대표님, 오늘의 컨디션은 어떠십니까?</h2>
                    <div className="flex flex-col md:flex-row gap-4 mb-20 w-full max-w-2xl">
                      {['피곤함', '보통', '아주 좋음'].map((status) => (
                        <button key={status} onClick={() => { setCondition(status); setPreviewView('REPORT'); }} className="flex-1 py-10 border border-zinc-800 bg-[#0A0A0A] hover:border-[#C2A35D]/60 hover:bg-white/[0.03] transition-all duration-500 rounded-2xl text-zinc-300 hover:text-white text-[16px] font-medium tracking-wide shadow-xl hover:shadow-[0_0_20px_rgba(194,163,93,0.1)]">{status}</button>
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

                {previewView === 'REPORT' && (
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
                        onClick={handleTestCheckIn} 
                        disabled={isCheckingIn} 
                        whileTap={{ scale: 0.96, backgroundColor: '#050505', color: '#C2A35D', borderColor: '#C2A35D' }} 
                        className="w-full py-6 mt-6 bg-white text-black text-[15px] font-bold tracking-wide border border-transparent hover:bg-[#C2A35D] transition-colors duration-200 rounded-xl shadow-xl flex justify-center items-center gap-3 relative overflow-hidden cursor-pointer"
                      >
                        {isCheckingIn ? <><div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div><span className="tracking-[0.2em] font-pretendard">SYSTEM SYNCING...</span></> : <span>10초 퀵 체크인</span>}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {previewView === 'VALUE' && (
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

                {previewView === 'DONE' && (
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
                        <div className="pt-14 mt-14 border-t border-zinc-800/80">
                          <p className="text-white text-[17px] md:text-[18px] font-medium tracking-wide">더 이상의 실행을 통제하십시오.</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {editingUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center px-6">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-[#0A0A0A] border border-zinc-800 rounded-3xl p-12 w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-8">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white tracking-wide">사전 데스킹 (Pre-Desking)</h3>
                  <p className="text-zinc-400 text-[14px] mt-3 tracking-wide font-light">[{editingUser.name}] 고객이 접속 전, 3가지 컨디션에 따른 지침을 미리 검수합니다.</p>
                </div>
                <button onClick={() => setEditingUser(null)} className="text-zinc-500 hover:text-white text-3xl font-light">&times;</button>
              </div>

              <div className="flex border-b border-zinc-800 mb-10">
                {['아주 좋음', '보통', '피곤함'].map(tab => (
                  <button key={tab} onClick={() => setSelectedConditionTab(tab as any)} className={`flex-1 py-5 text-[14px] font-bold tracking-[0.2em] uppercase transition-all ${selectedConditionTab === tab ? 'text-[#C2A35D] border-b-2 border-[#C2A35D]' : 'text-zinc-600 hover:text-zinc-400'}`}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="space-y-10">
                <div>
                  <label className="block text-[#C2A35D] text-[12px] font-bold tracking-[0.2em] mb-4 uppercase">1. 지금 당장 할 일</label>
                  <textarea value={reportDrafts[selectedConditionTab].action} onChange={(e) => handleDraftChange('action', e.target.value)} className="w-full bg-[#111111] border border-zinc-800 rounded-2xl p-6 text-zinc-300 text-[16px] leading-[1.8] tracking-wide focus:border-[#C2A35D] focus:outline-none min-h-[120px]" />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[#C2A35D] text-[12px] font-bold tracking-[0.2em] mb-4 uppercase">2-1. 얻는 것</label>
                    <textarea value={reportDrafts[selectedConditionTab].benefit} onChange={(e) => handleDraftChange('benefit', e.target.value)} className="w-full bg-[#111111] border border-zinc-800 rounded-2xl p-6 text-zinc-300 text-[16px] leading-[1.8] tracking-wide focus:border-[#C2A35D] focus:outline-none min-h-[100px]" />
                  </div>
                  <div>
                    <label className="block text-[#C2A35D] text-[12px] font-bold tracking-[0.2em] mb-4 uppercase">2-2. 잃는 것</label>
                    <textarea value={reportDrafts[selectedConditionTab].loss} onChange={(e) => handleDraftChange('loss', e.target.value)} className="w-full bg-[#111111] border border-zinc-800 rounded-2xl p-6 text-zinc-300 text-[16px] leading-[1.8] tracking-wide focus:border-[#C2A35D] focus:outline-none min-h-[100px]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[#C2A35D] text-[12px] font-bold tracking-[0.2em] mb-4 uppercase">3. 생각 뒤집기</label>
                  <textarea value={reportDrafts[selectedConditionTab].mindset} onChange={(e) => handleDraftChange('mindset', e.target.value)} className="w-full bg-[#111111] border border-zinc-800 rounded-2xl p-6 text-zinc-300 text-[16px] leading-[1.8] tracking-wide focus:border-[#C2A35D] focus:outline-none min-h-[100px]" />
                </div>
              </div>

              <div className="flex gap-6 mt-14">
                <button onClick={() => setEditingUser(null)} className="flex-1 py-6 border border-zinc-800 text-zinc-400 rounded-xl hover:bg-zinc-900 transition-colors text-[14px] font-bold tracking-[0.2em] uppercase">취소</button>
                <button onClick={saveReport} className="flex-1 py-6 bg-[#C2A35D] text-black font-bold rounded-xl hover:bg-[#d4b97a] transition-colors text-[14px] tracking-[0.2em] uppercase shadow-xl">이 컨디션 초안 저장</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
