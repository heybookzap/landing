"use client";

import { motion } from "framer-motion";

export default function CancelFlow({
  onAccept,
  onCancel,
}: {
  onAccept?: () => void;
  onCancel?: () => void;
}) {
  return (
    <section className="relative z-10 w-full max-w-lg flex flex-col items-center gap-10 px-6 py-16 text-center mx-auto">
      <p className="text-[10px] tracking-[0.5em] font-bold uppercase text-red-700 opacity-80">
        System Warning
      </p>

      <h2 className="text-2xl sm:text-3xl font-light leading-tight tracking-tighter text-[#ededed]">
        구독을 <span className="font-bold text-white">영구 해지</span>하시겠습니까?
      </h2>

      <p className="text-sm leading-relaxed text-red-500 max-w-sm">
        지금까지 방어한 모든 복리 자산이 즉시 소각됩니다.
      </p>

      <div className="w-full flex flex-col gap-4 mt-8">
        <motion.button
          onClick={onAccept}
          whileHover={{ filter: "brightness(1.1)", y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-5 text-xs font-bold tracking-[0.2em] uppercase"
          style={{
            background: "#B8860B",
            color: "#000000",
            boxShadow: "0 0 30px rgba(184,134,11,0.2)",
          }}
        >
          해지를 취소하고 시스템으로 돌아갑니다
        </motion.button>

        <button
          onClick={onCancel}
          className="w-full py-4 text-[10px] tracking-widest text-gray-600 underline underline-offset-4 hover:text-gray-400 transition-colors uppercase"
        >
          해지를 수용하고 자산을 소각합니다
        </button>
      </div>
    </section>
  );
}
