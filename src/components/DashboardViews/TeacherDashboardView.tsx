"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  CalendarCheck,
  FileText,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Award,
  Megaphone,
  Plus,
  Search,
  Calendar,
  CheckSquare,
  MapPin,
  RefreshCw,
  ChevronRight,
  SlidersHorizontal,
  Database,
  GraduationCap,
  Hash,
  Mail,
  PieChart,
  BarChart3,
  FileCheck,
  FileCode,
  Bell,
  Activity,
  Hourglass,
  Command,
  User,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useSession } from "@/lib/auth-client";
import {
  getTeacherRequestsAction,
  ClassSubjectRequestItem,
} from "@/lib/actions/teacher.request";
import {
  getTeacherStudentsAction,
  StudentUser,
} from "@/lib/actions/teacher-students";
import { getTeacherExamsAction, ExamItem } from "@/lib/actions/teacher.exam";
import { getNoticesAction, NoticeItem } from "@/lib/actions/teacher.notice";
import type { Result } from "@/components/shared/ResultList";

/* ========================================================= */
/* MAIN COMPONENT */
/* ========================================================= */

interface AttendanceStatsData {
  totalStudents: number;
  presentCount: number;
  presentRate: string;
  lateCount: number;
  lateRate: string;
  absentCount: number;
  absentRate: string;
  weeklyAttendance: { day: string; attendance: number }[];
  classAttendance: { name: string; attendance: number }[];
  distributionData: { name: string; value: number }[];
}

