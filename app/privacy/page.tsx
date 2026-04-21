'use client'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 max-w-3xl mx-auto py-20 px-6 space-y-8">
        <h1 className="text-3xl font-bold">개인정보처리방침</h1>
        <div className="text-sm text-zinc-400 leading-relaxed space-y-4 font-light">
          <p>1. 수집 항목: 이메일, 결제 기록, 서비스 이용 로그.</p>
          <p>2. 수집 목적: VVIP 회원 식별, 서비스 제공 및 고객 지원.</p>
          <p>3. 보유 기간: 서비스 해지 시 혹은 관련 법령에 따른 보존 기간 종료 시까지 지체 없이 파기합니다.</p>
        </div>
      </main>
    </div>
  )
}
