'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function LearnMorePage() {
  const router = useRouter()

  const handleStartPayment = () => {
    router.push('/checkout')
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center px-6 font-pretendard relative overflow-y-auto selection:bg-[#C2A35D] selection:text-black">
      
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#C2A35D] rounded-full mix-blend-screen filter blur-[250px] opacity-[0.02] pointer-events-none"></div>

      <header className="w-full px-4 md:px-8 py-10 z-40 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <span className="text-[#C2A35D] font-serif italic text-xl font-bold uppercase tracking-tight">ONE BLANK</span>
          <span className="text-white text-[9px] tracking-[0.4em] font-light uppercase">The Mechanism</span>
        </div>
        <button onClick={() => router.push('/')} className="text-zinc-500 hover:text-white text-[9px] tracking-[0.4em] font-medium uppercase transition-colors duration-500">
          [ 뒤로 가기 ]
        </button>
      </header>

      <div className="w-full max-w-5xl mx-auto z-10 pb-32">
        
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="min-h-[60vh] flex flex-col justify-center items-center text-center pt-10"
        >
          <p className="text-[#C2A35D] text-[10px] tracking-[0.5em] font-medium mb-8 uppercase italic font-serif">Service Protocol</p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-white break-keep leading-snug mb-8">
            대표님의 &apos;고민&apos;을 <br className="md:hidden" />대신합니다.
          </h1>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#C2A35D] to-transparent mx-auto mb-8 opacity-50"></div>
          <p className="text-zinc-400 text-lg md:text-xl font-light tracking-tight break-keep">
            아무 생각 말고, <br className="md:hidden" />시키는 것 딱 하나만 하세요.
          </p>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="pt-20 border-t border-white/5"
        >
          <div className="text-center mb-16">
            <p className="text-[#C2A35D] text-[10px] tracking-[0.5em] font-medium uppercase italic font-serif">The Core Solution</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {[
              {
                num: "01",
                point: "목표만 주세요",
                result: "계획은 다 짜드립니다."
              },
              {
                num: "02",
                point: "매일 아침 9시",
                result: "딱 1개만 시킵니다."
              },
              {
                num: "03",
                point: "피곤한 날엔",
                result: "강제로 쉬게 합니다."
              },
              {
                num: "04",
                point: "주말에는",
                result: "아예 접속을 막습니다."
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.02)" }}
                className="bg-white/[0.01] border border-white/5 backdrop-blur-md p-8 md:p-12 rounded-3xl flex flex-col justify-between shadow-2xl transition-all duration-500 group"
              >
                <div className="text-[#C2A35D] text-[11px] tracking-widest font-bold font-serif italic mb-8">
                  {item.num}
                </div>
                <div className="space-y-3">
                  <p className="text-zinc-500 text-sm font-light tracking-wide">{item.point}</p>
                  <h3 className="text-2xl md:text-3xl font-light text-zinc-100 tracking-tight break-keep group-hover:text-white transition-colors">
                    {item.result}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 text-center flex justify-center"
        >
          <button 
            onClick={handleStartPayment}
            className="w-full max-w-[340px] py-6 bg-white text-black text-[11px] tracking-[0.3em] font-bold rounded-xl shadow-[0_0_40px_rgba(194,163,93,0.2)] hover:bg-[#C2A35D] transition-all duration-500 uppercase"
          >
            이해했습니다. 모든 고민 넘기기
          </button>
        </motion.div>

      </div>
    </main>
  )
}
