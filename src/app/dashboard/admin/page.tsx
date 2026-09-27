"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Sparkles,
  UserCheck,
  Building,
  ArrowUpRight,
  Activity,
  Bell,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Inbox,
  Lock,
  Layers,
  Wallet,
  Clock3,
  TrendingUp,
  Server,
  Zap,
} from "lucide-react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

function authedFetch(path: string, init?: RequestInit) {
  return fetch(`${SERVER_URL}${path}`, {
    ...init,
    credentials: "include",
    cache: "no-store",
  });
}

interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  pendingUsers: number;
  lockedUsers: number;
  totalNotices: number;
  totalAssignments: number;
  totalExams: number;
  totalResults: number;
  totalRequests: number;
  pendingRequests: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activityFilter, setActivityFilter] = useState<"all" | "sync" | "queue">("all");

  const rawRole = (session?.user as { role?: string } | undefined)?.role?.toLowerCase();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/");
      } else if (rawRole !== "admin") {
        router.replace("/unauthorized");
      }
    }
  }, [session, rawRole, isPending, router]);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await authedFetch("/api/admin/stats");
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load admin stats", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user && rawRole === "admin") {
      loadStats();
    }
  }, [session, rawRole, loadStats]);

  // Loading skeleton while checking authentication & role
  if (isPending) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-36 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // If not logged in or role is not admin, redirect handles it
  if (!session?.user || rawRole !== "admin") {
    return null;
  }

  const currentDateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const activities = [
    { type: "sync", title: "Database Sync Completed", desc: "Live user counts and stats synchronized", time: "Just now", color: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400" },
    { type: "users", title: "Teacher & Student Accounts Active", desc: `${stats?.totalStudents ?? 0} Students, ${stats?.totalTeachers ?? 0} Faculty members`, time: "Live Data", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400" },
    { type: "queue", title: "Pending Approvals Queue", desc: `${stats?.pendingUsers ?? 0} accounts waiting for verification`, time: "Realtime", color: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400" },
  ];

  const filteredActivities = activities.filter((act) => activityFilter === "all" || act.type === activityFilter);

  return (
    <div className="space-y-6 pb-12">
      {/* Premium Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white via-indigo-50/20 to-white dark:from-slate-950 dark:via-indigo-950/30 dark:to-slate-950 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
      >
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-indigo-500/15 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-60 h-60 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                ADMIN CONTROL CENTER
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                System Healthy
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back, Admin! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {currentDateStr} · Overseeing school operations, staff, roster &amp; financials.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadStats}
              disabled={statsLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all border border-slate-200/90 dark:border-slate-800 disabled:opacity-50 cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${statsLoading ? "animate-spin text-indigo-600 dark:text-indigo-400" : ""}`} />
              <span>{statsLoading ? "Syncing..." : "Sync Real Stats"}</span>
            </button>

            <button
              onClick={() => router.push("/dashboard/admin/fees")}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 rounded-2xl transition-all shadow-lg shadow-indigo-600/25 cursor-pointer active:scale-[0.98]"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Fees Portal</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 4 Interactive Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Students */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.2 }}
          onClick={() => router.push("/dashboard/admin/students")}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between cursor-pointer group hover:border-indigo-400 dark:hover:border-indigo-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-900/50">
                Live DB
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Students
            </p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {statsLoading ? (
                <span className="inline-block w-16 h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
              ) : (
                stats?.totalStudents ?? 0
              )}
            </h3>
          </div>
        </motion.div>

        {/* Card 2: Total Teachers */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.2 }}
          onClick={() => router.push("/dashboard/admin/teachers")}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between cursor-pointer group hover:border-purple-400 dark:hover:border-purple-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-xs group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-200/50 dark:border-purple-900/50">
                Active Staff
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Teachers
            </p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {statsLoading ? (
                <span className="inline-block w-16 h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
              ) : (
                stats?.totalTeachers ?? 0
              )}
            </h3>
          </div>
        </motion.div>

        {/* Card 3: Pending Approvals */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.2 }}
          onClick={() => router.push("/dashboard/admin/approvals")}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between cursor-pointer group hover:border-amber-400 dark:hover:border-amber-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Inbox className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1">
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                  (stats?.pendingUsers ?? 0) > 0
                    ? "bg-amber-100 text-amber-700 border-amber-200/70 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800"
                    : "bg-emerald-50 text-emerald-600 border-emerald-200/70 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
                }`}
              >
                {(stats?.pendingUsers ?? 0) > 0 ? "Action Required" : "All Approved"}
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Approvals
            </p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {statsLoading ? (
                <span className="inline-block w-16 h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
              ) : (
                stats?.pendingUsers ?? 0
              )}
            </h3>
          </div>
        </motion.div>

        {/* Card 4: Fee & Notice Records */}
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.2 }}
          onClick={() => router.push("/dashboard/admin/notices")}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between cursor-pointer group hover:border-emerald-400 dark:hover:border-emerald-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-900/50">
                Notices Active
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Notices
            </p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {statsLoading ? (
                <span className="inline-block w-16 h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
              ) : (
                stats?.totalNotices ?? 0
              )}
            </h3>
          </div>
        </motion.div>
      </div>

      {/* Middle Section: Attendance Chart & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Attendance Bar Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Weekly Attendance Analytics
            </h2>
            <span className="text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 px-3 py-1 rounded-full font-bold">
              Last 7 Days · 92.4% Avg
            </span>
          </div>

          <div className="h-52 flex items-end justify-between gap-3 sm:gap-5 pt-8 px-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
            {[
              { day: "Sat", height: "78%", rate: "88%" },
              { day: "Sun", height: "94%", rate: "96%" },
              { day: "Mon", height: "85%", rate: "91%" },
              { day: "Tue", height: "98%", rate: "99%" },
              { day: "Wed", height: "89%", rate: "93%" },
              { day: "Thu", height: "92%", rate: "95%" },
              { day: "Fri", height: "55%", rate: "65%" },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-800/60 shadow-xs">
                  {col.rate}
                </span>
                <div
                  className="w-full max-w-10 bg-gradient-to-t from-indigo-600 to-cyan-400 dark:from-indigo-700 dark:to-cyan-400 rounded-t-2xl group-hover:from-indigo-500 group-hover:to-cyan-300 transition-all duration-300 shadow-md shadow-indigo-500/10 group-hover:scale-105"
                  style={{ height: col.height }}
                />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pt-1 group-hover:text-indigo-600 transition-colors">
                  {col.day}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-1.5 font-bold text-slate-700 dark:text-slate-300">
                <span>Faculty Punctuality &amp; Activity</span>
                <span className="text-emerald-600 dark:text-emerald-400">96.5%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-sm" style={{ width: "96.5%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: System Metrics Summary */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-4">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            System Status Metrics
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1 font-bold text-slate-600 dark:text-slate-300">
                <span>Published Exams</span>
                <span className="text-indigo-600 font-extrabold">{stats?.totalExams ?? 0} Exams</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: "85%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-bold text-slate-600 dark:text-slate-300">
                <span>Total Assignments</span>
                <span className="text-amber-600 font-extrabold">{stats?.totalAssignments ?? 0} Active</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: "70%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-bold text-slate-600 dark:text-slate-300">
                <span>Locked Accounts</span>
                <span className="text-rose-600 font-extrabold">{stats?.lockedUsers ?? 0} Users</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: stats?.lockedUsers ? "40%" : "0%" }} />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-3">
            <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <p className="font-extrabold text-indigo-900 dark:text-indigo-200">Database Synchronized</p>
              <p className="text-[11px] text-indigo-700/80 dark:text-indigo-400/80">Real-time stats connected to server api.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Activity Feed */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Recent System Activity
            </h2>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-900 p-1">
              {[
                { id: "all", label: "All Logs" },
                { id: "sync", label: "Sync" },
                { id: "queue", label: "Queue" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActivityFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    activityFilter === f.id
                      ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredActivities.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:border-indigo-200/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${item.color}`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Management Actions */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-4">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Quick Launcher
          </h2>

          <div className="space-y-2.5">
            {/* Action 1: Fees Management */}
            <button
              onClick={() => router.push("/dashboard/admin/fees")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 hover:border-emerald-500/50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Fees Management
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Tuition claims &amp; payments
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
            </button>

            {/* Action 2: Classes & Sections */}
            <button
              onClick={() => router.push("/dashboard/admin/classes")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:border-indigo-500/50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Classes &amp; Sections
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Grade setup &amp; section roster
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
            </button>

            {/* Action 3: Class Routine */}
            <button
              onClick={() => router.push("/dashboard/admin/routine")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 hover:border-blue-500/50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                  <Clock3 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Class Routine
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Time slots &amp; schedules
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </button>

            {/* Action 4: Faculty Teachers */}
            <button
              onClick={() => router.push("/dashboard/admin/teachers")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 hover:border-purple-500/50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Manage Teachers
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Faculty accounts &amp; subjects
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            </button>

            {/* Action 5: User Approvals */}
            <button
              onClick={() => router.push("/dashboard/admin/approvals")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 hover:border-amber-500/50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    User Approvals
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {stats?.pendingUsers ?? 0} pending verification requests
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}