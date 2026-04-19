'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const [missionTitle, setMissionTitle] = useState('신규 프로젝트 핵심 가치 3가지 정의하기')
  const [missionDesc, setMissionDesc] = useState('멋진 문장이 아니어도 좋습니다. 대표님의 머릿속에 있는 본질 3가지를 메모장에 적는 것까지만 하십시오. 그 이상은 생각하지 마십시오.')

  return (
    <div className="flex h-screen bg-[#000000] text-white font-pretendard">
      {/* 좌측: 마스터 컨트롤 패널 */}
      <div className="w-full max-w-sm border-r border-[#1A1A1A] bg-[#050505] flex flex-col">
        <div className="p-8 border-b border-[#1A1A1A]">
          <p className="text-[#C2A35D] text-[10px] tracking-[0.4em] uppercase mb-2 font-bold font-serif italic">ONE BLANK</p>
          <h1 className="text-xl font-light tracking-tight text-white uppercase">Master Tower</h1>
        </div>
        
        <div className="p-8 space-y-10 overflow-y-auto flex-1">
          <div className="space-y-4">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">System Status</p>
            <div className="p-5 border border-[#1A1A1A] bg-[#0A0A0A] rounded-xl">
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Total Revenue</p>
              <p className="text-xl font-light tracking-tighter">₩109,200,000</p>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <p className="text-[10px] text-[#C2A35D] uppercase tracking-widest font-bold">Directive Control</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase">Mission Title</label>
                <input 
                  value={missionTitle}
                  onChange={(e) => setMissionTitle(e.target.value)}
                  className="w-full bg-black border border-zinc-800 p-3 text-xs text-white focus:border-[#C2A35D] outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase">Description</label>
                <textarea 
                  rows={4}
                  value={missionDesc}
                  onChange={(e) => setMissionDesc(e.target.value)}
                  className="w-full bg-black border border-zinc-800 p-3 text-xs text-zinc-400 focus:border-[#C2A35D] outline-none transition-colors leading-relaxed"
                />
              </div>
              <button className="w-full py-4 bg-[#C2A35D] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all">
                Update Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 우측: 실시간 시뮬레이터 */}
      <div className="flex-1 bg-[#000000] p-12 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.02)_0%,_transparent_70%)] pointer-events-none"></div>
        <p className="text-[#C2A35D] text-[10px] tracking-[0.5em] uppercase mb-12 opacity-50">Live Preview Session</p>
        
        <div className="w-[320px] aspect-[9/19] border-[8px] border-zinc-900 rounded-[3rem] bg-black shadow-2xl relative overflow-hidden flex flex-col p-8 pt-16 text-center">
          <span className="text-[#C2A35D] font-serif italic text-[10px] font-bold uppercase tracking-widest mb-20">ONE BLANK</span>
          <div className="space-y-4">
             <p className="text-[#C2A35D] text-[8px] tracking-[0.4em] uppercase font-medium">Today&apos;s Directive</p>
             <h3 className="text-lg font-light leading-tight text-white break-keep">{missionTitle}</h3>
          </div>
          <div className="mt-8 p-4 bg-zinc-950/50 border border-zinc-900 rounded-xl">
             <p className="text-zinc-500 text-[9px] leading-relaxed font-light italic">&quot;{missionDesc}&quot;</p>
          </div>
        </div>
      </div>
    </div>
  )
}
