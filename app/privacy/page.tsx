'use client'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-pretendard">
      <main className="flex-1 max-w-3xl mx-auto py-24 px-6 space-y-12">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-[#C2A35D]">개인정보처리방침</h1>
        <div className="text-[16px] text-zinc-300 leading-[1.8] space-y-8 font-light tracking-wide break-keep italic">
          "대표님의 모든 사업적 목표와 정보는 암호화되어 생명처럼 보호됩니다."
        </div>
        <div className="text-sm text-zinc-400 space-y-4 border-t border-zinc-800 pt-8">
          <p>1. 수집 항목: 이메일, 결제 기록, 서비스 이용 로그.</p>
          <p>2. 수집 목적: VVIP 회원 식별 및 맞춤형 지침 생성.</p>
          <p>3. 보유 기간: 서비스 해지 시 혹은 관련 법령에 따른 보존 기간 종료 시까지 즉시 파기.</p>
        </div>
      </main>
    </div>
  )
}
