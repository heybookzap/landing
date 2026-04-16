'use client'

import ServiceBody from '@/components/ServiceBody'

export default function ServicePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center">
      <nav className="w-full border-b border-zinc-800 p-6 flex justify-between items-center max-w-5xl">
        <span className="font-bold tracking-tighter">ONE BLANK</span>
        <span className="text-xs font-mono text-zinc-500">VVIP ACCESS</span>
      </nav>
      <div className="w-full">
        <ServiceBody />
      </div>
    </main>
  )
}
