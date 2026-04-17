'use client'

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-[#000000] text-white font-mono">
      <div className="w-full max-w-sm border-r border-[#1A1A1A] bg-[#050505] flex flex-col">
        <div className="p-8 border-b border-[#1A1A1A]">
          <p className="text-[#C2A35D] text-[10px] tracking-widest uppercase mb-2">Master Console</p>
          <h1 className="text-xl font-light tracking-tight text-white">System Overview</h1>
        </div>
        
        <div className="p-8 space-y-8 overflow-y-auto">
          <div className="space-y-4">
            <div className="p-6 border border-[#1A1A1A] bg-[#0A0A0A]">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Total Revenue</p>
              <p className="text-2xl font-light">₩109,200,000</p>
            </div>
            <div className="p-6 border border-[#1A1A1A] bg-[#0A0A0A]">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Active VVIPs</p>
              <p className="text-2xl font-light text-[#C2A35D]">28 / 30</p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Real-time Activity Log</p>
            <div className="space-y-3 text-xs text-zinc-400">
              <p className="border-l-2 border-green-500 pl-3 py-1">User #028 completed daily task.</p>
              <p className="border-l-2 border-[#C2A35D] pl-3 py-1">User #029 submitted new Dream Outcome.</p>
              <p className="border-l-2 border-[#8B0000] pl-3 py-1">User #012 ghost reset triggered.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#050505] p-12 flex flex-col items-center justify-center text-center">
        <div className="space-y-6 max-w-lg">
          <div className="w-16 h-16 border border-[#1A1A1A] rounded-full mx-auto flex items-center justify-center text-[#C2A35D]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <p className="text-sm font-light text-zinc-400 leading-relaxed">
            운영자 모드입니다.<br />좌측 패널에서 고객들의 인지 상태와 시스템 로직을<br />실시간으로 모니터링할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
