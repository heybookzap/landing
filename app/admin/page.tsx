'use client'

import ServiceBody from '@/components/ServiceBody'

export default function AdminPage() {
  return (
    <div className="flex h-screen bg-black text-white">
      <div className="w-1/2 border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800 bg-zinc-950">
          <h1 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Master Console</h1>
          <p className="text-lg font-bold">SYSTEM INTELLIGENCE</p>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase">VVIP Users</p>
              <p className="text-2xl font-mono">28</p>
            </div>
            <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase">Revenue</p>
              <p className="text-2xl font-mono">₩10,920,000</p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-sm font-mono">
              <thead className="bg-zinc-800 text-zinc-400">
                <tr>
                  <th className="p-3">UID</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="p-3 text-zinc-500">#00{i + 1}</td>
                    <td className="p-3 text-green-500 uppercase">Active</td>
                    <td className="p-3 text-zinc-300">14.8x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-black border border-zinc-800 rounded-lg font-mono text-xs text-zinc-500 h-40 overflow-hidden">
            <p>[SYSTEM] Database connection established</p>
            <p>[AUTH] VVIP Access token validated</p>
            <p>[PAYMENT] Webhook listener active on /api/toss</p>
          </div>
        </div>
      </div>

      <div className="w-1/2 bg-zinc-950 flex flex-col">
        <div className="p-6 border-b border-zinc-800 bg-black">
          <h1 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">End-User View</h1>
          <p className="text-lg font-bold text-green-500">LIVE SERVICE EXPERIENCE</p>
        </div>
        <div className="flex-1 overflow-y-auto p-10">
          <ServiceBody />
        </div>
      </div>
    </div>
  )
}
