"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { ArrowLeft } from "lucide-react";

type SessionRow = {
  condition: string;
  day_of_week: number;
  time_slot: number;
  task_type: string;
  difficulty_rating: number | null;
  completed: boolean;
  created_at: string;
};

type Tab = "weekly" | "monthly";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function ReportPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [hourlyValue, setHourlyValue] = useState(0);
  const [userName, setUserName] = useState("");
  const [tab, setTab] = useState<Tab>("weekly");

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, hourly_value")
        .eq("id", user.id)
        .single();
      if (profile?.hourly_value) setHourlyValue(profile.hourly_value);
      if (profile?.full_name) setUserName(profile.full_name);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: sessionData } = await supabase
        .from("sessions")
        .select("condition, day_of_week, time_slot, task_type, difficulty_rating, completed, created_at")
        .eq("user_id", user.id)
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: false });

      if (sessionData) setSessions(sessionData as SessionRow[]);
    };
    fetchData();
  }, []);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const weeklySessions = sessions.filter((s) => new Date(s.created_at) >= sevenDaysAgo);
  const monthlySessions = sessions;

  const completedMonthly = monthlySessions.filter((s) => s.completed);
  const totalDecisions = completedMonthly.length;
  const avgMinutesPerDecision = 15;
  const hoursRecovered = Math.round((totalDecisions * avgMinutesPerDecision) / 60 * 10) / 10;
  const cashRecovered = Math.floor(hoursRecovered * hourlyValue);

  const dayStats = Array.from({ length: 7 }, (_, day) => {
    const daySessions = weeklySessions.filter((s) => s.day_of_week === day);
    const completed = daySessions.filter((s) => s.completed).length;
    const rate = daySessions.length > 0 ? completed / daySessions.length : 0;
    return { day, total: daySessions.length, completed, rate };
  });

  const withData = dayStats.filter((d) => d.total > 0);
  const weakestDay = withData.length > 0
    ? withData.reduce((min, d) => d.rate < min.rate ? d : min)
    : null;
  const strongestDay = withData.length > 0
    ? withData.reduce((max, d) => d.rate > max.rate ? d : max)
    : null;

  const weeklyCompleted = weeklySessions.filter((s) => s.completed).length;

  const avgDifficulty = monthlySessions.length > 0
    ? (monthlySessions.reduce((sum, s) => sum + (s.difficulty_rating ?? 3), 0) / monthlySessions.length).toFixed(1)
    : "—";

  const topTaskType = (() => {
    const counts: Record<string, number> = {};
    monthlySessions.forEach((s) => { counts[s.task_type] = (counts[s.task_type] ?? 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] ?? "—";
  })();

  const topCondition = (() => {
    const counts: Record<string, number> = {};
    monthlySessions.forEach((s) => { counts[s.condition] = (counts[s.condition] ?? 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const map: Record<string, string> = { tired: "피곤함", normal: "보통", good: "최상" };
    return map[sorted[0]?.[0]] ?? "—";
  })();

  const completionRate = monthlySessions.length > 0
    ? `${Math.round((completedMonthly.length / monthlySessions.length) * 100)}%`
    : "—";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans px-6 py-10">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">

        <header className="flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-100 transition-colors text-[10px] font-bold tracking-widest uppercase"
          >
            <ArrowLeft size={13} /> Dashboard
          </button>
          <div className="text-right">
            <p className="text-[#D4AF37] text-sm font-black italic tracking-tight">SYSTEM REPORT</p>
            <p className="text-[10px] text-zinc-600 tracking-widest uppercase">
              {userName ? `${userName} 대표님` : "Performance Analysis"}
            </p>
          </div>
        </header>

        <div className="flex gap-2">
          {(["weekly", "monthly"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${
                tab === t
                  ? "bg-[#D4AF37] text-[#0a0a0a]"
                  : "border border-zinc-800 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t === "weekly" ? "주간 리포트" : "월간 리포트"}
            </button>
          ))}
        </div>

        {tab === "weekly" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "이번 주 완료 미션", value: `${weeklyCompleted}건` },
                { label: "최강 요일", value: strongestDay ? DAY_LABELS[strongestDay.day] + "요일" : "—" },
                { label: "취약 요일", value: weakestDay ? DAY_LABELS[weakestDay.day] + "요일" : "—" },
                { label: "평균 난이도", value: avgDifficulty },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-1.5"
                >
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{label}</p>
                  <p className="text-xl font-black text-[#D4AF37]">{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-5">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">요일별 완료율</p>
              <div className="flex justify-between gap-2 items-end" style={{ height: "80px" }}>
                {dayStats.map(({ day, rate, total }) => (
                  <div key={day} className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-full flex flex-col justify-end" style={{ height: "60px" }}>
                      <div
                        className={`w-full rounded-lg transition-all duration-700 ${total > 0 ? "bg-[#D4AF37]" : "bg-zinc-800"}`}
                        style={{ height: `${total > 0 ? Math.max(8, rate * 100) : 8}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-zinc-600">{DAY_LABELS[day]}</span>
                  </div>
                ))}
              </div>
            </div>

            {weakestDay && weakestDay.total > 0 && (
              <div className="bg-[#0f0f0f] border border-[#D4AF37]/20 rounded-2xl p-7 flex flex-col gap-4">
                <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">
                  Predictive Intervention
                </p>
                <blockquote className="text-zinc-200 text-[15px] font-semibold leading-relaxed">
                  "최근 3주 데이터를 보니, 대표님은{" "}
                  <strong className="text-white">{DAY_LABELS[weakestDay.day]}요일</strong>에 멘탈이 가장 취약합니다.
                  이번 주 {DAY_LABELS[weakestDay.day]}요일엔 하드 워크 대신{" "}
                  <strong className="text-white">단순 리서치 또는 검토 과업만</strong> 배정하겠습니다."
                </blockquote>
              </div>
            )}
          </div>
        )}

        {tab === "monthly" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "시스템이 대신 내린 결정", value: `${totalDecisions}건` },
                { label: "절약된 뇌 에너지", value: `${hoursRecovered}시간` },
                { label: "회수된 현금 가치", value: `₩${cashRecovered.toLocaleString()}` },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-7 flex flex-col gap-2"
                >
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{label}</p>
                  <p className="text-3xl font-black font-mono text-[#D4AF37] tracking-tighter leading-none">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-[#0f0f0f] border border-zinc-800 rounded-2xl p-7 flex flex-col gap-5">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">수치 증명 — 이번 달</p>
              <div className="flex flex-col divide-y divide-zinc-900">
                {[
                  { label: "시스템이 처리한 결정", val: `${totalDecisions}건` },
                  { label: "미션당 평균 절약 시간", val: `${avgMinutesPerDecision}분` },
                  { label: "절약된 총 뇌 에너지", val: `${hoursRecovered}시간` },
                  { label: "시간당 인지적 가치", val: `₩${hourlyValue.toLocaleString()}` },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between items-center py-3">
                    <span className="text-sm text-zinc-500">{label}</span>
                    <span className="text-sm font-bold text-zinc-200">{val}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm font-black text-zinc-200">회수된 현금 가치 합계</span>
                  <span className="text-xl font-black text-[#D4AF37]">₩{cashRecovered.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-5">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">6차원 데이터 분포</p>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: "완료율", value: completionRate },
                  { label: "최다 과업 유형", value: topTaskType },
                  { label: "최다 컨디션", value: topCondition },
                  { label: "평균 피드백 점수", value: `${avgDifficulty}점` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">{label}</p>
                    <p className="text-base font-black text-zinc-300">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
