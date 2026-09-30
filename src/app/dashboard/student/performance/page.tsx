"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  Sparkles,
  CalendarCheck,
  Award,
  FileText,
  Wand2,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type StudentPace = "ON_TRACK" | "BUILDING" | "GROWING" | "GETTING_STARTED";

interface PerformanceSnapshot {
  studentName: string;
  pace: StudentPace;
  attendanceRate: number | null;
  averageScorePercent: number | null;
  assignmentCompletionRate: number | null;
}

const paceStyles: Record<
  StudentPace,
  { label: string; className: string; dot: string }
> = {
  ON_TRACK: {
    label: "Going Strong",
    className:
      "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
    dot: "bg-emerald-500",
  },
  BUILDING: {
    label: "Keep Building",
    className:
      "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/60",
    dot: "bg-sky-500",
  },
  GROWING: {
    label: "Room to Grow",
    className:
      "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60",
    dot: "bg-indigo-500",
  },
  GETTING_STARTED: {
    label: "Getting Started",
    className:
      "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
  },
};

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl hover:border-indigo-500/40"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-2xs">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <p className="mt-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
        {label}
      </p>

      <p className="mt-0.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">{value}</p>

      {detail && (
        <p className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-500 truncate font-medium">{detail}</p>
      )}
    </motion.div>
  );
}

