'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadTossPayments, TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk'

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_gck_docs_Ovk5rk1EwkebP0W43n07xlzm'
const customerKey = 'vvip_' + Math.random().toString(36).substring(7)

export default function CheckoutPage() {
  const router = useRouter()
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function fetchToss() {
      const tossPayments = await loadTossPayments(clientKey)
      const widgets = tossPayments.widgets({ customerKey })
      setWidgets(widgets)
    }
    fetchToss()
  }, [])

  useEffect(() => {
    if (!widgets) return
    async function renderWidgets() {
      await widgets.setAmount({ currency: 'KRW', value: 3900000 })
      await Promise.all([
        widgets.renderPaymentMethods({ selector: '#payment-method', variantKey: 'DEFAULT' }),
        widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' })
      ])
      setReady(true)
    }
    renderWidgets()
  }, [widgets])

  const handlePayment = async () => {
    if (!widgets) return
    
    document.cookie = "vvip_session=true; path=/;"
    
    await widgets.requestPayment({
      orderId: 'ORDER_' + new Date().getTime(),
      orderName: 'ONE BLANK 1년 완벽 보호 시스템',
      successUrl: window.location.origin + '/checkout/success',
      failUrl: window.location.origin + '/pricing',
    })
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 flex flex-col items-center justify-center animate-in fade-in duration-1000">
      <div className="max-w-lg w-full py-12 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-light tracking-tight">결제하고 내 시간 지키기</h1>
          <p className="text-zinc-500 text-sm font-light">
            결제가 끝나는 순간부터 당신의 골치 아픈 계획은 우리가 대신 세워줍니다.
          </p>
        </div>

        <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-6 rounded-sm">
          <div id="payment-method" className="w-full" />
          <div id="agreement" className="w-full mt-4" />
        </div>

        <button 
          onClick={handlePayment}
          disabled={!ready}
          className="w-full bg-[#C2A35D] text-black py-5 font-bold text-xs tracking-[0.2em] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all"
        >
          3,900,000원 결제하고 바로 시작하기
        </button>
      </div>
    </main>
  )
}
