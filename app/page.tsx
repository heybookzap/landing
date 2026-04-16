'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OneBlankEliteSystem() {
  const [appState, setAppState] = useState('onboarding');
  const [step, setStep] = useState(1);
  const [hourlyValue, setHourlyValue] = useState<number>(100000);
  const [dreamOutcome, setDreamOutcome] = useState('');
  const [testTime, setTestTime] = useState('09:00');
  const [condition, setCondition] = useState<string | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [roiAsset, setRoiAsset] = useState(14950000);
  const [showPush, setShowPush] = useState(false);
  const [isGhostResetting, setIsGhostResetting] = useState(false);
  const [paidUsers] = useState(28);

  const dailyGain = hourlyValue * 1.5;

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    const start = roiAsset;
    const end = roiAsset + dailyGain;
    const duration = 2500;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setRoiAsset(Math.floor(start + (end - start) * easeOutQuart));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-['Pretendard'] flex flex-col relative overflow-hidden selection:bg-[#D4AF37]/30">

      {/* PUSH NOTIFICATION LAYER */}
      <AnimatePresence>
        {showPush && (
          <motion.div
            initial={{ y: -150, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: -150, opacity: 0, x: "-50%" }}
            className="absolute top-8 left-1/2 w-[90%] max-w-[420px] z-[100] cursor-pointer"
            onClick={() => setShowPush(false)}
          >
            <div className="bg-[#1C1C1E]/90 backdrop-blur-3xl border border-white/10 p-6 rounded-[32px] shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-[#D4AF37] rounded-lg flex items-center justify-center text-black text-[10px] font-black">1B</div>
                <span className="text-[12px] font-bold tracking-[0.2em] text-zinc-500 font-['Inter'] uppercase">ONE BLANK</span>
                <span className="text-[10px] text-zinc-600 ml-auto">지금</span>
              </div>
              <p className="text-[15px] font-semibold leading-relaxed tracking-tight text-zinc-100">
                대표님, 오늘 벌어들일 가치가 준비되었습니다.<br/>지침을 확인하십시오.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[12px] text-[#D4AF37] font-bold font-['Inter']">예상 ROI: +{dailyGain.toLocaleString()} KRW</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MASTER CONTROL HEADER */}
      <header className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-50">
        <div className="flex items-center gap-8">
          <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.5em] uppercase opacity-80 font-['Inter']">MASTER CONTROL</span>
          <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
            {['Onboarding', '05:00', '09:00', 'Ghost Reset', 'Completed Day'].map((t) => (
              <button
                key={t}
                onClick={() => {
                  if (t === 'Onboarding') { setAppState('onboarding'); setStep(1); }
                  else if (t === 'Ghost Reset') { setIsGhostResetting(true); setTestTime('09:00'); setCondition(null); setAppState('main'); }
                  else { setTestTime(t === 'Completed Day' ? 'done' : t); setCondition(null); setIsCheckedIn(false); setAppState('main'); setIsGhostResetting(false); }
                }}
                className={`px-4 py-1.5 rounded-full text-[9px] font-bold tracking-tighter transition-all ${((appState === 'onboarding' && t === 'Onboarding') || (appState === 'main' && testTime === (t === 'Completed Day' ? 'done' : t) && !isGhostResetting && t !== 'Onboarding' && t !== 'Ghost Reset') || (appState === 'main' && t === 'Ghost Reset' && isGhostResetting)) ? 'bg-white text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setShowPush(true)} className="px-5 py-2 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-black rounded-full hover:bg-[#D4AF37] hover:text-black transition-all font-['Inter']">알림 테스트</button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.02)_0%,_transparent_75%)] pointer-events-none"></div>
        <div className="w-full max-w-[1000px] z-10">
          <AnimatePresence mode="wait">

            {appState === 'onboarding' && (
              <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col items-center">

                {/* 1단계: 시급 선택 */}
                {step === 1 && (
                  <div className="text-center">
                    <h1 className="text-[32px] font-bold mb-20 tracking-tighter font-serif italic text-zinc-100">당신의 <span className="text-[#D4AF37]">1시간 가치</span>를 입력하십시오.</h1>
                    <div className="flex flex-col gap-5 max-w-[420px] mx-auto">
                      {[30000, 50000, 100000].map(v => (
                        <button key={v} onClick={() => { setHourlyValue(v); setStep(2); }} className={`py-7 border rounded-xl font-['Inter'] font-bold text-[20px] tracking-[0.2em] transition-all ${v === 100000 ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5 shadow-[0_0_40px_rgba(212,175,55,0.1)]' : 'border-white/5 bg-white/[0.02] text-zinc-600 hover:text-white'}`}>{v.toLocaleString()}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2단계: 기회비용 경고 */}
                {step === 2 && (
                  <div className="text-center">
                    <h1 className="text-[32px] font-bold mb-20 tracking-tighter opacity-20 font-serif italic">당신의 <span className="text-[#D4AF37]">1시간 가치</span>를 입력하십시오.</h1>
                    <div className="p-12 border border-red-900/40 bg-red-950/5 rounded-[32px] max-w-[700px] mx-auto mb-20">
                      <p className="text-[17px] text-zinc-300 font-light leading-relaxed">
                        하루 4시간 지연 시, 한 달에 약 <span className="text-white font-black">{(hourlyValue * 4 * 30).toLocaleString()}원</span>의<br/>기회비용이 증발하고 있습니다.
                      </p>
                    </div>
                    <button onClick={() => setStep(3)} className="px-20 py-6 border border-white rounded-xl text-[16px] font-black tracking-widest hover:bg-white hover:text-black transition-all">확 인</button>
                  </div>
                )}

                {/* 3단계: 시스템 심사 */}
                {step === 3 && (
                  <div className="text-center">
                    <h2 className="text-[36px] font-bold mb-4 tracking-tighter font-serif italic">시스템 심사 단계</h2>
                    <p className="text-[15px] text-zinc-500 mb-24 font-light tracking-tight">자산 규모와 결정 피로도를 기준으로 최적의 대상인지 분석합니다.</p>
                    <div className="flex gap-6 justify-center">
                      <button onClick={() => alert('심사 탈락 대상입니다.')} className="px-12 py-7 border border-white/10 text-zinc-600 text-[16px] font-bold rounded-xl">심사 탈락 (테스트)</button>
                      <button onClick={() => setStep(4)} className="px-12 py-7 bg-[#D4AF37] text-black font-black text-[16px] rounded-xl shadow-[0_20px_40px_rgba(212,175,55,0.2)]">심사 통과 (VVIP)</button>
                    </div>
                  </div>
                )}

                {/* 4단계: 분석 중 */}
                {step === 4 && (
                  <div className="text-center" onClick={() => setStep(5)}>
                    <div className="w-16 h-16 mx-auto mb-12 border-t-2 border-[#D4AF37] rounded-full animate-spin" />
                    <p className="text-[14px] text-[#D4AF37] tracking-[0.6em] font-['Inter'] font-black uppercase">Analyzing...</p>
                  </div>
                )}

                {/* 5단계: 허가 */}
                {step === 5 && (
                  <div className="text-center max-w-[800px]">
                    <h2 className="text-[32px] font-bold mb-10 tracking-tighter font-serif italic">입장이 허가되었습니다.</h2>
                    <p className="text-[20px] text-zinc-400 mb-24 font-light leading-[2.2]">
                      까다로운 심사를 통과하신 것을 환영합니다.<br/><br/>
                      지금 이 순간부터, 대표님의 뇌를 갉아먹던 모든 '의사결정 피로'는<br/>
                      <span className="text-white font-medium italic underline underline-offset-8">시스템이 온전히 대신 짊어집니다.</span>
                    </p>
                    <button onClick={() => setStep(6)} className="px-20 py-6 border border-white/20 rounded-xl text-[16px] font-black hover:bg-white hover:text-black transition-all">다 음</button>
                  </div>
                )}

                {/* 6단계: Pricing Matrix */}
                {step === 6 && (
                  <div className="text-center w-full">
                    <h2 className="text-[32px] font-bold mb-24 tracking-tighter font-serif italic text-zinc-100">플랜을 선택하십시오.</h2>
                    <div className="grid grid-cols-3 gap-8 items-end max-w-[1100px] mx-auto">

                      {/* 좌측: Core 월 — 미끼(Decoy) */}
                      <div className="p-10 border border-white/5 bg-zinc-950/40 rounded-3xl opacity-50 grayscale hover:grayscale-0 transition-all">
                        <p className="text-[20px] font-bold mb-2 text-zinc-400">Core 월 구독</p>
                        <p className="text-[12px] text-zinc-600 mb-10 uppercase tracking-widest font-bold">기본 플랜</p>
                        <p className="text-[36px] font-black mb-12 font-['Inter']">390,000</p>
                        <button onClick={() => setStep(7)} className="w-full py-4 border border-white/10 text-[14px] text-zinc-500 rounded-xl">선 택</button>
                      </div>

                      {/* 중앙: Core 연 — 핵심 타겟 */}
                      <div className="p-12 border-2 border-[#D4AF37] bg-zinc-950 rounded-[40px] relative scale-110 z-10 shadow-[0_0_100px_rgba(212,175,55,0.2)]">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col gap-2 w-full items-center">
                          <span className="bg-[#D4AF37] text-black text-[12px] font-black px-6 py-2 rounded-full shadow-2xl whitespace-nowrap">상위 0.1%의 85%가 선택 ★ 가장 인기있음</span>
                          <span className="bg-white/10 text-white text-[11px] font-bold px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">평생 가격 동결 + 2개월 혜택</span>
                        </div>
                        <p className="text-[28px] font-black mb-4 text-[#D4AF37] font-serif italic">Core 연 구독</p>
                        <p className="text-[48px] font-black mb-16 font-['Inter'] tracking-tighter">3,900,000</p>
                        <button onClick={() => setStep(7)} className="w-full py-6 bg-[#D4AF37] text-black font-black text-[18px] rounded-2xl shadow-lg hover:bg-white transition-all">결제 및 입장</button>
                      </div>

                      {/* 우측: Premium 월 — 앵커링 */}
                      <div className="p-10 border border-white/10 bg-zinc-950/60 rounded-3xl relative">
                        <div className="absolute -top-3 right-6 bg-[#D4AF37] text-black text-[10px] font-black px-3 py-1 rounded-full">30명 한정 슬롯 ⚡</div>
                        <p className="text-[20px] font-bold mb-2">Premium 월 구독</p>
                        <p className="text-[12px] text-zinc-500 mb-10 uppercase tracking-widest font-bold">VIP Management</p>
                        <p className="text-[36px] font-black mb-12 font-['Inter']">1,500,000</p>
                        <button onClick={() => setStep(7)} className="w-full py-4 border border-white/20 text-[14px] rounded-xl">선 택</button>
                      </div>

                    </div>
                  </div>
                )}

                {/* 7단계: 거대 목표 입력 */}
                {step === 7 && (
                  <div className="text-center max-w-[600px] mx-auto">
                    <h2 className="text-[18px] font-light mb-2 text-zinc-500">시스템에 위임할 단 하나의</h2>
                    <h2 className="text-[28px] font-bold mb-12 tracking-tighter text-[#D4AF37] font-serif italic">거대 목표를 입력하십시오.</h2>
                    <textarea
                      value={dreamOutcome}
                      onChange={(e) => setDreamOutcome(e.target.value)}
                      placeholder="예: 6개월 내 월 매출 1억 돌파"
                      className="w-full h-16 bg-transparent border-b border-white/10 text-white text-[22px] font-bold text-center focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-zinc-800 py-2 resize-none mb-12"
                    />
                    <p className="text-[13px] text-zinc-400 leading-[2] font-light mb-14">
                      이 목표를 기준으로 시스템이 대표님만의 맞춤형 실행 경로를 학습하기 시작합니다.<br/>
                      도중에 목표를 변경하셔도 괜찮습니다. 다만, 시스템이 새로운 목표에 완벽히 동기화되기 위해<br/>
                      약 2주의 재설정 기간이 소요될 수 있습니다.<br/>
                      <span className="text-zinc-300 font-medium underline underline-offset-8">가장 중요하게 달성하고 싶은 단 하나의 목표만 신중히 적어주십시오.</span>
                    </p>
                    <button onClick={() => setStep(8)} disabled={!dreamOutcome} className={`w-full py-6 font-black text-[16px] rounded-2xl transition-all duration-700 ${dreamOutcome ? 'bg-white text-black hover:bg-[#D4AF37]' : 'bg-white/5 text-white/20'}`}>내 뇌의 통제권 위임하기</button>
                  </div>
                )}

                {/* 8단계: 이식 완료 */}
                {step === 8 && (
                  <div className="text-center">
                    <div className="relative w-40 h-40 mx-auto mb-16">
                      <motion.div
                        animate={{ rotateY: 360, rotateX: 20 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border border-[#D4AF37]/20 rounded-3xl"
                      />
                      <motion.div
                        animate={{ rotateX: 360, rotateY: 10 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 border border-[#D4AF37]/40 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#D4AF37] rounded-full shadow-[0_0_30px_#D4AF37] animate-pulse" />
                      </div>
                    </div>
                    <p className="text-[16px] leading-[2.4] text-zinc-300 font-light">
                      목표가 시스템에 성공적으로 이식되었습니다.<br/>
                      <span className="text-white font-bold text-[20px]">당신의 역할은 끝났습니다. 이제 뇌를 끄십시오.</span><br/><br/>
                      시스템이 1,250만 개의 상위 1% 데이터를 기반으로 이 목표를 분해<br/>
                      (Slicing)하기 시작합니다.<br/><br/>
                      <span className="text-[#D4AF37] font-medium italic">내일 아침 09:00, 첫 번째 단일 지침서와 함께 찾아뵙겠습니다.</span>
                    </p>
                    <button onClick={() => setAppState('main')} className="mt-20 px-16 py-5 border border-[#D4AF37] text-[#D4AF37] rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all text-[14px] font-black">메인 서비스 진입</button>
                  </div>
                )}

              </motion.div>
            )}

            {/* 메인 대시보드 */}
            {appState === 'main' && (
              <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">

                {/* 05:00 화면 */}
                {testTime === '05:00' && (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-12 border-t-2 border-[#D4AF37] rounded-full animate-spin" />
                    <h2 className="text-[28px] font-bold mb-12 tracking-[0.2em] uppercase font-serif">System Slicing</h2>
                    <p className="text-[16px] text-zinc-400 leading-[2.4] font-light">
                      대표님이 주무시는 동안, 시스템이 1,250만 개의<br/>상위 1% 의사결정 패턴과 대조하여 최적의 실행 경로를 분석 중입니다.
                    </p>
                    <p className="mt-16 text-[13px] text-[#D4AF37] opacity-60 font-black">09:00 AM에 뵙겠습니다.</p>
                  </div>
                )}

                {/* 09:00 Ghost Reset */}
                {testTime === '09:00' && isGhostResetting && !condition && (
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-10 border border-[#D4AF37] rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37]" />
                    </div>
                    <h2 className="text-[34px] font-bold mb-10 tracking-tighter font-serif italic">환영합니다.</h2>
                    <div className="bg-zinc-950/80 border border-white/5 p-14 rounded-[40px] max-w-[520px] mx-auto mb-16 text-center">
                      <h3 className="text-red-500 font-black mb-6 tracking-widest text-[13px] uppercase">[Ghost Reset]</h3>
                      <p className="text-[15px] text-zinc-400 leading-[2.4] font-light">
                        지연된 과거 로그를 자산 방어 비용으로 처리하여 소멸시켰습니다.<br/><br/>
                        <span className="text-white font-bold">어제의 기록은 없습니다. 오늘의 단 하나만 실행하십시오.</span>
                      </p>
                    </div>
                    <button onClick={() => setIsGhostResetting(false)} className="px-14 py-6 border border-[#D4AF37] text-[#D4AF37] font-black rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all">오늘의 설계 시작하기</button>
                  </div>
                )}

                {/* 09:00 컨디션 선택 */}
                {testTime === '09:00' && !isGhostResetting && !condition && (
                  <div className="text-center">
                    <div className="mb-16 inline-block px-5 py-1.5 border border-[#D4AF37]/40 rounded-full text-[#D4AF37] text-[12px] font-black tracking-widest font-['Inter'] uppercase">09:00 AM</div>
                    <h1 className="text-[36px] font-bold mb-20 tracking-tighter font-serif italic">대표님, 오늘의 뇌 컨디션은 어떠십니까?</h1>
                    <div className="grid grid-cols-3 gap-6 max-w-[750px] mx-auto">
                      {['피곤함', '보통', '아주 좋음'].map(c => (
                        <button key={c} onClick={() => setCondition(c)} className={`py-14 border rounded-2xl text-[20px] transition-all hover:bg-white/[0.05] ${c === '보통' ? 'border-[#D4AF37]/60 text-[#D4AF37] font-bold shadow-[0_0_40px_rgba(212,175,55,0.08)]' : 'border-white/5 bg-white/[0.02] text-zinc-500'}`}>{c}</button>
                      ))}
                    </div>
                    <p className="mt-20 text-[11px] text-zinc-600 tracking-[0.3em] uppercase font-['Inter']">Current Active VVIP: {paidUsers}</p>
                  </div>
                )}

                {/* 오늘의 증거 리포트 */}
                {testTime === '09:00' && condition && !isCheckedIn && (
                  <div className="max-w-[650px] mx-auto">
                    <div className="flex justify-between items-center mb-12">
                      <h3 className="text-[18px] font-bold">오늘의 증거 리포트</h3>
                      <div className="px-4 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] text-[11px] font-black border border-[#D4AF37]/30 rounded-full font-['Inter']">C: {condition}</div>
                    </div>
                    <div className="space-y-12">
                      <section>
                        <h4 className="text-[13px] text-[#D4AF37] font-black mb-6 tracking-widest uppercase font-['Inter']">Ⅰ. 지금 당장 할 일</h4>
                        <div className="bg-zinc-950 border border-white/5 p-10 rounded-3xl text-center">
                          <p className="text-[20px] font-bold leading-relaxed">
                            {condition === '피곤함'
                              ? '"뇌를 보호하십시오. 오늘 업무 폴더만 열고 1분간 목차만 훑은 뒤 즉시 종료하십시오. 목차만 보십시오."'
                              : '"가장 어려운 결정 1개만 시스템에 위임하고 2분간 명상 후 바로 실행하십시오."'}
                          </p>
                        </div>
                      </section>
                      <section>
                        <h4 className="text-[13px] text-[#D4AF37] font-black mb-6 tracking-widest uppercase font-['Inter']">Ⅱ. 행동의 결과</h4>
                        <div className="grid grid-cols-2 gap-5">
                          <div className="p-8 border border-white/5 bg-white/[0.01] rounded-[28px]">
                            <p className="text-[12px] text-red-500 font-bold mb-4">○ 하면 얻는 것</p>
                            <p className="text-[15px] text-zinc-300 font-light">의사결정 피로도 <span className="text-white font-bold">30% 즉시 감소</span></p>
                          </div>
                          <div className="p-8 border border-white/5 bg-white/[0.01] rounded-[28px]">
                            <p className="text-[12px] text-[#D4AF37] font-bold mb-4">✕ 미루면 잃는 것</p>
                            <p className="text-[15px] text-zinc-300 font-light">완벽주의 발동으로 인한 <span className="text-white font-bold">48시간 지연</span></p>
                          </div>
                        </div>
                      </section>
                      <button onClick={handleCheckIn} className="w-full py-8 bg-white text-black font-black text-[22px] rounded-2xl shadow-[0_30px_60px_rgba(255,255,255,0.15)] hover:bg-[#D4AF37] hover:scale-[1.02] active:scale-95 transition-all">10초 퀵 체크인</button>
                    </div>
                  </div>
                )}

                {/* ROI 결과 화면 */}
                {testTime === '09:00' && isCheckedIn && (
                  <div className="text-center">
                    <div className="w-14 h-14 mx-auto mb-10 border-2 border-[#D4AF37] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#D4AF37] rounded-full shadow-[0_0_15px_#D4AF37]" />
                    </div>
                    <h2 className="text-[38px] font-bold mb-6 tracking-tighter font-serif italic">올해의 가치를 벌었습니다.</h2>
                    <p className="text-[16px] text-zinc-500 mb-20 font-light">대표님이 2분간 실행하여 당장 아낀 올해의 실제 돈입니다.</p>
                    <div className="bg-zinc-950 border border-white/5 p-20 rounded-[60px] max-w-[560px] mx-auto mb-16 relative">
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
                      <p className="text-[12px] text-zinc-600 tracking-[0.2em] mb-12 font-black uppercase font-['Inter']">1-YEAR ROI (올해 벌어들이는 가치)</p>
                      <div className="text-[64px] font-black tracking-tighter flex justify-center items-baseline gap-4 font-['Inter']">
                        <span className="text-[24px] text-zinc-700 font-serif italic">₩</span>
                        {roiAsset.toLocaleString()}
                      </div>
                      <p className="text-[15px] text-[#D4AF37] mt-10 font-black tracking-widest">↑ {dailyGain.toLocaleString()} (Today)</p>
                    </div>
                    <div className="bg-zinc-950/40 border border-[#D4AF37]/15 p-8 rounded-2xl inline-block px-16 text-[16px] text-zinc-400 italic">
                      "가장 힘든 2분이 끝났습니다. 이제 고민 없이, 남은 일들을 처리하십시오."
                    </div>
                  </div>
                )}

                {/* 하루 완료 */}
                {testTime === 'done' && (
                  <div className="text-center opacity-50">
                    <div className="w-14 h-14 mx-auto mb-12 border border-zinc-800 rounded-full flex items-center justify-center text-[#D4AF37] text-[20px]">✓</div>
                    <h2 className="text-[32px] font-bold mb-4 tracking-tighter font-serif italic">완벽한 하루였습니다.</h2>
                    <p className="text-[14px] font-light text-zinc-500">이미 과제를 완료하셨습니다. 평안한 하루 되십시오.</p>
                  </div>
                )}

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      <footer className="p-10 border-t border-white/[0.03] flex justify-center items-center gap-24 opacity-20 text-[10px] tracking-[0.5em] uppercase font-black font-['Inter']">
        <span>ONE BLANK SYSTEM v2.0</span>
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" />
          <span>VVIP Active</span>
        </div>
        <span>Permanent Cognitive Protection</span>
      </footer>
    </div>
  );
}
