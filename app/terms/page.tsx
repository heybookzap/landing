'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function TermsPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 md:px-12 py-10 font-pretendard relative overflow-y-auto selection:bg-[#C2A35D] selection:text-black">
      
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.03)_0%,_transparent_60%)] pointer-events-none z-0"></div>

      <header className="w-full px-4 md:px-8 z-40 flex justify-between items-center max-w-4xl mx-auto mb-20">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <span className="text-[#C2A35D] font-serif italic text-xl font-bold">1B</span>
          <span className="text-white text-[10px] tracking-[0.5em] font-light uppercase">THE ONE BLANK</span>
        </div>
        
        <button onClick={() => router.back()} className="text-zinc-500 hover:text-white text-[9px] tracking-[0.4em] font-light uppercase transition-colors">
          [ 뒤로 가기 ]
        </button>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl mx-auto z-10 pb-32"
      >
        <div className="mb-16 border-b border-zinc-900 pb-8">
          <p className="text-[#C2A35D] text-[10px] tracking-[0.4em] font-medium uppercase mb-4">Legal Notice</p>
          <h1 className="text-3xl font-light tracking-tight text-white break-keep">
            이용약관 및 환불규정
          </h1>
        </div>

        <div className="space-y-16 text-zinc-400 font-light text-[13px] md:text-sm leading-loose tracking-wide break-keep">
          
          <section className="space-y-6">
            <h2 className="text-lg text-white font-medium tracking-tight">제 1조 (목적)</h2>
            <p>
              본 약관은 주식회사 원블랭크(이하 "회사")가 제공하는 인지적 보호 및 할 일 관리 시스템(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무, 책임 및 환불에 관한 제반 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-lg text-white font-medium tracking-tight">제 2조 (서비스의 제공 및 변경)</h2>
            <p>
              회사는 회원에게 매일 지정된 시간에 단일 행동 지침을 제공하며, 주말 접속 차단 등 회원의 인지 에너지를 보호하기 위한 시스템적 환경을 제공합니다. 회사는 원활한 서비스 제공을 위해 필요한 경우 서비스의 내용을 변경할 수 있으며, 이 경우 사전에 공지합니다.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-lg text-white font-medium tracking-tight flex items-center gap-3">
              제 3조 (환불 규정 및 청약 철회)
              <span className="bg-[#C2A35D] text-black text-[9px] px-2 py-1 font-bold tracking-widest uppercase">필수 확인</span>
            </h2>
            <div className="space-y-4">
              <p className="text-zinc-300 font-medium">
                회사는 결제하신 고객님들께 아래와 같은 명확한 환불 규정을 적용합니다.
              </p>
              <ul className="list-disc pl-5 space-y-3">
                <li>
                  <span className="text-white">결제 후 14일 이내 (100% 환불 보장):</span> 서비스에 만족하지 못하셨거나, 시스템이 지시한 내용을 모두 수행했음에도 인지적 피로가 감소하지 않았다고 판단하실 경우, 결제일로부터 14일 이내에 고객센터로 요청하시면 묻지도 따지지도 않고 결제 금액 전액을 환불해 드립니다.
                </li>
                <li>
                  <span className="text-white">결제 후 14일 경과 (부분 환불):</span> 14일이 지난 후 해지를 원하실 경우, 전체 결제 금액에서 '실제 이용한 일수만큼 계산된 금액'과 '위약금(총 결제 대금의 10%)'을 제외한 나머지 금액을 환불해 드립니다.
                </li>
                <li>
                  환불 요청은 고객센터 이메일(support@oneblank.co.kr)을 통해 접수하며, 접수 확인 후 영업일 기준 3~5일 이내에 결제하신 수단으로 환불 처리됩니다.
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-lg text-white font-medium tracking-tight">제 4조 (회원의 의무)</h2>
            <p>
              회원은 본인의 계정 정보를 안전하게 관리할 책임이 있으며, 타인에게 양도하거나 대여할 수 없습니다. 회원이 시스템의 정상적인 운영을 고의로 방해하거나 불법적인 목적으로 서비스를 이용하는 경우, 회사는 즉시 서비스 제공을 중단하고 계정을 영구 정지할 수 있습니다.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-lg text-white font-medium tracking-tight">제 5조 (면책 조항)</h2>
            <p>
              회사는 천재지변, 전시, 사변 등 불가항력적인 사유로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다. 또한, 회원이 서비스에 접속하여 얻은 정보로 인해 발생한 직간접적인 손해에 대해서는 회사의 중대한 과실이 없는 한 책임지지 않습니다.
            </p>
          </section>

        </div>
      </motion.div>
    </main>
  )
}
