'use client'

import React, { useState } from 'react'

export default function ServiceBody() {
  const [roi, setRoi] = useState(0)
  
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto py-10">
      <section className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <h3 className="text-zinc-500 text-sm font-mono mb-4 uppercase">System Instruction</h3>
        <p className="text-xl font-medium leading-relaxed">
          오늘의 지침: 외부 자극에 대한 반응을 0.5초 지연시키십시오. 
          귀하의 인지 에너지는 오직 결정적 판단에만 소모되어야 합니다.
        </p>
      </section>

      <section className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <h3 className="text-zinc-500 text-sm font-mono mb-4 uppercase">ROI Simulator</h3>
        <div className="flex flex-col gap-4">
          <label className="text-sm text-zinc-400">일일 인지 절감 시간 (분)</label>
          <input 
            type="range" 
            min="0" 
            max="120" 
            onChange={(e) => setRoi(Number(e.target.value) * 32500)}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between items-end mt-4">
            <span className="text-zinc-500 text-sm">예상 복구 가치(연)</span>
            <span className="text-3xl font-mono text-white">₩{roi.toLocaleString()}</span>
          </div>
        </div>
      </section>

      <section className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <h3 className="text-zinc-500 text-sm font-mono mb-4 uppercase">Elite Status</h3>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-mono">Cognitive Shield Active</span>
        </div>
      </section>
    </div>
  )
}
