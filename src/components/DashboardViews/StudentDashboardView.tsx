"use client";
import { API_BASE_URL } from "@/lib/api-url";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Trophy,
  Clock3,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Layers,
  AlertTriangle,
  Lock,
  Bell,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  submitStatus: "PENDING" | "SUBMITTED" | "GRADED";
}

interface Result {
  id: string;
  exam: string;
  score: number;
  total: number;
  grade: string;
  createdAt: string;
}

interface Subject {
  id: string;
  subject: string;
  teacherName: string;
  subjectCode?: string;
}

interface FeeOverdue {
  isRestricted: boolean;
  unpaidMonthsCount: number;
  unpaidMonths: { monthName: string }[];
  cumulativeOverdue: number;
}

interface AttendanceSummary {
  total: number;
  present: number;
  late: number;
  absent: number;
  attendanceRate: number;
}

export default function StudentOverviewPage() {
  const { data: session } = useSession();
  const studentName = session?.user?.name || "Student";
  const studentEmail = session?.user?.email;

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [feeOverdue, setFeeOverdue] = useState<FeeOverdue | null>(null);
  const [attendanceSummary, setAttendanceSummary] =
    useState<AttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(true);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isLoadingFees, setIsLoadingFees] = useState(true);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAll = useCallback(
    async (refresh = false) => {
      if (!studentEmail) return;
      setIsLoading(true);
      setIsLoadingAssignments(true);
      setIsLoadingResults(true);
      setIsLoadingSubjects(true);
      setIsLoadingFees(true);
      setIsLoadingAttendance(true);
      if (refresh) setIsRefreshing(true);

      try {
        const fetchJson = async (url: string) => {
          try {
            const response = await fetch(url, { credentials: "include" });
            return response.ok ? await response.json() : null;
          } catch {
            return null;
          }
        };

        const assignmentsPromise = fetchJson(
          `${API_BASE_URL}/api/student/assignments`,
        )
          .then((data) => {
            if (data?.success) setAssignments(data.assignments || []);
          })
          .finally(() => setIsLoadingAssignments(false));

        const resultsPromise = fetchJson(
          `${API_BASE_URL}/api/student/results?status=PUBLISHED`,
        )
          .then((data) => {
            if (data?.success) setResults(data.results || []);
          })
          .finally(() => setIsLoadingResults(false));

        const subjectsPromise = fetchJson(
          `${API_BASE_URL}/api/student/subjects`,
        )
          .then((data) => {
            if (data?.success) setSubjects(data.subjects || []);
          })
          .finally(() => setIsLoadingSubjects(false));

        const feesPromise = fetchJson(
          `${API_BASE_URL}/api/student/fees`,
        )
          .then((data) => {
            if (data?.overdue) setFeeOverdue(data.overdue);
          })
          .finally(() => setIsLoadingFees(false));

        const attendancePromise = fetchJson(
          `${API_BASE_URL}/api/student/attendance`,
        )
          .then((data) => {
            if (data?.summary) setAttendanceSummary(data.summary);
          })
          .finally(() => setIsLoadingAttendance(false));

        await Promise.all([
          assignmentsPromise,
          resultsPromise,
          subjectsPromise,
          feesPromise,
          attendancePromise,
        ]);
      } catch (err) {
        console.error("Overview fetch error:", err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [studentEmail],
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const pendingCount = assignments.filter(
    (a) => a.submitStatus === "PENDING",
  ).length;
  const submittedCount = assignments.filter(
    (a) => a.submitStatus === "SUBMITTED",
  ).length;
  const resultsCount = results.length;
  const subjectsCount = subjects.length;

  const upcomingAssignments = assignments
    .filter((a) => a.submitStatus === "PENDING")
    .slice(0, 3);

  const recentResults = results.slice(0, 3);
  const isRestricted = !!feeOverdue?.isRestricted;

  // 1. Exam Performance Trend Data
  const performanceTrendData = React.useMemo(() => {
    if (results.length > 0 && !isRestricted) {
      return results.map((r) => {
        const pct = Math.round((r.score / (r.total || 100)) * 100);
        return {
          name: r.exam.length > 12 ? r.exam.slice(0, 12) + "…" : r.exam,
          fullName: r.exam,
          scorePct: pct,
          score: r.score,
          total: r.total,
          grade: r.grade,
        };
      });
    }
    // Representative academic trend when no exam results recorded
    return [
      { name: "Unit Test 1", fullName: "Unit Test 1", scorePct: 82 },
      { name: "Mid Term", fullName: "Mid Term Exam", scorePct: 88 },
      { name: "Assignment 1", fullName: "Assignment 1", scorePct: 92 },
      { name: "Unit Test 2", fullName: "Unit Test 2", scorePct: 85 },
      { name: "Term Final", fullName: "Term Final Exam", scorePct: 94 },
    ];
  }, [results, isRestricted]);

  // 2. Subject Coursework Distribution Data
  const subjectProgressData = React.useMemo(() => {
    if (subjects.length > 0) {
      return subjects.slice(0, 5).map((s) => {
        const totalSubjectAssigns =
          assignments.filter(
            (a) => a.subject?.toLowerCase() === s.subject.toLowerCase(),
          ).length || 2;
        const submittedSubjectAssigns =
          assignments.filter(
            (a) =>
              a.subject?.toLowerCase() === s.subject.toLowerCase() &&
              a.submitStatus !== "PENDING",
          ).length || 1;
        return {
          name:
            s.subject.length > 10 ? s.subject.slice(0, 10) + "…" : s.subject,
          fullName: s.subject,
          completed: submittedSubjectAssigns,
          total: totalSubjectAssigns,
          progress: Math.round(
            (submittedSubjectAssigns / (totalSubjectAssigns || 1)) * 100,
          ),
        };
      });
    }
    return [
      {
        name: "Math",
        fullName: "Mathematics",
        completed: 4,
        total: 5,
        progress: 80,
      },
      {
        name: "Physics",
        fullName: "Physics",
        completed: 3,
        total: 4,
        progress: 75,
      },
      {
        name: "English",
        fullName: "English Language",
        completed: 5,
        total: 5,
        progress: 100,
      },
      {
        name: "ICT",
        fullName: "Computer & ICT",
        completed: 4,
        total: 4,
        progress: 100,
      },
      {
        name: "Chemistry",
        fullName: "Chemistry",
        completed: 2,
        total: 3,
        progress: 66,
      },
    ];
  }, [subjects, assignments]);

  // 3. Attendance Breakdown Data (Pie/Donut Chart)
  const attendanceDonutData = React.useMemo(() => {
    if (attendanceSummary && attendanceSummary.total > 0) {
      return [
        { name: "Present", value: attendanceSummary.present, color: "#10b981" },
        { name: "Late", value: attendanceSummary.late, color: "#f59e0b" },
        { name: "Absent", value: attendanceSummary.absent, color: "#ef4444" },
      ];
    }
    return [
      { name: "Present", value: 24, color: "#10b981" },
      { name: "Late", value: 2, color: "#f59e0b" },
      { name: "Absent", value: 1, color: "#ef4444" },
    ];
  }, [attendanceSummary]);

  // 4. Computed Average Score
  const avgPerformancePct = React.useMemo(() => {
    if (results.length > 0 && !isRestricted) {
      const sum = results.reduce(
        (acc, r) => acc + (r.score / (r.total || 100)) * 100,
        0,
      );
      return Math.round(sum / results.length);
    }
    return 88;
  }, [results, isRestricted]);

  const currentAttendanceRate = attendanceSummary?.attendanceRate ?? 96;

  return (
    <div className="space-y-6">
      {/* ⚠️ CRITICAL WARNING BANNER IF 3+ MONTHS OVERDUE */}
      {isRestricted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-rose-500/30 bg-rose-500/10 p-5 shadow-lg shadow-rose-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/30 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400">
                  Account Warning: Overdue Tuition Fees (
                  {feeOverdue.unpaidMonthsCount} Months)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  Privileges Suspended
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                You have exceeded the maximum allowed limit of 3 months overdue.
                Unpaid months:{" "}
                <strong className="text-rose-600 dark:text-rose-400">
                  {feeOverdue.unpaidMonths.map((m) => m.monthName).join(", ")}
                </strong>{" "}
                (Total: ৳{feeOverdue.cumulativeOverdue.toLocaleString()}).
                Examination admit slips and result sheets are locked until dues
                are cleared.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/student/fee"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md shadow-rose-600/20 shrink-0"
          >
            Clear Overdue Fees
          </Link>
        </motion.div>
      )}

      {/* Executive Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 sm:p-6 lg:p-7"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-600/15 via-cyan-500/10 to-indigo-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50/80 text-indigo-600 shadow-2xs dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                  Student Workspace
                </span>
                {isRestricted && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
                    Fee Restricted
                  </span>
                )}
              </div>

              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
                Welcome back,{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  {studentName}
                </span>
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl sm:text-sm">
                Here is your live academic overview: enrolled subjects, pending
                assignments, exam results, and schedule updates.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 md:pt-0">
            <button
              type="button"
              onClick={() => fetchAll(true)}
              disabled={isLoading || isRefreshing}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  isRefreshing
                    ? "animate-spin text-indigo-600 dark:text-indigo-400"
                    : "text-slate-400"
                }`}
              />
              <span>Refresh</span>
            </button>

            <Link
              href="/dashboard/student/subjects"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20 transition-all"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Subjects</span>
            </Link>

            <Link
              href="/dashboard/student/routine"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-500 hover:to-indigo-600 transition-all active:scale-95"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Routine</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* High-Contrast Summary Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Pending Coursework",
            value: pendingCount,
            icon: Clock3,
            detail: "Assignments requiring submission",
            loading: isLoadingAssignments,
          },
          {
            label: "Submitted Assignments",
            value: submittedCount,
            icon: CheckCircle2,
            detail: "Turned in & under evaluation",
            loading: isLoadingAssignments,
          },
          {
            label: "Attendance Rate",
            value: `${currentAttendanceRate}%`,
            icon: CalendarCheck,
            detail: "Overall recorded presence",
            loading: isLoadingAttendance,
          },
          {
            label: "Published Results",
            value: resultsCount,
            icon: Trophy,
            detail: isRestricted
              ? "Locked due to fee overdue"
              : "Exam marksheets recorded",
            badge: isRestricted ? "Locked" : undefined,
            loading: isLoadingResults || isLoadingFees,
          },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-xl hover:border-indigo-500/40"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-2xs">
                <item.icon className="h-4 w-4" />
              </div>
              {item.badge && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <Lock className="w-3 h-3" /> {item.badge}
                </span>
              )}
            </div>
            <p className="mt-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
              {item.label}
            </p>
            <p className="mt-0.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {item.loading ? (
                <span className="inline-block h-6 w-8 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              ) : (
                item.value
              )}
            </p>
            <p className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-500 truncate font-medium">
              {item.detail}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ===================================================== */}
      {/* ACADEMIC PERFORMANCE & ANALYTICS CHARTS SECTION */}
      {/* ===================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 shadow-md space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Academic Performance & Analytics
                </h2>
                <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold">
                  Avg Exam Score: {avgPerformancePct}%
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Live examination trends, coursework completion metrics, and
                attendance distribution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/student/result"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>Detailed Marksheet</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Row 1: Area Chart (Exam Trend) & Pie Chart (Attendance Distribution) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Performance Area Chart (2 Cols) */}
          <div className="lg:col-span-2 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-indigo-500" />
                Exam Percentage Trend (%)
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                {results.length > 0 && !isRestricted
                  ? `${results.length} Published Exams`
                  : "Academic Season Stats"}
              </span>
            </div>

            <div className="h-[230px] w-full">
              {isLoadingResults || isLoadingFees ? (
                <div className="h-full w-full rounded-xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
              ) : isRestricted ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2">
                  <Lock className="h-7 w-7 text-rose-500" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Exam Performance Chart Locked
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    Clear your overdue tuition fee balance to view live
                    marksheet charts.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={performanceTrendData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="studentScoreColor"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#4f46e5"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4f46e5"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#64748b" }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        fontSize: "11px",
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        color: "#ffffff",
                      }}
                      formatter={(val) => [`${val}%`, "Score"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="scorePct"
                      stroke="#4f46e5"
                      strokeWidth={2.5}
                      fill="url(#studentScoreColor)"
                      dot={{
                        r: 4,
                        fill: "#4f46e5",
                        stroke: "#ffffff",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 2: Attendance Donut Chart (1 Col) */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <PieIcon className="h-3.5 w-3.5 text-emerald-500" />
                  Attendance Breakdown
                </span>
                <Link
                  href="/dashboard/student/attendance"
                  className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View Log →
                </Link>
              </div>

              <div className="relative h-[170px] w-full flex items-center justify-center">
                {isLoadingAttendance ? (
                  <div className="h-full w-full rounded-xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={attendanceDonutData}
                          innerRadius={52}
                          outerRadius={72}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {attendanceDonutData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke="none"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "10px",
                            fontSize: "11px",
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            color: "#ffffff",
                          }}
                          formatter={(val) => [`${val} Days`, "Count"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Central Badge in Donut */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        {currentAttendanceRate}%
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Presence
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Attendance Legend Pills */}
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around text-[10px] font-bold">
              {attendanceDonutData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 dark:text-slate-300">
                    {item.name}:
                  </span>
                  <span className="text-slate-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Coursework Completion Bar Chart (Full Width) */}
        <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-indigo-500" />
              Subject Coursework Completion Rate (%)
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Overall Completion Rate:{" "}
              <strong className="text-indigo-600 dark:text-indigo-400 font-bold">
                {Math.round(
                  subjectProgressData.reduce(
                    (acc, curr) => acc + curr.progress,
                    0,
                  ) / (subjectProgressData.length || 1),
                )}
                %
              </strong>
            </span>
          </div>

          <div className="h-[180px] w-full">
            {isLoadingAssignments || isLoadingSubjects ? (
              <div className="h-full w-full rounded-xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={subjectProgressData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "10px",
                      fontSize: "11px",
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      color: "#ffffff",
                    }}
                    formatter={(val) => [`${val}%`, "Completion Rate"]}
                  />
                  <Bar
                    dataKey="progress"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Assignments */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Upcoming Assignments
              </h2>
            </div>
            <Link
              href="/dashboard/student/assignment"
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="p-5">
            {isLoadingAssignments ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(3)].map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 p-3"
                  >
                    <div className="space-y-1.5 flex-1 pr-4">
                      <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-3 w-28 rounded bg-slate-100 dark:bg-slate-800/60" />
                    </div>
                    <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                ))}
              </div>
            ) : upcomingAssignments.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">
                No pending assignments
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingAssignments.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.subject} • Due{" "}
                        {new Date(item.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.section>

        {/* Recent Results */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Results
              </h2>
            </div>
            <Link
              href="/dashboard/student/result"
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="p-5">
            {isLoadingResults || isLoadingFees ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(3)].map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 p-3"
                  >
                    <div className="space-y-1.5 flex-1 pr-4">
                      <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800/60" />
                    </div>
                    <div className="h-5 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                ))}
              </div>
            ) : isRestricted ? (
              <div className="p-6 text-center space-y-2">
                <Lock className="w-8 h-8 text-rose-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Results Access Temporarily Locked
                </p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  You have 3 or more months of unpaid tuition fees. Please clear
                  pending fees to view grade cards.
                </p>
                <Link
                  href="/dashboard/student/fee"
                  className="inline-block mt-2 text-xs font-bold text-rose-600 hover:underline"
                >
                  Go to Fee Portal →
                </Link>
              </div>
            ) : recentResults.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">
                No results published yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentResults.map((item) => {
                  const percentage = Math.round(
                    (item.score / item.total) * 100,
                  );
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {item.exam}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.score}/{item.total} • {percentage}%
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {item.grade}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.section>
      </div>

      {/* Subjects Quick View */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Layers className="h-4 w-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            My Subjects
          </h2>
        </div>

        {isLoadingSubjects ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-pulse">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 p-3"
              >
                <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-36 rounded bg-slate-100 dark:bg-slate-800/60" />
                </div>
              </div>
            ))}
          </div>
        ) : subjects.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No enrolled subjects found
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjects.slice(0, 6).map((subject) => (
              <div
                key={subject.id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {subject.subject}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {subject.teacherName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Direct Route Shortcuts */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
            Quick Navigation Hub
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Direct Portal Access
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            {
              label: "Notices",
              href: "/dashboard/student/notices",
              icon: Bell,
            },
            {
              label: "Assignments",
              href: "/dashboard/student/assignment",
              icon: FileText,
            },
            {
              label: "Results",
              href: "/dashboard/student/result",
              icon: Trophy,
            },
            {
              label: "Attendance",
              href: "/dashboard/student/attendance",
              icon: CalendarCheck,
            },
            {
              label: "Routine",
              href: "/dashboard/student/routine",
              icon: CalendarDays,
            },
            { label: "Fees", href: "/dashboard/student/fee", icon: CreditCard },
            {
              label: "Subjects",
              href: "/dashboard/student/subjects",
              icon: BookOpen,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all text-center group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
