'use client'

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-3xl mx-auto py-20 px-6 space-y-12">
        <h1 className="text-3xl font-bold tracking-tight">취소 및 환불 정책</h1>
        
        <div className="space-y-10 text-sm leading-relaxed text-zinc-400">
          <section className="space-y-4">
            <h2 className="text-white text-lg font-medium">1. 환불 규정 안내</h2>
            <p>본 서비스는 디지털 콘텐츠 및 소프트웨어 라이선스 상품으로, 관련 법령에 따라 환불 규정을 준수합니다.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-white text-lg font-medium">2. 환불 가능 조건</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>결제 완료 후 7일 이내, 시스템 접속 이력이 없는 경우 전액 환불이 가능합니다.</li>
              <li>시스템 결함으로 인해 정상적인 서비스 이용이 불가능한 경우 전액 환불됩니다.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-white text-lg font-medium">3. 환불 제한 조건</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>디지털 콘텐츠 특성상 시스템 접속 및 지침 확인이 이루어진 경우 환불이 불가능합니다.</li>
              <li>이용약관 위반으로 인한 계정 정지 시에는 환불되지 않습니다.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-white text-lg font-medium">4. 환불 절차</h2>
            <p>환불 신청은 고객센터(이메일 또는 유선)를 통해 접수하며, 승인 후 3영업일 이내에 결제 수단과 동일한 방식으로 환불됩니다.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
