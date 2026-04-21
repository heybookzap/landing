'use client'

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-pretendard">
      <main className="flex-1 max-w-4xl mx-auto py-24 px-6 space-y-12 w-full">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-[#C2A35D]">취소 및 환불 정책</h1>
        
        <div className="bg-[#0A0A0A] border border-[#C2A35D]/30 p-10 rounded-3xl space-y-6">
          <h2 className="text-[#C2A35D] text-lg font-bold">🛡️ [ 14일 인지 방어 보증 (Risk-Free) ]</h2>
          <p className="text-zinc-200 text-[16px] leading-relaxed break-keep font-medium">
            시스템 이용 후 14일 이내, 단 한 번이라도 서비스가 대표님의 인지 효율을 개선하지 못했다고 판단하신다면 그건 저희가 실패한 것입니다. 이유를 묻지 않고 즉시 100% 전액 환불해 드립니다.
          </p>
        </div>

        <div className="space-y-10 pt-10 border-t border-zinc-900">
          <section className="space-y-4">
            <h2 className="text-white text-lg font-medium tracking-tight italic">⚖️ 법무/CS용 상세 환불 기준</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-zinc-400 leading-relaxed">
              <div className="space-y-4 bg-zinc-900/30 p-6 rounded-2xl">
                <p className="text-white font-bold">[ 14일 조건부 전액 환불 ]</p>
                <p>- 결제 후 14일 이내 불만족 시 100% 환불 (최초 1회에 한함)</p>
                <p>- 단, 14일 경과 후에는 잔여 일수 비례 환불 적용</p>
              </div>
              <div className="space-y-4 bg-zinc-900/30 p-6 rounded-2xl">
                <p className="text-white font-bold">[ 월/연 구독 해지 안내 ]</p>
                <p>- 월 구독: 차기 결제일 3일 전까지 해지 시 다음 달 결제 중단</p>
                <p>- 연 구독: 중도 해지 시 (이용 기간 ÷ 12개월) 정산 후 잔액 반환</p>
              </div>
            </div>
          </section>
          <p className="text-zinc-600 text-xs text-center">환불 문의: support@oneblank.co.kr</p>
        </div>
      </main>
    </div>
  )
}
