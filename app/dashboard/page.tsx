"use client";

/**
 * ONE BLANK — MainDashboard
 *
 * ─── 6-Dimension Session Schema ───────────────────────────────────────────────
 *
 *  sessions table (one row per mission attempt):
 *
 *  customer_id      uuid        references profiles.id (NOT user_id — maps to
 *                               B2B whitepaper model: one customer may have
 *                               multiple seats; for now 1:1 with auth user)
 *  condition        text        self-reported before mission starts
 *                               CHECK IN ('tired', 'normal', 'good')
 *  day_of_week      smallint    0 = Sunday … 6 = Saturday (JS getDay() convention)
 *  time_slot        smallint    0–23 (hour of day when mission was started)
 *  task_type        text        'research' | 'writing' | 'review' |
 *                               'meeting' | 'deep_work'
 *  difficulty_rating smallint   1–5 post-mission cognitive fatigue score
 *                               (captured via QuickFeedbackModal)
 *  mission_completed boolean    true = user tapped "완료"
 *
 * ─── B2B Whitepaper Vision Note ───────────────────────────────────────────────
 *  Future: customer_id decouples from auth identity → one org can register
 *  N seats, all sessions aggregated under a single business customer_id.
 *  Weekly signal analytics then surface team-level cognitive load patterns,
 *  enabling ops managers to rebalance workload distribution.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";
import QuickFeedbackModal from "../components/QuickFeedbackModal";

type Mission = {
  id: string;
  title: string;
  task_type: string;
  duration_minutes: number;
  difficulty: number;
};

type Condition = "tired" | "normal" | "good";

const CONDITION_LABELS: Record<Condition, string> = {
  tired: "피곤함",
  normal: "보통",
  good: "최상",
};

export default function MainDashboard() {
  const [userName, setUserName] = useState("");
  const [mission, setMission] = useState<Mission | null>(null);
  const [condition, setCondition] = useState<Condition>("normal");
  const [conditionSet, setConditionSet] = useState(false);
  const [missionDone, setMissionDone] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hourlyValue, setHourlyValue] = useState(0);
  const [assetValue, setAssetValue] = useState(0);
  const accumulatorRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, hourly_value")
        .eq("id", user.id)
        .single();

      if (profile?.full_name) setUserName(profile.full_name);
      if (profile?.hourly_value) setHourlyValue(profile.hourly_value);

      const today = new Date().getDay(); // 0 Sun … 6 Sat
      const { data: missions } = await supabase
        .from("missions")
        .select("id, title, task_type, duration_minutes, difficulty")
        .eq("user_id", user.id)
        .eq("day_of_week", today)
        .eq("completed", false)
        .order("time_slot", { ascending: true })
        .limit(1);

      if (missions && missions.length > 0) {
        setMission(missions[0] as Mission);
      }
    };

    loadData();
  }, []);

  // Real-time asset ticker: (hourlyValue / 3600) × 3s tick × 1.5 leverage
  useEffect(() => {
    if (hourlyValue <= 0) return;
    const tickValue = (hourlyValue / 3600) * 3 * 1.5;

    intervalRef.current = setInterval(() => {
      accumulatorRef.current += tickValue;
      setAssetValue(Math.floor(accumulatorRef.current));
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hourlyValue]);

  const handleMissionComplete = async () => {
    if (!mission) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const now = new Date();
    const { data: session } = await supabase
      .from("sessions")
      .insert({
        customer_id: user.id,
        condition,
        day_of_week: now.getDay(),
        time_slot: now.getHours(),
        task_type: mission.task_type,
        mission_completed: true,
      })
      .select("id")
      .single();

    if (session) setSessionId(session.id);
    setFeedbackOpen(true);
  };

  const handleFeedbackSubmit = async (score: number) => {
    if (sessionId) {
      await supabase
        .from("sessions")
        .update({ difficulty_rating: score })
        .eq("id", sessionId);
    }
    if (mission) {
      await supabase
        .from("missions")
        .update({ completed: true })
        .eq("id", mission.id);
    }
    setFeedbackOpen(false);
    setMissionDone(true);
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col relative overflow-hidden">

      {/* Subtle radial glow — keeps it from feeling completely flat */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(212,175,55,0.03),transparent)] pointer-events-none" />

      {/* Header — minimal */}
      <header className="absolute top-0 left-0 right-0 z-10 h-16 flex items-center justify-between px-8">
        <span className="text-[11px] font-black tracking-[0.35em] text-[#D4AF37]/40 uppercase">ONE BLANK</span>
        {conditionSet && (
          <span className="text-[9px] font-bold tracking-widest text-[#D4AF37]/30 uppercase">
            {CONDITION_LABELS[condition]}
          </span>
        )}
      </header>

      {/* Main — vertically centered, 70% empty */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 pt-16">

        {!conditionSet ? (
          /* Step 0: Condition check */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="flex flex-col items-center gap-10 max-w-xs text-center"
          >
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold tracking-[0.45em] text-[#D4AF37]/40 uppercase">
                시스템 체크인
              </p>
              <p className="text-[#D4AF37] text-lg font-black leading-snug">
                오늘 컨디션은<br />어떻습니까?
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              {(["tired", "normal", "good"] as Condition[]).map((c) => (
                <button
                  key={c}
                  onClick={() => { setCondition(c); setConditionSet(true); }}
                  className="w-full py-3.5 border border-[#D4AF37]/20 rounded-2xl text-[11px] font-black text-[#D4AF37]/60 tracking-widest uppercase hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all"
                >
                  {CONDITION_LABELS[c]}
                </button>
              ))}
            </div>
          </motion.div>

        ) : missionDone ? (
          /* Step 2: Done state */
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]/60" />
            <div className="flex flex-col gap-2">
              <p className="text-[#D4AF37] text-2xl font-black tracking-tight">
                오늘의 임무 완수.
              </p>
              <p className="text-[#D4AF37]/40 text-sm font-medium">
                시스템이 내일을 준비합니다.
              </p>
            </div>
          </motion.div>

        ) : (
          /* Step 1: Mission display */
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="flex flex-col items-center gap-12 max-w-sm w-full text-center"
          >
            {/* Directive */}
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-bold tracking-[0.45em] text-[#D4AF37]/30 uppercase">
                Today&apos;s Directive
              </p>
              <p className="text-[#D4AF37]/60 text-sm font-semibold leading-relaxed">
                당신의 뇌는 쉬십시오.<br />
                오늘은 이것만 하시면 됩니다.
              </p>
            </div>

            {/* The single mission */}
            {mission ? (
              <div className="w-full flex flex-col gap-6">
                <div className="relative w-full border border-[#D4AF37]/20 rounded-[24px] p-8 flex flex-col gap-4">
                  {/* Gold left bar */}
                  <div className="absolute top-0 left-0 w-[1.5px] h-full bg-gradient-to-b from-[#D4AF37]/60 via-[#D4AF37]/20 to-transparent rounded-l-[24px]" />
                  <p className="text-[9px] font-bold tracking-[0.45em] text-[#D4AF37]/40 uppercase">
                    {mission.task_type} · {mission.duration_minutes}분
                  </p>
                  <p className="text-[#D4AF37] text-base font-black leading-snug text-left">
                    {mission.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${i < mission.difficulty ? "bg-[#D4AF37]/50" : "bg-[#D4AF37]/10"}`}
                      />
                    ))}
                    <span className="text-[9px] text-[#D4AF37]/30 font-bold ml-1">난이도</span>
                  </div>
                </div>

                <button
                  onClick={handleMissionComplete}
                  className="w-full py-4 border border-[#D4AF37]/30 rounded-2xl text-[11px] font-black text-[#D4AF37]/70 tracking-[0.3em] uppercase hover:border-[#D4AF37]/60 hover:text-[#D4AF37] transition-all"
                >
                  완료
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-[#D4AF37]/20" />
                <p className="text-[#D4AF37]/30 text-xs font-medium tracking-wide">
                  오늘 배정된 미션이 없습니다.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Asset widget — bottom right corner */}
      <AnimatePresence>
        {assetValue > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="absolute bottom-8 right-8"
          >
            <div className="flex flex-col items-end gap-1">
              <p className="text-[8px] font-bold tracking-widest text-[#D4AF37]/25 uppercase">
                오늘 {userName || "대표님"}이 방어한 인지적 자산
              </p>
              <p className="text-[#D4AF37]/50 text-sm font-black font-mono tracking-tight">
                ₩{assetValue.toLocaleString()}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback modal */}
      {mission && (
        <QuickFeedbackModal
          isOpen={feedbackOpen}
          missionTitle={mission.title}
          onSubmit={handleFeedbackSubmit}
          onClose={() => setFeedbackOpen(false)}
        />
      )}
    </div>
  );
}
