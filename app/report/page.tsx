"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";

type ReportRow = {
  condition: string;
  day_of_week: number;
  task_type: string;
  difficulty_rating: number | null;
  status: string;
  created_at: string;
};

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function ReportPage() {
  const router = useRouter();
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [userName, setUserName] = useState("");
  const [tab, setTab] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 📌 profiles 테이블의 실제 컬럼명인 hourly_wage를 반영했습니다.
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, hourly_wage")
        .eq("id", user.id)
        .single();
      
      if (profile) {
        setHourlyRate(profile.hourly_wage || 0);
        setUserName(profile.full_name || "");
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: reportData } = await supabase
        .from("daily_reports")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: false });

      if (reportData) setReports(reportData as ReportRow[]);
    };
    fetchData();
  }, []);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const weeklyReports = reports.filter((r) => new Date(r.created_at) >= sevenDaysAgo);
  const completedMonthly = reports.filter((r) => r.status === "COMPLETED");
  
  const hoursRecovered = Math.round((completedMonthly.length * 15) / 60 * 10) / 10;
  const cashRecovered = Math.floor(hoursRecovered * hourlyRate);

  const dayStats = Array.from({ length: 7 }, (_, day) => {
    const dayReports = weeklyReports.filter((r) => r.day_of_week === day);
    const completed = dayReports.filter((r) => r.status === "COMPLETED").length;
    const rate = dayReports.length > 0 ? completed / dayReports.length : 0;
    return { day, total: dayReports.length, completed, rate };
  });

  const weakestDay = dayStats.filter(d => d.total > 0).reduce((min, d) => d.rate < min.rate ? d : min, dayStats[0]);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-pretendard px-6 py-10 selection:bg-[#C2A35D] selection:text-black">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">

        <header className="flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-zinc-600 hover:text-white transition-colors text-[10px] font-bold tracking-widest uppercase"
          >
            <ArrowLeft size={13} /> Dashboard
          </button>
          <div className="text-right">
            <p className="text-[#C2A35D] text-sm font-black italic tracking-tight uppercase font-serif">System Report</p>
            <p className="text-[10px] text-zinc-600 tracking-widest uppercase">
              {userName ? `${userName} Member` : "Performance Analysis"}
            </p>
          </div>
        </header>

        <div className="flex gap-2">
          {(["weekly", "monthly"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${
                tab === t ? "bg-[#C2A35D] text-black" : "border border-zinc-900 text-zinc-600 hover:text-zinc-300"
              }`}
            >
              {t === "weekly" ? "주간 보고서" : "월간 보고서"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 space-y-2">
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">대신 내린 결정</p>
            <p className="text-3xl font-black text-[#C2A35D]">{completedMonthly.length}건</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 space-y-2">
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">절약된 시간</p>
            <p className="text-3xl font-black text-[#C2A35D]">{hoursRecovered}시간</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 space-y-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">회수된 자산 가치</p>
            <p className="text-3xl font-black text-[#C2A35D]">₩{cashRecovered.toLocaleString()}</p>
          </div>
        </div>

        {tab === "weekly" && weakestDay.total > 0 && (
          <div className="bg-[#080808] border border-[#C2A35D]/20 rounded-3xl p-8 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C2A35D]/30 to-transparent"></div>
            <p className="text-[10px] font-bold text-[#C2A35D] uppercase tracking-widest italic font-serif">AI Intervention</p>
            <p className="text-zinc-200 text-lg font-light leading-relaxed break-keep">
              &quot;대표님은 <span className="text-white font-bold">{DAY_LABELS[weakestDay.day]}요일</span>에 결정 피로도가 가장 높습니다. 
              이번 주 해당 요일에는 뇌를 거의 쓰지 않는 <span className="text-white font-bold">단순 검토 업무</span>만 배정하여 번아웃을 방어하겠습니다.&quot;
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
