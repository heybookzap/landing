'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard({ onExit }: { onExit: () => void }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview | vvip | funnel | logs
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }) + '.' + now.getMilliseconds().toString().padStart(3, '0'));
    }, 47);
    return () => clearInterval(timer);
  }, []);

  // --- Mock Data ---
  const vvipData = [
    { id: 'VB-001', status: 'Active', plan: 'Core 연 구독', condition: '보통', checkIn: '09:02:11', roi: '14,950,000', outcome: '연 매출 100억 달성' },
    { id: 'VB-002', status: 'Active', plan: 'Premium 월 구독', condition: '피곤함', checkIn: '09:15:44', roi: '32,100,000', outcome: '두 번째 브랜드 런칭' },
    { id: 'VB-003', status: 'Warning', plan: 'Core 월 구독', condition: '미입력', checkIn: 'Pending', roi: '8,400,000', outcome: '조직 리빌딩' },
    { id: 'VB-004', status: 'Active', plan: 'Core 연 구독', condition: '아주 좋음', checkIn: '09:00:05', roi: '21,000,000', outcome: '해외 시장 진출' },
  ];

  const logs = [
    { time: '09:02:11', type: 'ACTION', msg: 'VVIP [VB-001] 컨디션 "보통" 체크인 완료. ROI +150,000 업데이트.' },
    { time: '09:00:05', type: 'ACTION', msg: 'VVIP [VB-004] 컨디션 "아주 좋음" 체크인 완료. ROI +150,000 업데이트.' },
    { time: '09:00:00', type: 'SYSTEM', msg: '전체 VVIP 28명 대상 09:00 지침 푸시 알람 발송 완료 (성공률 100%).' },
    { time: '05:12:44', type: 'GHOST', msg: '[VB-003] 지연 로그 탐지. 자산 방어 비용 처리 및 Ghost Reset 강제 실행.' },
    { time: '05:00:00', type: 'SLICING', msg: '1,250만 데이터 대조 및 28명 개별 맞춤형 Slicing 프로세스 완료.' },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white font-['Pretendard'] p-8 selection:bg-[#D4AF37]/30">
      {/* Admin Header */}
      <header className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-[32px] font-black font-serif italic text-[#D4AF37] tracking-tighter">MASTER CONSOLE</h1>
          <p className="text-[12px] text-zinc-500 tracking-[0.3em] uppercase font-['Inter'] mt-2">One Blank System Administrator</p>
        </div>
        <div className="flex items-end gap-8">
          <div className="text-right">
            <p className="text-[10px] text-zinc-600 tracking-widest uppercase mb-1">Server Time (KST)</p>
            <p className="text-[20px] font-bold font-['Inter'] text-zinc-300 w-[140px]">{currentTime}</p>
          </div>
          <button onClick={onExit} className="px-6 py-3 border border-red-900/50 text-red-500 text-[12px] font-bold tracking-widest hover:bg-red-900/20 transition-all">EXIT CONSOLE</button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-10">
        {[
          { id: 'overview', label: '대시보드 요약' },
          { id: 'vvip', label: 'VVIP 상태망 통제' },
          { id: 'funnel', label: '수익화 퍼널 분석' },
          { id: 'logs', label: '시스템 코어 로그' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-3 text-[13px] font-bold tracking-widest uppercase transition-all ${activeTab === tab.id ? 'bg-[#D4AF37] text-black' : 'border border-white/10 text-zinc-500 hover:border-white/30 hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main>
        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="p-8 border border-white/5 bg-[#0a0a0a] rounded-2xl">
                  <p className="text-[11px] text-zinc-500 tracking-[0.2em] uppercase mb-4">현재 활성 VVIP</p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-[42px] font-black font-['Inter'] text-white">28</p>
                    <p className="text-[12px] text-green-500 font-bold">/ 30 슬롯</p>
                  </div>
                </div>
                <div className="p-8 border border-[#D4AF37]/30 bg-[#0a0a0a] rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37]/5 rounded-bl-full" />
                  <p className="text-[11px] text-[#D4AF37] tracking-[0.2em] uppercase mb-4">누적 결제액 (MRR/ARR)</p>
                  <p className="text-[32px] font-black font-['Inter'] text-white">₩104,700,000</p>
                  <p className="text-[11px] text-zinc-500 mt-2 font-['Inter']">Core 연 구독 85% 점유율</p>
                </div>
                <div className="p-8 border border-white/5 bg-[#0a0a0a] rounded-2xl">
                  <p className="text-[11px] text-zinc-500 tracking-[0.2em] uppercase mb-4">오늘 보호한 인지 자산</p>
                  <p className="text-[32px] font-black font-['Inter'] text-white">₩4,200,000</p>
                  <p className="text-[11px] text-zinc-500 mt-2 font-['Inter']">1인 평균 150,000 절감</p>
                </div>
                <div className="p-8 border border-white/5 bg-[#0a0a0a] rounded-2xl">
                  <p className="text-[11px] text-zinc-500 tracking-[0.2em] uppercase mb-4">시스템 부하율 (Slicing)</p>
                  <p className="text-[32px] font-black font-['Inter'] text-green-500">12.4%</p>
                  <p className="text-[11px] text-zinc-500 mt-2 font-['Inter']">Stable 상태</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: VVIP MANAGEMENT */}
          {activeTab === 'vvip' && (
            <motion.div key="vvip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[11px] text-zinc-500 tracking-widest uppercase bg-black/50">
                      <th className="p-6 font-medium">ID</th>
                      <th className="p-6 font-medium">Status</th>
                      <th className="p-6 font-medium">Plan</th>
                      <th className="p-6 font-medium">Condition</th>
                      <th className="p-6 font-medium">Check-In</th>
                      <th className="p-6 font-medium text-right">Protected Asset (KRW)</th>
                      <th className="p-6 font-medium">Dream Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px] font-light">
                    {vvipData.map((user, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-6 font-['Inter'] font-bold text-zinc-300">{user.id}</td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded text-[10px] font-bold ${user.status === 'Active' ? 'bg-green-900/30 text-green-500 border border-green-900' : 'bg-red-900/30 text-red-500 border border-red-900'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-6 font-medium text-[#D4AF37]">{user.plan}</td>
                        <td className="p-6">{user.condition}</td>
                        <td className="p-6 font-['Inter'] text-zinc-400">{user.checkIn}</td>
                        <td className="p-6 font-['Inter'] text-right font-medium">₩{user.roi}</td>
                        <td className="p-6 text-zinc-400 truncate max-w-[200px]">{user.outcome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 3: FUNNEL ANALYTICS */}
          {activeTab === 'funnel' && (
            <motion.div key="funnel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-2 gap-8">
                {/* Onboarding Funnel */}
                <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl">
                  <h3 className="text-[14px] font-bold tracking-widest text-[#D4AF37] mb-8 uppercase">온보딩 진입 전환율</h3>
                  <div className="space-y-6 relative">
                    <div className="absolute left-[15px] top-4 bottom-4 w-px bg-white/10 z-0" />
                    {[
                      { step: '1. 시급 입력 (랜딩)', users: 1240, rate: '100%' },
                      { step: '2. 기회비용 확인', users: 980, rate: '79%' },
                      { step: '3. 자격 심사 통과', users: 310, rate: '25%' },
                      { step: '4. 플랜 선택 (결제)', users: 28, rate: '2.2%' },
                      { step: '5. 목표 이식 완료', users: 28, rate: '100%' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-6 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-black border-2 border-[#D4AF37] flex items-center justify-center text-[10px] font-bold text-[#D4AF37] font-['Inter']">{i+1}</div>
                        <div className="flex-1 bg-white/[0.02] border border-white/5 p-4 rounded-xl flex justify-between items-center">
                          <span className="font-medium text-[13px]">{s.step}</span>
                          <div className="text-right">
                            <span className="font-['Inter'] font-bold text-[16px] mr-4">{s.users}명</span>
                            <span className="font-['Inter'] text-[12px] text-zinc-500 w-12 inline-block">{s.rate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Matrix Conversion */}
                <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl">
                  <h3 className="text-[14px] font-bold tracking-widest text-[#D4AF37] mb-8 uppercase">프라이싱 선택 분포</h3>
                  <div className="space-y-4">
                    <div className="p-6 border border-white/5 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-[14px] font-bold mb-1">Core 월 구독 (390k)</p>
                        <p className="text-[11px] text-zinc-500 uppercase tracking-widest">Decoy (미끼)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[24px] font-black font-['Inter']">10%</p>
                        <p className="text-[11px] text-zinc-500">3명</p>
                      </div>
                    </div>
                    <div className="p-6 border border-[#D4AF37] bg-[#D4AF37]/5 rounded-xl flex justify-between items-center shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                      <div>
                        <p className="text-[14px] font-bold mb-1 text-[#D4AF37]">Core 연 구독 (3.9M)</p>
                        <p className="text-[11px] text-[#D4AF37]/60 uppercase tracking-widest">Main Target</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[24px] font-black font-['Inter'] text-[#D4AF37]">85%</p>
                        <p className="text-[11px] text-zinc-400">24명</p>
                      </div>
                    </div>
                    <div className="p-6 border border-white/5 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-[14px] font-bold mb-1">Premium 월 구독 (1.5M)</p>
                        <p className="text-[11px] text-zinc-500 uppercase tracking-widest">Anchoring (고래)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[24px] font-black font-['Inter']">5%</p>
                        <p className="text-[11px] text-zinc-500">1명</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: SYSTEM LOGS */}
          {activeTab === 'logs' && (
            <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-black border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                <div className="bg-zinc-900 px-6 py-3 border-b border-white/10 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="ml-4 text-[11px] text-zinc-400 font-['Inter'] tracking-widest uppercase">Root@OneBlank-Core:~#</span>
                </div>
                <div className="p-8 font-['Inter'] text-[13px] h-[400px] overflow-y-auto space-y-3 font-medium">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-6 leading-relaxed hover:bg-white/5 p-1 -mx-1 rounded transition-colors">
                      <span className="text-zinc-500 min-w-[80px]">{log.time}</span>
                      <span className={`min-w-[80px] text-center px-2 rounded text-[10px] font-bold ${
                        log.type === 'ACTION' ? 'bg-blue-900/30 text-blue-400' :
                        log.type === 'GHOST' ? 'bg-red-900/30 text-red-500' :
                        log.type === 'SLICING' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' :
                        'bg-green-900/30 text-green-400'
                      }`}>
                        [{log.type}]
                      </span>
                      <span className="text-zinc-300 tracking-tight">{log.msg}</span>
                    </div>
                  ))}
                  <div className="flex gap-6 leading-relaxed animate-pulse">
                    <span className="text-zinc-500 min-w-[80px]">Now</span>
                    <span className="text-zinc-600">... Waiting for next input sequence ...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
