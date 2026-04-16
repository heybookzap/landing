"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    // 매직 링크(Magic Link)를 통해 비밀번호 없는 입장을 구현합니다.
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // 입장이 승인되면 바로 대시보드로 이동하도록 설정합니다.
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      alert("접근 거부: 승인되지 않은 이메일입니다.");
    } else {
      setMessage("메일함으로 접근 권한이 발송되었습니다.");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center px-6">
      {/* 5% 골드 법칙: 은은한 배경 아우라 */}
      <div className="orb-wrapper" aria-hidden>
        <div className="glowing-orb" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-sm flex flex-col gap-16 text-center"
      >
        <div className="space-y-6">
          <p className="text-[10px] tracking-[0.8em] font-bold text-[#D4AF37] uppercase opacity-80">
            Elite Entry
          </p>
          <h1 className="text-3xl font-bold serif tracking-tighter">엘리트 시스템 입장</h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-8">
          <input
            type="email"
            placeholder="[ EMAIL ]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="luxury-input w-full py-4 text-center text-sm focus:outline-none placeholder:text-gray-700"
          />
          <button
            disabled={loading}
            className="gold-btn-luxury w-full py-5 text-[10px] font-bold tracking-[0.2em] uppercase"
          >
            {loading ? "전송 중입니다..." : "시스템 입장권 받기"}
          </button>
        </form>

        {message && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-[#D4AF37] text-[11px] italic"
          >
            {message}
          </motion.p>
        )}

        <div className="mt-12 flex flex-col items-center gap-4 opacity-20">
          <div className="w-px h-12 bg-[#D4AF37]" />
          <p className="text-[9px] tracking-[0.5em] text-white uppercase">
            ONE BLANK — THE ELITE AUTHENTICATOR
          </p>
        </div>
      </motion.div>
    </main>
  );
}
