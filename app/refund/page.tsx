'use client'

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-pretendard selection:bg-[#C2A35D] selection:text-black">
      <main className="flex-1 max-w-4xl mx-auto py-24 px-6 space-y-12 w-full">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-[#C2A35D]">취소 및 환불 정책</h1>
        
        <div className="bg-[#0A0A0A] border border-[#C2A35D]/40 p-10 rounded-3xl space-y-6 shadow-[0_0_30px_rgba(194,163,93,0.1)]">
          <h2 className="text-[#C2A35D] text-xl font-bold">🛡️ [ 14일 인지 방어 보증 (Risk-Free) ]</h2>
          <p className="text-zinc-200 text-[17px] leading-relaxed break-keep font-medium">
            ONE BLANK는 대표님의 변화를 100% 보장합니다. 결제 후 14일 동안, 매일 아침 시스템이 내리는 '2분 지침'을 단 하루도 빠짐없이 완료(체크인)하셨음에도 불구하고 결정 피로가 줄어들지 않았다면?
          </p>
          <p className="text-white font-bold text-lg underline underline-offset-8 decoration-[#C2A35D]">
            저희가 실패한 것입니다. 즉시 100% 전액 환불해 드립니다.
          </p>
        </div>

        <div className="space-y-12 pt-16 border-t border-zinc-900">
          <section className="space-y-6">
            <h2 className="text-white text-xl font-medium tracking-tight italic">⚖️ 법무/CS용 상세 환불 기준</h2>
            <div className="grid grid-cols-1 gap-8 text-zinc-400">
              <div className="space-y-4 bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800">
                <p className="text-white font-bold text-base">[ 14일 조건부 전액 환불 ]</p>
                <ul className="space-y-2 text-sm leading-relaxed">
                  <li>• 결제일로부터 14일 이내: 시스템 지침 미이행 및 불만족 시 100% 환불</li>
                  <li>• 단, 14일 이내라도 시스템 지침을 7회 이상 확인한 경우 콘텐츠 소비로 간주하여 전액 환불이 제한될 수 있습니다.</li>
                </ul>
              </div>

              <div className="space-y-4 bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800">
                <p className="text-white font-bold text-base">[ 구독 중도 해지 시 환불 산식 ]</p>
                <div className="space-y-6 text-sm">
                  <div>
                    <p className="text-zinc-200 font-medium mb-2">1. 월 구독 (Monthly)</p>
                    <p>결제일로부터 14일 경과 후 해지 시, 잔여 일수에 대해 일할 계산하여 환불 (위약금 10% 공제)</p>
                  </div>
                  <div>
                    <p className="text-zinc-200 font-medium mb-2">2. 연 구독 (Yearly)</p>
                    <p>환불금 = 결제 금액 - (정상가 기준 이용 개월 수 소비) - 위약금(결제 대금의 10%)</p>
                    <p className="mt-1 text-zinc-500 text-xs">* 할인 혜택은 완납 유지 시 제공되며, 중도 해지 시 이용 기간에 대해서는 정상가(월 39만원)가 적용됩니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <p className="text-zinc-600 text-[11px] text-center tracking-widest uppercase font-light">Contact: support@oneblank.co.kr</p>
        </div>
      </main>
    </div>
  )
}
