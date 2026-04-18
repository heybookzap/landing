'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LearnMorePage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-[#050505] text-white font-pretendard relative">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <header className="fixed top-0 left-0 w-full px-8 py-10 z-20 flex justify-between items-center mix-blend-difference">
        <Link href="/" className="flex items-center gap-4">
          <div className="w-[1px] h-4 bg-[#C2A35D]"></div>
          <span className="text-[#C2A35D] text-[10px] tracking-[0.8em] font-light uppercase">One Blank</span>
        </Link>
        <Link href="/" className="text-zinc-400 hover:text-white text-[10px] tracking-[0.3em] uppercase transition-colors">
          뒤로 가기
        </Link>
      </header>

      <div className="relative z-10 pt-40 pb-32 px-6 md:px-20 max-w-5xl mx-auto space-y-40">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center space-y-12">
          <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-zinc-100">Vision</h1>
          <p className="text-zinc-400 text-sm md:text-lg font-extralight tracking-widest leading-relaxed break-keep max-w-2xl mx-auto">
            초등학생도 이해할 수 있도록 가장 솔직하게 말씀드립니다. <br />
            이곳은 대표님의 머리 아픈 고민을 돈으로 바꿔서 없애주는 곳입니다.
          </p>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="border-l border-[#C2A35D]/30 pl-8 md:pl-16 space-y-6">
          <span className="text-[#C2A35D] text-[10px] tracking-[0.5em] font-light uppercase">01 / 계획 짜기</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-200 break-keep">골치 아픈 계획은 이제 저희가 짭니다.</h2>
          <p className="text-zinc-500 text-base md:text-xl font-extralight leading-[1.8] break-keep max-w-2xl">
            "이번 달에 천만 원 벌기" 같은 목표만 던져주세요. 무엇을 해야 할지 그 과정과 계획은 시스템이 알아서 짜드립니다. 대표님은 머리 아프게 고민할 필요가 전혀 없습니다.
          </p>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="border-l border-[#C2A35D]/30 pl-8 md:pl-16 space-y-6">
          <span className="text-[#C2A35D] text-[10px] tracking-[0.5em] font-light uppercase">02 / 하루에 하나씩</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-200 break-keep">매일 아침 9시, 딱 하나만 시킵니다.</h2>
          <p className="text-zinc-500 text-base md:text-xl font-extralight leading-[1.8] break-keep max-w-2xl">
            오늘은 이거 할까, 저거 할까 방황하지 마세요. 매일 아침 대표님의 상태를 묻고, 그날 당장 해야 할 '딱 하나의 행동'만 콕 집어서 알려드립니다. 피곤한 날에는 무조건 쉬라고 명령합니다.
          </p>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="border-l border-[#C2A35D]/30 pl-8 md:pl-16 space-y-6">
          <span className="text-[#C2A35D] text-[10px] tracking-[0.5em] font-light uppercase">03 / 완벽한 보호</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-200 break-keep">월 39만 원으로 뇌를 완벽히 쉬게 하세요.</h2>
          <p className="text-zinc-500 text-base md:text-xl font-extralight leading-[1.8] break-keep max-w-2xl">
            머리가 맑아야 돈을 벌 수 있습니다. 매월 결제를 신경 쓰는 에너지조차 아깝습니다. 시스템에 고민을 넘기고, 대표님은 돈 버는 데만 집중하세요.
          </p>
        </motion.section>

        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center pt-20 border-t border-zinc-900">
          <button 
            onClick={() => router.push('/checkout')}
            className="w-full max-w-md py-6 bg-white text-black text-[10px] tracking-[0.5em] font-bold hover:bg-[#C2A35D] transition-colors duration-700"
          >
            이해했습니다. 시스템에 고민 넘기기
          </button>
        </motion.section>
      </div>
    </main>
  )
}