export default function TeacherDashboardView() {
  const { data: session } = useSession();
  const teacherEmail = session?.user?.email || "";
  const teacherName = session?.user?.name || "Teacher";

  // Real Data States
  const [assignedClassesCount, setAssignedClassesCount] = useState<number>(0);
  const [approvedRequests, setApprovedRequests] = useState<ClassSubjectRequestItem[]>([]);
  const [totalStudentsCount, setTotalStudentsCount] = useState<number>(0);
  const [studentsList, setStudentsList] = useState<StudentUser[]>([]);
  const [studentSearch, setStudentSearch] = useState<string>("");
  const [assignmentsCount, setAssignmentsCount] = useState<{ total: number; active: number }>({ total: 0, active: 0 });
  const [recentAssignments, setRecentAssignments] = useState<any[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<ExamItem[]>([]);
  const [recentNotices, setRecentNotices] = useState<NoticeItem[]>([]);
  const [resultsList, setResultsList] = useState<Result[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStatsData | null>(null);
  const [isLoadingRealData, setIsLoadingRealData] = useState<boolean>(true);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState<boolean>(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>("");



  // Fetch Real Database Metrics
  const fetchRealData = async () => {
    setIsLoadingRealData(true);
    setIsLoadingAttendance(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("better-auth.session_token") : null;
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

      if (teacherEmail) {
        const requestsRes = await getTeacherRequestsAction(teacherEmail);
        if (requestsRes.success) {
          const approved = requestsRes.requests.filter((r) => r.status === "APPROVED");
          setApprovedRequests(approved);
          setAssignedClassesCount(approved.length);
        }
      }

      const studentsRes = await getTeacherStudentsAction({ limit: 6 });
      if (studentsRes.success) {
        setStudentsList(studentsRes.students || []);
        setTotalStudentsCount(studentsRes.pagination?.total || studentsRes.students?.length || 0);
      }

      if (teacherEmail) {
        const assignRes = await fetch(`${serverUrl}/api/teacher/assignments?teacherEmail=${encodeURIComponent(teacherEmail)}`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const assignData = await assignRes.json();
        if (assignData.success) {
          const list = assignData.assignments || [];
          const active = list.filter((a: any) => a.status === "ACTIVE").length;
          setAssignmentsCount({ total: list.length, active });
          setRecentAssignments(list.slice(0, 3));
        }
      }

      const examsRes = await getTeacherExamsAction();
      if (examsRes.success) {
        setUpcomingExams((examsRes.exams || []).slice(0, 3));
      }

      const noticesRes = await getNoticesAction();
      if (noticesRes.success) {
        setRecentNotices((noticesRes.notices || []).slice(0, 3));
      }

      // Fetch Real Results from /api/teacher/results
      const resultsRes = await fetch(`${serverUrl}/api/teacher/results`, {
        credentials: "include",
      });
      const resultsData = await resultsRes.json();
      if (resultsRes.ok && resultsData.success) {
        setResultsList(resultsData.results || []);
      }

      // Fetch Dynamic Real-time Attendance Stats
      try {
        const attendanceRes = await fetch(`${serverUrl}/api/teacher/attendance/stats`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const attendanceData = await attendanceRes.json();
        if (attendanceRes.ok && attendanceData.success && attendanceData.stats) {
          setAttendanceStats(attendanceData.stats);
        }
      } catch (attErr) {
        console.error("Error fetching attendance stats:", attErr);
      } finally {
        setIsLoadingAttendance(false);
      }

      const now = new Date();
      setLastRefreshedAt(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error("Error fetching real teacher dashboard metrics:", err);
    } finally {
      setIsLoadingRealData(false);
    }
  };

  useEffect(() => {
    fetchRealData();
  }, [teacherEmail]);

  // Dynamic Room Schedule computed from approved class assignments
  const todaySchedule = React.useMemo(() => {
    if (approvedRequests.length === 0) return [];
    const times = [
      "08:30 AM - 09:30 AM",
      "10:15 AM - 11:15 AM",
      "01:30 PM - 02:30 PM",
      "03:00 PM - 04:00 PM",
    ];
    const rooms = ["Lab 302", "Room 104", "Room 201", "Lab 105"];
    const statuses: ("Completed" | "In Progress" | "Up Next")[] = [
      "In Progress",
      "Up Next",
      "Up Next",
      "Completed",
    ];

    return approvedRequests.map((req, idx) => ({
      id: req.id,
      time: times[idx % times.length],
      subject: req.subject || "General Class",
      grade: `${req.grade || "Class 8"} ${req.section || "Section A"}`,
      room: rooms[idx % rooms.length],
      status: statuses[idx % statuses.length],
    }));
  }, [approvedRequests]);

  // Computed Dynamic Attendance Metrics
  const computedAttendanceRate = React.useMemo(() => {
    if (!attendanceStats) return "0.0%";
    return `${attendanceStats.presentRate}%`;
  }, [attendanceStats]);

  const weeklyAttendanceChartData = React.useMemo(() => {
    if (attendanceStats?.weeklyAttendance && attendanceStats.weeklyAttendance.length > 0) {
      return attendanceStats.weeklyAttendance;
    }
    return [
      { day: "Mon", attendance: 0 },
      { day: "Tue", attendance: 0 },
      { day: "Wed", attendance: 0 },
      { day: "Thu", attendance: 0 },
      { day: "Fri", attendance: 0 },
    ];
  }, [attendanceStats]);

  const attendanceDistributionData = React.useMemo(() => {
    return [
      {
        name: "Present",
        value: attendanceStats?.presentCount ?? 0,
        percentage: `${attendanceStats?.presentRate ?? "0.0"}%`,
        color: "#4f46e5",
      },
      {
        name: "Late",
        value: attendanceStats?.lateCount ?? 0,
        percentage: `${attendanceStats?.lateRate ?? "0.0"}%`,
        color: "#f59e0b",
      },
      {
        name: "Absent",
        value: attendanceStats?.absentCount ?? 0,
        percentage: `${attendanceStats?.absentRate ?? "0.0"}%`,
        color: "#ef4444",
      },
    ];
  }, [attendanceStats]);

  const classAttendanceRatesData = React.useMemo(() => {
    if (attendanceStats?.classAttendance && attendanceStats.classAttendance.length > 0) {
      return attendanceStats.classAttendance.slice(0, 5).map((c) => ({
        name: c.name,
        rate: c.attendance,
      }));
    }
    return [];
  }, [attendanceStats]);

  // Computed Exam Bar Chart Data from Real Results
  const examBarData = React.useMemo(() => {
    if (resultsList.length === 0) return [];
    const map: Record<string, { totalPct: number; count: number; fullName: string }> = {};
    resultsList.forEach((r) => {
      const examName = r.exam || "General Exam";
      const pct = (r.score / (r.total || 100)) * 100;
      if (!map[examName]) {
        map[examName] = { totalPct: 0, count: 0, fullName: examName };
      }
      map[examName].totalPct += pct;
      map[examName].count += 1;
    });
    return Object.values(map).map((item) => ({
      name: item.fullName.length > 14 ? item.fullName.slice(0, 14) + "…" : item.fullName,
      fullName: item.fullName,
      avgScore: Math.round(item.totalPct / item.count),
      count: item.count,
    }));
  }, [resultsList]);



  const filteredStudents = studentsList.filter((s) => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.studentClass?.toLowerCase().includes(q) ||
      s.roll?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-900 dark:text-white">
      {/* ===================================================== */}
      {/* EXECUTIVE HEADER BANNER */}
      {/* ===================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl dark:shadow-black/70 sm:p-6 lg:p-7"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-600/15 via-purple-500/10 to-indigo-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50/80 text-indigo-600 shadow-2xs dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Command className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                  Academic Command Center
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <Database className="h-3 w-3" />
                  Synced {lastRefreshedAt ? `(${lastRefreshedAt})` : ""}
                </span>
              </div>

              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
                Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{teacherName}</span>
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl sm:text-sm">
                Manage your daily teaching workflow: live sections, room schedules, enrolled student directory, assignments, and test evaluation metrics.
              </p>
            </div>
          </div>

          {/* Action Buttons & Sync */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 md:pt-0">
            <button
              onClick={fetchRealData}
              disabled={isLoadingRealData}
              title="Refresh Metrics"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 transition-all cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingRealData ? "animate-spin" : ""}`} />
            </button>

            <Link
              href="/dashboard/teacher/students"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20 transition-all"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Directory</span>
            </Link>

            <Link
              href="/dashboard/teacher/my-classes"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-500 hover:to-indigo-600 transition-all active:scale-95"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>My Classes</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ===================================================== */}
      {/* HIGH-CONTRAST TOP STAT CARDS GRID */}
      {/* ===================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          icon={BookOpen}
          label="Assigned Classes"
          value={String(assignedClassesCount)}
          isLoading={isLoadingRealData}
          detail="Active database sections"
          delay={0}
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value={String(totalStudentsCount)}
          isLoading={isLoadingRealData}
          detail="Enrolled directory count"
          delay={0.04}
        />
        <StatCard
          icon={FileText}
          label="Active Courseworks"
          value={String(assignmentsCount.active)}
          isLoading={isLoadingRealData}
          detail={`${assignmentsCount.total} total courseworks`}
          delay={0.08}
        />
        <StatCard
          icon={Clock}
          label="Scheduled Exams"
          value={String(upcomingExams.length)}
          isLoading={isLoadingRealData}
          detail="Active exam schedules"
          delay={0.12}
        />
        <StatCard
          icon={CalendarCheck}
          label="Attendance Rate"
          value={computedAttendanceRate}
          isLoading={isLoadingRealData || isLoadingAttendance}
          detail={
            attendanceStats
              ? `${attendanceStats.presentCount} present today`
              : "Live database attendance"
          }
          delay={0.16}
        />
        <StatCard
          icon={Award}
          label="Avg Result Score"
          value={
            resultsList.length > 0
              ? `${(
                  resultsList.reduce(
                    (sum, r) => sum + (r.score / (r.total || 100)) * 100,
                    0
                  ) / resultsList.length
                ).toFixed(1)}%`
              : "0.0%"
          }
          isLoading={isLoadingRealData}
          detail={`${resultsList.length} total results recorded`}
          delay={0.2}
        />
      </div>

      {/* ===================================================== */}
      {/* SECTION 1: TODAY'S ROOM SCHEDULE */}
      {/* ===================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between"
      >
        <div>
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  Today&apos;s Room Schedule
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Scheduled room sessions and class times</p>
              </div>
            </div>

            <Link
              href="/dashboard/teacher/my-classes"
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Full Timetable</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {todaySchedule.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <Calendar className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                <p>No room sessions or class schedules assigned for today.</p>
                <Link
                  href="/dashboard/teacher/my-classes"
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Plus className="h-3 w-3" /> Request Class Assignment
                </Link>
              </div>
            ) : (
              todaySchedule.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-xl border border-slate-200/90 bg-slate-50/60 p-3 sm:p-3.5 transition-all hover:border-indigo-500/40 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-indigo-500/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40 shrink-0 font-bold text-xs">
                      <GraduationCap className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.subject}
                        </span>
                        <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/40 px-1.5 py-0.5 text-[9px] font-bold">
                          {item.grade}
                        </span>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> {item.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> {item.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 sm:pt-0 shrink-0">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase flex items-center gap-1 border ${item.status === "In Progress"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
                          : item.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                        }`}
                    >
                      {item.status === "In Progress" && <Activity className="h-3 w-3 animate-pulse" />}
                      {item.status === "Completed" && <CheckSquare className="h-3 w-3" />}
                      {item.status === "Up Next" && <Hourglass className="h-3 w-3" />}
                      {item.status}
                    </span>

                    <Link
                      href="/dashboard/teacher/attendance"
                      className="rounded-lg bg-indigo-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-2xs hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 flex items-center gap-1 transition-all"
                    >
                      <CheckSquare className="h-3 w-3" />
                      <span>Log Attendance</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      {/* ===================================================== */}
      {/* SECTION 2: ENROLLED STUDENTS DIRECTORY PREVIEW */}
      {/* ===================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="flex flex-col gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
              <Users className="h-4 w-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1">
                  Enrolled Students Directory
                </h2>
                <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 px-2 py-0.5 text-[9px] font-mono font-bold flex items-center gap-1">
                  ({totalStudentsCount})
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Quick lookup for student section assignments and contacts
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500"
              />
            </div>

            <Link
              href="/dashboard/teacher/students"
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20 transition-all shrink-0"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Roster Cards Grid */}
        {isLoadingRealData ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">
            No matching student records.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStudents.map((st) => (
              <div
                key={st.id}
                className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-slate-50/60 p-3 transition-all hover:border-indigo-500/40 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-indigo-500/30"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40 font-black text-xs">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {st.name}
                    </h4>
                    <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/40 px-1.5 py-0.5 text-[9px] font-bold shrink-0">
                      {st.studentClass || "Grade 10"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                    <Hash className="h-3 w-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <strong>{st.roll || "N/A"}</strong>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <Mail className="h-3 w-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="truncate">{st.email}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ===================================================== */}
      {/* SECTION 3: ATTENDANCE ANALYTICS (DYNAMIC REAL-TIME DATA) */}
      {/* ===================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="flex flex-col gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
              <CalendarCheck className="h-4 w-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Attendance Analytics
                </h2>
                <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 px-2 py-0.5 text-[9px] font-mono font-bold flex items-center gap-1">
                  <Database className="h-3 w-3" /> LIVE STATS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Daily presence trends, status breakdown, and section performance rates
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/teacher/attendance"
            className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20 transition-all shrink-0"
          >
            <span>Explore Attendance</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Attendance Content Grid */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* Chart 1: Weekly Area Chart */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  Weekly Attendance Trend (%)
                </h3>
                <p className="text-[10px] text-slate-500">Monday to Friday presence percentage</p>
              </div>
              {attendanceStats && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 px-2 py-0.5 rounded-md">
                  <TrendingUp className="h-3 w-3" />
                  {attendanceStats.presentRate}% Rate
                </div>
              )}
            </div>

            <div className="h-[200px] w-full">
              {isLoadingAttendance ? (
                <div className="h-full w-full rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyAttendanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="attendanceColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(val) => `${val}%`} />
                    <Tooltip contentStyle={{ borderRadius: "10px", fontSize: "11px", backgroundColor: "#0f172a", borderColor: "#334155", color: "#ffffff" }} formatter={(val) => [`${val}%`, "Rate"]} />
                    <Area type="monotone" dataKey="attendance" stroke="#4f46e5" strokeWidth={2.5} fill="url(#attendanceColor)" dot={{ r: 3.5, fill: "#4f46e5", stroke: "#ffffff", strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 2: Today's Status Breakdown */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <PieChart className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Status Breakdown
            </h3>
            <p className="text-[10px] text-slate-500 mb-3">Today&apos;s session status distribution</p>

            {isLoadingAttendance ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-9 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {attendanceDistributionData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-lg bg-white p-2.5 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 dark:text-white">{item.value}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({item.percentage})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 dark:text-white block flex items-center gap-1">
                <BarChart3 className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> Class Rates
              </span>
              {isLoadingAttendance ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                  ))}
                </div>
              ) : (
                classAttendanceRatesData.map((cls) => (
                  <div key={cls.name} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-slate-900 dark:text-white">{cls.name}</span>
                      <span className="text-indigo-600 dark:text-indigo-400">{cls.rate}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-400" style={{ width: `${cls.rate}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===================================================== */}
      {/* SECTION 4: EXAMINATIONS & RESULTS ANALYTICS */}
      {/* ===================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="flex flex-col gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
              <Award className="h-4 w-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Examinations & Results Activity
                </h2>
                <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 px-2 py-0.5 text-[9px] font-mono font-bold flex items-center gap-1">
                  <Database className="h-3 w-3" /> {resultsList.length} Records
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Live academic performance metrics, student grade distributions, and examination log records
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/teacher/results"
            className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20 transition-all shrink-0"
          >
            <span>Manage Results</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Results Content Grid */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          {/* Grade Distribution & Performance Metrics */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center gap-2 mb-3.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40 shrink-0">
                <FileCheck className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">
                  Grade Breakdown & Class Pass Rate
                </h3>
                <p className="text-[10px] text-slate-500">
                  Distribution across {resultsList.length} student result entries
                </p>
              </div>
            </div>

            {isLoadingRealData ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 rounded-md bg-slate-200/80 dark:bg-slate-800 animate-pulse" />
                ))}
              </div>
            ) : resultsList.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <Award className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                <p>No student results recorded yet.</p>
                <Link
                  href="/dashboard/teacher/results"
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Plus className="h-3 w-3" /> Enter First Result
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {["A+", "A", "B+", "B", "C", "D", "F"].map((gradeCategory) => {
                  const count = resultsList.filter(
                    (r) => r.grade?.toUpperCase() === gradeCategory
                  ).length;
                  const percentage =
                    resultsList.length > 0
                      ? Math.round((count / resultsList.length) * 100)
                      : 0;

                  return (
                    <div key={gradeCategory} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-md text-[9px] font-black ${
                              gradeCategory === "A+"
                                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                                : gradeCategory === "A"
                                  ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                  : gradeCategory === "B+"
                                    ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400"
                                    : gradeCategory === "B"
                                      ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {gradeCategory}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            Grade {gradeCategory}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-mono">
                            {count} {count === 1 ? "student" : "students"}
                          </span>
                          <span className="font-black text-slate-900 dark:text-white">
                            {percentage}%
                          </span>
                        </div>
                      </div>

                      <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-400 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Published: <strong className="text-emerald-600 dark:text-emerald-400">{resultsList.filter((r) => r.status?.toUpperCase() === "PUBLISHED").length}</strong> / {resultsList.length}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Drafts: <strong className="text-amber-600 dark:text-amber-400">{resultsList.filter((r) => r.status?.toUpperCase() === "DRAFT").length}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Recent Result Activity Log */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center gap-2 mb-3.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40 shrink-0">
                <Award className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">
                  Recent Result Records
                </h3>
                <p className="text-[10px] text-slate-500">
                  Latest student marks submitted from results page
                </p>
              </div>
            </div>

            {isLoadingRealData ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-slate-200/80 dark:bg-slate-800 animate-pulse" />
                ))}
              </div>
            ) : resultsList.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <FileText className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                <p>No recent examination result submissions.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {resultsList.slice(0, 3).map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white p-3 dark:border-slate-800 dark:bg-slate-950 transition-all hover:border-indigo-500/40"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40 font-black text-xs">
                      <Award className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                            <span className="truncate">{res.studentName}</span>
                          </h4>
                          <p className="mt-0.5 text-[10px] text-slate-500 truncate">
                            {res.exam} • Class {res.studentClass}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase border ${
                              res.grade?.toUpperCase() === "A+" || res.grade?.toUpperCase() === "A"
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/40"
                                : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            Grade {res.grade}
                          </span>
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase border ${
                              res.status?.toUpperCase() === "PUBLISHED"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                            }`}
                          >
                            {res.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                        <span className="text-slate-500 dark:text-slate-400">
                          Score: <strong className="text-slate-900 dark:text-white">{res.score}/{res.total} ({Math.round((res.score / (res.total || 100)) * 100)}%)</strong>
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {new Date(res.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Interactive Result Performance Bar Chart */}
        <div className="mt-5 rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40 shrink-0">
                <BarChart3 className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">
                  Examination Result Performance Bar Chart (%)
                </h3>
                <p className="text-[10px] text-slate-500">Average student score performance breakdown per examination</p>
              </div>
            </div>
            <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 px-2 py-0.5 text-[9px] font-mono font-bold flex items-center gap-1">
              <BarChart3 className="h-3 w-3" /> RESULT BAR
            </span>
          </div>

          {isLoadingRealData ? (
            <div className="h-[180px] w-full rounded-xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
          ) : examBarData.length === 0 ? (
            <div className="flex h-[140px] w-full items-center justify-center text-xs text-slate-400">
              No examination result records available to plot bar chart.
            </div>
          ) : (
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={examBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(val) => `${val}%`} />
                  <Tooltip
                    cursor={{ fill: "rgba(99, 102, 241, 0.15)", rx: 6 }}
                    contentStyle={{ borderRadius: "10px", fontSize: "11px", backgroundColor: "#0f172a", borderColor: "#334155", color: "#ffffff" }}
                    formatter={(val: any) => [`${val}%`, "Average Score"]}
                    labelFormatter={(label: any, items: any) => items[0]?.payload?.fullName || label}
                  />
                  <Bar dataKey="avgScore" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </motion.section>

      {/* ===================================================== */}
      {/* SECTION 5: LIVE OPERATIONAL FEEDS (EXAMS, COURSEWORKS, NOTICES) */}
      {/* ===================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Real Data Block 1: Upcoming Exams Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between"
        >
          <div>
            <div className="mb-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Live Upcoming Exams
                </h3>
              </div>
              <Link
                href="/dashboard/teacher/examinations"
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>All ({upcomingExams.length})</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {isLoadingRealData ? (
              <div className="space-y-2.5">
                {[1, 2].map((i) => (
                  <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
                ))}
              </div>
            ) : upcomingExams.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">No upcoming exam schedules in system.</p>
            ) : (
              <div className="space-y-2.5">
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3 transition-all hover:border-indigo-500/40 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-indigo-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase flex items-center gap-1">
                        <GraduationCap className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> {exam.subject}
                      </span>
                      <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/40 px-1.5 py-0.5 text-[9px] font-bold">{exam.studentClass}</span>
                    </div>
                    <h4 className="mt-1 text-xs font-bold text-slate-900 dark:text-white truncate">{exam.title}</h4>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> {exam.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> {exam.roomNo}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Real Data Block 2: Recent Courseworks / Assignments */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between"
        >
          <div>
            <div className="mb-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Live Courseworks
                </h3>
              </div>
              <Link
                href="/dashboard/teacher/assignments"
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>All ({assignmentsCount.total})</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {isLoadingRealData ? (
              <div className="space-y-2.5">
                {[1, 2].map((i) => (
                  <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
                ))}
              </div>
            ) : recentAssignments.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">No active courseworks found.</p>
            ) : (
              <div className="space-y-2.5">
                {recentAssignments.map((asgn) => (
                  <div key={asgn.id} className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3 transition-all hover:border-indigo-500/40 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-indigo-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <FileCode className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> {asgn.subject}
                      </span>
                      <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 px-1.5 py-0.5 text-[9px] font-bold">
                        {asgn.status}
                      </span>
                    </div>
                    <h4 className="mt-1 text-xs font-bold text-slate-900 dark:text-white truncate">{asgn.title}</h4>
                    <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-indigo-600 dark:text-indigo-400" /> Due: {asgn.dueDate || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Real Data Block 3: School Notices & Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between md:col-span-2 lg:col-span-1"
        >
          <div>
            <div className="mb-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
                  <Megaphone className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Live School Notices
                </h3>
              </div>
              <Link
                href="/dashboard/teacher/notices"
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>All ({recentNotices.length})</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {isLoadingRealData ? (
              <div className="space-y-2.5">
                {[1, 2].map((i) => (
                  <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
                ))}
              </div>
            ) : recentNotices.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">No notices published yet.</p>
            ) : (
              <div className="space-y-2.5">
                {recentNotices.map((notice) => (
                  <div key={notice.id} className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3 transition-all hover:border-indigo-500/40 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-indigo-500/30">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/40 px-1.5 py-0.5 text-[9px] font-bold flex items-center gap-1">
                        <Bell className="h-3 w-3" /> {notice.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{notice.date}</span>
                    </div>
                    <h4 className="mt-1 text-xs font-bold text-slate-900 dark:text-white truncate">{notice.title}</h4>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ===================================================== */}
      {/* ROUTE NAVIGATION HUB WITH DEDICATED ICONS */}
      {/* ===================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.45 }}
        className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" /> Portal Route Shortcuts
          </h3>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            Direct Navigation Hub
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
          <RouteShortcut href="/dashboard/teacher/my-classes" label="My Classes" icon={BookOpen} />
          <RouteShortcut href="/dashboard/teacher/students" label="Students" icon={Users} />
          <RouteShortcut href="/dashboard/teacher/assignments" label="Assignments" icon={FileText} />
          <RouteShortcut href="/dashboard/teacher/examinations" label="Exams" icon={Clock} />
          <RouteShortcut href="/dashboard/teacher/notices" label="Notices" icon={Megaphone} />
          <RouteShortcut href="/dashboard/teacher/attendance" label="Attendance" icon={CalendarCheck} />
          <RouteShortcut href="/dashboard/teacher/results" label="Results" icon={Award} />
        </div>
      </motion.div>
    </div>
  );
}

/* ========================================================= */
/* MONOCHROMATIC / ACCENTED STAT CARD COMPONENT */
/* ========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  isLoading,
  isIncomplete,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  isLoading?: boolean;
  isIncomplete?: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className="relative rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm backdrop-blur-xl transition-all duration-200 hover:border-indigo-500/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-2xs">
          <Icon className="h-4 w-4" />
        </div>
        {isIncomplete && (
          <span className="rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 px-1.5 py-0.5 text-[8px] font-mono font-bold flex items-center gap-1">
            <PieChart className="h-3 w-3" /> DEMO
          </span>
        )}
      </div>

      <p className="mt-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
        {label}
      </p>

      {isLoading || value === "..." ? (
        <div className="my-1.5 h-6 w-16 rounded-md bg-slate-200/90 dark:bg-slate-800 animate-pulse skeleton-shimmer" />
      ) : (
        <p className="mt-0.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">{value}</p>
      )}

      <p className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-500 truncate font-medium">{detail}</p>
    </motion.div>
  );
}

/* ========================================================= */
/* ACCENTED ROUTE SHORTCUT COMPONENT */
/* ========================================================= */

function RouteShortcut({
  href,
  label,
  badge,
  icon: Icon,
  isDemo,
}: {
  href: string;
  label: string;
  badge?: string;
  icon: React.ElementType;
  isDemo?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col justify-between rounded-xl border p-3 transition-all hover:border-indigo-500 hover:shadow-sm dark:hover:border-indigo-500/40 ${isDemo
          ? "border-slate-200/90 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40"
          : "border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-950"
        }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/40">
            <Icon className="h-3.5 w-3.5" />
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
        </div>
        <p className="mt-2.5 text-xs font-bold text-slate-900 dark:text-white truncate">{label}</p>
      </div>

      {badge && (
        <span className="mt-2 text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400">{badge}</span>
      )}
    </Link>
  );
}