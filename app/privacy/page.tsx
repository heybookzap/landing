'use client'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-pretendard selection:bg-[#C2A35D] selection:text-black">
      <main className="flex-1 max-w-3xl mx-auto py-24 px-6 space-y-12 w-full text-left">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-[#C2A35D]">개인정보처리방침</h1>
        <div className="text-[17px] text-zinc-300 leading-[1.8] space-y-8 font-light tracking-wide break-keep italic mb-12">
          "대표님의 모든 사업적 목표와 지침 이행 데이터는 군사 수준의 보안으로 암호화되어 생명처럼 보호됩니다. 우리는 대표님의 인지를 방어할 뿐, 그 어떤 정보도 외부로 발설하지 않습니다."
        </div>
        <div className="space-y-10 border-t border-zinc-900 pt-12">
          <section className="space-y-4">
            <h2 className="text-white text-lg font-medium">1. 개인정보 수집 항목 및 방법</h2>
            <p className="text-zinc-400 text-[15px] leading-relaxed font-light">
              - 필수 항목: 이메일 주소, 결제 정보(카드 번호 일부 및 승인 번호), 목표 설정 데이터, 일일 컨디션 및 체크인 로그.<br />
              - 수집 방법: 회원가입, 온보딩 설문, 일일 리포트 작성 페이지.
            </p>
          </section>
          <section className="space-y-4">
            <h2 className="text-white text-lg font-medium">2. 개인정보의 이용 목적</h2>
            <p className="text-zinc-400 text-[15px] leading-relaxed font-light">
              수집된 정보는 오직 대표님 한 분만을 위한 1:1 맞춤형 실행 지침 생성 및 인지 효율 통계 분석(ROI 계산)을 위해서만 사용됩니다.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
