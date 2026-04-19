'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function CheckoutPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [plan, setPlan] = useState<'monthly' | 'yearly' | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [overlayType, setOverlayType] = useState<'terms' | 'privacy' | 'refund' | null>(null)

  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [showTossModal, setShowTossModal] = useState(false)
  const [widgets, setWidgets] = useState<any>(null)

  const handlePlanSelect = (selected: 'monthly' | 'yearly') => {
    setPlan(selected)
    setStep(2)
  }

  useEffect(() => {
    if (!showTossModal) return

    const script = document.createElement("script")
    script.src = "https://js.tosspayments.com/v2/standard"
    script.onload = async () => {
      try {
        const tossPayments = (window as any).TossPayments("test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm")
        const customerKey = "ONEBLANK_USER_" + Date.now()
        const widgetsInstance = tossPayments.widgets({ customerKey })
        setWidgets(widgetsInstance)

        const price = plan === 'yearly' ? 3900000 : 390000
        await widgetsInstance.setAmount({ currency: "KRW", value: price })

        await Promise.all([
          widgetsInstance.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          widgetsInstance.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          })
        ])
      } catch (error) {
        console.error("토스 위젯 로딩 실패:", error)
      }
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [showTossModal, plan])

  const openPaymentModal = () => {
    if (!customerName || !customerEmail || !password) {
      alert('성함, 이메일, 그리고 접속에 사용할 비밀번호를 모두 입력해 주십시오.')
      return
    }
    if (password.length < 6) {
      alert('안전한 보안을 위해 비밀번호는 6자리 이상으로 설정해 주십시오.')
      return
    }
    if (!agreed) {
      alert('ONE BLANK 자체 이용약관 및 환불규정에 동의해 주십시오.')
      return
    }
    setShowTossModal(true)
  }

  const executeTossPayment = async () => {
    if (!widgets) return
    try {
      // 📌 결제 전 고객 정보를 브라우저에 임시 저장 (데이터 보존)
      localStorage.setItem('customerName', customerName)
      localStorage.setItem('customerEmail', customerEmail)
      localStorage.setItem('customerPassword', password)

      await widgets.requestPayment({
        orderId: "ORDER_" + Date.now(),
        orderName: plan === 'yearly' ? 'Core 연 구독 (VVIP)' : 'Core 월 구독',
        customerName: customerName,
        customerEmail: customerEmail,
        successUrl: window.location.origin + "/success", 
        failUrl: window.location.origin + "/checkout",
      })
    } catch (error) {
      console.error("결제 요청 중 오류 발생:", error)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center font-pretendard relative selection:bg-[#C2A35D] selection:text-black overflow-y-auto">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(194,163,93,0.03)_0%,_transparent_70%)] pointer-events-none z-0"></div>

      <header className="w-full px-8 md:px-16 py-10 z-40 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <span className="text-[#C2A35D] font-serif italic text-2xl font-bold uppercase">ONE BLANK</span>
          <span className="text-white text-[11px] tracking-[0.4em] font-light uppercase">Authorized Session</span>
        </div>
        <button onClick={() => router.push('/')} className="text-zinc-500 hover:text-white text-[11px] tracking-widest uppercase transition-colors">[ 나가기 ]</button>
      </header>

      <div className="w-full max-w-6xl px-6 z-10 pb-24">
        <div className="text-center mb-12 mt-6">
          <p className="text-[#C2A35D] text-[11px] tracking-[0.4em] font-medium uppercase mb-3">Step {step.toString().padStart(2, '0')}</p>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
            {step === 1 ? "내 뇌의 통제권 위임하기" : "권한 위임자 정보 입력"}
          </h1>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
                <div className="bg-[#050505] border border-zinc-800 p-10 flex flex-col justify-between hover:border-zinc-600 transition-all duration-500 rounded-[32px]">
                  <div className="space-y-8 text-left">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-zinc-400 uppercase tracking-widest">Core 월 구독</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-serif italic font-bold text-white tracking-tighter">₩ 390,000</span>
                        <span className="text-zinc-500 text-sm">/ 월</span>
                      </div>
                    </div>
                    <div className="space-y-4 border-t border-zinc-800 pt-8">
                      {["매일 기상 직후, 단 1가지 행동 지침 동기화", "소모적인 결정 권한 위임", "실시간 뇌 에너지 리소스 최적화"].map((f) => (
                        <div key={f} className="flex items-start gap-3 text-sm text-zinc-300 font-light leading-snug">
                          <span className="text-[#C2A35D]">✔</span> <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => handlePlanSelect('monthly')} className="w-full mt-12 py-5 bg-zinc-800 text-white text-[12px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-500 rounded-xl">이 플랜으로 시작하기</button>
                </div>

                <div className="bg-[#0A0A0A] border border-[#C2A35D]/50 p-10 flex flex-col justify-between hover:border-[#C2A35D] transition-all duration-500 rounded-[32px] relative shadow-[0_20px_40px_rgba(194,163,93,0.08)] overflow-hidden">
                  <div className="absolute top-6 right-8">
                    <span className="bg-[#C2A35D] text-black text-[10px] px-3 py-1.5 font-bold tracking-widest uppercase rounded-full">VVIP 추천</span>
                  </div>
                  <div className="space-y-8 text-left">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-[#C2A35D] uppercase tracking-widest">Core 연 구독</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-serif italic font-bold text-white tracking-tighter">₩ 3,900,000</span>
                        <span className="text-zinc-500 text-sm">/ 년</span>
                      </div>
                      <p className="text-[#C2A35D] text-[12px] mt-2 font-light tracking-wide leading-relaxed">
                        (2개월 무료 혜택 및 VVIP 클럽 우선권 부여)
                      </p>
                    </div>
                    <div className="space-y-4 border-t border-zinc-800 pt-8">
                      {["[VVIP 전용] 주말 시스템 인지적 강제 차단", "매일 기상 직후, 단 1가지 행동 지침 동기화", "[VVIP 전용] 프라이빗 1:1 진단 리포트 제공"].map((f) => (
                        <div key={f} className="flex items-start gap-3 text-sm text-zinc-300 font-light leading-snug">
                          <span className="text-[#C2A35D]">✔</span> <span>{f}</span>
                        </div>
                      ))}
                      <div className="flex items-start gap-3 text-sm text-[#C2A35D] font-bold leading-snug pt-2">
                        <span>🎁</span> <span>[VVIP 한정 보너스] 시스템 미판매 자산 :<br/>&apos;CEO 생산성 정밀 진단 툴&apos; 즉시 해제</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handlePlanSelect('yearly')} className="w-full mt-12 py-5 bg-white text-black text-[12px] font-bold tracking-widest uppercase hover:bg-[#C2A35D] transition-all duration-500 rounded-xl shadow-xl">가장 현명하게 VVIP로 시작하기</button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl mx-auto w-full space-y-12">
              <div className="bg-[#0A0A0A] border border-zinc-800 p-6 rounded-2xl flex justify-between items-center text-left">
                <div className="space-y-1">
                  <p className="text-zinc-400 text-[11px] tracking-widest uppercase font-medium">선택된 플랜</p>
                  <p className="text-lg font-light text-white">{plan === 'yearly' ? 'Core 연 구독 (VVIP)' : 'Core 월 구독'}</p>
                </div>
                <button onClick={() => setStep(1)} className="text-zinc-400 hover:text-white text-[11px] tracking-widest uppercase underline underline-offset-4 transition-colors">변경하기</button>
              </div>
              <div className="space-y-10">
                <div className="space-y-8">
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="성함 (Full Name)" className="w-full bg-transparent border-b border-zinc-500 py-4 text-white placeholder-zinc-400 text-lg font-light focus:outline-none focus:border-[#C2A35D] transition-colors" />
                  <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="이메일 주소 (Email Address)" className="w-full bg-transparent border-b border-zinc-500 py-4 text-white placeholder-zinc-400 text-lg font-light focus:outline-none focus:border-[#C2A35D] transition-colors" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="사용할 비밀번호 (6자리 이상)" className="w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder-zinc-600 text-lg font-light focus:outline-none focus:border-[#C2A35D] transition-colors" />
                </div>
                <div className="space-y-8 pt-4">
                  <div className="flex items-start gap-4 text-left">
                    <div onClick={() => setAgreed(!agreed)} className={`mt-1 w-5 h-5 border flex items-center justify-center cursor-pointer transition-colors ${agreed ? 'border-white bg-white' : 'border-zinc-500'}`}>
                      {agreed && <span className="text-black text-xs">✔</span>}
                    </div>
                    <p className="text-[13px] text-zinc-300 leading-relaxed font-light">
                      <button onClick={() => setOverlayType('terms')} className="text-white font-medium hover:text-[#C2A35D] underline underline-offset-4 transition-all">이용약관</button> 및 <button onClick={() => setOverlayType('refund')} className="text-white font-medium hover:text-[#C2A35D] underline underline-offset-4 transition-all">환불규정</button>에 동의하며,<br />결제와 동시에 멤버 계정이 생성됨을 확인합니다.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button onClick={openPaymentModal} className="w-full py-6 bg-white text-black text-[14px] font-bold tracking-[0.1em] hover:bg-zinc-200 transition-all uppercase rounded-xl shadow-xl">
                      ₩ {plan === 'yearly' ? '3,900,000' : '390,000'} 결제 및 계정 생성
                    </button>
                    <p className="text-center text-zinc-500 text-[11px] tracking-widest uppercase mt-2">Secure SSL Connection</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showTossModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-2xl bg-white rounded-2xl flex flex-col relative shadow-2xl my-8">
              <button onClick={() => setShowTossModal(false)} className="absolute top-5 right-6 text-zinc-400 hover:text-black z-10 text-3xl font-light">&times;</button>
              <div className="p-6 md:p-8 space-y-4 max-h-[85vh] overflow-y-auto">
                <div className="text-center pb-2 border-b border-zinc-100">
                  <h2 className="text-black text-xl font-bold">안전 결제 시스템</h2>
                  <p className="text-zinc-500 text-sm mt-1">결제 수단을 선택해 주십시오.</p>
                </div>
                <div id="payment-method" className="w-full"></div>
                <div id="agreement" className="w-full"></div>
                <button onClick={executeTossPayment} className="w-full py-5 bg-[#3182f6] text-white text-[15px] font-bold rounded-xl mt-4 hover:bg-[#236bb5] transition-colors">
                  {plan === 'yearly' ? '3,900,000' : '390,000'}원 최종 결제하기
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
