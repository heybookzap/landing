'use client'

import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 max-w-3xl mx-auto py-20 px-6 space-y-8">
        <h1 className="text-3xl font-bold">이용약관</h1>
        <div className="text-sm text-zinc-400 leading-relaxed space-y-4 font-light">
          <p>제1조 (목적) 본 약관은 ONE BLANK가 제공하는 인지 보호 시스템 서비스의 이용 조건 및 절차를 규정함을 목적으로 합니다.</p>
          <p>제2조 (서비스 제공) 회사는 VVIP 승인 유저에게 영구 라이선스 기반의 데이터 분석 및 지침 하사 서비스를 제공합니다.</p>
          <p>제3조 (계약 성립) 이용자가 본 약관에 동의하고 결제를 완료함과 동시에 서비스 이용 계약이 성립된 것으로 간주합니다.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
