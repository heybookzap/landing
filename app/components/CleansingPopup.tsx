"use client";

import { motion } from "framer-motion";

export default function CleansingPopup({ tier, onDismiss }: { tier: string; onDismiss: () => void }) {
  const getMessage = () => {
    // 📌 티어 명칭을 우리 시스템 표준(VVIP, Core)에 맞게 교정했습니다.
    if (tier === "VVIP" || tier === "Elite") return "엘리트 방어 시스템이 재정렬되었습니다. 완벽히 명료한 상태로 시작하십시오.";
    if (tier === "Core") return "시스템 인지 기록이 정화되었습니다. 이제 본질에만 집중하십시오.";
    return "어제의 모든 부하가 소멸되었습니다. 가벼운 마음으로 진입하십시오.";
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/98 px-6 backdrop-blur-md">
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="max-w-sm w-full text-center space-y-10 p-10 border border-zinc-900 bg-[#050505] rounded-[32px] shadow-2xl relative overflow-hidden"
      >
        {/* 상단 장식선 */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C2A35D]/50 to-transparent"></div>
        
        <div className="space-y-4">
          <p className="text-[10px] tracking-[0.5em] font-bold text-[#C2A35D] uppercase font-serif italic">System Cleansing</p>
          <p className="text-zinc-300 text-sm leading-relaxed font-light break-keep">
            {getMessage()}
          </p>
        </div>

        <button 
          onClick={onDismiss} 
          className="w-full py-5 bg-[#C2A35D] text-black font-bold text-[11px] tracking-[0.2em] uppercase rounded-xl hover:bg-white transition-all duration-500 shadow-lg"
        >
          명료한 상태로 진입합니다
        </button>
      </motion.div>
    </div>
  );
}

