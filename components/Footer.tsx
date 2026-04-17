'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 border-t border-zinc-900 bg-black text-zinc-500">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-wrap gap-6 text-xs font-medium">
          <Link href="/terms" className="hover:text-white">이용약관</Link>
          <Link href="/privacy" className="hover:text-white font-bold">개인정보처리방침</Link>
          <Link href="/refund" className="hover:text-white">환불정책</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] leading-relaxed">
          <div className="space-y-1">
            <p>상호명: [대표님 상호명 입력]</p>
            <p>대표자명: [대표님 성함 입력]</p>
            <p>사업자등록번호: [000-00-00000]</p>
            <p>통신판매업신고번호: [제 2026-서울강남-0000 호]</p>
          </div>
          <div className="space-y-1">
            <p>사업장주소: [상세 주소 입력]</p>
            <p>고객센터: [010-0000-0000]</p>
            <p>이메일: [official@oneblank.co.kr]</p>
            <p>© 2026 ONE BLANK. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
