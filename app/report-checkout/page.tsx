"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Script from "next/script";

type LegalModalType = "terms" | "privacy" | "refund";
type ModalType = LegalModalType | null;

const legalContent: Record<LegalModalType, { title: string; body: string }> = {
  terms: {
    title: "이용약관",
    body: `제1조 (목적)\n본 약관은 ONE BLANK(이하 '회사')가 제공하는 디지털 의사결정 운영 시스템 및 관련 제반 서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.\n\n제2조 (서비스의 제공 및 변경)\n1. 회사는 회원에게 의사결정 OS, 컨디션 진단, 시스템 통제, 자산 누수 방지 리포트 등의 서비스를 제공합니다.\n2. 회사는 기술적 사양의 변경이나 운영상의 사유로 서비스 내용을 변경할 수 있으며, 이 경우 최소 7일 전 공지합니다.\n\n제3조 (해지 및 재가입 제한)\n회원이 서비스를 해지하는 경우, 해지 즉시 대기자 명단에 있는 다른 회원에게 해당 자리가 양보됩니다. 해지 이후 동일 서비스에 대한 재가입은 불가합니다.`
  },
  privacy: {
    title: "개인정보처리방침",
    body: `1. 수집하는 개인정보 항목\n회사는 서비스 제공을 위해 성명, 이메일 주소, 접속 로그, 쿠키, 결제 기록을 수집합니다.\n\n2. 개인정보의 이용 목적\n수집된 정보는 회원 관리, 서비스 제공 및 개선, 신규 서비스 개발, 법적 의무 이행을 위해서만 사용됩니다.\n\n3. 개인정보의 보유 및 이용기간\n회원 탈퇴 시까지 보유하며, 관련 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.`
  },
  refund: {
    title: "환불 규정",
    body: `환불 불가(All Sales Are Final).\n고급 클럽의 룰을 타협하지 않습니다.\n\n디지털 콘텐츠 및 시스템 접근 권한 부여 특성상 결제 후 서비스가 즉시 개시되므로 원칙적으로 환불이 불가합니다.\n\n1. 본 서비스는 디지털 콘텐츠 및 시스템 접근 권한을 제공하는 용역으로, '전자상거래 등에서의 소비자보호에 관한 법률' 제17조 제2항에 따라 회원의 결제 후 시스템 로그인이 완료된 시점부터는 청약 철회가 제한됩니다.\n\n2. 다만, 회사의 귀책 사유로 인한 시스템 오류로 서비스를 전혀 이용할 수 없는 경우에 한하여 전액 환불을 진행합니다.\n\n3. 모든 환불 요청은 고객센터 이메일(proof@bookzapstudio.com)을 통해 접수하며, 심사 후 7 영업일 이내에 처리됩니다.`
  }
};

