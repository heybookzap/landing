"use client";

import { motion } from "framer-motion";

export default function FrozenOverlay() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md text-center space-y-8">
        <p className="text-xs tracking-[0.4em] text-red-500 font-bold">ELITE SYSTEM HALT</p>
        <p className="text-xl font-bold text-white">엘리트 시스템이 정지되었습니다. 다시 시작하여 자산을 지켜내십시오.</p>
        <a
          href="https://toss.me/oneblank"
          target="_blank"
          className="block w-full py-4 bg-[#B8860B] text-black font-bold text-sm tracking-widest"
        >
          복구 비용 100,000원을 납부합니다
        </a>
      </motion.div>
    </div>
  );
}
