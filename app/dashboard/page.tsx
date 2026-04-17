'use client'

import { useState } from 'react'

type FlowState = 'CONDITION' | 'TASK' | 'DONE' | 'GHOST'

export default function DashboardPage() {
  const [view, setView] = useState<FlowState>('CONDITION')
  const [task, setTask] = useState('')

  const handleCondition = (level: string) => {
    if (level === 'TIRED') setTask('컴퓨터 바탕화면 정리하고 안 쓰는 창 끄기 (딱 1분)')
    else if (level === 'NORMAL') setTask('지금 가장 하기 싫은 일 딱 2분만 눈 딱 감고 하기')
    else setTask('오늘 하루 중 가장 중요한 결정 한 가지만 지금 바로 내리기')
    setView('TASK')
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-sans">
      <nav className="w-full p-8 border-b border-[#1A1A1A] flex justify-between items-center">
        <span className="font-light tracking-widest text-lg text-white">ONE BLANK</span>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-zinc-600 tracking-[0.2em] uppercase">보호 작동 중</span>
          <div className="w-2 h-2 bg-[#C2A35D] rounded-full animate-pulse"></div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto">
        {view === 'CONDITION' && (
          <div className="w-full text-center space-y-20 animate-in fade-in duration-1000">
            <h1 className="text-2xl font-light tracking-tight">오늘 내 머릿속 컨디션은 어떤가요?</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button onClick={() => handleCondition('TIRED')} className="py-12 border border-[#1A1A1A] bg-[#0A0A0A] hover:border-zinc-700 transition-all group">
                <span className="block text-xs text-zinc-500 font-mono tracking-widest mb-2 group-hover:text-zinc-300">TIRED</span>
                <span className="text-lg font-light text-zinc-400">조금 피곤해요</span>
              </button>
              <button onClick={() => handleCondition('NORMAL')} className="py-12 border border-[#1A1A1A] bg-[#0A0A0A] hover:border-[#C2A35D] transition-all group">
                <span className="block text-xs text-[#C2A35D] font-mono tracking-widest mb-2 opacity-50 group-hover:opacity-100">NORMAL</span>
                <span className="text-lg font-light text-zinc-300">그냥 보통이에요</span>
              </button>
              <button onClick={() => handleCondition('GREAT')} className="py-12 border border-[#1A1A1A] bg-[#0A0A0A] hover:border-white transition-all group">
                <span className="block text-xs text-zinc-500 font-mono tracking-widest mb-2 group-hover:text-zinc-300">GREAT</span>
                <span className="text-lg font-light text-zinc-400">아주 좋아요</span>
              </button>
            </div>
            <p onClick={() => setView('GHOST')} className="text-[10px] text-zinc-700 tracking-widest font-mono cursor-pointer hover:text-zinc-400 transition-colors uppercase">
              어제 깜빡하고 못 했나요?
            </p>
          </div>
        )}

        {view === 'TASK' && (
          <div className="w-full text-center space-y-16 animate-in slide-in-from-bottom-8 duration-700">
            <p className="text-[#C2A35D] text-[10px] font-mono tracking-[0.3em] uppercase">오늘 딱 하나 할 일</p>
            <p className="text-3xl font-light leading-relaxed text-white">{task}</p>
            <button onClick={() => setView('DONE')} className="border border-white text-white px-16 py-5 text-xs font-mono tracking-widest hover:bg-white hover:text-black transition-all">
              다 했어요! (10초 확인)
            </button>
          </div>
        )}

        {view === 'DONE' && (
          <div className="w-full text-center space-y-12 animate-in zoom-in duration-700">
            <div className="w-16 h-16 border border-[#C2A35D] rounded-full mx-auto flex items-center justify-center text-[#C2A35D] text-xl">✓</div>
            <div className="space-y-4">
              <h2 className="text-2xl font-light tracking-tight">완벽한 하루였습니다.</h2>
              <p className="text-sm text-zinc-500 font-light leading-relaxed">
                자정까지 화면이 잠깁니다.<br />이제 우리는 잊고 진짜 중요한 일에만 집중하세요.
              </p>
            </div>
            <div className="pt-12 border-t border-[#1A1A1A]">
              <p className="text-[10px] text-zinc-600 font-mono tracking-widest mb-4 uppercase">내가 아낀 시간의 가치</p>
              <p className="text-4xl font-light text-[#C2A35D] tracking-tighter">₩14,820,000</p>
            </div>
          </div>
        )}

        {view === 'GHOST' && (
          <div className="w-full text-center space-y-12 animate-in fade-in duration-1000">
            <p className="text-[#8B0000] text-[10px] font-mono tracking-[0.3em] uppercase">모두 지웠습니다</p>
            <div className="space-y-4">
              <h2 className="text-2xl font-light tracking-tight text-zinc-300">
                어제 못했다고 자책하지 마세요.
              </h2>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">
                어제 기록은 우리가 다 지웠습니다.<br />오늘은 오늘 할 일 딱 하나만 하세요.
              </p>
            </div>
            <button onClick={() => setView('CONDITION')} className="border-b border-[#C2A35D] text-[#C2A35D] pb-1 text-xs tracking-widest font-mono uppercase hover:text-white hover:border-white transition-colors">
              오늘 새롭게 시작하기
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