// Inner component — must be wrapped in Suspense because it calls useSearchParams
function ReportCheckoutContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "대표님";
  const lostAsset = parseInt(searchParams.get("lost_asset") || "48958", 10);
  const monthlyRevenue = parseInt(searchParams.get("monthly_revenue") || "0", 10);
  const weeklyHours = parseInt(searchParams.get("weekly_hours") || "0", 10);

  // Derived stats shown in the ROI proof section
  const hourlyValue = weeklyHours > 0
    ? Math.floor(monthlyRevenue / (weeklyHours * 4.3))
    : Math.floor(lostAsset / 8);
  const annualLeak = lostAsset * 365;

  const [modalType, setModalType] = useState<ModalType>(null);
  const widgetsRef = useRef<any>(null);
  const [payReady, setPayReady] = useState(false);

  const initToss = async () => {
    try {
      const tp = (window as any).TossPayments;
      if (!tp) return;
      const tossPayments = tp("test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm");
      const widgets = tossPayments.widgets({ customerKey: tp.ANONYMOUS });
      await widgets.setAmount({ currency: "KRW", value: 390000 });
      await Promise.all([
        widgets.renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" }),
        widgets.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
      ]);
      widgetsRef.current = widgets;
      setPayReady(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePayment = async () => {
    if (!widgetsRef.current) return;
    try {
      await widgetsRef.current.requestPayment({
        orderId: `OB-${Date.now()}`,
        orderName: "인지 제어 진단 시스템",
        successUrl: `${window.location.origin}/result`,
        failUrl: `${window.location.origin}/cancel`,
      });
    } catch (e: any) {
      if (e?.code !== "USER_CANCEL") console.error(e);
    }
  };

  const isLegal = (type: ModalType): type is LegalModalType =>
    type === "terms" || type === "privacy" || type === "refund";

  return (
    <>
      <Script
        src="https://js.tosspayments.com/v2/standard"
        strategy="afterInteractive"
        onLoad={initToss}
      />

      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-[#D4AF37] selection:text-black flex flex-col">

        {/* Shock header */}
        <div className="w-full bg-red-950 border-b border-red-900 px-6 py-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-red-400 text-xs font-bold tracking-widest uppercase mb-1">
              진단 결과 — 경보
            </p>
            <p className="text-red-300 text-base md:text-lg font-black leading-snug">
              충격: {name}이 오늘 하루 망설이느라 증발시킨 자산 가치는{" "}
              <span className="text-red-200 text-xl md:text-2xl font-black font-mono">
                ₩{lostAsset.toLocaleString()}
              </span>
              입니다.
            </p>
          </div>
        </div>

        <main className="flex-1 flex flex-col">
          <div className="max-w-2xl mx-auto w-full px-6 py-12 flex flex-col gap-10">

            {/* ROI proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="flex flex-col gap-6"
            >
              <div className="bg-[#0f0f0f] border border-red-900/40 rounded-[24px] p-7 flex flex-col gap-5">
                <p className="text-[10px] font-bold tracking-[0.4em] text-red-500/80 uppercase">
                  수치 증명 — {name}의 인지 누수 분석
                </p>
                <div className="flex flex-col divide-y divide-zinc-900">
                  {[
                    { label: "시간당 인지적 자산 가치", val: `₩${hourlyValue.toLocaleString()}` },
                    { label: "하루 평균 낭비되는 결정 시간", val: "약 8시간" },
                    { label: "오늘 하루 증발한 가치", val: `₩${lostAsset.toLocaleString()}`, highlight: true },
                    { label: "이 속도로 1년이면", val: `₩${annualLeak.toLocaleString()}`, danger: true },
                  ].map(({ label, val, highlight, danger }) => (
                    <div key={label} className="flex justify-between items-center py-3.5">
                      <span className="text-sm text-zinc-500">{label}</span>
                      <span className={`text-sm font-black ${danger ? "text-red-400" : highlight ? "text-red-300" : "text-zinc-300"}`}>
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Context bridge */}
              <div className="flex flex-col gap-3">
                <p className="text-[10px] font-bold tracking-[0.4em] text-[#D4AF37]/60 uppercase">
                  이 누수를 영구적으로 차단하는 유일한 방법
                </p>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-100 leading-[1.2]">
                  매일 아침, 오늘 할 일 1가지를<br />
                  <span className="text-[#D4AF37]">우리가 대신 결정합니다.</span>
                </h2>
                <p className="text-zinc-400 text-sm leading-[1.9] font-medium mt-1">
                  ONE BLANK는 {name}의 뇌를 대신합니다. 진단 데이터를 기반으로
                  가장 높은 레버리지를 낼 수 있는 과업 하나만을 배정합니다.
                  당신은 그것만 실행하면 됩니다.
                </p>
              </div>
            </motion.div>

            {/* Payment card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="bg-[#111111] border border-zinc-800 rounded-[24px] p-7 flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold tracking-[0.4em] text-zinc-600 uppercase">Core Plan — Single Payment</p>
                <h3 className="text-xl font-black tracking-tight text-zinc-100 mt-1">인지 제어 진단 시스템</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-[2.6rem] font-black font-mono text-[#D4AF37] tracking-tighter leading-none">390,000</span>
                  <span className="text-lg font-bold text-[#D4AF37] leading-none">원</span>
                </div>
                <p className="text-[11px] text-zinc-700 font-medium mt-1">단건 결제 / 무형 디지털 콘텐츠</p>
              </div>

              <div className="w-full h-px bg-zinc-800/80" />

              <div id="payment-method" className="w-full" />
              <div id="agreement" className="w-full" />

              <button
                onClick={handlePayment}
                disabled={!payReady}
                className="w-full py-4 bg-[#D4AF37] text-[#0a0a0a] rounded-xl font-black tracking-wide text-sm hover:brightness-110 transition-all shadow-[0_0_40px_rgba(212,175,55,0.15)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {payReady ? "내 뇌를 대신할 비서 고용하기" : "결제 시스템 로딩 중..."}
              </button>

              <p className="text-[10px] text-zinc-700 text-center leading-relaxed">
                결제 즉시 서비스가 개시됩니다. 환불 불가(All Sales Are Final). 해지 시 재가입 불가.
              </p>
            </motion.div>

          </div>
        </main>

        {/* Footer */}
        <footer className="w-full bg-[#0a0a0a] border-t border-zinc-900 pt-12 pb-10 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
              <div className="flex flex-col gap-3">
                <span className="text-base font-black tracking-[0.25em] uppercase text-zinc-600">ONE BLANK</span>
                <p className="text-zinc-700 text-xs leading-relaxed max-w-xs">
                  상위 0.1% 의사결정자를 위한 프라이빗 운영 시스템.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Policy</span>
                <button onClick={() => setModalType("terms")} className="text-zinc-700 hover:text-zinc-300 text-xs transition-colors text-left">이용약관</button>
                <button onClick={() => setModalType("privacy")} className="text-zinc-700 hover:text-zinc-300 text-xs transition-colors text-left">개인정보처리방침</button>
                <button onClick={() => setModalType("refund")} className="text-zinc-700 hover:text-zinc-300 text-xs transition-colors text-left">환불 규정</button>
              </div>
            </div>
            <div className="pt-8 border-t border-zinc-900/60 flex flex-col gap-1.5 text-[10px] text-zinc-700 font-medium tracking-tight">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <span>상호명: 원블랭크(ONE BLANK)</span>
                <span>대표자: 권미현</span>
                <span>사업자등록번호: 157-11-03032</span>
                <span>통신판매업신고번호: 신고 진행 중</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <span>주소: 경상남도 거제시 거제면 두동로 259-90, 103동 1701호</span>
                <span>이메일: proof@bookzapstudio.com</span>
                <span>전화번호: 010-8978-0703</span>
              </div>
              <p className="mt-3 text-zinc-800">© 2026 ONE BLANK. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Legal modals */}
        <AnimatePresence>
          {modalType && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6"
              onClick={(e) => { if (e.target === e.currentTarget) setModalType(null); }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="bg-[#0f0f0f] border border-zinc-800 w-full max-w-md max-h-[82vh] overflow-hidden rounded-[24px] flex flex-col shadow-2xl"
              >
                {isLegal(modalType) && (
                  <>
                    <div className="px-7 pt-7 pb-5 border-b border-zinc-900 flex justify-between items-center">
                      <h3 className="text-sm font-black tracking-wide text-zinc-100">{legalContent[modalType].title}</h3>
                      <button onClick={() => setModalType(null)} className="text-zinc-600 hover:text-white transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                    <div className="p-7 overflow-y-auto">
                      {modalType === "refund" && (
                        <div className="mb-6 p-5 bg-zinc-900 border border-zinc-700 rounded-2xl">
                          <p className="text-zinc-100 text-base font-black leading-snug tracking-tight">
                            환불 불가(All Sales Are Final).
                          </p>
                          <p className="text-zinc-400 text-sm font-semibold mt-1">
                            고급 클럽의 룰을 타협하지 않습니다.
                          </p>
                        </div>
                      )}
                      <pre className="text-zinc-500 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                        {legalContent[modalType].body}
                      </pre>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}

export default function ReportCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
        </div>
      }
    >
      <ReportCheckoutContent />
    </Suspense>
  );
}
