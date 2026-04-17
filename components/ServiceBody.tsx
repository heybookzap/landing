'use client'

import React, { useState } from 'react'

export default function ServiceBody() {
  const [view, setView] = useState('CONDITION')
  const [task, setTask] = useState('')

  const handleCondition = (condition: string) => {
    if (condition === 'TIRED') setTask('오늘은 바탕화면 폴더 정리 딱 1분만 하십시오.')
    else if (condition === 'NORMAL') setTask('가장 회피하고 싶은 작업 하나에 2분간 몰입하십시오.')
    else setTask('가장 중요한 전략적 의사결정 3가지를 지금 즉시 확정하십시오.')
    setView('TASK')
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-6">
      {view === 'CONDITION' && (
        <div className="space-y-12 text-center animate-in fade-in">
          <h3 className="text-xl font-light">오늘의 뇌 컨디션은 어떠십니까?</h3>
          <div className="grid grid-cols-3 gap-4">
            {['TIRED', 'NORMAL', 'GREAT'].map((c) => (
              <button key={c} onClick={() => handleCondition(c)} className="py-6 border border-zinc-800 rounded-2xl text-xs font-mono hover:border-[#C2A35D] hover:text-[#C2A35D] transition-all">{c}</button>
            ))}
          </div>
          <p onClick={() => setView('GHOST')} className="text-zinc-700 text-[10px] cursor-pointer underline">어제 지침을 수행하지 못하셨나요?</p>
        </div>
      )}

      {view === 'TASK' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 text-center">
          <div className="p-10 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] space-y-6">
            <p className="text-[#C2A35D] text-[10px] font-mono tracking-widest">TODAY'S TASK</p>
            <p className="text-2xl font-light leading-relaxed">{task}</p>
            <button onClick={() => setView('DONE')} className="w-full bg-white text-black py-4 rounded-2xl font-bold">10초 체크인 완료</button>
          </div>
        </div>
      )}

      {view === 'DONE' && (
        <div className="text-center space-y-6 animate-in zoom-in">
          <div className="w-16 h-16 border border-green-500 rounded-full mx-auto flex items-center justify-center text-green-500 text-2xl">✓</div>
          <h3 className="text-xl font-bold">완벽한 하루였습니다.</h3>
          <p className="text-zinc-500 text-sm">자정까지 대시보드는 잠금 처리됩니다. 본업에 100% 몰입하십시오.</p>
        </div>
      )}

      {view === 'GHOST' && (
        <div className="p-10 border border-red-900/30 bg-zinc-950 rounded-[2.5rem] text-center space-y-6 animate-in fade-in">
          <p className="text-red-500 text-[10px] font-mono tracking-widest uppercase">Ghost Reset</p>
          <p className="text-lg text-zinc-300 font-light italic">어제의 기록은 소멸되었습니다. 자책하지 말고 오늘 단 하나만 실행하십시오.</p>
          <button onClick={() => setView('CONDITION')} className="text-[#C2A35D] text-sm underline font-mono">RETRY TODAY</button>
        </div>
      )}
    </div>
  )
}