function PerformanceSkeleton() {
  return (
    <div className="space-y-6">
      {/* AI Insights Banner Skeleton */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 animate-pulse">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-5 w-36 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-9 w-40 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="mt-4 h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 animate-pulse space-y-3"
          >
            <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-7 w-16 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-2.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 animate-pulse space-y-4">
          <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-64 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-56 w-full rounded-xl bg-slate-100 dark:bg-slate-900/60" />
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 animate-pulse space-y-4">
          <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-48 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-48 w-full rounded-xl bg-slate-100 dark:bg-slate-900/60" />
        </div>
      </div>
    </div>
  );
}

export default function StudentPerformancePage() {
  const { isPending: isSessionLoading } = useSession();
  const [snapshot, setSnapshot] = useState<PerformanceSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const hasFetched = useRef(false);

  const [insight, setInsight] = useState<string | null>(null);
  const [insightSource, setInsightSource] = useState<"groq" | "fallback" | null>(null);
  const [insightError, setInsightError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchSnapshot = async (refresh = false) => {
    try {
      setIsLoading(true);
      if (refresh) setIsRefreshing(true);
      setError("");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/performance`,
        { credentials: "include" }
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load your performance snapshot.");
      }

      setSnapshot(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load your performance snapshot.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isSessionLoading || hasFetched.current) return;
    hasFetched.current = true;
    fetchSnapshot();
  }, [isSessionLoading]);

  const handleGenerateInsight = async () => {
    setIsGenerating(true);
    setInsightError("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/performance/insight`,
        { method: "POST", credentials: "include" }
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not generate an insight right now.");
      }

      setInsight(data.insight);
      setInsightSource(data.source ?? null);
    } catch (err: any) {
      console.error(err);
      setInsightError(err.message || "Could not generate an insight right now.");
    } finally {
      setIsGenerating(false);
    }
  };

  const status = snapshot
    ? paceStyles[snapshot.pace] ?? paceStyles.GETTING_STARTED
    : null;

  const chartRows = snapshot
    ? [
        { name: "Attendance", value: snapshot.attendanceRate, fill: "#6366f1" },
        { name: "Avg. score", value: snapshot.averageScorePercent, fill: "#10b981" },
        { name: "Assignments", value: snapshot.assignmentCompletionRate, fill: "#f59e0b" },
      ].filter((row): row is { name: string; value: number; fill: string } => row.value !== null)
    : [];

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 sm:p-6 lg:p-7"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-600/15 via-rose-500/10 to-indigo-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-rose-100 bg-rose-50/80 text-rose-600 shadow-2xs dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
              <HeartPulse className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  Student Workspace
                </span>
              </div>

              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
                My Performance Metrics
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl sm:text-sm">
                A quick read on your attendance, examination scores, coursework completion, and AI guidance insights.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => fetchSnapshot(true)}
              disabled={isLoading || isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isRefreshing
                    ? "animate-spin text-indigo-600 dark:text-indigo-400"
                    : "text-slate-400"
                }`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </motion.div>

      {isLoading || isRefreshing ? (
        <PerformanceSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 mb-4 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Unable to load performance metrics
          </h3>
          <p className="max-w-md text-xs text-slate-500 dark:text-slate-400 mb-4">
            {error}
          </p>
          <button
            onClick={() => fetchSnapshot(true)}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
          >
            Try again
          </button>
        </div>
      ) : snapshot && status ? (
        <>
          {/* AI Insights & Pace Banner */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Academic Momentum
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${status.className}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>

              <button
                type="button"
                onClick={handleGenerateInsight}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer shrink-0"
              >
                {isGenerating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Wand2 className="h-3.5 w-3.5" />
                )}
                {insight ? "Regenerate My Insight" : "Generate My Insight"}
              </button>
            </div>

            <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
              These numbers reflect your active database metrics. Use the AI insight feature for feedback and study suggestions.
            </p>

            <AnimatePresence>
              {insight && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 p-3.5">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5">
                      <Sparkles className="h-3 w-3" />
                      Your Personalized Note
                    </p>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {insight}
                    </p>
                    {insightSource === "fallback" && (
                      <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
                        Generated automatically from your numbers.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {insightError && (
              <p className="mt-2 text-[11px] text-rose-500 dark:text-rose-400">{insightError}</p>
            )}
          </div>

          {/* High-Contrast Stat Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={HeartPulse}
              label="Overall Pace"
              value={status.label}
              detail="Academic trajectory"
            />
            <StatCard
              icon={CalendarCheck}
              label="Attendance Rate"
              value={
                snapshot.attendanceRate !== null ? `${snapshot.attendanceRate}%` : "Not recorded"
              }
              detail="Recorded presence"
            />
            <StatCard
              icon={Award}
              label="Average Score"
              value={
                snapshot.averageScorePercent !== null
                  ? `${snapshot.averageScorePercent}%`
                  : "Not recorded"
              }
              detail="Exam mark average"
            />
            <StatCard
              icon={FileText}
              label="Assignment Completion"
              value={
                snapshot.assignmentCompletionRate !== null
                  ? `${snapshot.assignmentCompletionRate}%`
                  : "Not recorded"
              }
              detail="Turned in courseworks"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs p-5 sm:p-6">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Performance analysis</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Attendance, published exam scores, and assignment completion side by side.
              </p>
              {chartRows.length === 0 ? (
                <p className="mt-8 text-xs text-slate-500 dark:text-slate-400">
                  Your chart will fill in once attendance or a published result is on record.
                </p>
              ) : (
                <div className="mt-4 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartRows} barSize={36}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip
                        cursor={{ fill: "transparent" }}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#1e293b",
                          borderRadius: "0.75rem",
                          color: "#f8fafc",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                        }}
                        itemStyle={{ color: "#f8fafc" }}
                        labelStyle={{ color: "#94a3b8", fontWeight: 600 }}
                        formatter={(value) => [`${value}%`, "Rate"]}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {chartRows.map((row) => (
                          <Cell key={row.name} fill={row.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs p-5 sm:p-6">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Overall mix</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Same colors as the bars: attendance, average score, and assignments.
              </p>
              {chartRows.length === 0 ? (
                <p className="mt-8 text-xs text-slate-500 dark:text-slate-400">
                  Not enough recorded numbers for a mix yet.
                </p>
              ) : (
                <div className="mt-2">
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartRows.map((row) => ({
                            name: row.name,
                            value: Math.max(row.value, 0.5),
                            display: row.value,
                            fill: row.fill,
                          }))}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={48}
                          outerRadius={72}
                          paddingAngle={3}
                        >
                          {chartRows.map((row) => (
                            <Cell key={row.name} fill={row.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#1e293b",
                            borderRadius: "0.75rem",
                            color: "#f8fafc",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                          }}
                          itemStyle={{ color: "#f8fafc" }}
                          labelStyle={{ color: "#94a3b8", fontWeight: 600 }}
                          formatter={(_value, _name, item) => {
                            const display = (item?.payload as { display?: number } | undefined)?.display;
                            return [`${display ?? 0}%`, "Rate"];
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {chartRows.map((row) => (
                      <div
                        key={row.name}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100"
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-sm"
                          style={{ backgroundColor: row.fill }}
                        />
                        {row.name}: {row.value}%
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
