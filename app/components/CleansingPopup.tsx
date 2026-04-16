"use client";

import { motion } from "framer-motion";

export default function CleansingPopup({ tier, onDismiss }: { tier: string; onDismiss: () => void }) {
  const getMessage = () => {
    if (tier === "Premium") return "엘리트 시스템이 다시 정렬되었습니다. 명료한 상태로 시작하십시오.";
    if (tier === "Core") return "시스템 기록이 정리되었습니다. 명료한 상태로 시작하십시오.";
    return "어제의 기록이 지워졌습니다. 명료한 상태로 시작하십시오.";
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 px-6">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-sm text-center space-y-8">
        <p className="text-xs tracking-widest text-[#B8860B] uppercase">SYSTEM RESET</p>
        <p className="text-gray-300 leading-relaxed">{getMessage()}</p>
        <button onClick={onDismiss} className="w-full py-4 bg-[#B8860B] text-black font-bold text-sm">
          확인했습니다. 시작합니다.
        </button>
      </motion.div>
    </div>
  );
}
